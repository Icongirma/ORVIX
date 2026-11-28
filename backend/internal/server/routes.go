package server

import (
	"context"
	"encoding/json"
	"net/http"
	"time"
)

// HealthResponse represents the JSON response payload for the API health check endpoint.
type HealthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
}

// DBHealthResponse represents the JSON response payload for the database connectivity check.
type DBHealthResponse struct {
	Status   string `json:"status"`
	Database string `json:"database"`
}

// routes registers application endpoints and middlewares on an http.ServeMux.
func (s *Server) routes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/v1/health", s.handleHealth)
	mux.HandleFunc("GET /api/v1/health/db", s.handleDBHealth)

	return s.corsMiddleware(mux)
}

// handleHealth handles the general API service health check, returning a 200 OK JSON response.
func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	resp := HealthResponse{
		Status:  "ok",
		Service: "ORVIX API",
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}

// handleDBHealth checks actual PostgreSQL connectivity, returning 200 OK if reachable or 503 if unavailable.
// Never exposes database passwords, connection strings, or sensitive internal errors.
func (s *Server) handleDBHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	if s.db == nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		_ = json.NewEncoder(w).Encode(DBHealthResponse{
			Status:   "error",
			Database: "unavailable",
		})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()

	if err := s.db.PingCheck(ctx); err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		_ = json.NewEncoder(w).Encode(DBHealthResponse{
			Status:   "error",
			Database: "unavailable",
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(DBHealthResponse{
		Status:   "ok",
		Database: "connected",
	})
}

// corsMiddleware attaches basic CORS headers using standard library functionality.
func (s *Server) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
