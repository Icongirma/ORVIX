-- =============================================================================
-- Migration: 000005_gamification_category_constraints.down.sql
-- Description: Revert category constraints added in migration 000005.
-- =============================================================================

-- Remove only the three constraints introduced by 000005
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS chk_achievements_badge_variant;
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS chk_achievements_category;
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS chk_challenges_category;
