/**
 * AuthMiddleware is responsible for protecting routes by validating JWT tokens.
 *
 * It intercepts incoming HTTP requests before they reach the actual handler.
 * The middleware checks for a valid Authorization header containing a JWT.
 *
 * Flow:
 * 1. Extract the token from the "Authorization: Bearer <token>" header
 * 2. Verify the token using the server's secret key
 * 3. If invalid or missing → reject the request with 401 Unauthorized
 * 4. If valid → allow the request to proceed to the next handler
 *
 * This enables stateless authentication, where the server does not store session data.
 * Instead, the client sends a signed token on each request to prove identity.
 */
 
package middleware

import (
	"auth-app/utils"
	"context"
	"net/http"
	"strings"
	"github.com/golang-jwt/jwt/v5"
)

// Middleware function to protect routes that require authentication
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(writer http.ResponseWriter, request *http.Request) {

		// Get Authorization header
		authHeader := request.Header.Get("Authorization")

		// Expect "Bearer <token>"
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			utils.WriteJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Unauthorized",
			})
			return
		}

		// Extract token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return utils.GetJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			utils.WriteJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Invalid token",
			})
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			utils.WriteJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Invalid token claims",
			})
			return
		}

		// Extract email
		email, ok := claims["email"].(string)
		if !ok {
			utils.WriteJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Invalid token payload",
			})
			return // ✅ CRITICAL FIX
		}

		// Add email to context
		ctx := context.WithValue(request.Context(), "email", email)

		// Call next handler ONCE with updated context
		next(writer, request.WithContext(ctx))
	}
}