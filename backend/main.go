// Package main bootstraps the authentication API server.
package main

import (
	"auth-app/db"
	"auth-app/handlers"
	"auth-app/middleware"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/joho/godotenv"
)

// main loads configuration, wires the routes, and starts the HTTP server.
func main() {

	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found (using system env variables)")
	}

	database := db.InitializeDatabase()
	defer func() {
		if err := database.Close(); err != nil {
			log.Println("Error closing database connection:", err)
		}
	}()

	mux := http.NewServeMux()

	// Register handlers
	mux.HandleFunc("/signup", handlers.SignupHandler(database))
	mux.HandleFunc("/login", handlers.LoginHandler(database))
	mux.HandleFunc("/logout", handlers.LogoutHandler())

	// Protected route to test JWT middleware
	mux.HandleFunc("/me", middleware.AuthMiddleware(handlers.MeHandler(database)))

	server := &http.Server{
		Addr:              ":8080",
		Handler:           middleware.EnableCORS(mux),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       30 * time.Second,
	}

	log.Println("Server starting on port 8080...")
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal("Server failed to start: ", err)
	}
}
