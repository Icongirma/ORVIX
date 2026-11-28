-- =============================================================================
-- Migration: 000003_user_preferences_schema.up.sql
-- Description: User accounts, playback preferences, favorite teams, match alerts
-- =============================================================================

-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(128) NOT NULL DEFAULT '',
    avatar_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_users_id_non_empty CHECK (LENGTH(TRIM(id)) > 0),
    CONSTRAINT chk_users_username_format CHECK (LENGTH(TRIM(username)) >= 3 AND username ~ '^[a-zA-Z0-9_.-]+$'),
    CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_users_password_hash_non_empty CHECK (LENGTH(TRIM(password_hash)) > 0),
    CONSTRAINT chk_users_status CHECK (status IN ('active', 'suspended', 'deactivated'))
);

CREATE UNIQUE INDEX uq_users_username_lower ON users (LOWER(username));
CREATE UNIQUE INDEX uq_users_email_lower ON users (LOWER(email));

-- 2. User Profiles / Preferences Table
CREATE TABLE user_profiles (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    stream_quality VARCHAR(32) NOT NULL DEFAULT '1080p60',
    spatial_audio_enabled BOOLEAN NOT NULL DEFAULT true,
    favorite_sport_id VARCHAR(32) REFERENCES sports(id) ON DELETE SET NULL,
    theme VARCHAR(32) NOT NULL DEFAULT 'graphite',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_profiles_stream_quality CHECK (stream_quality IN ('auto', '720p', '1080p', '1080p60', '4k60')),
    CONSTRAINT chk_user_profiles_theme CHECK (theme IN ('graphite', 'mixed', 'light'))
);

CREATE INDEX idx_user_profiles_favorite_sport_id ON user_profiles (favorite_sport_id);

-- 3. User Favorite Teams Table (Following / Bookmarks)
CREATE TABLE user_favorite_teams (
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id VARCHAR(64) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, team_id)
);

CREATE INDEX idx_user_favorite_teams_team_id ON user_favorite_teams (team_id);

-- 4. User Match Alerts Table (Notification Subscriptions)
CREATE TABLE user_match_alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id VARCHAR(64) NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    alert_type VARCHAR(32) NOT NULL DEFAULT 'match_start',
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_user_match_alerts_type CHECK (
        alert_type IN (
            'match_start',
            'score_change',
            'red_card',
            'period_end',
            'match_finish',
            'lineup_announced'
        )
    ),
    CONSTRAINT uq_user_match_alerts_user_match_type UNIQUE (user_id, match_id, alert_type)
);

-- Full index on match_id for match-level queries and FK deletion cascading
CREATE INDEX idx_user_match_alerts_match_id ON user_match_alerts (match_id);

-- Partial index for active notification dispatch
CREATE INDEX idx_user_match_alerts_active_dispatch 
    ON user_match_alerts (match_id, alert_type) 
    WHERE is_enabled = true;
