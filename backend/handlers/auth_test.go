package handlers

import (
	"auth-app/db"
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestSignupHandler(test *testing.T) {

	// Initialize test database
	database := db.InitializeDatabase()

	// Generate unique email dymanically for testing
	email := fmt.Sprintf("test_%d@citytelecoin.com", time.Now().UnixNano())

	body := []byte(fmt.Sprintf(
		`{"firstName":"Test","lastName":"User","email":"%s","password":"root"}`,
		email,
	))

	// Create POST request
	request, err := http.NewRequest("POST", "/signup", bytes.NewBuffer(body))
	if err != nil {
		test.Fatal(err)
	}

	// Create ResponseRecorder, handler, and the execute the request
	respRecorder := httptest.NewRecorder()
	handler := SignupHandler(database)
	handler.ServeHTTP(respRecorder, request)

	// Check status code
	if respRecorder.Code != http.StatusCreated {
		test.Errorf("Expected status 201, got %d", respRecorder.Code)
	}
}

func TestLoginHandler(test *testing.T) {
	database := db.InitializeDatabase()

	// Generate unique email for this test run
	email := fmt.Sprintf("test_%d@citytelcoin.com", time.Now().UnixNano())

	// Create a test user in the database
	signupBody := []byte(fmt.Sprintf(
		`{"firstName":"Test","lastName":"User","email":"%s","password":"root"}`,
		email,
	))
	signupRequest, _ := http.NewRequest("POST", "/signup", bytes.NewBuffer(signupBody))
	signupRR := httptest.NewRecorder()
	SignupHandler(database).ServeHTTP(signupRR, signupRequest)

	// Attempt to login with the test user credentials
	loginBody := []byte(fmt.Sprintf(
		`{"email":"%s","password":"root"}`,
		email,
	))
	loginRequest, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(loginBody))
	respRequest := httptest.NewRecorder()

	handler := LoginHandler(database)
	handler.ServeHTTP(respRequest, loginRequest)

	// Check success
	if respRequest.Code != http.StatusOK {
		test.Errorf("Expected status 200, got %d", respRequest.Code)
	}

	// Check for token in response
	if !bytes.Contains(respRequest.Body.Bytes(), []byte("token")) {
		test.Errorf("Expected token in response, got %s", respRequest.Body.String())

	}
}
