package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"backend/db"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	if err := run(); err != nil {
		log.Fatalf("Failed to run: %v", err)
	}
}

func run() error {
	// Initialize Prisma client
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return err
	}

	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			log.Fatalf("Failed to disconnect: %v", err)
		}
	}()

	ctx := context.Background()

	// Initialize a new Fiber app
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173", // Replace with your frontend URL
	}))

	// Define a route to get all tests
	app.Get("/api/tests", func(c *fiber.Ctx) error {
		// Fetch all tests along with sections and questions using With()
		tests, err := client.Test.FindMany().With(
			db.Test.Sections.Fetch(),
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch tests"})
		}

		// Convert the tests to JSON format
		result, err := json.MarshalIndent(tests, "", "  ")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to marshal test data"})
		}

		return c.Send(result)
	})

	app.Get("/api/test/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		test, err := client.Test.FindUnique(
			db.Test.ID.Equals(id),
		).With(
			db.Test.Sections.Fetch().With(
				db.Sections.Questions.Fetch(),
			),
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Faind to get test"})
		}
		response, err := json.MarshalIndent(test, "", " ")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "parsing failed"})
		}

		return c.Send(response)
	})

	// Start the Fiber app on port 8080
	if err := app.Listen(":8080"); err != nil {
		return fmt.Errorf("failed to run server: %w", err)
	}

	return nil
}
