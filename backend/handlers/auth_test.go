package handlers

import (
	"auth-app/db"
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSignupHandler(test *testing.T) {

	// Initialize test database
	database := db.InitializeDatabase()

	body := []byte(`{"email":"user@citytelecoin.com","password":"root"}`)

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

	// Create a test user in the database
	signupBody := []byte(`{"email":"user@citytelecoin.com","password":"root"}`)
	signupRequest, _ := http.NewRequest("POST", "/signup", bytes.NewBuffer(signupBody))
	signupRR := httptest.NewRecorder()
	SignupHandler(database).ServeHTTP(signupRR, signupRequest)

	// Attempt to login with the test user credentials
	loginBody := []byte(`{"email":"user@citytelecoin.com","password":"root"}`)
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
