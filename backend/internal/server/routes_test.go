package server

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Icongirma/ORVIX/backend/internal/config"
)

type mockDB struct {
	pingErr error
}

func (m *mockDB) PingCheck(ctx context.Context) error {
	return m.pingErr
}

func TestHealthEndpoint(t *testing.T) {
	cfg := &config.Config{Port: "8080"}
	srv := New(cfg, nil)
	handler := srv.routes()

	req, err := http.NewRequest("GET", "/api/v1/health", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", rec.Code)
	}

	var resp HealthResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode response JSON: %v", err)
	}

	if resp.Status != "ok" || resp.Service != "ORVIX API" {
		t.Errorf("unexpected health response payload: %+v", resp)
	}
}

func TestDBHealthEndpoint_Connected(t *testing.T) {
	cfg := &config.Config{Port: "8080"}
	mock := &mockDB{pingErr: nil}
	srv := New(cfg, mock)
	handler := srv.routes()

	req, err := http.NewRequest("GET", "/api/v1/health/db", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("expected status 200 OK, got %d", rec.Code)
	}

	var resp DBHealthResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode JSON response: %v", err)
	}

	if resp.Status != "ok" || resp.Database != "connected" {
		t.Errorf("expected status 'ok' and database 'connected', got: %+v", resp)
	}
}

func TestDBHealthEndpoint_Unavailable(t *testing.T) {
	cfg := &config.Config{Port: "8080"}
	mock := &mockDB{pingErr: errors.New("connection refused")}
	srv := New(cfg, mock)
	handler := srv.routes()

	req, err := http.NewRequest("GET", "/api/v1/health/db", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusServiceUnavailable {
		t.Errorf("expected status 503 Service Unavailable, got %d", rec.Code)
	}

	var resp DBHealthResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode JSON response: %v", err)
	}

	if resp.Status != "error" || resp.Database != "unavailable" {
		t.Errorf("expected status 'error' and database 'unavailable', got: %+v", resp)
	}
}

func TestDBHealthEndpoint_NilDB(t *testing.T) {
	cfg := &config.Config{Port: "8080"}
	srv := New(cfg, nil)
	handler := srv.routes()

	req, err := http.NewRequest("GET", "/api/v1/health/db", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusServiceUnavailable {
		t.Errorf("expected status 503 for nil DB, got %d", rec.Code)
	}
}

func TestCORSOptions(t *testing.T) {
	cfg := &config.Config{Port: "8080"}
	srv := New(cfg, nil)
	handler := srv.routes()

	req, err := http.NewRequest("OPTIONS", "/api/v1/health/db", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusNoContent {
		t.Errorf("expected status 204 No Content for OPTIONS, got %d", rec.Code)
	}
}
