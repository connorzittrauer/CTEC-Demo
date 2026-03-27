package middleware

import (
	"auth-app/utils"
	"net/http"
	"net/http/httptest"
	"testing"
)

// Test protected route access with valid token
func TestAuthMiddleware_ValidToken(test *testing.T) {
	
	token, _ := utils.GenerateJWT("user@citytelecoin.com")

	// Build request
	request, _ := http.NewRequest("GET", "/protected", nil)
	request.Header.Set("Authorization", "Bearer "+token)

	respRequest := httptest.NewRecorder()

	// Dummy handler 
	handler := AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	handler.ServeHTTP(respRequest, request)

	if respRequest.Code != http.StatusOK {
		test.Errorf("Expected status 200 OK, got %d", respRequest.Code)
	}
}

// Test protected route access without token
func TestAuthMiddleware_NoToken(test *testing.T) {

	request, _ := http.NewRequest("GET", "/protected", nil)
	respRequest := httptest.NewRecorder()

	handler := AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	handler.ServeHTTP(respRequest, request)

	if respRequest.Code != http.StatusUnauthorized {
		test.Errorf("Expected 401, got %d", respRequest.Code)
	}
	

}