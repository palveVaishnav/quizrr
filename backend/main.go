package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"backend/db"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"backend/seed"
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
		tests, err := client.Test.FindMany().With(
			db.Test.Sections.Fetch(),
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch tests"})
		}

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
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get test"})
		}
		response, err := json.MarshalIndent(test, "", " ")
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "parsing failed"})
		}

		return c.Send(response)
	})

	app.Post("/api/attempt/:id", func(c *fiber.Ctx) error {
		// 1. Get request body and test ID
		Body := c.Body()
		id := c.Params("id")

		// 2. Parse received data
		var receivedData Test
		if err := json.Unmarshal(Body, &receivedData); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
		}

		// 3. Fetch test data from database
		test, err := client.Test.FindUnique(
			db.Test.ID.Equals(id),
		).With(
			db.Test.Sections.Fetch().With(
				db.Sections.Questions.Fetch(),
			),
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to get test"})
		}

		// 4. Convert fetched test to struct for comparison
		var dbTest Test
		dbTestJSON, _ := json.Marshal(test) // Convert dbTest to JSON
		if err := json.Unmarshal(dbTestJSON, &dbTest); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to parse database data"})
		}

		// 5. Compare answers and count matching items
		matchingCount := 0

		// Iterate through sections in received data
		for _, receivedSection := range receivedData.Sections {
			// Find the corresponding section in the database data
			for _, dbSection := range dbTest.Sections {
				if receivedSection.ID == dbSection.ID {
					// Compare questions within the matching section
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

		_, err = client.Attempt.CreateOne(
			db.Attempt.TestID.Set(id),     // Use TestID directly
			db.Attempt.Marks.Set(matchingCount), // Use matching count
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to save attempt"})
		}

		fmt.Printf("Matching Answers: %d\n", matchingCount)

		// 6. Return response with matching count
		response := fiber.Map{"status": "ok", "matching_answers": matchingCount}
		return c.JSON(response)
	})

	// Start the Fiber app on port 8080
	if err := app.Listen(":8080"); err != nil {
		return fmt.Errorf("failed to run server: %w", err)
	}
	return nil
}
