// Package db contains database initialization and connectivity helpers.
package db

import (
	"auth-app/config"
	"database/sql"
	"log"
	"time"

	_ "github.com/lib/pq"
)

// InitializeDatabase opens the Postgres connection and waits for readiness.
func InitializeDatabase() *sql.DB {
	connectionString := config.DatabaseURL()

	db, error := sql.Open("postgres", connectionString)
	if error != nil {
		log.Fatal("Error opening database: ", error)
	}

	// Retry connection until DB is ready
	// This fixes a docker race condition that can occur when the app starts before the DB is fully initialized.
	for i := 0; i < 10; i++ {
		error = db.Ping()
		if error == nil {
			break
		}

		log.Println("Waiting for database...")
		time.Sleep(2 * time.Second)
	}

	if error != nil {
		log.Fatal("Could not connect to database after retries: ", error)
	}

	log.Println("Successfully connected to database")

	return db
}
