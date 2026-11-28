-- =============================================================================
-- Migration: 000002_schema_integrity.down.sql
-- Description: Rollback non-negative CHECK constraints introduced in 000002
-- Note: Does NOT drop tables or delete any data.
-- =============================================================================

ALTER TABLE matches
    DROP CONSTRAINT IF EXISTS chk_matches_home_score_non_negative,
    DROP CONSTRAINT IF EXISTS chk_matches_away_score_non_negative,
    DROP CONSTRAINT IF EXISTS chk_matches_current_minute_non_negative;

ALTER TABLE match_events
    DROP CONSTRAINT IF EXISTS chk_match_events_minute_non_negative,
    DROP CONSTRAINT IF EXISTS chk_match_events_extra_minute_non_negative,
    DROP CONSTRAINT IF EXISTS chk_match_events_home_score_after_non_negative,
    DROP CONSTRAINT IF EXISTS chk_match_events_away_score_after_non_negative;
