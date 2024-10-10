package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sort"

	"backend/db"
	"backend/seed"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// Struct definitions
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
	UserId   string    `json:"userId"`
}

type Attempt struct {
	TestID string `json:"testId"`
	Marks  int    `json:"marks"`
}

var client *db.PrismaClient
var ctx = context.Background()

func main() {
	// Check if the "seed" argument is provided to run the seed logic
	if len(os.Args) > 1 && os.Args[1] == "seed" {
		runSeed()
		return
	}

	// Initialize the Prisma client
	client = db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer client.Prisma.Disconnect()

	// Initialize the Fiber app
	app := fiber.New()
	setupMiddleware(app)
	setupRoutes(app)

	// Start the server
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

// runSeed handles database seeding
func runSeed() {
	fmt.Println("Running database seeding...")
	seed.SeedDatabase()
	fmt.Println("Seeding completed.")
}

// setupMiddleware configures the middleware for the app
func setupMiddleware(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
}

// setupRoutes registers the API routes
func setupRoutes(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	app.Get("/api/tests", getTests)
	app.Get("/api/test/:id", getTestByID)
	app.Get("/api/attempts", getAllAttempts) // New endpoint
	app.Get("/api/attempts/:id", getAttemptsByUser)
	app.Post("/api/attempt/:id", createAttempt)
}

func getAllAttempts(c *fiber.Ctx) error {
	attempts, err := client.Attempt.FindMany().Exec(ctx) // Fetch attempts without user data
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch attempts"})
	}
	sort.Slice(attempts, func(i, j int) bool {
		return attempts[i].Marks > attempts[j].Marks
	})

	return c.JSON(attempts)
}

// getTests handles fetching all tests
func getTests(c *fiber.Ctx) error {
	tests, err := client.Test.FindMany().With(
		db.Test.Sections.Fetch(),
	).Exec(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch tests"})
	}
	return c.JSON(tests)
}

// getTestByID handles fetching a single test by ID
func getTestByID(c *fiber.Ctx) error {
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
}

// getAttempts handles fetching attempts by user ID
func getAttemptsByUser(c *fiber.Ctx) error {
	id := c.Params("id")

	attempts, err := client.Attempt.FindMany(
		db.Attempt.AuthID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch attempts"})
	}

	if len(attempts) == 0 {
		return c.JSON([]fiber.Map{})
	}

	testIds := extractTestIDs(attempts)
	tests, err := client.Test.FindMany(
		db.Test.ID.In(testIds),
	).Exec(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch tests"})
	}

	response := buildAttemptResponse(attempts, tests)
	return c.JSON(response)
}

// createAttempt handles creating a new test attempt
func createAttempt(c *fiber.Ctx) error {
	id := c.Params("id")

	var receivedData Test
	if err := parseJSONBody(c, &receivedData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Fetch the test from the database
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

	// Convert and parse the fetched test data
	var dbTest Test
	if err := parseDatabaseData(test, &dbTest); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Ensure the user exists or create a new user
	if err := ensureUserExists(receivedData.UserId); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// Calculate matching answers
	matchingCount := calculateMatchingAnswers(receivedData, dbTest)

	// Save the attempt
	_, err = client.Attempt.CreateOne(
		db.Attempt.TestID.Set(id),
		db.Attempt.Marks.Set(matchingCount),
		db.Attempt.AuthID.Set(receivedData.UserId),
	).Exec(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save attempt"})
	}

	return c.JSON(fiber.Map{"status": "ok", "matching_answers": matchingCount})
}

// Helper functions

// parseJSONBody is a helper function to parse the JSON body from the request
func parseJSONBody(c *fiber.Ctx, data interface{}) error {
	if err := c.BodyParser(data); err != nil {
		return fmt.Errorf("invalid request body")
	}
	return nil
}

// parseDatabaseData is a helper function to parse database data into a target structure
func parseDatabaseData(source interface{}, target interface{}) error {
	dbDataJSON, err := json.Marshal(source)
	if err != nil {
		return fmt.Errorf("failed to marshal database data")
	}
	if err := json.Unmarshal(dbDataJSON, target); err != nil {
		return fmt.Errorf("failed to unmarshal database data")
	}
	return nil
}

// extractTestIDs extracts test IDs from a list of attempts
func extractTestIDs(attempts []db.AttemptModel) []string {
	var testIds []string
	for _, attempt := range attempts {
		testIds = append(testIds, attempt.TestID)
	}
	return testIds
}

// buildAttemptResponse constructs the response for attempts
func buildAttemptResponse(attempts []db.AttemptModel, tests []db.TestModel) []fiber.Map {
	response := []fiber.Map{}
	for _, attempt := range attempts {
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
	return response
}

// ensureUserExists checks if a user exists and creates a new one if not found
func ensureUserExists(userId string) error {
	user, err := client.User.FindUnique(
		db.User.AuthID.Equals(userId),
	).Exec(ctx)
	if err != nil || user == nil {
		_, err := client.User.CreateOne(
			db.User.AuthID.Set(userId),
		).Exec(ctx)
		if err != nil {
			return fmt.Errorf("failed to create new user")
		}
	}
	return nil
}

// calculateMatchingAnswers calculates the number of matching answers between received and stored test data
func calculateMatchingAnswers(receivedData Test, dbTest Test) int {
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
	return matchingCount
}
