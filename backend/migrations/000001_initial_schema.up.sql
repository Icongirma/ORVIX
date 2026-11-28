-- =============================================================================
-- Migration: 000001_initial_schema.up.sql
-- Description: Core Sports Relational Schema
-- Platforms: Sports & categories, leagues, seasons, teams, rosters, matches, events
-- =============================================================================

-- 1. Sports and Categories
CREATE TABLE IF NOT EXISTS sports (
    id VARCHAR(32) PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(64) NOT NULL,
    icon VARCHAR(64) NOT NULL DEFAULT 'Trophy',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Leagues and Competitions
CREATE TABLE IF NOT EXISTS leagues (
    id VARCHAR(64) PRIMARY KEY,
    sport_id VARCHAR(32) NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
    slug VARCHAR(128) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    country_or_region VARCHAR(64) NOT NULL,
    current_phase VARCHAR(64) NOT NULL DEFAULT 'Regular Season',
    active_season VARCHAR(32) NOT NULL DEFAULT '2026/27',
    description TEXT NOT NULL DEFAULT '',
    badge_variant VARCHAR(32) NOT NULL DEFAULT 'champagne',
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leagues_sport_id ON leagues(sport_id);
CREATE INDEX IF NOT EXISTS idx_leagues_is_active ON leagues(is_active);

-- 3. Seasons
CREATE TABLE IF NOT EXISTS seasons (
    id VARCHAR(64) PRIMARY KEY,
    league_id VARCHAR(64) NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    name VARCHAR(32) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_season_league_name UNIQUE (league_id, name)
);

CREATE INDEX IF NOT EXISTS idx_seasons_league_id ON seasons(league_id);
CREATE INDEX IF NOT EXISTS idx_seasons_is_current ON seasons(is_current);

-- 4. Teams and Competitors
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(64) PRIMARY KEY,
    sport_id VARCHAR(32) NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
    league_id VARCHAR(64) REFERENCES leagues(id) ON DELETE SET NULL,
    slug VARCHAR(128) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    short_name VARCHAR(64) NOT NULL,
    code VARCHAR(16) NOT NULL,
    accent_color VARCHAR(32) NOT NULL DEFAULT '#C6AD7B',
    venue VARCHAR(128) NOT NULL DEFAULT '',
    city VARCHAR(64) NOT NULL DEFAULT '',
    coach VARCHAR(64) NOT NULL DEFAULT '',
    founded VARCHAR(32) NOT NULL DEFAULT '',
    season_rank VARCHAR(64) NOT NULL DEFAULT '',
    key_stat VARCHAR(64) NOT NULL DEFAULT '',
    stat_label VARCHAR(64) NOT NULL DEFAULT '',
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_sport_id ON teams(sport_id);
CREATE INDEX IF NOT EXISTS idx_teams_league_id ON teams(league_id);
CREATE INDEX IF NOT EXISTS idx_teams_code ON teams(code);

-- 5. Team Season Standings / Form History
CREATE TABLE IF NOT EXISTS team_seasons (
    id BIGSERIAL PRIMARY KEY,
    team_id VARCHAR(64) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    season_id VARCHAR(64) NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    rank INTEGER,
    played INTEGER NOT NULL DEFAULT 0,
    won INTEGER NOT NULL DEFAULT 0,
    drawn INTEGER NOT NULL DEFAULT 0,
    lost INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0,
    goals_for INTEGER NOT NULL DEFAULT 0,
    goals_against INTEGER NOT NULL DEFAULT 0,
    form VARCHAR(32) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_team_season UNIQUE (team_id, season_id)
);

CREATE INDEX IF NOT EXISTS idx_team_seasons_season_id ON team_seasons(season_id);
CREATE INDEX IF NOT EXISTS idx_team_seasons_rank ON team_seasons(season_id, rank);

-- 6. Players and Squad Rosters
CREATE TABLE IF NOT EXISTS players (
    id VARCHAR(64) PRIMARY KEY,
    team_id VARCHAR(64) REFERENCES teams(id) ON DELETE SET NULL,
    name VARCHAR(128) NOT NULL,
    position VARCHAR(64) NOT NULL DEFAULT '',
    number INTEGER NOT NULL DEFAULT 0,
    nationality VARCHAR(64) NOT NULL DEFAULT '',
    avatar_url TEXT,
    is_captain BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);

-- 7. Matches and Fixtures
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(64) PRIMARY KEY,
    sport_id VARCHAR(32) NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
    league_id VARCHAR(64) NOT NULL REFERENCES leagues(id) ON DELETE RESTRICT,
    season_id VARCHAR(64) REFERENCES seasons(id) ON DELETE SET NULL,
    home_team_id VARCHAR(64) NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    away_team_id VARCHAR(64) NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    status VARCHAR(32) NOT NULL DEFAULT 'scheduled',
    status_text VARCHAR(64) NOT NULL DEFAULT 'Upcoming',
    start_time TIMESTAMPTZ NOT NULL,
    venue VARCHAR(128) NOT NULL DEFAULT '',
    city VARCHAR(64) NOT NULL DEFAULT '',
    broadcast_badge VARCHAR(32) NOT NULL DEFAULT 'LIVE',
    home_score INTEGER NOT NULL DEFAULT 0,
    away_score INTEGER NOT NULL DEFAULT 0,
    current_minute INTEGER,
    current_period VARCHAR(16),
    home_formation VARCHAR(16),
    away_formation VARCHAR(16),
    home_lineup JSONB,
    away_lineup JSONB,
    stats JSONB,
    head_to_head JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_match_status CHECK (status IN ('scheduled', 'live', 'finished', 'postponed', 'cancelled')),
    CONSTRAINT chk_different_teams CHECK (home_team_id <> away_team_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_sport_status ON matches(sport_id, status);
CREATE INDEX IF NOT EXISTS idx_matches_league_time ON matches(league_id, start_time);
CREATE INDEX IF NOT EXISTS idx_matches_home_team ON matches(home_team_id, start_time);
CREATE INDEX IF NOT EXISTS idx_matches_away_team ON matches(away_team_id, start_time);
CREATE INDEX IF NOT EXISTS idx_matches_start_time ON matches(start_time);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- 8. Match Events and Live Telemetry
CREATE TABLE IF NOT EXISTS match_events (
    id BIGSERIAL PRIMARY KEY,
    match_id VARCHAR(64) NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    event_type VARCHAR(32) NOT NULL,
    minute INTEGER,
    extra_minute INTEGER,
    period VARCHAR(16),
    team_id VARCHAR(64) REFERENCES teams(id) ON DELETE SET NULL,
    player_id VARCHAR(64) REFERENCES players(id) ON DELETE SET NULL,
    secondary_player_id VARCHAR(64) REFERENCES players(id) ON DELETE SET NULL,
    event_data JSONB,
    home_score_after INTEGER,
    away_score_after INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_match_events_match_minute ON match_events(match_id, minute, created_at);
CREATE INDEX IF NOT EXISTS idx_match_events_event_type ON match_events(event_type);
CREATE INDEX IF NOT EXISTS idx_match_events_team_id ON match_events(team_id);
