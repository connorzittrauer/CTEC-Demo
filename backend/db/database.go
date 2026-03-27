/**
 * This module initializes the database connection and
 * logs any relevant PSQL connectivity issues.
 */

package db

import (
	"database/sql"
	"log"
	"time" 
	_ "github.com/lib/pq"
)

func InitializeDatabase() *sql.DB {
	connectionString := "postgres://postgres:password@db:5432/authdb?sslmode=disable"

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
