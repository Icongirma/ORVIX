-- =============================================================================
-- Migration: 000003_user_preferences_schema.down.sql
-- Description: Safe rollback of Milestone 8.3.3a schema (No CASCADE)
-- =============================================================================

DROP TABLE IF EXISTS user_match_alerts;
DROP TABLE IF EXISTS user_favorite_teams;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;
