package utils

import (
	"time" 
	"github.com/golang-jwt/jwt/v5" 
)

// Secret key used to sign JWTs
// In production, this should come from environment variables (not hardcoded)
// change to .ENV BEFORE DEPLOYING TO GITHUB!
var jwtSecret = []byte("secretkey")

// Generates a signed JWT token for a given user email
func GenerateJWT(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	}

	// Creates a new JWT token with the specified claims and signing method
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key and return the string version 
	return token.SignedString(jwtSecret)
}
