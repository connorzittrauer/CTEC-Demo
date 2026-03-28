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

	mux := http.NewServeMux()

	// Register handlers
	mux.HandleFunc("/signup", handlers.SignupHandler(database))
	mux.HandleFunc("/login", handlers.LoginHandler(database))
	mux.HandleFunc("/logout", handlers.LogoutHandler())

	// Protected route to test JWT middleware
	mux.HandleFunc("/protected", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {

		email := r.Context().Value("email").(string)

		utils.WriteJSONResponse(w, http.StatusOK, map[string]string{
			"message": "You accessed a protected route!",
			"email":   email,
		})
	}))

	log.Println("Server starting on port 8080...")
	http.ListenAndServe(":8080", middleware.EnableCORS(mux))
}
