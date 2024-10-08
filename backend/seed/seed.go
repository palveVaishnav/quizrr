package seed

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"backend/db"
	"github.com/steebchen/prisma-client-go/runtime/types"
)

func SeedDatabase() {
	if err := seed(); err != nil {
		log.Fatalf("Error seeding data: %v", err)
	}
}

func seed() error {
	// Initialize Prisma client
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return err
	}
	defer client.Prisma.Disconnect()

	ctx := context.Background()

	// Create a new Test
	createdTest, err := client.Test.CreateOne(
		db.Test.Name.Set("JEE Mock Test"),
		db.Test.Time.Set(180),      // 180 minutes duration
		db.Test.Nquestions.Set(16), // Total 16 questions
		db.Test.Marks.Set(400),     // Total marks for the test
		db.Test.Locked.Set(false),  // Initially unlocked
	).Exec(ctx)
	if err != nil {
		return fmt.Errorf("failed to create test: %w", err)
	}

	// Define sections and their questions
	sections := []struct {
		Title     string
		Questions []string
	}{
		{"Physics", []string{
			"What is the unit of force?",
			"What is Newton's first law?",
			"What is the speed of light?",
			"What is the formula for kinetic energy?",
		}},
		{"Chemistry", []string{
			"What is the pH of pure water?",
			"What is the chemical formula of water?",
			"What is the periodic table?",
			"What is Avogadro's number?",
		}},
		{"Mathematics", []string{
			"What is the quadratic formula?",
			"What is the derivative of x^2?",
			"What is the area of a circle?",
			"What is the value of pi?",
		}},
		{"Biology", []string{
			"What is the powerhouse of the cell?",
			"What is DNA?",
			"What is the process of photosynthesis?",
			"What is the human genome?",
		}},
	}

	for _, section := range sections {
		// Create each section linked to the test
		createdSection, err := client.Sections.CreateOne(
			db.Sections.Title.Set(section.Title),
			db.Sections.MaxMarks.Set(100), // Assuming each section has a maximum of 100 marks
			db.Sections.Test.Link(
				db.Test.ID.Equals(createdTest.ID),
			),
		).Exec(ctx)

		if err != nil {
			return fmt.Errorf("failed to create section: %w", err)
		}

		for i, questionText := range section.Questions {

			// Prepare the options array and convert to types.JSON
			options := []string{"Option 1", "Option 2", "Option 3", "Option 4"}
			optionsJSON, err := json.Marshal(options)
			if err != nil {
				return fmt.Errorf("could not marshal options: %w", err)
			}

			// Convert the marshaled options into types.JSON
			optionsType := types.JSON(optionsJSON)

			// Create each question linked to the section
			_, err = client.Question.CreateOne(
				db.Question.Question.Set(questionText),
				db.Question.Options.Set(optionsType), // Setting options as JSON in the schema
				db.Question.Answer.Set(i%4), // Dummy correct answer
				db.Question.Sections.Link(
					db.Sections.ID.Equals(createdSection.ID),
				),
			).Exec(ctx)

			if err != nil {
				return fmt.Errorf("failed to create question: %w", err)
			}
		}
	}

	// Output the created test details
	result, _ := json.MarshalIndent(createdTest, "", "  ")
	fmt.Printf("Created Test: %s\n", result)

	return nil
}