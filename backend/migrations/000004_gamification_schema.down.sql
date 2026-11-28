-- =============================================================================
-- Migration: 000004_gamification_schema.down.sql
-- Description: Safe rollback of Milestone 8.3.3b gamification schema (No CASCADE)
-- =============================================================================

ALTER TABLE IF EXISTS challenges 
    DROP CONSTRAINT IF EXISTS fk_challenges_reward_badge_id;

DROP TABLE IF EXISTS user_xp_standings;
DROP TABLE IF EXISTS user_xp_ledger;
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS user_challenges;
DROP TABLE IF EXISTS challenges;
