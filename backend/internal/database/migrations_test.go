package database

import (
	"context"
	"fmt"
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
		{"000003_user_preferences_schema", "000003", "user_preferences_schema"},
		{"000004_gamification_schema", "000004", "gamification_schema"},
		{"000005_gamification_category_constraints", "000005", "gamification_category_constraints"},
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
		"migrations/migrations_notes.txt":  &fstest.MapFile{Data: []byte("hello")},
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
		t.Error("expected error with nil db, got nil")
	}

	_, err = migrator.GetAppliedMigrations(context.Background())
	if err == nil {
		t.Error("expected error with nil db, got nil")
	}

	_, err = migrator.Apply(context.Background(), nil)
	if err == nil {
		t.Error("expected error with nil db, got nil")
	}
}

func TestMigrator_LivePostgreSQL(t *testing.T) {
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
	t.Cleanup(func() {
		_ = db.Close()
	})

	// Ensure any leftover probe records from previous test runs are purged
	_, _ = db.ExecContext(ctx, "DELETE FROM schema_migrations WHERE version = '999999'")

	migrator := db.NewMigrator()

	// 1. Ensure table exists
	err = migrator.EnsureSchemaMigrationsTable(ctx)
	if err != nil {
		t.Fatalf("EnsureSchemaMigrationsTable failed: %v", err)
	}

	// 2. Query initial applied migrations
	initialApplied, err := migrator.GetAppliedMigrations(ctx)
	if err != nil {
		t.Fatalf("GetAppliedMigrations failed: %v", err)
	}
	for k := range initialApplied {
		t.Logf("Found applied version: %s", k)
	}
	t.Logf("Currently applied migrations count: %d", len(initialApplied))

	// Guaranteed test cleanup (registered after db.Close cleanup, runs before db.Close in LIFO order)
	testVersion := "999999"
	t.Cleanup(func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM schema_migrations WHERE version = $1", testVersion)
	})

	// 3. Apply a temporary probe migration
	testMigrations := []Migration{
		{
			Version: testVersion,
			Name:    "test_framework_probe",
			Content: "SELECT 1;",
		},
	}

	applied, err := migrator.Apply(ctx, testMigrations)
	if err != nil {
		t.Fatalf("Migrate failed: %v", err)
	}
	t.Logf("Newly applied test migrations: %v", applied)

	// 4. Verify probe version was recorded
	var exists bool
	err = db.QueryRowContext(ctx, "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = $1)", testVersion).Scan(&exists)
	if err != nil {
		t.Fatalf("failed to query schema_migrations: %v", err)
	}
	if !exists {
		t.Errorf("expected version %s to be recorded in schema_migrations", testVersion)
	}
}

