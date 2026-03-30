// Package config provides environment-based runtime configuration helpers.
package config

import (
	"fmt"
	"os"
)

// GetEnv returns the configured environment value or the provided fallback.
func GetEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return fallback
}

// DatabaseURL returns the Postgres connection string for the backend.
func DatabaseURL() string {
	if value := os.Getenv("DATABASE_URL"); value != "" {
		return value
	}

	host := GetEnv("DB_HOST", "db")
	port := GetEnv("DB_PORT", "5432")
	user := GetEnv("DB_USER", "postgres")
	password := GetEnv("DB_PASSWORD", "password")
	name := GetEnv("DB_NAME", "authdb")
	sslMode := GetEnv("DB_SSLMODE", "disable")

	return fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		user,
		password,
		host,
		port,
		name,
		sslMode,
	)
}

// AllowedOrigin returns the configured frontend origin for CORS.
func AllowedOrigin() string {
	return GetEnv("CORS_ALLOWED_ORIGIN", "http://localhost:5173")
}
