// Package handlers contains the HTTP handlers for authentication endpoints.
package handlers

import (
	"auth-app/utils"
	"database/sql"
	"net/http"
	"strings"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type signupRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

// LoginHandler authenticates an existing user and returns a JWT on success.
func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {

		// Validates that the request method is POST
		if request.Method != http.MethodPost {
			utils.WriteJSONResponse(writer, http.StatusMethodNotAllowed, map[string]string{
				"error": "Method not allowed",
			})
			return
		}

		var user loginRequest

		// Decodes our JSON request into the User struct
		err := utils.DecodeJSONBody(request, &user)
		if err != nil {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Invalid JSON format",
			})
			return
		}

		user.Email = utils.NormalizeEmail(user.Email)

		// Validates that email and password are provided
		if validationError := utils.ValidateEmail(user.Email); validationError != "" {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": validationError,
			})
			return
		}
		if strings.TrimSpace(user.Password) == "" {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Password is required",
			})
			return
		}

		var storedUser loginRequest

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

// MeHandler verifies the current authenticated user and returns their email.
func MeHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		email := r.Context().Value("email").(string)

		// Check if user exists, if not, return an error (handles case where user was deleted after token was issued)
		var exists bool
		err := db.QueryRow(
			"SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)",
			email,
		).Scan(&exists)

		if err != nil || !exists {
			utils.WriteJSONResponse(w, http.StatusUnauthorized, map[string]string{
				"error": "User no longer exists",
			})
			return
		}

		utils.WriteJSONResponse(w, http.StatusOK, map[string]string{
			"message": "Authenticated",
			"email":   email,
		})
	}
}

// SignupHandler creates a new user account after validating the request body.
func SignupHandler(db *sql.DB) http.HandlerFunc {

	return func(writer http.ResponseWriter, request *http.Request) {

		var user signupRequest

		// Validates that the request method is POST
		if request.Method != http.MethodPost {
			utils.WriteJSONResponse(writer, http.StatusMethodNotAllowed, map[string]string{
				"error": "Method not allowed",
			})
			return
		}

		// Decodes our JSON request into the User struct for error handling and validation
		err := utils.DecodeJSONBody(request, &user)

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

		user.FirstName = strings.TrimSpace(user.FirstName)
		user.LastName = strings.TrimSpace(user.LastName)
		user.Email = utils.NormalizeEmail(user.Email)

		if validationError := utils.ValidateName(user.FirstName, "First name"); validationError != "" {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": validationError,
			})
			return
		}
		if validationError := utils.ValidateName(user.LastName, "Last name"); validationError != "" {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": validationError,
			})
			return
		}
		if validationError := utils.ValidateEmail(user.Email); validationError != "" {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": validationError,
			})
			return
		}
		if validationError := utils.ValidatePassword(user.Password); validationError != "" {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": validationError,
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

		// Checks if a user tries to register with an email that already exists in the database
		if err != nil {
			// Check for unique constraint violation
			if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
				utils.WriteJSONResponse(writer, http.StatusConflict, map[string]string{
					"error": "Email already registered",
				})
				return
			}

			utils.WriteJSONResponse(writer, http.StatusInternalServerError, map[string]string{
				"error": "Internal server error",
			})
			return
		}

		utils.WriteJSONResponse(writer, http.StatusCreated, map[string]string{
			"message": "User created successfully",
		})
	}
}

// LogoutHandler returns a success response for client-side logout flows.
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
