package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/Icongirma/ORVIX/backend/internal/config"
)

// DatabaseChecker defines the interface for testing database connectivity.
type DatabaseChecker interface {
	PingCheck(ctx context.Context) error
}

// Server wraps the standard library http.Server with configuration, routes, and database connectivity.
type Server struct {
	cfg        *config.Config
	db         DatabaseChecker
	httpServer *http.Server
}

// New creates and initializes a new Server instance.
func New(cfg *config.Config, db DatabaseChecker) *Server {
	s := &Server{
		cfg: cfg,
		db:  db,
	}

	handler := s.routes()

	s.httpServer = &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      handler,
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
		IdleTimeout:  cfg.IdleTimeout,
	}

	return s
}

// Start begins listening and serving HTTP requests.
func (s *Server) Start() error {
	return s.httpServer.ListenAndServe()
}

// Shutdown gracefully shuts down the server without interrupting active connections.
func (s *Server) Shutdown(ctx context.Context) error {
	return s.httpServer.Shutdown(ctx)
}
