package config

import (
	"bufio"
	"fmt"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// Config holds runtime configuration for the ORVIX backend server and database.
type Config struct {
	// Server
	Port            string
	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	IdleTimeout     time.Duration
	ShutdownTimeout time.Duration

	// Database
	DBHost     string
	DBPort     string
	DBName     string
	DBUser     string
	DBPassword string
	DBSSLMode  string
	DBRequired bool

	// Database Connection Pool
	DBMaxOpenConns    int
	DBMaxIdleConns    int
	DBConnMaxLifetime time.Duration
	DBConnMaxIdleTime time.Duration
	DBConnectTimeout  time.Duration
}

// LoadDotEnv reads key-value pairs from .env within validated project boundaries
// and sets them if not already present in the environment.
func LoadDotEnv() {
	envPath := findEnvPath()
	if envPath == "" {
		return
	}

	f, err := os.Open(envPath)
	if err != nil {
		return
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			k := strings.TrimSpace(parts[0])
			v := strings.TrimSpace(parts[1])
			// Strip quotes if present
			if len(v) >= 2 && ((v[0] == '"' && v[len(v)-1] == '"') || (v[0] == '\'' && v[len(v)-1] == '\'')) {
				v = v[1 : len(v)-1]
			}
			if _, exists := os.LookupEnv(k); !exists {
				_ = os.Setenv(k, v)
			}
		}
	}
}

// findEnvPath locates the .env file within the project boundary.
// It starts from the working directory and traverses up to parent directories,
// stopping at the project root boundary (marked by package.json or docker-compose.yml).
func findEnvPath() string {
	dir, err := os.Getwd()
	if err != nil {
		return ""
	}

	for i := 0; i < 5; i++ {
		candidate := filepath.Join(dir, ".env")
		if fi, err := os.Stat(candidate); err == nil && !fi.IsDir() {
			// Accept if in current execution directory, backend root with go.mod, or project root
			if i == 0 || isProjectBoundary(dir) || hasFile(dir, "go.mod") {
				return candidate
			}
		}

		// Stop traversal if we have reached the project boundary
		if isProjectBoundary(dir) {
			break
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}

	return ""
}

func isProjectBoundary(dir string) bool {
	return hasFile(dir, "package.json") || hasFile(dir, "docker-compose.yml") || hasFile(dir, ".git")
}

func hasFile(dir, name string) bool {
	p := filepath.Join(dir, name)
	_, err := os.Stat(p)
	return err == nil
}

// Load reads configuration from environment variables with sensible local defaults.
func Load() *Config {
	LoadDotEnv()

	port := getEnv("PORT", "8080")

	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbName := getEnv("DB_NAME", "orvix")
	dbUser := getEnv("DB_USER", "orvix_user")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")
	dbRequired := getEnvBool("DB_REQUIRED", false)

	dbMaxOpenConns := getEnvInt("DB_MAX_OPEN_CONNS", 25)
	dbMaxIdleConns := getEnvInt("DB_MAX_IDLE_CONNS", 10)
	dbConnMaxLifetime := getEnvDuration("DB_CONN_MAX_LIFETIME", 5*time.Minute)
	dbConnMaxIdleTime := getEnvDuration("DB_CONN_MAX_IDLE_TIME", 1*time.Minute)
	dbConnectTimeout := getEnvDuration("DB_CONNECT_TIMEOUT", 5*time.Second)

	return &Config{
		Port:              port,
		ReadTimeout:       5 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       120 * time.Second,
		ShutdownTimeout:   5 * time.Second,
		DBHost:            dbHost,
		DBPort:            dbPort,
		DBName:            dbName,
		DBUser:            dbUser,
		DBPassword:        dbPassword,
		DBSSLMode:         dbSSLMode,
		DBRequired:        dbRequired,
		DBMaxOpenConns:    dbMaxOpenConns,
		DBMaxIdleConns:    dbMaxIdleConns,
		DBConnMaxLifetime: dbConnMaxLifetime,
		DBConnMaxIdleTime: dbConnMaxIdleTime,
		DBConnectTimeout:  dbConnectTimeout,
	}
}

// DSN returns the PostgreSQL connection string formatted for the pgx driver.
func (c *Config) DSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s&connect_timeout=%d",
		url.QueryEscape(c.DBUser),
		url.QueryEscape(c.DBPassword),
		c.DBHost,
		c.DBPort,
		c.DBName,
		c.DBSSLMode,
		int(c.DBConnectTimeout.Seconds()),
	)
}

// SafeDSN returns the connection target with the password masked for safe logging.
func (c *Config) SafeDSN() string {
	return fmt.Sprintf("postgres://%s:****@%s:%s/%s?sslmode=%s",
		c.DBUser,
		c.DBHost,
		c.DBPort,
		c.DBName,
		c.DBSSLMode,
	)
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getEnvBool(key string, defaultVal bool) bool {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	b, err := strconv.ParseBool(val)
	if err != nil {
		return defaultVal
	}
	return b
}

func getEnvInt(key string, defaultVal int) int {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	n, err := strconv.Atoi(val)
	if err != nil {
		return defaultVal
	}
	return n
}

func getEnvDuration(key string, defaultVal time.Duration) time.Duration {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	d, err := time.ParseDuration(val)
	if err != nil {
		return defaultVal
	}
	return d
}
