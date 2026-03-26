
/**
 * This module initializes the database connection and
 * logs any relevant PSQL connectivity issues.
 */

package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func InitializeDatabase() *sql.DB {
	connectionString := "postgres://postgres:password@db:5432/authdb?sslmode=disable"


	db, error := sql.Open("postgres", connectionString)
	if error != nil {
		log.Fatal("Error opening database: ", error)
	}

	error = db.Ping()
	if error != nil {
		log.Fatal("Error connecting to database: ", error)
	}

	log.Println("Successfully connected to database")

	return db
}