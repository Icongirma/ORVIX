package database

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"testing/fstest"
	"time"

	"github.com/Icongirma/ORVIX/backend/internal/config"
)

func TestParseMigrationName(t *testing.T) {
	tests := []struct {
		input           string
		expectedVersion string
		expectedName    string
	}{
		{"000001_create_users", "000001", "create_users"},
		{"000002_add_sports_tables", "000002", "add_sports_tables"},
		{"standalone", "standalone", "standalone"},
	}

	for _, tt := range tests {
		v, n := parseMigrationName(tt.input)
		if v != tt.expectedVersion || n != tt.expectedName {
			t.Errorf("parseMigrationName(%q) = (%q, %q), want (%q, %q)",
				tt.input, v, n, tt.expectedVersion, tt.expectedName)
		}
	}
}

func TestLoadMigrationsFromFS(t *testing.T) {
	mockFS := fstest.MapFS{
		"migrations/000002_second.up.sql":  &fstest.MapFile{Data: []byte("SELECT 2;")},
		"migrations/000001_first.up.sql":   &fstest.MapFile{Data: []byte("SELECT 1;")},
		"migrations/000001_first.down.sql": &fstest.MapFile{Data: []byte("DROP TABLE 1;")},
		"migrations/ignored_file.txt":      &fstest.MapFile{Data: []byte("hello")},
	}

	migrations, err := LoadMigrationsFromFS(mockFS, "migrations")
	if err != nil {
		t.Fatalf("LoadMigrationsFromFS failed: %v", err)
	}

	if len(migrations) != 2 {
		t.Fatalf("expected 2 migrations, got %d", len(migrations))
	}

	// Verify ordering: 000001 must precede 000002
	if migrations[0].Version != "000001" || migrations[0].Name != "first" {
		t.Errorf("expected first migration version 000001, got %s", migrations[0].Version)
	}
	if migrations[1].Version != "000002" || migrations[1].Name != "second" {
		t.Errorf("expected second migration version 000002, got %s", migrations[1].Version)
	}

	if migrations[0].Content != "SELECT 1;" {
		t.Errorf("expected content 'SELECT 1;', got '%s'", migrations[0].Content)
	}
}

func TestLoadMigrationsFromDir(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "orvix_test_migrations_*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}
	defer os.RemoveAll(tempDir)

	// Create test files
	file2 := filepath.Join(tempDir, "000002_beta.up.sql")
	file1 := filepath.Join(tempDir, "000001_alpha.up.sql")
	downFile := filepath.Join(tempDir, "000001_alpha.down.sql")
	otherFile := filepath.Join(tempDir, "notes.md")

	_ = os.WriteFile(file2, []byte("CREATE TABLE beta (id INT);"), 0644)
	_ = os.WriteFile(file1, []byte("CREATE TABLE alpha (id INT);"), 0644)
	_ = os.WriteFile(downFile, []byte("DROP TABLE alpha;"), 0644)
	_ = os.WriteFile(otherFile, []byte("# Notes"), 0644)

	migrations, err := LoadMigrationsFromDir(tempDir)
	if err != nil {
		t.Fatalf("LoadMigrationsFromDir failed: %v", err)
	}

	if len(migrations) != 2 {
		t.Fatalf("expected 2 up migrations, got %d", len(migrations))
	}

	if migrations[0].Version != "000001" || migrations[1].Version != "000002" {
		t.Errorf("migrations are not ordered by version: got %s, %s", migrations[0].Version, migrations[1].Version)
	}
}

func TestMigrator_NilDB(t *testing.T) {
	migrator := NewMigrator(nil)

	err := migrator.EnsureSchemaMigrationsTable(context.Background())
	if err == nil {
		t.Error("expected error for EnsureSchemaMigrationsTable with nil DB, got nil")
	}

	_, err = migrator.GetAppliedMigrations(context.Background())
	if err == nil {
		t.Error("expected error for GetAppliedMigrations with nil DB, got nil")
	}

	_, err = migrator.Apply(context.Background(), []Migration{{Version: "1"}})
	if err == nil {
		t.Error("expected error for Apply with nil DB, got nil")
	}
}

