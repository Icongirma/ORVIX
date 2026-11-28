package database

import (
	"context"
	"testing"
	"time"

	"github.com/Icongirma/ORVIX/backend/internal/config"
)

func TestConnect_InvalidConfig(t *testing.T) {
	cfg := &config.Config{
		DBHost: "",
		DBName: "",
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	_, err := Connect(ctx, cfg)
	if err == nil {
		t.Error("expected error for empty host and name, got nil")
	}
}

func TestPingCheck_NilDB(t *testing.T) {
	var db *DB
	err := db.PingCheck(context.Background())
	if err == nil {
		t.Error("expected error for nil DB PingCheck, got nil")
	}
}
