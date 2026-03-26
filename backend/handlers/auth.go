package handlers

import "strings"

import (
	"auth-app/models"
	"database/sql"
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

/* LoginHandler handles the login process for existing users to
 * to be called from the React frontend when a user attempts to log in
 *
 * @param db *sql.DB - The database connection
 * @return http.HandlerFunc - The login handler function
 */
func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {

		// Validates that the request method is POST
		if request.Method != http.MethodPost {
			writeJSONResponse(writer, http.StatusMethodNotAllowed, map[string]string{
				"error": "Method not allowed",
			})
			return
		}

		var user models.User

		// Decodes our JSON request into the User struct
		err := json.NewDecoder(request.Body).Decode(&user)
		if err != nil {
			writeJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Invalid JSON format",
			})
			return
		}

		// Validates that email and password are provided
		if user.Email == "" || user.Password == "" {
			writeJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Email and password required",
			})
			return
		}

		var storedUser models.User

		/**
		* This case checks if the email exists.
		*
		* We return a generic error message when the user is not found
		* to avoid revealing whether an email exists in the system.
		* This helps prevent user enumeration attacks.

		*
		 */
		query := "SELECT email, password FROM users WHERE email=$1"
		err = db.QueryRow(query, user.Email).Scan(&storedUser.Email, &storedUser.Password)

		if err == sql.ErrNoRows {
			writeJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Invalid email or password",
			})
			return
		} else if err != nil {
			writeJSONResponse(writer, http.StatusInternalServerError, map[string]string{
				"error": "Database error",
			})
			return
		}

		/**
		 *  This case checks the provided password against the stored hash.

		 *  Compares the provided password with the actual stored hashed password
		 *	in the database and returns an error if they do not match.
		 */
		err = bcrypt.CompareHashAndPassword(
			[]byte(storedUser.Password),
			[]byte(user.Password),
		)

		if err != nil {
			writeJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Invalid email or password",
			})
			return
		}

		// If we reach this point, the login is successful. We can return a success message.
		writer.Header().Set("Content-Type", "application/json")
		writer.WriteHeader(http.StatusOK)
		json.NewEncoder(writer).Encode(map[string]string{
			"message": "Login Successful",
		})

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

		// Decodes our JSON request into the User struct for error handling and validation
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
			return
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

		if err != nil {
			http.Error(writer, "User may already exist", http.StatusInternalServerError)
			return
		}

		writer.WriteHeader(http.StatusCreated)
		writer.Write([]byte("User created successfully"))

	}
}

// Utility function to write JSON responses messages
func writeJSONResponse(writer http.ResponseWriter, statusCode int, data interface{}) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(statusCode)
	json.NewEncoder(writer).Encode(data)
}
