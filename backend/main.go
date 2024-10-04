package main

import (
	"context"
	"encoding/json"
	"fmt"
	// Client
	"backend/db"
	"github.com/steebchen/prisma-client-go/runtime/types"
)

func main() {
	if err := run(); err != nil {
		panic(err)
	}
}

func run() error {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return err
	}

	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

	ctx := context.Background()

	// Prepare the options array and convert to types.JSON
	options := []string{"Option 1", "Option 2", "Option 3", "Option 4"}
	optionsJSON, err := json.Marshal(options)
	if err != nil {
		return fmt.Errorf("could not marshal options: %w", err)
	}

	// Convert the marshaled options into types.JSON
	optionsType := types.JSON(optionsJSON)

	// create a Question and adding to db
	createdQuestion, err := client.Question.CreateOne(
		db.Question.Question.Set("New Question"),
		db.Question.Options.Set(optionsType),
		db.Question.Viewed.Set(false),
		db.Question.Review.Set(false),
		db.Question.Answer.Set(1),
	).Exec(ctx)
	if err != nil {
		return err
	}

	// the db response for createOne
	result, _ := json.MarshalIndent(createdQuestion, "", "  ")
	fmt.Printf("created Question: %s\n", result)

	//  Searching / verify what is created
	question, err := client.Question.FindUnique(
		db.Question.ID.Equals(createdQuestion.ID),
	).Exec(ctx)
	if err != nil {
		return err
	}

	// convert to json for fe
	result, _ = json.MarshalIndent(question, "", "  ")
	fmt.Printf("Question : %s\n", result)

	return nil
}
