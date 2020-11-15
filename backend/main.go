package main

import (
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	c *mongo.Client
	db *mongo.Database
	col *mongo.Collection
	cfg config.Properties
)

func init(){

}

func main() {
	e := echo.New()
	e.POST('/videos', CreateVideo)
}
