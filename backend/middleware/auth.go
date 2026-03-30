// Package middleware contains HTTP middleware used by the API.
package middleware

import (
	"auth-app/utils"
	"context"
	"errors"
	"net/http"
	"strings"
)

type contextKey string

const emailContextKey contextKey = "email"

// EmailFromContext returns the authenticated email stored by AuthMiddleware.
func EmailFromContext(ctx context.Context) (string, bool) {
	email, ok := ctx.Value(emailContextKey).(string)
	return email, ok
}

// AuthMiddleware validates bearer tokens before allowing the request through.
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

		claims, err := utils.ParseJWT(tokenString)
		if errors.Is(err, utils.ErrMissingJWTSecret) {
			utils.WriteJSONResponse(writer, http.StatusInternalServerError, map[string]string{
				"error": "Authentication is not configured",
			})
			return
		}
		if err != nil {
			utils.WriteJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Invalid token",
			})
			return
		}

		// Extract email
		email, ok := claims["email"].(string)
		if !ok {
			utils.WriteJSONResponse(writer, http.StatusUnauthorized, map[string]string{
				"error": "Invalid token payload",
			})
			return
		}

		// Add email to context
		ctx := context.WithValue(request.Context(), emailContextKey, email)

		// Call next handler ONCE with updated context
		next(writer, request.WithContext(ctx))
	}
}
