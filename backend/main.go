package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"backend/db"
	"backend/seed"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// Define structs for received data and database data
type Question struct {
	ID     string `json:"id"`
	Answer int    `json:"answer"`
}

type Section struct {
	ID        string     `json:"id"`
	Questions []Question `json:"questions"`
}

type Test struct {
	ID       string    `json:"id"`
	Sections []Section `json:"sections"`
	UserId   string    `json:"userId"`  // Include UserId field if it's part of the received JSON
}

type Attempt struct {
	TestID string `json:"testId"` // The ID of the test being attempted
	Marks  int    `json:"marks"`  // The count of matching answers (marks)
}

func main() {
	if len(os.Args) > 1 && os.Args[1] == "seed" {
		fmt.Println("Running database seeding...")
		seed.SeedDatabase()
		fmt.Println("Seeding completed.")
		return
	}
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
	defer client.Prisma.Disconnect()

	ctx := context.Background()

	// Initialize a new Fiber app
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173", // Replace with your frontend URL
	}))

	// Define a route to get all tests
	app.Get("/api/tests", func(c *fiber.Ctx) error {
		tests, err := client.Test.FindMany().With(
			db.Test.Sections.Fetch(),
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch tests"})
		}

		return c.JSON(tests)
	})

	// Define a route to get a test by ID
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
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get test"})
		}
		return c.JSON(test)
	})

	// Define a route to submit an attempt
	app.Post("/api/attempt/:id", func(c *fiber.Ctx) error {
		// Get the test ID from URL params
		id := c.Params("id")

		// Parse the request body into the Test struct
		var receivedData Test
		if err := c.BodyParser(&receivedData); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
		}

		// Fetch test data from the database for comparison
		test, err := client.Test.FindUnique(
			db.Test.ID.Equals(id),
		).With(
			db.Test.Sections.Fetch().With(
				db.Sections.Questions.Fetch(),
			),
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get test"})
		}

		// Convert fetched test data to the Test struct for comparison
		var dbTest Test
		dbTestJSON, _ := json.Marshal(test) // Convert dbTest to JSON
		if err := json.Unmarshal(dbTestJSON, &dbTest); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse database data"})
		}
		// Check if user exists in the database
		user, err := client.User.FindUnique(
			db.User.ID.Equals(receivedData.UserId),
		).Exec(ctx)

		// If the user is not found, create a new user record
		if user == nil {
			fmt.Println("User not found, creating a new user...")

			_, err := client.User.CreateOne(
				db.User.ID.Set(receivedData.UserId), // Assuming UserID is unique
			).Exec(ctx)
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create new user"})
			}
		}

		// Compare answers and count matching items
		matchingCount := 0
		for _, receivedSection := range receivedData.Sections {
			for _, dbSection := range dbTest.Sections {
				if receivedSection.ID == dbSection.ID {
					for _, receivedQuestion := range receivedSection.Questions {
						for _, dbQuestion := range dbSection.Questions {
							if receivedQuestion.ID == dbQuestion.ID && receivedQuestion.Answer == dbQuestion.Answer {
								matchingCount++
							}
						}
					}
				}
			}
		}



		// Create a new attempt record in the database
		_, err = client.Attempt.CreateOne(
			db.Attempt.TestID.Set(id),            // Use TestID directly
			db.Attempt.Marks.Set(matchingCount),  // Use matching count
			db.Attempt.UserID.Set(receivedData.UserId), // Set the UserId field if applicable
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save attempt"})
		}

		// Return response with the count of matching answers
		response := fiber.Map{"status": "ok", "matching_answers": matchingCount}
		return c.JSON(response)
	})

	// Start the Fiber app on port 8080
	if err := app.Listen(":8080"); err != nil {
		return fmt.Errorf("failed to run server: %w", err)
	}
	return nil
}