// TestVerifyCompletePlatformSchema verifies all platform tables across migrations 000001, 000002, 000003, and 000004.
func TestVerifyCompletePlatformSchema(t *testing.T) {
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
	t.Cleanup(func() {
		_ = db.Close()
	})

	// Apply any pending migrations from migrations directory
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

	// 1. Verify schema_migrations has version 000001, 000002, 000003, 000004, and 000005 recorded exactly once
	for _, ver := range []string{"000001", "000002", "000003", "000004", "000005"} {
		var count int
		err = db.QueryRowContext(ctx, "SELECT count(*) FROM schema_migrations WHERE version = $1", ver).Scan(&count)
		if err != nil {
			t.Fatalf("failed to query schema_migrations for version %s: %v", ver, err)
		}
		if count != 1 {
			t.Errorf("expected migration %s recorded exactly once, got %d", ver, count)
		}
	}

	// 2. Verify all 18 expected tables exist
	expectedTables := []string{
		"sports",
		"leagues",
		"seasons",
		"teams",
		"team_seasons",
		"players",
		"matches",
		"match_events",
		"users",
		"user_profiles",
		"user_favorite_teams",
		"user_match_alerts",
		"challenges",
		"user_challenges",
		"achievements",
		"user_achievements",
		"user_xp_ledger",
		"user_xp_standings",
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
		"uq_users_username_lower",
		"uq_users_email_lower",
		"idx_user_profiles_favorite_sport_id",
		"idx_user_favorite_teams_team_id",
		"idx_user_match_alerts_match_id",
		"idx_user_match_alerts_active_dispatch",
		"idx_challenges_status_dates",
		"idx_challenges_sport_id",
		"idx_challenges_match_id",
		"idx_challenges_reward_badge_id",
		"idx_user_challenges_challenge_status",
		"idx_user_challenges_user_status",
		"idx_achievements_category",
		"idx_user_achievements_user_unlocked",
		"idx_user_achievements_achievement_id",
		"idx_user_xp_ledger_user_created",
		"idx_user_xp_standings_total_xp",
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

	// 4. Verify check constraints exist
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
		"chk_users_id_non_empty",
		"chk_users_username_format",
		"chk_users_email_format",
		"chk_users_password_hash_non_empty",
		"chk_users_status",
		"chk_user_profiles_stream_quality",
		"chk_user_profiles_theme",
		"chk_user_match_alerts_type",
		"chk_challenges_id_non_empty",
		"chk_challenges_title_non_empty",
		"chk_challenges_reward_xp",
		"chk_challenges_total_steps",
		"chk_challenges_dates",
		"chk_challenges_status",
		"chk_user_challenges_step",
		"chk_user_challenges_status",
		"chk_user_challenges_completion",
		"chk_achievements_id_non_empty",
		"chk_achievements_code_non_empty",
		"chk_achievements_title_non_empty",
		"chk_achievements_reward_xp",
		"chk_user_xp_ledger_amount",
		"chk_user_xp_ledger_source_type",
		"chk_user_xp_ledger_source_id_non_empty",
		"chk_user_xp_standings_total_xp",
		"chk_user_xp_standings_level",
		"chk_challenges_category",
		"chk_achievements_category",
		"chk_achievements_badge_variant",
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

// TestUserPreferencesSchema_IdentityAndConstraints verifies Milestone 8.3.3a constraints.
func TestUserPreferencesSchema_IdentityAndConstraints(t *testing.T) {
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
	t.Cleanup(func() {
		_ = db.Close()
	})

	probeSportID := "test_sport_833a_id"
	probeLeagueID := "test_league_833a_id"
	probeTeamID := "test_team_833a_id"
	probeTeamAwayID := "test_team_away_833a_id"
	probeMatchID := "test_match_833a_id"
	probeUserID := "test_usr_833a_1"

	cleanupIdentity := func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_match_alerts WHERE user_id LIKE 'test_usr_833a_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_favorite_teams WHERE user_id LIKE 'test_usr_833a_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_profiles WHERE user_id LIKE 'test_usr_833a_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM users WHERE id LIKE 'test_usr_833a_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM matches WHERE id = $1", probeMatchID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM teams WHERE id IN ($1, $2)", probeTeamID, probeTeamAwayID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM leagues WHERE id = $1", probeLeagueID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM sports WHERE id = $1", probeSportID)
	}
	cleanupIdentity()
	t.Cleanup(cleanupIdentity)

	_, _ = db.ExecContext(ctx, `INSERT INTO sports (id, slug, name) VALUES ($1, $1, 'Test Sport') ON CONFLICT (id) DO NOTHING`, probeSportID)
	_, _ = db.ExecContext(ctx, `INSERT INTO leagues (id, sport_id, slug, name, country_or_region) VALUES ($1, $2, $1, 'Test League', 'Global') ON CONFLICT (id) DO NOTHING`, probeLeagueID, probeSportID)
	_, _ = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Team A', 'TA', 'TA') ON CONFLICT (id) DO NOTHING`, probeTeamID, probeSportID, probeLeagueID)
	_, _ = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Team B', 'TB', 'TB') ON CONFLICT (id) DO NOTHING`, probeTeamAwayID, probeSportID, probeLeagueID)
	_, _ = db.ExecContext(ctx, `INSERT INTO matches (id, sport_id, league_id, home_team_id, away_team_id, start_time) VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT (id) DO NOTHING`, probeMatchID, probeSportID, probeLeagueID, probeTeamID, probeTeamAwayID)

	// 1. Insert valid base user
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, username, email, password_hash, display_name, status)
		VALUES ($1, 'AlexRivera', 'alex@orvix.internal', '$2a$12$e8F7s.test.hash.value', 'Alex Rivera', 'active')
	`, probeUserID)
	if err != nil {
		t.Fatalf("failed to insert valid user: %v", err)
	}

	// 2. Case-insensitive username duplicate rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, username, email, password_hash, display_name, status)
		VALUES ('test_usr_833a_2', 'alexrivera', 'other@orvix.internal', '$2a$12$e8F7s.test.hash.value', 'Other', 'active')
	`)
	if err == nil {
		t.Error("expected duplicate lowercase username to be rejected by uq_users_username_lower, got nil")
	}

	// 3. Case-insensitive email duplicate rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, username, email, password_hash, display_name, status)
		VALUES ('test_usr_833a_3', 'DifferentUser', 'ALEX@ORVIX.INTERNAL', '$2a$12$e8F7s.test.hash.value', 'Other', 'active')
	`)
	if err == nil {
		t.Error("expected duplicate uppercase email to be rejected by uq_users_email_lower, got nil")
	}

	// 4. Invalid username format rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, username, email, password_hash)
		VALUES ('test_usr_833a_bad_un', 'ab', 'user_ab@orvix.internal', 'valid_hash_string')
	`)
	if err == nil {
		t.Error("expected username < 3 chars to be rejected, got nil")
	}

	// 5. Invalid email format rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, username, email, password_hash)
		VALUES ('test_usr_833a_bad_em', 'ValidUser1', 'not-an-email', 'valid_hash_string')
	`)
	if err == nil {
		t.Error("expected malformed email to be rejected, got nil")
	}

	// 6. Empty password-hash rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, username, email, password_hash)
		VALUES ('test_usr_833a_bad_pw', 'ValidUser2', 'valid2@orvix.internal', '   ')
	`)
	if err == nil {
		t.Error("expected whitespace-only password hash to be rejected, got nil")
	}

	// 7. Empty user id rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, username, email, password_hash)
		VALUES ('   ', 'ValidUser3', 'valid3@orvix.internal', 'valid_hash_string')
	`)
	if err == nil {
		t.Error("expected empty user ID to be rejected by chk_users_id_non_empty, got nil")
	}

	// 8. Invalid user status rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO users (id, username, email, password_hash, status)
		VALUES ('test_usr_833a_bad_st', 'ValidUser4', 'valid4@orvix.internal', 'valid_hash_string', 'banned')
	`)
	if err == nil {
		t.Error("expected invalid user status 'banned' to be rejected, got nil")
	}

	// 9. Valid user_profile insertion
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_profiles (user_id, stream_quality, spatial_audio_enabled, favorite_sport_id, theme)
		VALUES ($1, '4k60', true, $2, 'graphite')
	`, probeUserID, probeSportID)
	if err != nil {
		t.Fatalf("expected valid user_profile to be accepted, got error: %v", err)
	}

	// 10. Invalid stream_quality rejection
	_, err = db.ExecContext(ctx, `
		UPDATE user_profiles SET stream_quality = '8k_ultra' WHERE user_id = $1
	`, probeUserID)
	if err == nil {
		t.Error("expected invalid stream_quality to be rejected, got nil")
	}

	// 11. Invalid theme rejection
	_, err = db.ExecContext(ctx, `
		UPDATE user_profiles SET theme = 'neon_amber' WHERE user_id = $1
	`, probeUserID)
	if err == nil {
		t.Error("expected invalid theme to be rejected, got nil")
	}

	// 12. Nonexistent favorite_sport_id FK rejection
	_, err = db.ExecContext(ctx, `
		UPDATE user_profiles SET favorite_sport_id = 'nonexistent_sport_xyz' WHERE user_id = $1
	`, probeUserID)
	if err == nil {
		t.Error("expected nonexistent favorite_sport_id FK to be rejected, got nil")
	}

	// 13. Valid nullable favorite_sport_id acceptance
	_, err = db.ExecContext(ctx, `
		UPDATE user_profiles SET favorite_sport_id = NULL WHERE user_id = $1
	`, probeUserID)
	if err != nil {
		t.Errorf("expected NULL favorite_sport_id to be accepted, got error: %v", err)
	}

	// 14. Favorite teams FK rejection for nonexistent team
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_favorite_teams (user_id, team_id)
		VALUES ($1, 'nonexistent_team_xyz')
	`, probeUserID)
	if err == nil {
		t.Error("expected nonexistent team_id FK to be rejected, got nil")
	}

	// 15. Valid favorite team insertion & duplicate PK rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_favorite_teams (user_id, team_id)
		VALUES ($1, $2)
	`, probeUserID, probeTeamID)
	if err != nil {
		t.Fatalf("expected valid favorite team to be accepted, got error: %v", err)
	}

	_, err = db.ExecContext(ctx, `
		INSERT INTO user_favorite_teams (user_id, team_id)
		VALUES ($1, $2)
	`, probeUserID, probeTeamID)
	if err == nil {
		t.Error("expected duplicate (user_id, team_id) to be rejected, got nil")
	}

	// 16. Match alert invalid alert_type rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_match_alerts (user_id, match_id, alert_type)
		VALUES ($1, $2, 'bet_odds_change')
	`, probeUserID, probeMatchID)
	if err == nil {
		t.Error("expected invalid alert_type 'bet_odds_change' to be rejected, got nil")
	}

	// 17. Valid match alert insertion & duplicate rejection
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_match_alerts (user_id, match_id, alert_type)
		VALUES ($1, $2, 'score_change')
	`, probeUserID, probeMatchID)
	if err != nil {
		t.Fatalf("expected valid match alert to be accepted, got error: %v", err)
	}

	_, err = db.ExecContext(ctx, `
		INSERT INTO user_match_alerts (user_id, match_id, alert_type)
		VALUES ($1, $2, 'score_change')
	`, probeUserID, probeMatchID)
	if err == nil {
		t.Error("expected duplicate (user_id, match_id, alert_type) to be rejected by uq constraint, got nil")
	}
}

// TestUserPreferencesSchema_CascadingDeletions tests cascades for users, teams, and matches.
func TestUserPreferencesSchema_CascadingDeletions(t *testing.T) {
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
	t.Cleanup(func() {
		_ = db.Close()
	})

	sportID := "test_sport_casc_833a"
	leagueID := "test_league_casc_833a"
	teamAID := "test_team_casc_a_833a"
	teamBID := "test_team_casc_b_833a"
	matchID := "test_match_casc_833a"

	user1ID := "test_usr_casc_1"
	user2ID := "test_usr_casc_2"
	user3ID := "test_usr_casc_3"

	cleanupCascades := func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_match_alerts WHERE user_id LIKE 'test_usr_casc_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_favorite_teams WHERE user_id LIKE 'test_usr_casc_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_profiles WHERE user_id LIKE 'test_usr_casc_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM users WHERE id LIKE 'test_usr_casc_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM matches WHERE id IN ($1, 'test_temp_match_casc')", matchID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM teams WHERE id IN ($1, $2, 'test_temp_team_casc')", teamAID, teamBID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM leagues WHERE id = $1", leagueID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM sports WHERE id = $1", sportID)
	}
	cleanupCascades()
	t.Cleanup(cleanupCascades)

	_, _ = db.ExecContext(ctx, `INSERT INTO sports (id, slug, name) VALUES ($1, $1, 'Cascade Sport') ON CONFLICT (id) DO NOTHING`, sportID)
	_, _ = db.ExecContext(ctx, `INSERT INTO leagues (id, sport_id, slug, name, country_or_region) VALUES ($1, $2, $1, 'Cascade League', 'Global') ON CONFLICT (id) DO NOTHING`, leagueID, sportID)
	_, _ = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Team CA', 'CA', 'CA') ON CONFLICT (id) DO NOTHING`, teamAID, sportID, leagueID)
	_, _ = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Team CB', 'CB', 'CB') ON CONFLICT (id) DO NOTHING`, teamBID, sportID, leagueID)
	_, _ = db.ExecContext(ctx, `INSERT INTO matches (id, sport_id, league_id, home_team_id, away_team_id, start_time) VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT (id) DO NOTHING`, matchID, sportID, leagueID, teamAID, teamBID)

	// Scenario 1: User deletion cascades
	_, err = db.ExecContext(ctx, `INSERT INTO users (id, username, email, password_hash) VALUES ($1, 'CascUser1', 'casc1@orvix.internal', 'valid_hash_1')`, user1ID)
	if err != nil {
		t.Fatalf("failed to insert user 1: %v", err)
	}
	_, err = db.ExecContext(ctx, `INSERT INTO user_profiles (user_id) VALUES ($1)`, user1ID)
	if err != nil {
		t.Fatalf("failed to insert profile 1: %v", err)
	}
	_, err = db.ExecContext(ctx, `INSERT INTO user_favorite_teams (user_id, team_id) VALUES ($1, $2)`, user1ID, teamAID)
	if err != nil {
		t.Fatalf("failed to insert favorite team 1: %v", err)
	}
	_, err = db.ExecContext(ctx, `INSERT INTO user_match_alerts (user_id, match_id, alert_type) VALUES ($1, $2, 'match_start')`, user1ID, matchID)
	if err != nil {
		t.Fatalf("failed to insert match alert 1: %v", err)
	}

	_, err = db.ExecContext(ctx, `DELETE FROM users WHERE id = $1`, user1ID)
	if err != nil {
		t.Fatalf("failed to delete user 1: %v", err)
	}

	var profCount, favCount, alertCount int
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_profiles WHERE user_id = $1`, user1ID).Scan(&profCount)
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_favorite_teams WHERE user_id = $1`, user1ID).Scan(&favCount)
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_match_alerts WHERE user_id = $1`, user1ID).Scan(&alertCount)

	if profCount != 0 || favCount != 0 || alertCount != 0 {
		t.Errorf("expected 0 dependent rows after user deletion, got profiles=%d, favorites=%d, alerts=%d", profCount, favCount, alertCount)
	}

	// Scenario 2: Team deletion cascades
	_, err = db.ExecContext(ctx, `INSERT INTO users (id, username, email, password_hash) VALUES ($1, 'CascUser2', 'casc2@orvix.internal', 'valid_hash_2')`, user2ID)
	if err != nil {
		t.Fatalf("failed to insert user 2: %v", err)
	}

	tempTeamID := "test_temp_team_casc"
	_, err = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Temp Team', 'TT', 'TT')`, tempTeamID, sportID, leagueID)
	if err != nil {
		t.Fatalf("failed to insert temp team: %v", err)
	}

	_, err = db.ExecContext(ctx, `INSERT INTO user_favorite_teams (user_id, team_id) VALUES ($1, $2)`, user2ID, tempTeamID)
	if err != nil {
		t.Fatalf("failed to insert favorite for temp team: %v", err)
	}

	_, err = db.ExecContext(ctx, `DELETE FROM teams WHERE id = $1`, tempTeamID)
	if err != nil {
		t.Fatalf("failed to delete temp team: %v", err)
	}

	var favCountTeam int
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_favorite_teams WHERE team_id = $1`, tempTeamID).Scan(&favCountTeam)
	if favCountTeam != 0 {
		t.Errorf("expected favorite team record to be cascaded on team deletion, got count=%d", favCountTeam)
	}

	var user2Exists bool
	_ = db.QueryRowContext(ctx, `SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)`, user2ID).Scan(&user2Exists)
	if !user2Exists {
		t.Error("expected user 2 to remain after team deletion")
	}

	// Scenario 3: Match deletion cascades
	_, err = db.ExecContext(ctx, `INSERT INTO users (id, username, email, password_hash) VALUES ($1, 'CascUser3', 'casc3@orvix.internal', 'valid_hash_3')`, user3ID)
	if err != nil {
		t.Fatalf("failed to insert user 3: %v", err)
	}

	tempMatchID := "test_temp_match_casc"
	_, err = db.ExecContext(ctx, `INSERT INTO matches (id, sport_id, league_id, home_team_id, away_team_id, start_time) VALUES ($1, $2, $3, $4, $5, NOW())`, tempMatchID, sportID, leagueID, teamAID, teamBID)
	if err != nil {
		t.Fatalf("failed to insert temp match: %v", err)
	}

	_, err = db.ExecContext(ctx, `INSERT INTO user_match_alerts (user_id, match_id, alert_type) VALUES ($1, $2, 'lineup_announced')`, user3ID, tempMatchID)
	if err != nil {
		t.Fatalf("failed to insert match alert for temp match: %v", err)
	}

	_, err = db.ExecContext(ctx, `DELETE FROM matches WHERE id = $1`, tempMatchID)
	if err != nil {
		t.Fatalf("failed to delete temp match: %v", err)
	}

	var alertCountMatch int
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_match_alerts WHERE match_id = $1`, tempMatchID).Scan(&alertCountMatch)
	if alertCountMatch != 0 {
		t.Errorf("expected match alert record to be cascaded on match deletion, got count=%d", alertCountMatch)
	}

	var user3Exists bool
	_ = db.QueryRowContext(ctx, `SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)`, user3ID).Scan(&user3Exists)
	if !user3Exists {
		t.Error("expected user 3 to remain after match deletion")
	}
}

