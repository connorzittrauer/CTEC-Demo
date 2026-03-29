package main

import (
	"auth-app/db"
	"auth-app/handlers"
	"auth-app/middleware"
	"github.com/joho/godotenv"
	"log"
	"net/http"
)

func main() {

	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found (using system env variables)")
	}

	database := db.InitializeDatabase()

	mux := http.NewServeMux()

	// Register handlers
	mux.HandleFunc("/signup", handlers.SignupHandler(database))
	mux.HandleFunc("/login", handlers.LoginHandler(database))
	mux.HandleFunc("/logout", handlers.LogoutHandler())

	// Protected route to test JWT middleware
	mux.HandleFunc("/me", middleware.AuthMiddleware(handlers.MeHandler(database)))



	log.Println("Server starting on port 8080...")
	http.ListenAndServe(":8080", middleware.EnableCORS(mux))
}
