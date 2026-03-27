package utils

import (
	"time" 
	"os"
	"github.com/golang-jwt/jwt/v5" 
)

// getJWTSecret retrieves the JWT secret from environment variables at runtime
func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")

	// Fail fast if missing
	if secret == "" {
		panic("JWT_SECRET not set in environment variables.")
	}

	return []byte(secret)
}

// Generates a signed JWT token for a given user email
func GenerateJWT(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	}

	// Creates a new JWT token with the specified claims and signing method
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key and return the string version 
	return token.SignedString(getJWTSecret())
}