// TestMigrator_LivePostgreSQL runs against local PostgreSQL when available
func TestMigrator_LivePostgreSQL(t *testing.T) {
	cfg := config.Load()
	if cfg.DBPassword == "" {
		t.Skip("skipping live PostgreSQL migration test: DB_PASSWORD is empty")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db, err := Connect(ctx, cfg)
	if err != nil {
		t.Skipf("skipping live test: cannot connect to DB: %v", err)
	}

	testVersion := "999999_test_framework_probe"

	// Guaranteed cleanup of test probe record and DB closure using t.Cleanup
	t.Cleanup(func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM schema_migrations WHERE version = $1", testVersion)
		_ = db.Close()
	})

	migrator := db.NewMigrator()
	if migrator == nil {
		t.Fatal("expected non-nil migrator from db.NewMigrator()")
	}

	// 1. Ensure table can be created
	if err := migrator.EnsureSchemaMigrationsTable(ctx); err != nil {
		t.Fatalf("EnsureSchemaMigrationsTable failed: %v", err)
	}

	// 2. Query applied migrations
	applied, err := migrator.GetAppliedMigrations(ctx)
	if err != nil {
		t.Fatalf("GetAppliedMigrations failed: %v", err)
	}
	t.Logf("Currently applied migrations count: %d", len(applied))

	// 3. Test applying an idempotent test migration
	testMigrations := []Migration{
		{
			Version: testVersion,
			Name:    "test_framework_probe",
			Content: "SELECT 1;", // Pure no-op probe
		},
	}

	appliedNew, err := migrator.Apply(ctx, testMigrations)
	if err != nil {
		t.Fatalf("Apply failed: %v", err)
	}

	// If it was already applied in a previous run, appliedNew should be empty. Otherwise length 1.
	t.Logf("Newly applied test migrations: %v", appliedNew)

	// 4. Test duplicate prevention: re-applying the same migration must skip it
	reApplied, err := migrator.Apply(ctx, testMigrations)
	if err != nil {
		t.Fatalf("Re-applying test migration failed: %v", err)
	}
	if len(reApplied) != 0 {
		t.Errorf("expected 0 migrations on re-apply, got %d", len(reApplied))
	}

	// 5. Test transactional rollback on SQL syntax failure
	failedMigration := []Migration{
		{
			Version: "999998_should_fail",
			Name:    "should_fail",
			Content: "INVALID SQL SYNTAX HERE THAT MUST FAIL TRANSACTION;",
		},
	}

	_, err = migrator.Apply(ctx, failedMigration)
	if err == nil {
		t.Error("expected error for invalid SQL in migration, got nil")
	}

	// Verify that the failed migration was NOT recorded in schema_migrations
	appliedAfterFail, err := migrator.GetAppliedMigrations(ctx)
	if err != nil {
		t.Fatalf("GetAppliedMigrations failed after rollback: %v", err)
	}
	if _, exists := appliedAfterFail["999998_should_fail"]; exists {
		t.Error("failed migration was incorrectly recorded in schema_migrations despite rollback")
	}

	// 6. Verify advisory lock release: another connection must be able to acquire and release the lock immediately
	testConn, err := db.Conn(ctx)
	if err != nil {
		t.Fatalf("failed to open connection to test advisory lock: %v", err)
	}
	defer testConn.Close()

	var lockAcquired bool
	if err := testConn.QueryRowContext(ctx, "SELECT pg_try_advisory_lock($1)", MigrationLockID).Scan(&lockAcquired); err != nil {
		t.Fatalf("failed to test pg_try_advisory_lock: %v", err)
	}
	if !lockAcquired {
		t.Errorf("expected advisory lock %d to be released after Apply, but it was still locked", MigrationLockID)
	} else {
		// Unlock test lock
		var unlocked bool
		_ = testConn.QueryRowContext(ctx, "SELECT pg_advisory_unlock($1)", MigrationLockID).Scan(&unlocked)
	}
}