// TestGamification_ChallengesAndAchievements tests challenge creation, dates, progress constraints,
// completion consistency, achievement unlock invariants, and foreign key references.
func TestGamification_ChallengesAndAchievements(t *testing.T) {
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
	t.Cleanup(func() {
		_ = db.Close()
	})

	sportID := "test_sport_gam_833b"
	leagueID := "test_league_gam_833b"
	teamAID := "test_team_gam_a_833b"
	teamBID := "test_team_gam_b_833b"
	matchID := "test_match_gam_833b"
	userID := "test_usr_gam_833b_1"
	achID := "test_ach_gam_833b_1"
	challengeID := "test_ch_gam_833b_1"

	cleanupGam := func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_challenges WHERE user_id LIKE 'test_usr_gam_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_achievements WHERE user_id LIKE 'test_usr_gam_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_xp_ledger WHERE user_id LIKE 'test_usr_gam_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_xp_standings WHERE user_id LIKE 'test_usr_gam_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM challenges WHERE id LIKE 'test_ch_gam_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM achievements WHERE id LIKE 'test_ach_gam_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM users WHERE id LIKE 'test_usr_gam_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM matches WHERE id = $1", matchID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM teams WHERE id IN ($1, $2)", teamAID, teamBID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM leagues WHERE id = $1", leagueID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM sports WHERE id = $1", sportID)
	}
	cleanupGam()
	t.Cleanup(cleanupGam)

	// Parent fixtures
	_, _ = db.ExecContext(ctx, `INSERT INTO sports (id, slug, name) VALUES ($1, $1, 'Gamification Sport') ON CONFLICT (id) DO NOTHING`, sportID)
	_, _ = db.ExecContext(ctx, `INSERT INTO leagues (id, sport_id, slug, name, country_or_region) VALUES ($1, $2, $1, 'Gamification League', 'Global') ON CONFLICT (id) DO NOTHING`, leagueID, sportID)
	_, _ = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Team GA', 'GA', 'GA') ON CONFLICT (id) DO NOTHING`, teamAID, sportID, leagueID)
	_, _ = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Team GB', 'GB', 'GB') ON CONFLICT (id) DO NOTHING`, teamBID, sportID, leagueID)
	_, _ = db.ExecContext(ctx, `INSERT INTO matches (id, sport_id, league_id, home_team_id, away_team_id, start_time) VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT (id) DO NOTHING`, matchID, sportID, leagueID, teamAID, teamBID)
	_, _ = db.ExecContext(ctx, `INSERT INTO users (id, username, email, password_hash) VALUES ($1, 'GamUser1', 'gam1@orvix.internal', 'valid_hash_gam1') ON CONFLICT (id) DO NOTHING`, userID)

	// 1. Create achievement fixture
	_, err = db.ExecContext(ctx, `
		INSERT INTO achievements (id, code, title, description, category, reward_xp)
		VALUES ($1, 'TEST_ACH_1', 'Telemetry Master', 'Completed telemetry tasks', 'knowledge', 250)
	`, achID)
	if err != nil {
		t.Fatalf("failed to insert achievement: %v", err)
	}

	// 2. Reject duplicate achievement code
	_, err = db.ExecContext(ctx, `
		INSERT INTO achievements (id, code, title, category)
		VALUES ('test_ach_gam_dup', 'TEST_ACH_1', 'Duplicate Code', 'knowledge')
	`)
	if err == nil {
		t.Error("expected duplicate achievement code to be rejected, got nil")
	}

	// 3. Challenge date constraint rejection (ends_at <= starts_at)
	_, err = db.ExecContext(ctx, `
		INSERT INTO challenges (id, title, category, starts_at, ends_at)
		VALUES ('test_ch_bad_dates', 'Bad Dates', 'trivia', NOW() + INTERVAL '2 days', NOW() + INTERVAL '1 day')
	`)
	if err == nil {
		t.Error("expected challenge with ends_at <= starts_at to be rejected by chk_challenges_dates, got nil")
	}

	// 4. Challenge reward_xp constraint (< 0 rejected)
	_, err = db.ExecContext(ctx, `
		INSERT INTO challenges (id, title, category, reward_xp)
		VALUES ('test_ch_neg_xp', 'Neg XP', 'trivia', -100)
	`)
	if err == nil {
		t.Error("expected negative reward_xp to be rejected, got nil")
	}

	// 5. Create valid challenge with link to sport, match, and reward_badge_id
	_, err = db.ExecContext(ctx, `
		INSERT INTO challenges (id, title, description, category, sport_id, match_id, reward_xp, reward_badge_id, total_steps, starts_at, ends_at, status)
		VALUES ($1, 'Monaco Telemetry Quiz', '5 questions on sector deltas', 'trivia', $2, $3, 500, $4, 5, NOW(), NOW() + INTERVAL '3 days', 'active')
	`, challengeID, sportID, matchID, achID)
	if err != nil {
		t.Fatalf("failed to insert valid challenge: %v", err)
	}

	// 6. User challenge participation
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_challenges (user_id, challenge_id, current_step, status)
		VALUES ($1, $2, 0, 'in_progress')
	`, userID, challengeID)
	if err != nil {
		t.Fatalf("failed to insert user_challenge: %v", err)
	}

	// 7. Duplicate participation rejected
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_challenges (user_id, challenge_id, current_step, status)
		VALUES ($1, $2, 0, 'in_progress')
	`, userID, challengeID)
	if err == nil {
		t.Error("expected duplicate user_challenge to be rejected by uq_user_challenges_user_challenge, got nil")
	}

	// 8. Bidirectional completion constraint:
	// 8a. completed status without completed_at must be rejected
	_, err = db.ExecContext(ctx, `
		UPDATE user_challenges SET status = 'completed', completed_at = NULL WHERE user_id = $1 AND challenge_id = $2
	`, userID, challengeID)
	if err == nil {
		t.Error("expected completed status with NULL completed_at to be rejected, got nil")
	}

	// 8b. in_progress status with non-NULL completed_at must be rejected
	_, err = db.ExecContext(ctx, `
		UPDATE user_challenges SET status = 'in_progress', completed_at = NOW() WHERE user_id = $1 AND challenge_id = $2
	`, userID, challengeID)
	if err == nil {
		t.Error("expected in_progress status with non-NULL completed_at to be rejected, got nil")
	}

	// 8c. Atomic conditional progress update: step capped by total_steps
	res, err := db.ExecContext(ctx, `
		UPDATE user_challenges uc
		SET current_step = uc.current_step + 1, updated_at = NOW()
		FROM challenges c
		WHERE uc.challenge_id = c.id
		  AND uc.user_id = $1
		  AND uc.challenge_id = $2
		  AND uc.status = 'in_progress'
		  AND uc.current_step < c.total_steps
	`, userID, challengeID)
	if err != nil {
		t.Fatalf("failed atomic step update: %v", err)
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected != 1 {
		t.Errorf("expected 1 row affected by step update, got %d", rowsAffected)
	}

	// 8d. Valid completion with completed_at accepted
	_, err = db.ExecContext(ctx, `
		UPDATE user_challenges 
		SET current_step = 5, status = 'completed', completed_at = NOW(), updated_at = NOW()
		WHERE user_id = $1 AND challenge_id = $2
	`, userID, challengeID)
	if err != nil {
		t.Fatalf("expected valid completion to be accepted, got error: %v", err)
	}

	// 9. Achievement unlock & duplicate prevention
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_achievements (user_id, achievement_id)
		VALUES ($1, $2)
	`, userID, achID)
	if err != nil {
		t.Fatalf("failed to unlock achievement: %v", err)
	}

	_, err = db.ExecContext(ctx, `
		INSERT INTO user_achievements (user_id, achievement_id)
		VALUES ($1, $2)
	`, userID, achID)
	if err == nil {
		t.Error("expected duplicate achievement unlock to be rejected by uq_user_achievements_user_achievement, got nil")
	}
}

// TestGamification_XPLedgerAndStandings tests the append-only ledger, conflict-aware duplicate handling,
// non-empty source_id, atomic dual-write consistency, and level intervals.
func TestGamification_XPLedgerAndStandings(t *testing.T) {
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
	t.Cleanup(func() {
		_ = db.Close()
	})

	userID := "test_usr_xp_833b_1"

	cleanupXP := func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_xp_ledger WHERE user_id LIKE 'test_usr_xp_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_xp_standings WHERE user_id LIKE 'test_usr_xp_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM users WHERE id LIKE 'test_usr_xp_%'")
	}
	cleanupXP()
	t.Cleanup(cleanupXP)

	_, err = db.ExecContext(ctx, `INSERT INTO users (id, username, email, password_hash) VALUES ($1, 'XPUser1', 'xp1@orvix.internal', 'valid_hash')`, userID)
	if err != nil {
		t.Fatalf("failed to insert user: %v", err)
	}

	// 1. Negative amount rejection on ledger
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_xp_ledger (user_id, amount, source_type, source_id)
		VALUES ($1, -50, 'challenge', 'ch_123')
	`, userID)
	if err == nil {
		t.Error("expected negative amount on user_xp_ledger to be rejected, got nil")
	}

	// 2. Empty source_id rejection on ledger
	_, err = db.ExecContext(ctx, `
		INSERT INTO user_xp_ledger (user_id, amount, source_type, source_id)
		VALUES ($1, 50, 'challenge', '   ')
	`, userID)
	if err == nil {
		t.Error("expected whitespace source_id to be rejected, got nil")
	}

	// 3. Conflict-aware insertion & standings update (Event 1: 500 XP)
	tx1, err := db.BeginTx(ctx, nil)
	if err != nil {
		t.Fatalf("failed to begin tx1: %v", err)
	}

	var insertedID int64
	err = tx1.QueryRowContext(ctx, `
		INSERT INTO user_xp_ledger (user_id, amount, source_type, source_id, description)
		VALUES ($1, $2, 'challenge', 'ch_monaco_quiz', 'Monaco Telemetry Quiz')
		ON CONFLICT (user_id, source_type, source_id) DO NOTHING
		RETURNING id
	`, userID, 500).Scan(&insertedID)
	if err != nil {
		_ = tx1.Rollback()
		t.Fatalf("failed conflict-aware ledger insert: %v", err)
	}
	if insertedID == 0 {
		_ = tx1.Rollback()
		t.Fatalf("expected newly inserted row id, got %d", insertedID)
	}

	// Increment standings inside same transaction
	// Formula: level = 1 + floor(total_xp / 1000)
	_, err = tx1.ExecContext(ctx, `
		INSERT INTO user_xp_standings (user_id, total_xp, level, updated_at)
		VALUES ($1, $2, 1 + ($2 / 1000), NOW())
		ON CONFLICT (user_id) DO UPDATE
		SET total_xp = user_xp_standings.total_xp + EXCLUDED.total_xp,
		    level = 1 + ((user_xp_standings.total_xp + EXCLUDED.total_xp) / 1000),
		    updated_at = NOW()
	`, userID, 500)
	if err != nil {
		_ = tx1.Rollback()
		t.Fatalf("failed to update standings: %v", err)
	}
	_ = tx1.Commit()

	// Verify standings: 500 XP -> Level 1 (0-999 interval)
	var totalXP, level int
	err = db.QueryRowContext(ctx, `SELECT total_xp, level FROM user_xp_standings WHERE user_id = $1`, userID).Scan(&totalXP, &level)
	if err != nil {
		t.Fatalf("failed to query standings: %v", err)
	}
	if totalXP != 500 || level != 1 {
		t.Errorf("expected 500 XP and Level 1, got XP=%d, Level=%d", totalXP, level)
	}

	// 4. Duplicate event attempt (must NOT increment standings!)
	tx2, err := db.BeginTx(ctx, nil)
	if err != nil {
		t.Fatalf("failed to begin tx2: %v", err)
	}

	var dupID int64
	err = tx2.QueryRowContext(ctx, `
		INSERT INTO user_xp_ledger (user_id, amount, source_type, source_id, description)
		VALUES ($1, $2, 'challenge', 'ch_monaco_quiz', 'Duplicate Attempt')
		ON CONFLICT (user_id, source_type, source_id) DO NOTHING
		RETURNING id
	`, userID, 500).Scan(&dupID)

	// In PostgreSQL, ON CONFLICT DO NOTHING returns sql.ErrNoRows when conflict occurs
	if err == nil {
		t.Errorf("expected duplicate conflict to return no rows, got id=%d", dupID)
	}

	// Since dupID is 0 / err is ErrNoRows, application does NOT update standings!
	_ = tx2.Rollback()

	// Verify standings remained 500 XP and Level 1
	_ = db.QueryRowContext(ctx, `SELECT total_xp, level FROM user_xp_standings WHERE user_id = $1`, userID).Scan(&totalXP, &level)
	if totalXP != 500 || level != 1 {
		t.Errorf("expected standings to remain 500 XP after duplicate attempt, got XP=%d", totalXP)
	}

	// 5. Distinct event (700 XP) -> Total 1200 XP -> Level 2 (1,000-1,999 interval)
	tx3, err := db.BeginTx(ctx, nil)
	if err != nil {
		t.Fatalf("failed to begin tx3: %v", err)
	}

	var event2ID int64
	err = tx3.QueryRowContext(ctx, `
		INSERT INTO user_xp_ledger (user_id, amount, source_type, source_id, description)
		VALUES ($1, $2, 'achievement', 'ach_telemetry_master', 'Telemetry Master Unlock')
		ON CONFLICT (user_id, source_type, source_id) DO NOTHING
		RETURNING id
	`, userID, 700).Scan(&event2ID)
	if err != nil || event2ID == 0 {
		_ = tx3.Rollback()
		t.Fatalf("failed to insert second distinct event: %v", err)
	}

	_, err = tx3.ExecContext(ctx, `
		INSERT INTO user_xp_standings (user_id, total_xp, level, updated_at)
		VALUES ($1, $2, 1 + ($2 / 1000), NOW())
		ON CONFLICT (user_id) DO UPDATE
		SET total_xp = user_xp_standings.total_xp + EXCLUDED.total_xp,
		    level = 1 + ((user_xp_standings.total_xp + EXCLUDED.total_xp) / 1000),
		    updated_at = NOW()
	`, userID, 700)
	if err != nil {
		_ = tx3.Rollback()
		t.Fatalf("failed to update standings for event 2: %v", err)
	}
	_ = tx3.Commit()

	_ = db.QueryRowContext(ctx, `SELECT total_xp, level FROM user_xp_standings WHERE user_id = $1`, userID).Scan(&totalXP, &level)
	if totalXP != 1200 || level != 2 {
		t.Errorf("expected 1200 XP and Level 2, got XP=%d, Level=%d", totalXP, level)
	}

	// 6. Distinct event (1000 XP) -> Total 2200 XP -> Level 3 (2,000-2,999 interval)
	tx4, err := db.BeginTx(ctx, nil)
	if err != nil {
		t.Fatalf("failed to begin tx4: %v", err)
	}
	_, _ = tx4.ExecContext(ctx, `
		INSERT INTO user_xp_ledger (user_id, amount, source_type, source_id, description)
		VALUES ($1, 1000, 'broadcast_watch', 'watch_monaco_gp', 'Watched Full Telemetry Broadcast')
	`, userID)
	_, _ = tx4.ExecContext(ctx, `
		UPDATE user_xp_standings
		SET total_xp = total_xp + 1000,
		    level = 1 + ((total_xp + 1000) / 1000),
		    updated_at = NOW()
		WHERE user_id = $1
	`, userID)
	_ = tx4.Commit()

	_ = db.QueryRowContext(ctx, `SELECT total_xp, level FROM user_xp_standings WHERE user_id = $1`, userID).Scan(&totalXP, &level)
	if totalXP != 2200 || level != 3 {
		t.Errorf("expected 2200 XP and Level 3, got XP=%d, Level=%d", totalXP, level)
	}

	// 7. Verify auditability: Standings total_xp matches SUM(amount) in user_xp_ledger
	var ledgerSum int
	err = db.QueryRowContext(ctx, `SELECT COALESCE(SUM(amount), 0) FROM user_xp_ledger WHERE user_id = $1`, userID).Scan(&ledgerSum)
	if err != nil {
		t.Fatalf("failed to sum ledger: %v", err)
	}
	if ledgerSum != totalXP {
		t.Errorf("standings total_xp (%d) drifted from ledger sum (%d)", totalXP, ledgerSum)
	}
}

