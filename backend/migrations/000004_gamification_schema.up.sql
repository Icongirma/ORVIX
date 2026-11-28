-- =============================================================================
-- Migration: 000004_gamification_schema.up.sql
-- Description: Non-monetary fan engagement, challenges, achievements, and XP
-- =============================================================================

-- 1. Challenges Catalog Table
CREATE TABLE challenges (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL,
    sport_id VARCHAR(32) REFERENCES sports(id) ON DELETE SET NULL,
    match_id VARCHAR(64) REFERENCES matches(id) ON DELETE SET NULL,
    reward_xp INTEGER NOT NULL DEFAULT 500,
    reward_badge_id VARCHAR(64),
    total_steps INTEGER NOT NULL DEFAULT 1,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_challenges_id_non_empty CHECK (LENGTH(TRIM(id)) > 0),
    CONSTRAINT chk_challenges_title_non_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT chk_challenges_reward_xp CHECK (reward_xp >= 0),
    CONSTRAINT chk_challenges_total_steps CHECK (total_steps >= 1),
    CONSTRAINT chk_challenges_dates CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at),
    CONSTRAINT chk_challenges_status CHECK (status IN ('draft', 'active', 'completed', 'archived'))
);

CREATE INDEX idx_challenges_status_dates ON challenges (status, starts_at, ends_at);
CREATE INDEX idx_challenges_sport_id ON challenges (sport_id);
CREATE INDEX idx_challenges_match_id ON challenges (match_id);

-- 2. User Challenge Participation Table
CREATE TABLE user_challenges (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id VARCHAR(64) NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    current_step INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'in_progress',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_challenges_user_challenge UNIQUE (user_id, challenge_id),
    CONSTRAINT chk_user_challenges_step CHECK (current_step >= 0),
    CONSTRAINT chk_user_challenges_status CHECK (status IN ('in_progress', 'completed', 'expired')),
    CONSTRAINT chk_user_challenges_completion CHECK (
        (status = 'completed' AND completed_at IS NOT NULL) OR 
        (status <> 'completed' AND completed_at IS NULL)
    )
);

CREATE INDEX idx_user_challenges_challenge_status ON user_challenges (challenge_id, status);
CREATE INDEX idx_user_challenges_user_status ON user_challenges (user_id, status);

-- 3. Achievements Catalog Table
CREATE TABLE achievements (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category VARCHAR(64) NOT NULL,
    badge_icon VARCHAR(64) NOT NULL DEFAULT 'Medal',
    badge_variant VARCHAR(32) NOT NULL DEFAULT 'champagne',
    reward_xp INTEGER NOT NULL DEFAULT 0,
    is_secret BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_achievements_id_non_empty CHECK (LENGTH(TRIM(id)) > 0),
    CONSTRAINT chk_achievements_code_non_empty CHECK (LENGTH(TRIM(code)) > 0),
    CONSTRAINT chk_achievements_title_non_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT chk_achievements_reward_xp CHECK (reward_xp >= 0)
);

CREATE INDEX idx_achievements_category ON achievements (category);

-- Attach foreign key from challenges to achievements
ALTER TABLE challenges
    ADD CONSTRAINT fk_challenges_reward_badge_id
    FOREIGN KEY (reward_badge_id) REFERENCES achievements(id) ON DELETE SET NULL;

CREATE INDEX idx_challenges_reward_badge_id ON challenges (reward_badge_id);

-- 4. User Unlocked Achievements Table
CREATE TABLE user_achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(64) NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_achievements_user_achievement UNIQUE (user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_unlocked ON user_achievements (user_id, unlocked_at DESC);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements (achievement_id);

-- 5. User XP Ledger Table (Application-level append-only audit trail)
-- Note: source_id is a non-empty historical identifier without a foreign key.
-- Historical source IDs may safely remain after their originating challenge or achievement is deleted.
CREATE TABLE user_xp_ledger (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source_type VARCHAR(32) NOT NULL,
    source_id VARCHAR(64) NOT NULL,
    description VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_xp_ledger_amount CHECK (amount > 0),
    CONSTRAINT chk_user_xp_ledger_source_type CHECK (
        source_type IN ('challenge', 'achievement', 'broadcast_watch', 'community', 'trivia', 'manual_adjustment')
    ),
    CONSTRAINT chk_user_xp_ledger_source_id_non_empty CHECK (LENGTH(TRIM(source_id)) > 0),
    CONSTRAINT uq_user_xp_ledger_user_source UNIQUE (user_id, source_type, source_id)
);

CREATE INDEX idx_user_xp_ledger_user_created ON user_xp_ledger (user_id, created_at DESC);

-- 6. User XP Standings Table (Cached cumulative progression summary)
-- Level calculation: Level 1: 0-999 XP, Level 2: 1000-1999 XP, Level = 1 + floor(total_xp / 1000)
CREATE TABLE user_xp_standings (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_xp_standings_total_xp CHECK (total_xp >= 0),
    CONSTRAINT chk_user_xp_standings_level CHECK (level >= 1)
);

CREATE INDEX idx_user_xp_standings_total_xp ON user_xp_standings (total_xp DESC);