// TestVerifyCoreSportsSchema validates that Milestone 8.3.2 and 8.3.2a tables, constraints, and indexes exist in PostgreSQL.
func TestVerifyCoreSportsSchema(t *testing.T) {
	cfg := config.Load()
	if cfg.DBPassword == "" {
		t.Skip("skipping live test: DB_PASSWORD is empty")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db, err := Connect(ctx, cfg)
	if err != nil {
		t.Skipf("cannot connect to DB: %v", err)
	}
	defer db.Close()

	// Apply any pending migrations from migrations directory (resolving relative path)
	migrationsDir := "migrations"
	if _, err := os.Stat(migrationsDir); err != nil {
		migrationsDir = "../../migrations"
	}

	migrator := db.NewMigrator()
	applied, err := migrator.MigrateFromDir(ctx, migrationsDir)
	if err != nil {
		t.Fatalf("failed to apply migrations from %s: %v", migrationsDir, err)
	}
	t.Logf("Migrations newly applied during test setup: %v", applied)

	// Idempotence check: Running migrator again must not reapply anything
	reApplied, err := migrator.MigrateFromDir(ctx, migrationsDir)
	if err != nil {
		t.Fatalf("failed to re-run MigrateFromDir: %v", err)
	}
	if len(reApplied) != 0 {
		t.Errorf("expected 0 migrations on re-run, got %d: %v", len(reApplied), reApplied)
	}

	// 1. Verify schema_migrations has version 000001 and 000002 recorded exactly once
	for _, ver := range []string{"000001", "000002"} {
		var count int
		err = db.QueryRowContext(ctx, "SELECT count(*) FROM schema_migrations WHERE version = $1", ver).Scan(&count)
		if err != nil {
			t.Fatalf("failed to query schema_migrations for version %s: %v", ver, err)
		}
		if count != 1 {
			t.Errorf("expected migration %s recorded exactly once, got %d", ver, count)
		}
	}

	// 2. Verify all expected core sports tables exist
	expectedTables := []string{
		"sports",
		"leagues",
		"seasons",
		"teams",
		"team_seasons",
		"players",
		"matches",
		"match_events",
	}

	for _, tbl := range expectedTables {
		var exists bool
		query := `SELECT EXISTS (
			SELECT 1 FROM information_schema.tables 
			WHERE table_schema = 'public' AND table_name = $1
		)`
		if err := db.QueryRowContext(ctx, query, tbl).Scan(&exists); err != nil {
			t.Fatalf("failed to check table %s: %v", tbl, err)
		}
		if !exists {
			t.Errorf("table %s does not exist in PostgreSQL", tbl)
		}
	}

	// 3. Verify key indexes exist
	expectedIndexes := []string{
		"idx_leagues_sport_id",
		"idx_seasons_league_id",
		"idx_teams_sport_id",
		"idx_players_team_id",
		"idx_matches_sport_status",
		"idx_matches_league_time",
		"idx_matches_start_time",
		"idx_match_events_match_minute",
	}

	for _, idx := range expectedIndexes {
		var exists bool
		query := `SELECT EXISTS (
			SELECT 1 FROM pg_indexes 
			WHERE schemaname = 'public' AND indexname = $1
		)`
		if err := db.QueryRowContext(ctx, query, idx).Scan(&exists); err != nil {
			t.Fatalf("failed to check index %s: %v", idx, err)
		}
		if !exists {
			t.Errorf("index %s does not exist in PostgreSQL", idx)
		}
	}

	// 4. Verify check constraints exist (both 000001 and 000002)
	expectedConstraints := []string{
		"chk_match_status",
		"chk_different_teams",
		"chk_matches_home_score_non_negative",
		"chk_matches_away_score_non_negative",
		"chk_matches_current_minute_non_negative",
		"chk_match_events_minute_non_negative",
		"chk_match_events_extra_minute_non_negative",
		"chk_match_events_home_score_after_non_negative",
		"chk_match_events_away_score_after_non_negative",
	}

	for _, chk := range expectedConstraints {
		var chkExists bool
		chkQuery := `SELECT EXISTS (
			SELECT 1 FROM information_schema.check_constraints 
			WHERE constraint_name = $1
		)`
		if err := db.QueryRowContext(ctx, chkQuery, chk).Scan(&chkExists); err != nil {
			t.Fatalf("failed to check constraint %s: %v", chk, err)
		}
		if !chkExists {
			t.Errorf("check constraint %s does not exist in PostgreSQL", chk)
		}
	}
}

// TestConstraintRejectionAndAcceptance verifies that the non-negative CHECK constraints reject invalid values
// and accept valid and NULL values as specified by Milestone 8.3.2a.
func TestConstraintRejectionAndAcceptance(t *testing.T) {
	cfg := config.Load()
	if cfg.DBPassword == "" {
		t.Skip("skipping live test: DB_PASSWORD is empty")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db, err := Connect(ctx, cfg)
	if err != nil {
		t.Skipf("cannot connect to DB: %v", err)
	}
	defer db.Close()

	// Unique test fixture IDs
	testSportID := "test_sport_832a"
	testLeagueID := "test_league_832a"
	testTeamHome := "test_team_home_832a"
	testTeamAway := "test_team_away_832a"
	testMatchValid := "test_match_valid_832a"

	// Guaranteed reliable cleanup of test fixtures
	t.Cleanup(func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM match_events WHERE match_id LIKE 'test_match_%_832a'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM matches WHERE id LIKE 'test_match_%_832a'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM teams WHERE id IN ($1, $2)", testTeamHome, testTeamAway)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM leagues WHERE id = $1", testLeagueID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM sports WHERE id = $1", testSportID)
	})

	// Insert parent fixtures
	_, err = db.ExecContext(ctx, `INSERT INTO sports (id, slug, name) VALUES ($1, $1, 'Test Sport') ON CONFLICT (id) DO NOTHING`, testSportID)
	if err != nil {
		t.Fatalf("failed to insert test sport: %v", err)
	}

	_, err = db.ExecContext(ctx, `INSERT INTO leagues (id, sport_id, slug, name, country_or_region) VALUES ($1, $2, $1, 'Test League', 'Global') ON CONFLICT (id) DO NOTHING`, testLeagueID, testSportID)
	if err != nil {
		t.Fatalf("failed to insert test league: %v", err)
	}

	_, err = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Home Team', 'Home', 'HOM') ON CONFLICT (id) DO NOTHING`, testTeamHome, testSportID, testLeagueID)
	if err != nil {
		t.Fatalf("failed to insert test home team: %v", err)
	}

	_, err = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Away Team', 'Away', 'AWY') ON CONFLICT (id) DO NOTHING`, testTeamAway, testSportID, testLeagueID)
	if err != nil {
		t.Fatalf("failed to insert test away team: %v", err)
	}

	// 1. Negative home_score must be rejected
	_, err = db.ExecContext(ctx, `
		INSERT INTO matches (id, sport_id, league_id, home_team_id, away_team_id, start_time, home_score, away_score)
		VALUES ('test_match_neg_home', $1, $2, $3, $4, NOW(), -1, 0)
	`, testSportID, testLeagueID, testTeamHome, testTeamAway)
	if err == nil {
		t.Error("expected error inserting negative matches.home_score, got nil")
	}

	// 2. Negative away_score must be rejected
	_, err = db.ExecContext(ctx, `
		INSERT INTO matches (id, sport_id, league_id, home_team_id, away_team_id, start_time, home_score, away_score)
		VALUES ('test_match_neg_away', $1, $2, $3, $4, NOW(), 0, -2)
	`, testSportID, testLeagueID, testTeamHome, testTeamAway)
	if err == nil {
		t.Error("expected error inserting negative matches.away_score, got nil")
	}

	// 3. Negative current_minute must be rejected
	_, err = db.ExecContext(ctx, `
		INSERT INTO matches (id, sport_id, league_id, home_team_id, away_team_id, start_time, current_minute)
		VALUES ('test_match_neg_min', $1, $2, $3, $4, NOW(), -5)
	`, testSportID, testLeagueID, testTeamHome, testTeamAway)
	if err == nil {
		t.Error("expected error inserting negative matches.current_minute, got nil")
	}

	// 4. Insert a valid match with NULL current_minute (must be accepted)
	_, err = db.ExecContext(ctx, `
		INSERT INTO matches (id, sport_id, league_id, home_team_id, away_team_id, start_time, home_score, away_score, current_minute)
		VALUES ($1, $2, $3, $4, $5, NOW(), 0, 0, NULL)
	`, testMatchValid, testSportID, testLeagueID, testTeamHome, testTeamAway)
	if err != nil {
		t.Fatalf("expected valid match with NULL current_minute to be accepted, got error: %v", err)
	}

	// 5. Negative event minute must be rejected
	_, err = db.ExecContext(ctx, `
		INSERT INTO match_events (match_id, event_type, minute)
		VALUES ($1, 'goal', -1)
	`, testMatchValid)
	if err == nil {
		t.Error("expected error inserting negative match_events.minute, got nil")
	}

	// 6. Negative event extra_minute must be rejected
	_, err = db.ExecContext(ctx, `
		INSERT INTO match_events (match_id, event_type, extra_minute)
		VALUES ($1, 'goal', -2)
	`, testMatchValid)
	if err == nil {
		t.Error("expected error inserting negative match_events.extra_minute, got nil")
	}

	// 7. Negative event home_score_after must be rejected
	_, err = db.ExecContext(ctx, `
		INSERT INTO match_events (match_id, event_type, home_score_after)
		VALUES ($1, 'goal', -1)
	`, testMatchValid)
	if err == nil {
		t.Error("expected error inserting negative match_events.home_score_after, got nil")
	}

	// 8. Negative event away_score_after must be rejected
	_, err = db.ExecContext(ctx, `
		INSERT INTO match_events (match_id, event_type, away_score_after)
		VALUES ($1, 'goal', -1)
	`, testMatchValid)
	if err == nil {
		t.Error("expected error inserting negative match_events.away_score_after, got nil")
	}

	// 9. Valid match_event with NULL nullable columns must be accepted
	_, err = db.ExecContext(ctx, `
		INSERT INTO match_events (match_id, event_type, minute, extra_minute, home_score_after, away_score_after)
		VALUES ($1, 'period_start', NULL, NULL, NULL, NULL)
	`, testMatchValid)
	if err != nil {
		t.Errorf("expected match_event with NULL nullable values to be accepted, got error: %v", err)
	}

	// 10. Valid match_event with non-negative numbers (0 and positive) must be accepted
	_, err = db.ExecContext(ctx, `
		INSERT INTO match_events (match_id, event_type, minute, extra_minute, home_score_after, away_score_after)
		VALUES ($1, 'goal', 45, 2, 1, 0)
	`, testMatchValid)
	if err != nil {
		t.Errorf("expected match_event with valid non-negative values to be accepted, got error: %v", err)
	}
}
