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
			utils.WriteJSONResponse(writer, http.StatusMethodNotAllowed, map[string]string{
				"error": "Method not allowed",
			})
			return
		}

		var user models.User

		// Decodes our JSON request into the User struct
		err := json.NewDecoder(request.Body).Decode(&user)
		if err != nil {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Invalid JSON format",
			})
			return
		}

		// Validates that email and password are provided
		if user.Email == "" || user.Password == "" {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
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
			utils.WriteJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Invalid email or password",
			})
			return
		} else if err != nil {
			utils.WriteJSONResponse(writer, http.StatusInternalServerError, map[string]string{
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
			utils.WriteJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Invalid email or password",
			})
			return
		}

		// Generates a JWT token for the user when authenticated
		token, err := utils.GenerateJWT(storedUser.Email)

		if err != nil {
			// If token generation fails, return a server error
			utils.WriteJSONResponse(writer, http.StatusInternalServerError, map[string]string{
				"error": "Error generating JWT token",
			})
			return
		}

		utils.WriteJSONResponse(writer, http.StatusOK, map[string]string{
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
			utils.WriteJSONResponse(writer, http.StatusMethodNotAllowed, map[string]string{
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
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Invalid JSON format",
			})
			return
		}

		if user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "All fields are required",
			})
			return
		}

		if !strings.Contains(user.Email, "@") {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
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
			utils.WriteJSONResponse(writer, http.StatusInternalServerError, map[string]string{
				"error": "Error hashing password",
			})
			return
		}

		/**
		*	Insert the user into the database
		*	$1, $2, $3, and $4 are placeholders to prevent SQL injection attacks
		*
		 */
		_, err = db.Exec(
			"INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)",
			user.FirstName,
			user.LastName,
			user.Email,
			string(hashedPassword),
		)

		if err != nil {
			utils.WriteJSONResponse(writer, http.StatusInternalServerError, map[string]string{
				"error": "User may already exist",
			})
			return
		}

		utils.WriteJSONResponse(writer, http.StatusCreated, map[string]string{
			"message": "User created successfully",
		})
	}
}

/**
 * LogoutHandler handles user logout.
 *
 * Since we are using JWT (stateless authentication),
 * logout is handled on the client by deleting the token.
 *
 * This endpoint exists to satisfy API completeness.
 */
func LogoutHandler() http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {
		// Only POST allowed
		if request.Method != http.MethodPost {
			utils.WriteJSONResponse(writer, http.StatusMethodNotAllowed, map[string]string{
				"error": "Method not allowed",
			})
			return
		}

		utils.WriteJSONResponse(writer, http.StatusOK, map[string]string{
			"message": "Logout successful. ",
		})
	}
}
