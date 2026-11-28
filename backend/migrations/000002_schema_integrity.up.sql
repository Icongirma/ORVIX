-- =============================================================================
-- Migration: 000002_schema_integrity.up.sql
-- Description: Non-negative CHECK constraints for match scores, minutes, and events
-- =============================================================================

-- 1. Constraints on matches table
ALTER TABLE matches
    ADD CONSTRAINT chk_matches_home_score_non_negative CHECK (home_score >= 0),
    ADD CONSTRAINT chk_matches_away_score_non_negative CHECK (away_score >= 0),
    ADD CONSTRAINT chk_matches_current_minute_non_negative CHECK (current_minute IS NULL OR current_minute >= 0);

-- 2. Constraints on match_events table
ALTER TABLE match_events
    ADD CONSTRAINT chk_match_events_minute_non_negative CHECK (minute IS NULL OR minute >= 0),
    ADD CONSTRAINT chk_match_events_extra_minute_non_negative CHECK (extra_minute IS NULL OR extra_minute >= 0),
    ADD CONSTRAINT chk_match_events_home_score_after_non_negative CHECK (home_score_after IS NULL OR home_score_after >= 0),
    ADD CONSTRAINT chk_match_events_away_score_after_non_negative CHECK (away_score_after IS NULL OR away_score_after >= 0);