// TestGamification_CascadingDeletions tests cascading deletions for users, challenges, matches, sports, and achievements.
func TestGamification_CascadingDeletions(t *testing.T) {
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
	t.Cleanup(func() {
		_ = db.Close()
	})

	sportID := "test_sport_casc_gam"
	leagueID := "test_league_casc_gam"
	teamAID := "test_team_casc_ga"
	teamBID := "test_team_casc_gb"
	matchID := "test_match_casc_gam"
	achID := "test_ach_casc_gam"
	challengeID := "test_ch_casc_gam"
	userID := "test_usr_casc_gam"

	cleanupCascGam := func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_challenges WHERE user_id LIKE 'test_usr_casc_gam%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_achievements WHERE user_id LIKE 'test_usr_casc_gam%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_xp_ledger WHERE user_id LIKE 'test_usr_casc_gam%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM user_xp_standings WHERE user_id LIKE 'test_usr_casc_gam%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM challenges WHERE id LIKE 'test_ch_casc_gam%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM achievements WHERE id LIKE 'test_ach_casc_gam%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM users WHERE id LIKE 'test_usr_casc_gam%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM matches WHERE id = $1", matchID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM teams WHERE id IN ($1, $2)", teamAID, teamBID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM leagues WHERE id = $1", leagueID)
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM sports WHERE id = $1", sportID)
	}
	cleanupCascGam()
	t.Cleanup(cleanupCascGam)

	// Fixtures
	_, _ = db.ExecContext(ctx, `INSERT INTO sports (id, slug, name) VALUES ($1, $1, 'Cascade Gam Sport') ON CONFLICT (id) DO NOTHING`, sportID)
	_, _ = db.ExecContext(ctx, `INSERT INTO leagues (id, sport_id, slug, name, country_or_region) VALUES ($1, $2, $1, 'Cascade Gam League', 'Global') ON CONFLICT (id) DO NOTHING`, leagueID, sportID)
	_, _ = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Team CGA', 'CGA', 'CGA') ON CONFLICT (id) DO NOTHING`, teamAID, sportID, leagueID)
	_, _ = db.ExecContext(ctx, `INSERT INTO teams (id, sport_id, league_id, slug, name, short_name, code) VALUES ($1, $2, $3, $1, 'Team CGB', 'CGB', 'CGB') ON CONFLICT (id) DO NOTHING`, teamBID, sportID, leagueID)
	_, _ = db.ExecContext(ctx, `INSERT INTO matches (id, sport_id, league_id, home_team_id, away_team_id, start_time) VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT (id) DO NOTHING`, matchID, sportID, leagueID, teamAID, teamBID)
	_, _ = db.ExecContext(ctx, `INSERT INTO users (id, username, email, password_hash) VALUES ($1, 'CascGamUser', 'cgam@orvix.internal', 'hash') ON CONFLICT (id) DO NOTHING`, userID)
	_, _ = db.ExecContext(ctx, `INSERT INTO achievements (id, code, title, category) VALUES ($1, 'CASC_ACH_1', 'Title', 'milestone') ON CONFLICT (id) DO NOTHING`, achID)
	_, _ = db.ExecContext(ctx, `INSERT INTO challenges (id, title, category, sport_id, match_id, reward_badge_id) VALUES ($1, 'Title', 'trivia', $2, $3, $4) ON CONFLICT (id) DO NOTHING`, challengeID, sportID, matchID, achID)

	_, _ = db.ExecContext(ctx, `INSERT INTO user_challenges (user_id, challenge_id) VALUES ($1, $2)`, userID, challengeID)
	_, _ = db.ExecContext(ctx, `INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)`, userID, achID)
	_, _ = db.ExecContext(ctx, `INSERT INTO user_xp_ledger (user_id, amount, source_type, source_id) VALUES ($1, 500, 'challenge', $2)`, userID, challengeID)
	_, _ = db.ExecContext(ctx, `INSERT INTO user_xp_standings (user_id, total_xp, level) VALUES ($1, 500, 1)`, userID)

	// 1. Deleting achievement sets challenges.reward_badge_id to NULL (ON DELETE SET NULL) without deleting challenge
	_, err = db.ExecContext(ctx, `DELETE FROM achievements WHERE id = $1`, achID)
	if err != nil {
		t.Fatalf("failed to delete achievement: %v", err)
	}

	var badgeID *string
	err = db.QueryRowContext(ctx, `SELECT reward_badge_id FROM challenges WHERE id = $1`, challengeID).Scan(&badgeID)
	if err != nil {
		t.Fatalf("failed to query challenge after achievement deletion: %v", err)
	}
	if badgeID != nil {
		t.Errorf("expected reward_badge_id to be NULL after achievement deletion, got %v", *badgeID)
	}

	// 2. Deleting match sets challenges.match_id to NULL without deleting challenge
	_, err = db.ExecContext(ctx, `DELETE FROM matches WHERE id = $1`, matchID)
	if err != nil {
		t.Fatalf("failed to delete match: %v", err)
	}

	var chMatchID *string
	err = db.QueryRowContext(ctx, `SELECT match_id FROM challenges WHERE id = $1`, challengeID).Scan(&chMatchID)
	if err != nil {
		t.Fatalf("failed to query challenge after match deletion: %v", err)
	}
	if chMatchID != nil {
		t.Errorf("expected match_id to be NULL after match deletion, got %v", *chMatchID)
	}

	// 3. Deleting challenge cascades to user_challenges, but historical user_xp_ledger row remains intact
	_, err = db.ExecContext(ctx, `DELETE FROM challenges WHERE id = $1`, challengeID)
	if err != nil {
		t.Fatalf("failed to delete challenge: %v", err)
	}

	var ucCount int
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_challenges WHERE challenge_id = $1`, challengeID).Scan(&ucCount)
	if ucCount != 0 {
		t.Errorf("expected user_challenges to be cascaded after challenge deletion, got count=%d", ucCount)
	}

	var ledgerCount int
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_xp_ledger WHERE user_id = $1 AND source_id = $2`, userID, challengeID).Scan(&ledgerCount)
	if ledgerCount != 1 {
		t.Errorf("expected historical user_xp_ledger row to remain intact after challenge deletion, got count=%d", ledgerCount)
	}

	// 4. Deleting user cascades to all gamification user records
	_, err = db.ExecContext(ctx, `DELETE FROM users WHERE id = $1`, userID)
	if err != nil {
		t.Fatalf("failed to delete user: %v", err)
	}

	var uachCount, uxlCount, uxsCount int
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_achievements WHERE user_id = $1`, userID).Scan(&uachCount)
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_xp_ledger WHERE user_id = $1`, userID).Scan(&uxlCount)
	_ = db.QueryRowContext(ctx, `SELECT count(*) FROM user_xp_standings WHERE user_id = $1`, userID).Scan(&uxsCount)

	if uachCount != 0 || uxlCount != 0 || uxsCount != 0 {
		t.Errorf("expected 0 user gamification rows after user deletion, got achievements=%d, ledger=%d, standings=%d", uachCount, uxlCount, uxsCount)
	}
}

