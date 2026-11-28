# ORVIX Backend

The official backend service for the ORVIX sports media, broadcast telemetry, and entertainment platform.

---

## 1. Prerequisites

- **Go**: Version `1.22` or newer (built and tested with `go1.27.4`).
- **PostgreSQL**: PostgreSQL 16+ (via Docker Compose or local installation).
- **Docker & Docker Compose**: Recommended for local containerized database provisioning. (If Docker is not installed, local PostgreSQL or remote instances can be configured via environment variables).

---

## 2. Directory Structure

```text
backend/
├── cmd/
│   └── server/
│       └── main.go          # Server entrypoint, database init, and graceful shutdown lifecycle
├── internal/
│   ├── config/              # Runtime configuration, env parsing, and safe DSN formatting
│   │   ├── config.go
│   │   └── config_test.go
│   ├── database/            # PostgreSQL connection management, pooling, migrations, and health
│   │   ├── database.go
│   │   ├── database_test.go
│   │   ├── migrations.go    # SQL migration runner, transactional execution & tracking
│   │   └── migrations_test.go
│   └── server/              # HTTP server, routing multiplexer, middleware, and health endpoints
│       ├── server.go
│       ├── routes.go
│       └── routes_test.go
├── migrations/              # Forward and reverse SQL migration files (.up.sql, .down.sql)
│   └── .gitkeep
├── go.mod                   # Go module declaration and dependency lock
├── go.sum                   # Checksums for external dependencies (jackc/pgx/v5)
└── README.md                # Backend service documentation
```

---

## 3. Configuration & Environment Variables

The backend loads configuration from environment variables. Safe defaults are provided for local development.

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | `string` | `8080` | Port for the HTTP server to bind and listen on. |
| `DB_HOST` | `string` | `localhost` | PostgreSQL host address. |
| `DB_PORT` | `string` | `5432` | PostgreSQL listening port. |
| `DB_NAME` | `string` | `orvix` | Target PostgreSQL database name. |
| `DB_USER` | `string` | `orvix_user` | Application database username. |
| `DB_PASSWORD` | `string` | `""` | Database user password. |
| `DB_SSLMODE` | `string` | `disable` | SSL mode (`disable`, `require`, `verify-ca`, `verify-full`). |
| `DB_REQUIRED` | `bool` | `false` | When `true`, server aborts startup if DB connection fails. When `false`, server logs warning and starts. |
| `DB_MAX_OPEN_CONNS` | `int` | `25` | Maximum number of open connections to the database pool. |
| `DB_MAX_IDLE_CONNS` | `int` | `5` | Maximum number of idle connections retained in the pool. |
| `DB_CONN_MAX_LIFETIME` | `duration` | `5m` | Maximum amount of time a connection may be reused. |
| `DB_CONN_MAX_IDLE_TIME` | `duration` | `2m` | Maximum amount of time a connection may be idle before closing. |

A template file is available at the project root: [`.env.example`](../.env.example).

---

## 4. Starting the PostgreSQL Database with Docker Compose

A `docker-compose.yml` file is configured in the repository root.

### Start PostgreSQL
From the project root:
```bash
docker compose up -d
```

### Check Container Status
```bash
docker compose ps
```
The database container includes an internal health check using `pg_isready`. Once healthy, it accepts connections on port `5432` (or the configured `DB_PORT`).

### Data Persistence
Data is persisted inside the named Docker volume:
```text
orvix_pgdata
```
The volume persists across container restarts and updates.

### Stop PostgreSQL
```bash
# Stop containers without removing persistent data
docker compose down

# Stop containers and remove persistent volume (destructive)
docker compose down -v
```

---

## 5. Running the Backend Server

### Option A: Direct Run
From the `backend/` directory:
```bash
go run ./cmd/server
```

### Option B: Build Binary and Execute
From the `backend/` directory:

**Windows (PowerShell):**
```powershell
go build -o bin/server.exe ./cmd/server
./bin/server.exe
```

**macOS / Linux:**
```bash
go build -o bin/server ./cmd/server
./bin/server
```

---

## 6. Health & Diagnostics Endpoints

The server exposes two health endpoints for monitoring and cluster orchestration:

### 1. General API Health
Checks HTTP server responsiveness.

- **URL**: `GET http://localhost:8080/api/v1/health`
- **Response (HTTP 200 OK)**:
```json
{
  "status": "ok",
  "service": "ORVIX API"
}
```

### 2. Database Connectivity Health
Validates live connection to PostgreSQL via ping with a 2-second timeout.

- **URL**: `GET http://localhost:8080/api/v1/health/db`

**Connected (HTTP 200 OK):**
```json
{
  "status": "ok",
  "database": "connected"
}
```

**Unavailable / Disconnected (HTTP 503 Service Unavailable):**
```json
{
  "status": "error",
  "database": "unavailable"
}
```
*Note: For security, no database credentials, raw DSN strings, or internal driver errors are ever exposed via HTTP responses.*

---

## 7. Database Migrations

The ORVIX backend includes a transactional, zero-dependency SQL migration runner in `backend/internal/database/migrations.go`.

### Migration File Convention
Migration files reside in the `backend/migrations/` directory and use the naming format:
- Forward migration: `<version>_<name>.up.sql` (e.g. `000001_initial_schema.up.sql`)
- Rollback migration: `<version>_<name>.down.sql` (e.g. `000001_initial_schema.down.sql`)

Migrations are executed in ascending lexicographical order based on their version identifier.

### Tracking Table
Applied migrations are recorded in PostgreSQL in the `schema_migrations` table:
```sql
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Execution Characteristics
- **Concurrency Safe**: Uses a PostgreSQL session-level advisory lock (`pg_advisory_lock(742947239102)`) on a dedicated connection to prevent race conditions during concurrent startup or deployment.
- **Transactional**: Each migration script is executed within its own `BEGIN ... COMMIT` transaction alongside its insertion into `schema_migrations`.
- **Atomic Rollback**: If an error occurs in any SQL statement, the entire migration transaction is rolled back and no record is left in `schema_migrations`.
- **Duplicate Prevention**: Before executing, the runner queries `schema_migrations` and skips all previously applied migrations.
- **Programmatic API**:
  ```go
  migrator := db.NewMigrator()
  applied, err := migrator.MigrateFromDir(ctx, "migrations")
  ```

---

## 8. Running Unit Tests

Run all unit tests across all packages from the `backend/` directory:

```bash
go test -v ./...
```
