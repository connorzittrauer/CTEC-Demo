package main

import (
	"auth-app/db"
	"auth-app/handlers"
	"log"
	"net/http"
	"github.com/joho/godotenv"
)

func main() {

	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found (using system env variables)")
	}

	database := db.InitializeDatabase()

	// Define routes
	http.HandleFunc("/signup", handlers.SignupHandler(database))
	http.HandleFunc("/login", handlers.LoginHandler(database))

	log.Println("Server starting on port 8080...")
	http.ListenAndServe(":8080", nil)
}
