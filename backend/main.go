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
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return err
	}
	defer client.Prisma.Disconnect()

	ctx := context.Background()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // You can specify your front-end origin instead of "*"
    	AllowHeaders: "Origin, Content-Type, Accept",
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

	// app.Get("/api/attempts/:id", func(c *fiber.Ctx) error {
	// 	// id here is auth0 id of the user 
	// 	id := c.Params("id")
	// 	attempts, err := client.Attempt.FindMany(
	// 		db.Attempt.AuthID.Equals(id),
	// 	).Exec(ctx)
	// 	if err != nil {
	// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch attempts"})
	// 	}
	// 	return c.JSON(attempts)
	// })

	app.Get("/api/attempts/:id", func(c *fiber.Ctx) error {
		id := c.Params("id") 

		attempts, err := client.Attempt.FindMany(
			db.Attempt.AuthID.Equals(id),
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch attempts"})
		}

		// If no attempts are found, return an empty array
		if len(attempts) == 0 {
			return c.JSON([]fiber.Map{})
		}

		// Store the test IDs from the attempts
		var testIds []string
		for _, attempt := range attempts {
			testIds = append(testIds, attempt.TestID)
		}

		// Fetch the test details for the collected test IDs
		tests, err := client.Test.FindMany(
			db.Test.ID.In(testIds),
		).Exec(ctx)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch tests"})
		}

		// Create a response combining attempts with corresponding test details
		response := []fiber.Map{}
		for _, attempt := range attempts {
			// Find the corresponding test details for the current attempt
			var testDetails *db.TestModel
			for _, test := range tests {
				if test.ID == attempt.TestID {
					testDetails = &test
					break
				}
			}

			response = append(response, fiber.Map{
				"attempt": attempt,
				"test":    testDetails,
			})
		}

		return c.JSON(response)
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
		fmt.Println(receivedData.UserId)
		// Check if user exists in the database
		user, err := client.User.FindUnique(
			db.User.AuthID.Equals(receivedData.UserId),
		).Exec(ctx)
		if err != nil{
			fmt.Println("User Not found")
		}

		// If the user is not found, create a new user record
		if user == nil {
			fmt.Println("User not found, creating a new user...")

			_, err := client.User.CreateOne(
				db.User.AuthID.Set(receivedData.UserId),
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
			db.Attempt.TestID.Set(id),
			db.Attempt.Marks.Set(matchingCount),
			db.Attempt.AuthID.Set(receivedData.UserId),
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