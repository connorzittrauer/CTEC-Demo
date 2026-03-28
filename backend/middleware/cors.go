package middleware

import "net/http"

/**
 * EnableCORS
 *
 * HTTP middleware that enables Cross-Origin Resource Sharing (CORS)
 * for the backend API.
 *
 * Responsibilities:
 * - Allow frontend applications (e.g., React dev server) to communicate
 *   with this API across different origins
 * - Set required CORS headers on every response
 * - Intercept and properly handle preflight (OPTIONS) requests
 *
 * Behavior:
 * - Adds Access-Control-Allow-Origin for the frontend origin
 * - Allows standard HTTP methods (GET, POST, OPTIONS)
 * - Permits required headers (Content-Type, Authorization)
 * - Short-circuits OPTIONS requests with a 200 OK response
 *
 * Usage:
 * - Wrap the main router (ServeMux) in this middleware in main.go
 *   Example:
 *     http.ListenAndServe(":8080", middleware.EnableCORS(mux))
 *
 * Notes:
 * - Currently configured for local development (localhost:5173)
 * - Should be updated for production to restrict allowed origins
 * - Centralizes CORS logic to avoid duplication in handlers
 */
func EnableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}