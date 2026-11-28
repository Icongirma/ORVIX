package database

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// Migration represents a single SQL migration file.
type Migration struct {
	Version string
	Name    string
	Path    string
	Content string
}

// Migrator manages and executes database migrations against PostgreSQL.
type Migrator struct {
	db *sql.DB
}

// NewMigrator returns a new Migrator instance.
func NewMigrator(db *sql.DB) *Migrator {
	return &Migrator{db: db}
}

// NewMigrator returns a new Migrator for this database connection.
func (db *DB) NewMigrator() *Migrator {
	if db == nil || db.DB == nil {
		return nil
	}
	return NewMigrator(db.DB)
}

// EnsureSchemaMigrationsTable creates the schema_migrations tracking table if it does not already exist.
func (m *Migrator) EnsureSchemaMigrationsTable(ctx context.Context) error {
	if m.db == nil {
		return errors.New("database connection is nil")
	}

	query := `
	CREATE TABLE IF NOT EXISTS schema_migrations (
		version VARCHAR(255) PRIMARY KEY,
		applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`

	_, err := m.db.ExecContext(ctx, query)
	if err != nil {
		return fmt.Errorf("failed to create schema_migrations table: %w", err)
	}
	return nil
}

// GetAppliedMigrations returns a map of migration versions that have already been executed.
func (m *Migrator) GetAppliedMigrations(ctx context.Context) (map[string]time.Time, error) {
	if err := m.EnsureSchemaMigrationsTable(ctx); err != nil {
		return nil, err
	}

	rows, err := m.db.QueryContext(ctx, "SELECT version, applied_at FROM schema_migrations ORDER BY version ASC")
	if err != nil {
		return nil, fmt.Errorf("failed to query schema_migrations: %w", err)
	}
	defer rows.Close()

	applied := make(map[string]time.Time)
	for rows.Next() {
		var version string
		var appliedAt time.Time
		if err := rows.Scan(&version, &appliedAt); err != nil {
			return nil, fmt.Errorf("failed to scan migration record: %w", err)
		}
		applied[version] = appliedAt
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error reading schema_migrations rows: %w", err)
	}

	return applied, nil
}

// LoadMigrationsFromDir reads all *.up.sql migration files from a directory,
// validates them, and returns them sorted by version ascending.
func LoadMigrationsFromDir(dirPath string) ([]Migration, error) {
	entries, err := os.ReadDir(dirPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read migrations directory %s: %w", dirPath, err)
	}

	var migrations []Migration
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".up.sql") {
			continue
		}

		fullPath := filepath.Join(dirPath, entry.Name())
		contentBytes, err := os.ReadFile(fullPath)
		if err != nil {
			return nil, fmt.Errorf("failed to read migration file %s: %w", fullPath, err)
		}

		content := strings.TrimSpace(string(contentBytes))
		baseName := strings.TrimSuffix(entry.Name(), ".up.sql")
		version, name := parseMigrationName(baseName)

		migrations = append(migrations, Migration{
			Version: version,
			Name:    name,
			Path:    fullPath,
			Content: content,
		})
	}

	// Sort migrations lexicographically by version
	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})

	return migrations, nil
}

// LoadMigrationsFromFS reads all *.up.sql migration files from an fs.FS filesystem,
// useful for embedded assets or in-memory testing.
func LoadMigrationsFromFS(sys fs.FS, dirPath string) ([]Migration, error) {
	entries, err := fs.ReadDir(sys, dirPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read migrations fs path %s: %w", dirPath, err)
	}

	var migrations []Migration
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".up.sql") {
			continue
		}

		filePath := filepath.ToSlash(filepath.Join(dirPath, entry.Name()))
		contentBytes, err := fs.ReadFile(sys, filePath)
		if err != nil {
			return nil, fmt.Errorf("failed to read fs migration %s: %w", filePath, err)
		}

		content := strings.TrimSpace(string(contentBytes))
		baseName := strings.TrimSuffix(entry.Name(), ".up.sql")
		version, name := parseMigrationName(baseName)

		migrations = append(migrations, Migration{
			Version: version,
			Name:    name,
			Path:    filePath,
			Content: content,
		})
	}

	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})

	return migrations, nil
}

// MigrationLockID is the constant 64-bit integer identifier for the ORVIX PostgreSQL advisory lock.
const MigrationLockID int64 = 742947239102

