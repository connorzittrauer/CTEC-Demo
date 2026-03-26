package handlers
import "strings"

import (
	"auth-app/models"
	"database/sql"
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)
/* LoginHandler handles the login process for existing users
 * @param db *sql.DB - The database connection
 * @return http.HandlerFunc - The login handler function
 */
func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func (writer http.ResponseWriter, request *http.Request) {
		writer.Write([]byte("/login endpoint hit success"))		
	}

}

/**
 * SignupHandler handles the signup process for new users
 * @param db *sql.DB - The database connection
 * @return http.HandlerFunc - The signup handler function
 */
func SignupHandler(db *sql.DB) http.HandlerFunc {

	return func(writer http.ResponseWriter, request *http.Request) {
		
		var user models.User
		
		// Decodes our JSON request into the User struct
		err := json.NewDecoder(request.Body).Decode(&user)

		// Validates that the request method is POST
		if request.Method != http.MethodPost {
			http.Error(writer, "Method not allowed", http.StatusMethodNotAllowed)
			return 
		}

		/** 
		* Handles bad JSON formats
		*  
		* Expected incoming JSON:
		* {"email": "user@citytelecoin.com", "password": "password"}
	    */
		if err != nil {
			http.Error(writer, "Invalid JSON format", http.StatusBadRequest)
			return 
		}

		if user.Email == "" || user.Password == "" {
			http.Error(writer, "Email and password required", http.StatusBadRequest)	
			return; 
		}

		if !strings.Contains(user.Email, "@") {
			http.Error(writer, "Invalid email format", http.StatusBadRequest)
			return 
		}

		// Hashes our password using the bcrypt library
		hashedPassword, err := bcrypt.GenerateFromPassword(
			[]byte(user.Password),
			bcrypt.DefaultCost,
		)

		if err != nil {
			http.Error(writer, "Error hashing password", http.StatusInternalServerError)
			return 
		
		}

		/**  
		*	Insert the user into the database
		*	$1 and $2 are placeholders to prevent SQL injection attacks
		*/ 
		_, err = db.Exec(
			"INSERT INTO users(email, password) VALUES($1, $2)",
			user.Email,
			string(hashedPassword),
		)

		if err != nil{
			http.Error(writer, "User may already exist", http.StatusInternalServerError)
			return
		}


		writer.WriteHeader(http.StatusCreated)
		writer.Write([]byte("User created successfully"))



	}
}
