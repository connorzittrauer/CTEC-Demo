package main

import (
	"log"
	"net/http"

	"auth-app/db"
	"auth-app/handlers"
)

func main() {
	database := db.InitializeDatabase()

	// Define routes
	http.HandleFunc("/signup", handlers.SignupHandler(database))
	http.HandleFunc("/login", handlers.LoginHandler(database))

	log.Println("Server starting on port 8080...")
	http.ListenAndServe(":8080", nil)
}	