// Apply executes pending migrations sequentially in transaction blocks under a session-level advisory lock.
// A dedicated database connection is used to ensure the lock is acquired, held, and released on the same session.
// If any migration fails, its transaction is rolled back and the error is returned.
// Already applied migrations are safely skipped to prevent duplicate execution.
func (m *Migrator) Apply(ctx context.Context, migrations []Migration) ([]string, error) {
	if m.db == nil {
		return nil, errors.New("database connection is nil")
	}

	// Obtain a dedicated database connection to hold the session-level advisory lock
	conn, err := m.db.Conn(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to obtain dedicated database connection for migration lock: %w", err)
	}
	defer conn.Close()

	// Acquire PostgreSQL advisory lock on the dedicated connection
	if _, err := conn.ExecContext(ctx, "SELECT pg_advisory_lock($1)", MigrationLockID); err != nil {
		return nil, fmt.Errorf("failed to acquire migration advisory lock: %w", err)
	}

	// Guarantee that the advisory lock is released when Apply completes or fails
	defer func() {
		unlockCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		_, _ = conn.ExecContext(unlockCtx, "SELECT pg_advisory_unlock($1)", MigrationLockID)
	}()

	// Ensure schema_migrations table exists on this connection
	tableQuery := `
	CREATE TABLE IF NOT EXISTS schema_migrations (
		version VARCHAR(255) PRIMARY KEY,
		applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
	);`
	if _, err := conn.ExecContext(ctx, tableQuery); err != nil {
		return nil, fmt.Errorf("failed to ensure schema_migrations table: %w", err)
	}

	// Query applied migrations on this connection
	rows, err := conn.QueryContext(ctx, "SELECT version, applied_at FROM schema_migrations ORDER BY version ASC")
	if err != nil {
		return nil, fmt.Errorf("failed to query schema_migrations: %w", err)
	}
	defer rows.Close()

	appliedMap := make(map[string]time.Time)
	for rows.Next() {
		var version string
		var appliedAt time.Time
		if err := rows.Scan(&version, &appliedAt); err != nil {
			return nil, fmt.Errorf("failed to scan migration record: %w", err)
		}
		appliedMap[version] = appliedAt
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error reading schema_migrations rows: %w", err)
	}

	var newlyApplied []string

	for _, mig := range migrations {
		if _, alreadyApplied := appliedMap[mig.Version]; alreadyApplied {
			// Skip already executed migration
			continue
		}

		if mig.Content == "" {
			// Skip empty migrations
			continue
		}

		if err := m.applySingle(ctx, conn, mig); err != nil {
			return newlyApplied, fmt.Errorf("migration %s failed: %w", mig.Version, err)
		}

		newlyApplied = append(newlyApplied, mig.Version)
		appliedMap[mig.Version] = time.Now()
	}

	return newlyApplied, nil
}

// MigrateFromDir loads migrations from the specified directory and executes pending ones.
func (m *Migrator) MigrateFromDir(ctx context.Context, dirPath string) ([]string, error) {
	migrations, err := LoadMigrationsFromDir(dirPath)
	if err != nil {
		return nil, err
	}

	return m.Apply(ctx, migrations)
}

// applySingle executes one migration and updates schema_migrations within a single transaction on the dedicated connection.
func (m *Migrator) applySingle(ctx context.Context, conn *sql.Conn, mig Migration) error {
	tx, err := conn.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}

	// Rollback in case of failure or panic
	defer func() {
		_ = tx.Rollback()
	}()

	// Execute DDL/SQL content
	if _, err := tx.ExecContext(ctx, mig.Content); err != nil {
		return fmt.Errorf("SQL execution error: %w", err)
	}

	// Record migration in schema_migrations table
	insertQuery := "INSERT INTO schema_migrations (version, applied_at) VALUES ($1, NOW())"
	if _, err := tx.ExecContext(ctx, insertQuery, mig.Version); err != nil {
		return fmt.Errorf("failed to record migration version: %w", err)
	}

	// Commit atomically
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

// parseMigrationName extracts version and readable name from base filename.
// For example: "000001_create_schema" -> version: "000001", name: "create_schema".
// If no underscore is present, the entire base name is used as the version.
func parseMigrationName(baseName string) (string, string) {
	parts := strings.SplitN(baseName, "_", 2)
	if len(parts) == 2 {
		return parts[0], parts[1]
	}
	return baseName, baseName
}
