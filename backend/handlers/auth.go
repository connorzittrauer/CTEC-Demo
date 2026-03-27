package handlers

import (
	"auth-app/models"
	"auth-app/utils"
	"database/sql"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"strings"
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

		// Generates a JWT token for the user when authenticated
		token, err := utils.GenerateJWT(storedUser.Email)

		if err != nil {
			// If token generation fails, return a server error
			writeJSONResponse(writer, http.StatusInternalServerError, map[string]string{
				"error": "Error generating JWT token",
			})
			return
		}

		writeJSONResponse(writer, http.StatusOK, map[string]string{
			"message": "Login Successful",
			"token":   token,
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
			writeJSONResponse(writer, http.StatusMethodNotAllowed, map[string]string{
				"error": "Method not allowed",
			})
			return
		}

		/**
		* Handles bad JSON formats
		*
		* Expected incoming JSON:
		* {"email": "user@citytelecoin.com", "password": "password"}
		 */
		if err != nil {
			writeJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Invalid JSON format",
			})
			return
		}

		if user.Email == "" || user.Password == "" {
			writeJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Email and password required",
			})
			return
		}

		if !strings.Contains(user.Email, "@") {
			writeJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Invalid email format",
			})
			return
		}

		// Hashes our password using the bcrypt library
		hashedPassword, err := bcrypt.GenerateFromPassword(
			[]byte(user.Password),
			bcrypt.DefaultCost,
		)

		if err != nil {
			writeJSONResponse(writer, http.StatusInternalServerError, map[string]string{
				"error": "Error hashing password",
			})
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
			writeJSONResponse(writer, http.StatusInternalServerError, map[string]string{
				"error": "User may already exist",
			})
			return
		}

		writeJSONResponse(writer, http.StatusCreated, map[string]string{
			"message": "User created successfully",
		})
	}
}

// Utility function to write JSON responses messages
func writeJSONResponse(writer http.ResponseWriter, statusCode int, data interface{}) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(statusCode)
	json.NewEncoder(writer).Encode(data)
}
