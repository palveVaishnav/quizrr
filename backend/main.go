package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	"log"
	"os"
	_ "github.com/lib/pq" // Import PostgreSQL driver
)

var DB *sqlx.DB // Global variable to hold the database connection

func main() {
	// Load .env file
	// var err error
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}


	// Get the database connection string from environment variable
	dsn := os.Getenv("DATABASE_URL")
	// Open a new database connection using sqlx
	DB, err = sqlx.Connect("postgres", dsn)

	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}

	log.Println("Successfully connected to the database")

	// Initialize the Fiber app
	app := fiber.New()

	// Define a route to fetch questions from the database
	app.Get("/questions", func(c *fiber.Ctx) error {
		var questions []Question
		err := DB.Select(&questions, "SELECT * FROM questions;")
		if err != nil {
			log.Printf("Failed to query questions: %v", err)
			return c.Status(500).SendString("Failed to fetch questions")
		}
		return c.JSON(questions)
	})

	app.Get("/")

	// Start the server
	app.Listen(":3000")
}


