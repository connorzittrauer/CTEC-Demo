package main

import (
	"auth-app/db"
	"auth-app/handlers"
	"auth-app/middleware"
	"auth-app/utils"
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

	// Define routes
	http.HandleFunc("/signup", handlers.SignupHandler(database))
	http.HandleFunc("/login", handlers.LoginHandler(database))

	// Protected route to test JWT middleware
	http.HandleFunc("/protected", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		utils.WriteJSONResponse(w, http.StatusOK, map[string]string{
			"message": "You accessed a protected route!",
		})
	}))

	log.Println("Server starting on port 8080...")
	http.ListenAndServe(":8080", nil)
}
