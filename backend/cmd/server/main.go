package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/Icongirma/ORVIX/backend/internal/config"
	"github.com/Icongirma/ORVIX/backend/internal/database"
	"github.com/Icongirma/ORVIX/backend/internal/server"
)

func main() {
	log.Println("Starting ORVIX Backend Server...")

	cfg := config.Load()

	// Initialize database connection
	ctx, cancel := context.WithTimeout(context.Background(), cfg.DBConnectTimeout)
	defer cancel()

	db, err := database.Connect(ctx, cfg)
	if err != nil {
		if cfg.DBRequired {
			log.Fatalf("Fatal: Required database connection to %s failed: %v", cfg.SafeDSN(), err)
		}
		log.Printf("Warning: Database connection to %s failed: %v. Running in degraded mode (db health check will report unavailable).", cfg.SafeDSN(), err)
	} else {
		log.Printf("Database connection to %s established successfully.", cfg.SafeDSN())
		defer func() {
			if closeErr := db.Close(); closeErr != nil {
				log.Printf("Error closing database connection pool: %v", closeErr)
			}
		}()

		// Execute pending database migrations under advisory lock
		migrator := db.NewMigrator()
		applied, migErr := migrator.MigrateFromDir(ctx, "migrations")
		if migErr != nil {
			log.Fatalf("Fatal: Database migration failed: %v", migErr)
		} else if len(applied) > 0 {
			log.Printf("Database migrations: successfully applied %d new migration(s): %v", len(applied), applied)
		} else {
			log.Printf("Database migrations: schema is up to date (0 pending migrations).")
		}
	}

	srv := server.New(cfg, db)

	// Channel to listen for errors coming from the listener
	serverErrors := make(chan error, 1)

	// Start server in background goroutine
	go func() {
		log.Printf("ORVIX API listening on port %s (http://localhost:%s)", cfg.Port, cfg.Port)
		if err := srv.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverErrors <- err
		}
	}()

	// Channel to listen for OS interrupt / termination signals
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	// Blocking wait for shutdown signal or listener error
	select {
	case err := <-serverErrors:
		log.Fatalf("Server startup failed: %v", err)

	case sig := <-shutdown:
		log.Printf("Received signal %v. Initiating graceful shutdown...", sig)

		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), cfg.ShutdownTimeout)
		defer shutdownCancel()

		if err := srv.Shutdown(shutdownCtx); err != nil {
			log.Printf("Graceful shutdown failed: %v. Forcing close.", err)
			os.Exit(1)
		}

		log.Println("ORVIX Backend Server stopped cleanly.")
	}
}
