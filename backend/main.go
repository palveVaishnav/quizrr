package main 

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	"log"
	"os"
)

func main(){
	app := fiber.New()
	
	var err error
	// Replace with your own database connection string
	dsn := os.Getenv("DATABASE_URL") 
	// Open a new database connection using sqlx
	DB, err = sqlx.Connect("postgres", dsn)

	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}

	log.Println("Successfully connected to the database")

	// app.Get("/",func(c *fiber.Ctx) error{
	// 	return c.JSON(DummyQuestion)
	// })

	// app.Listen(":3000")
}