// TestGamificationCategoryConstraints verifies Milestone 8.3.3c constraints:
// - Approved challenge categories: trivia, attendance, social, streak.
// - Rejection of unapproved challenge categories (including prediction/betting).
// - Approved achievement categories: milestone, loyalty, knowledge, social, special_event.
// - Rejection of unapproved achievement categories.
// - Approved badge variants: champagne, bronze, silver, gold, platinum, special.
// - Rejection of unapproved badge variants.
// - Existing defaults remain intact (challenges.reward_xp=500, challenges.status='active', achievements.badge_icon='Medal', achievements.badge_variant='champagne').
func TestGamificationCategoryConstraints(t *testing.T) {
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
	t.Cleanup(func() {
		_ = db.Close()
	})

	cleanupConstraintsTest := func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM challenges WHERE id LIKE 'test_ch_cat_%'")
		_, _ = db.ExecContext(cleanupCtx, "DELETE FROM achievements WHERE id LIKE 'test_ach_cat_%'")
	}
	cleanupConstraintsTest()
	t.Cleanup(cleanupConstraintsTest)

	// 1. Challenges category check: Every approved category is accepted
	approvedChallengeCategories := []string{"trivia", "attendance", "social", "streak"}
	for i, cat := range approvedChallengeCategories {
		chID := fmt.Sprintf("test_ch_cat_appr_%d", i)
		_, err := db.ExecContext(ctx, `
			INSERT INTO challenges (id, title, category)
			VALUES ($1, 'Approved Category Challenge', $2)
		`, chID, cat)
		if err != nil {
			t.Errorf("expected approved challenge category %q to be accepted, got error: %v", cat, err)
		}
	}

	// 2. Challenges category check: Unapproved categories (including prediction, betting, wagers) must be rejected
	unapprovedChallengeCategories := []string{"prediction", "betting", "wager", "fantasy", "gambling", "random_unapproved"}
	for i, cat := range unapprovedChallengeCategories {
		chID := fmt.Sprintf("test_ch_cat_unappr_%d", i)
		_, err := db.ExecContext(ctx, `
			INSERT INTO challenges (id, title, category)
			VALUES ($1, 'Unapproved Category Challenge', $2)
		`, chID, cat)
		if err == nil {
			t.Errorf("expected unapproved challenge category %q to be rejected by chk_challenges_category, got nil", cat)
		}
	}

	// 3. Achievements category check: Every approved category is accepted
	approvedAchievementCategories := []string{"milestone", "loyalty", "knowledge", "social", "special_event"}
	for i, cat := range approvedAchievementCategories {
		achID := fmt.Sprintf("test_ach_cat_appr_%d", i)
		achCode := fmt.Sprintf("CODE_ACH_APPR_%d", i)
		_, err := db.ExecContext(ctx, `
			INSERT INTO achievements (id, code, title, category)
			VALUES ($1, $2, 'Approved Category Achievement', $3)
		`, achID, achCode, cat)
		if err != nil {
			t.Errorf("expected approved achievement category %q to be accepted, got error: %v", cat, err)
		}
	}

	// 4. Achievements category check: Unapproved categories must be rejected
	unapprovedAchievementCategories := []string{"prediction", "broadcast", "betting", "lottery", "invalid_cat"}
	for i, cat := range unapprovedAchievementCategories {
		achID := fmt.Sprintf("test_ach_cat_unappr_%d", i)
		achCode := fmt.Sprintf("CODE_ACH_UNAPPR_%d", i)
		_, err := db.ExecContext(ctx, `
			INSERT INTO achievements (id, code, title, category)
			VALUES ($1, $2, 'Unapproved Category Achievement', $3)
		`, achID, achCode, cat)
		if err == nil {
			t.Errorf("expected unapproved achievement category %q to be rejected by chk_achievements_category, got nil", cat)
		}
	}

	// 5. Badge variant check: Every approved variant is accepted
	approvedBadgeVariants := []string{"champagne", "bronze", "silver", "gold", "platinum", "special"}
	for i, variant := range approvedBadgeVariants {
		achID := fmt.Sprintf("test_ach_var_appr_%d", i)
		achCode := fmt.Sprintf("CODE_ACH_VAR_%d", i)
		_, err := db.ExecContext(ctx, `
			INSERT INTO achievements (id, code, title, category, badge_variant)
			VALUES ($1, $2, 'Approved Variant Achievement', 'milestone', $3)
		`, achID, achCode, variant)
		if err != nil {
			t.Errorf("expected approved badge variant %q to be accepted, got error: %v", variant, err)
		}
	}

	// 6. Badge variant check: Unapproved variants must be rejected
	unapprovedBadgeVariants := []string{"diamond", "ruby", "emerald", "wood", "invalid"}
	for i, variant := range unapprovedBadgeVariants {
		achID := fmt.Sprintf("test_ach_var_unappr_%d", i)
		achCode := fmt.Sprintf("CODE_ACH_UNVAR_%d", i)
		_, err := db.ExecContext(ctx, `
			INSERT INTO achievements (id, code, title, category, badge_variant)
			VALUES ($1, $2, 'Unapproved Variant Achievement', 'milestone', $3)
		`, achID, achCode, variant)
		if err == nil {
			t.Errorf("expected unapproved badge variant %q to be rejected by chk_achievements_badge_variant, got nil", variant)
		}
	}

	// 7. Verify existing defaults remain intact
	defChID := "test_ch_cat_defaults"
	_, err = db.ExecContext(ctx, `
		INSERT INTO challenges (id, title, category)
		VALUES ($1, 'Default Values Challenge', 'trivia')
	`, defChID)
	if err != nil {
		t.Fatalf("failed to insert default challenge: %v", err)
	}

	var rewardXP, totalSteps int
	var status string
	err = db.QueryRowContext(ctx, `
		SELECT reward_xp, total_steps, status FROM challenges WHERE id = $1
	`, defChID).Scan(&rewardXP, &totalSteps, &status)
	if err != nil {
		t.Fatalf("failed to query default challenge: %v", err)
	}
	if rewardXP != 500 {
		t.Errorf("expected default challenges.reward_xp = 500, got %d", rewardXP)
	}
	if totalSteps != 1 {
		t.Errorf("expected default challenges.total_steps = 1, got %d", totalSteps)
	}
	if status != "active" {
		t.Errorf("expected default challenges.status = 'active', got %q", status)
	}

	defAchID := "test_ach_cat_defaults"
	_, err = db.ExecContext(ctx, `
		INSERT INTO achievements (id, code, title, category)
		VALUES ($1, 'DEF_ACH_CODE', 'Default Values Achievement', 'milestone')
	`, defAchID)
	if err != nil {
		t.Fatalf("failed to insert default achievement: %v", err)
	}

	var badgeIcon, badgeVariant string
	var achRewardXP int
	var isSecret bool
	err = db.QueryRowContext(ctx, `
		SELECT badge_icon, badge_variant, reward_xp, is_secret FROM achievements WHERE id = $1
	`, defAchID).Scan(&badgeIcon, &badgeVariant, &achRewardXP, &isSecret)
	if err != nil {
		t.Fatalf("failed to query default achievement: %v", err)
	}
	if badgeIcon != "Medal" {
		t.Errorf("expected default achievements.badge_icon = 'Medal', got %q", badgeIcon)
	}
	if badgeVariant != "champagne" {
		t.Errorf("expected default achievements.badge_variant = 'champagne', got %q", badgeVariant)
	}
	if achRewardXP != 0 {
		t.Errorf("expected default achievements.reward_xp = 0, got %d", achRewardXP)
	}
	if isSecret != false {
		t.Errorf("expected default achievements.is_secret = false, got %v", isSecret)
	}
}
