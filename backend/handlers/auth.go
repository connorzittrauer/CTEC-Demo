// Package handlers contains the HTTP handlers for authentication endpoints.
package handlers

import (
	"auth-app/middleware"
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

		if request.Method != http.MethodPost {
			utils.WriteJSONResponse(writer, http.StatusMethodNotAllowed, map[string]string{
				"error": "Method not allowed",
			})
			return
		}

		var user loginRequest

		err := utils.DecodeJSONBody(request, &user)
		if err != nil {
			utils.WriteJSONResponse(writer, http.StatusBadRequest, map[string]string{
				"error": "Invalid JSON format",
			})
			return
		}

		user.Email = utils.NormalizeEmail(user.Email)

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

		// Return a generic auth failure to avoid user enumeration.
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

		token, err := utils.GenerateJWT(storedUser.Email)

		if err != nil {
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
		email, ok := middleware.EmailFromContext(r.Context())
		if !ok || email == "" {
			utils.WriteJSONResponse(w, http.StatusUnauthorized, map[string]string{
				"error": "Unauthorized",
			})
			return
		}

		// Reject tokens for users who no longer exist.
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

		if request.Method != http.MethodPost {
			utils.WriteJSONResponse(writer, http.StatusMethodNotAllowed, map[string]string{
				"error": "Method not allowed",
			})
			return
		}

		err := utils.DecodeJSONBody(request, &user)
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

		_, err = db.Exec(
			"INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)",
			user.FirstName,
			user.LastName,
			user.Email,
			string(hashedPassword),
		)

		if err != nil {
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
