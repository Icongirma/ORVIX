package config

import (
	"os"
	"strings"
	"testing"
	"time"
)

func TestLoad_DefaultPort(t *testing.T) {
	_ = os.Unsetenv("PORT")
	cfg := Load()

	if cfg.Port != "8080" {
		t.Errorf("expected default port 8080, got %s", cfg.Port)
	}
}

func TestLoad_CustomPort(t *testing.T) {
	customPort := "9090"
	_ = os.Setenv("PORT", customPort)
	defer func() { _ = os.Unsetenv("PORT") }()

	cfg := Load()
	if cfg.Port != customPort {
		t.Errorf("expected port %s, got %s", customPort, cfg.Port)
	}
}

func TestLoad_DatabaseDefaults(t *testing.T) {
	_ = os.Unsetenv("DB_HOST")
	_ = os.Unsetenv("DB_PORT")
	_ = os.Unsetenv("DB_NAME")
	_ = os.Unsetenv("DB_USER")
	_ = os.Unsetenv("DB_PASSWORD")
	_ = os.Unsetenv("DB_SSLMODE")

	cfg := Load()

	if cfg.DBHost != "localhost" {
		t.Errorf("expected default DBHost 'localhost', got '%s'", cfg.DBHost)
	}
	if cfg.DBPort != "5432" {
		t.Errorf("expected default DBPort '5432', got '%s'", cfg.DBPort)
	}
	if cfg.DBName != "orvix" {
		t.Errorf("expected default DBName 'orvix', got '%s'", cfg.DBName)
	}
	if cfg.DBUser != "orvix_user" {
		t.Errorf("expected default DBUser 'orvix_user', got '%s'", cfg.DBUser)
	}
	if cfg.DBSSLMode != "disable" {
		t.Errorf("expected default DBSSLMode 'disable', got '%s'", cfg.DBSSLMode)
	}
	if cfg.DBMaxOpenConns != 25 {
		t.Errorf("expected default DBMaxOpenConns 25, got %d", cfg.DBMaxOpenConns)
	}
	if cfg.DBMaxIdleConns != 10 {
		t.Errorf("expected default DBMaxIdleConns 10, got %d", cfg.DBMaxIdleConns)
	}
	if cfg.DBConnectTimeout != 5*time.Second {
		t.Errorf("expected default DBConnectTimeout 5s, got %v", cfg.DBConnectTimeout)
	}
}

func TestConfig_DSN(t *testing.T) {
	cfg := &Config{
		DBHost:           "127.0.0.1",
		DBPort:           "5433",
		DBName:           "testdb",
		DBUser:           "testuser",
		DBPassword:       "secret&pass",
		DBSSLMode:        "require",
		DBConnectTimeout: 5 * time.Second,
	}

	dsn := cfg.DSN()
	if !strings.HasPrefix(dsn, "postgres://testuser:secret%26pass@127.0.0.1:5433/testdb?sslmode=require") {
		t.Errorf("unexpected DSN output: %s", dsn)
	}

	safeDSN := cfg.SafeDSN()
	if strings.Contains(safeDSN, "secret") {
		t.Errorf("SafeDSN must mask password, got: %s", safeDSN)
	}
}

func TestLoadDotEnv(t *testing.T) {
	// Create a temporary .env file
	tmpFile := ".env"
	content := "# Comment\nTEST_ENV_VAR_ORVIX=hello_world\nQUOTED_VAR=\"quoted_val\"\n"
	if err := os.WriteFile(tmpFile, []byte(content), 0644); err != nil {
		t.Fatalf("failed to create temp .env: %v", err)
	}
	defer func() {
		_ = os.Remove(tmpFile)
		_ = os.Unsetenv("TEST_ENV_VAR_ORVIX")
		_ = os.Unsetenv("QUOTED_VAR")
	}()

	LoadDotEnv()

	if os.Getenv("TEST_ENV_VAR_ORVIX") != "hello_world" {
		t.Errorf("expected hello_world, got %s", os.Getenv("TEST_ENV_VAR_ORVIX"))
	}
	if os.Getenv("QUOTED_VAR") != "quoted_val" {
		t.Errorf("expected quoted_val, got %s", os.Getenv("QUOTED_VAR"))
	}
}
