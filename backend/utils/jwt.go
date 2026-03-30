// Package utils contains shared helpers for HTTP request and response handling.
package utils

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// ErrMissingJWTSecret indicates that JWT signing is not configured.
var ErrMissingJWTSecret = errors.New("JWT_SECRET not set in environment variables")

// GetJWTSecret retrieves the JWT secret from environment variables.
func GetJWTSecret() ([]byte, error) {
	secret := os.Getenv("JWT_SECRET")

	if secret == "" {
		return nil, ErrMissingJWTSecret
	}

	return []byte(secret), nil
}

// GenerateJWT signs a JWT for the provided user email.
func GenerateJWT(email string) (string, error) {
	secret, err := GetJWTSecret()
	if err != nil {
		return "", err
	}

	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	}

	// Creates a new JWT token with the specified claims and signing method
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key and return the string version
	return token.SignedString(secret)
}

// ParseJWT validates a token string and returns its claims.
func ParseJWT(tokenString string) (jwt.MapClaims, error) {
	secret, err := GetJWTSecret()
	if err != nil {
		return nil, err
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if token.Method.Alg() != jwt.SigningMethodHS256.Alg() {
			return nil, fmt.Errorf("unexpected signing method: %s", token.Method.Alg())
		}

		return secret, nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}
