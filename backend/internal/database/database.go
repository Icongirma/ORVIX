package database

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/Icongirma/ORVIX/backend/internal/config"
	_ "github.com/jackc/pgx/v5/stdlib"
)

// DB wraps a standard library *sql.DB connection pool with connectivity health checking.
type DB struct {
	*sql.DB
}

// Connect opens a connection pool to PostgreSQL using the pgx stdlib driver,
// sets connection pool bounds, and pings the database with a timeout.
func Connect(ctx context.Context, cfg *config.Config) (*DB, error) {
	if cfg.DBHost == "" || cfg.DBName == "" {
		return nil, errors.New("database host and name must not be empty")
	}

	conn, err := sql.Open("pgx", cfg.DSN())
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection pool: %w", err)
	}

	// Configure connection pooling
	conn.SetMaxOpenConns(cfg.DBMaxOpenConns)
	conn.SetMaxIdleConns(cfg.DBMaxIdleConns)
	conn.SetConnMaxLifetime(cfg.DBConnMaxLifetime)
	conn.SetConnMaxIdleTime(cfg.DBConnMaxIdleTime)

	// Verify connectivity within timeout
	pingCtx, cancel := context.WithTimeout(ctx, cfg.DBConnectTimeout)
	defer cancel()

	if err := conn.PingContext(pingCtx); err != nil {
		_ = conn.Close()
		return nil, fmt.Errorf("database ping failed: %w", err)
	}

	return &DB{DB: conn}, nil
}

// PingCheck verifies that the database is reachable within a short 3-second timeout.
func (db *DB) PingCheck(ctx context.Context) error {
	if db == nil || db.DB == nil {
		return errors.New("database connection is nil")
	}

	pingCtx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	return db.PingContext(pingCtx)
}
