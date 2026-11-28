-- =============================================================================
-- Migration: 000005_gamification_category_constraints.up.sql
-- Description: Add category check constraints for challenges, achievements,
--              and achievement badge variants.
-- =============================================================================

-- 1. Challenges category constraint: trivia, attendance, social, streak
ALTER TABLE challenges
    ADD CONSTRAINT chk_challenges_category
    CHECK (category IN ('trivia', 'attendance', 'social', 'streak'));

-- 2. Achievements category constraint: milestone, loyalty, knowledge, social, special_event
ALTER TABLE achievements
    ADD CONSTRAINT chk_achievements_category
    CHECK (category IN ('milestone', 'loyalty', 'knowledge', 'social', 'special_event'));

-- 3. Achievements badge variant constraint: champagne, bronze, silver, gold, platinum, special
ALTER TABLE achievements
    ADD CONSTRAINT chk_achievements_badge_variant
    CHECK (badge_variant IN ('champagne', 'bronze', 'silver', 'gold', 'platinum', 'special'));
