package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)
type Todo struct {
	ID int `json:"id"`
	Title string `json:"title"`
	Done bool `json:"done"`
	Body string `json:"body"`
}


func main()  {
	fmt.Print("Hello Non")

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://127.0.0.1:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	todos := []Todo{}

	app.Get("/healthCheck",func(c *fiber.Ctx) error {
		return c.SendString(("Ok"))
	})

	//Post
	app.Post("/api/todos",func(c *fiber.Ctx) error {
		todo := &Todo{}
		if err := c.BodyParser(todo); err != nil{
			return err
		}
		todo.ID = len(todos) + 1
		todos = append(todos, *todo)

		return c.JSON(todos)
	})

	//Update
	app.Patch("/api/todos/:id/done",func(c *fiber.Ctx) error {
		//get id as int
		id, err := c.ParamsInt("id")
		if err != nil{
			return c.Status(401).SendString("Invalid id")
		}
		for i, todo := range todos {
			if todo.ID == id{
				todos[i].Done = !todos[i].Done
				break
			}
		}
		return c.JSON(todos)
	})

	//Get
	app.Get("/api/todos",func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":4000"))
}