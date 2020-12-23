package repository

import (
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository struct {
	Client    *mongo.Client
	UserColl  *mongo.Collection
	VideoColl *mongo.Collection
}

var Repo *Repository

// Create a repository with the Database connection provided
func NewRepository(client *mongo.Client) (this *Repository) {
	this = new(Repository)
	fmt.Println("New Repository")
	this.Client = client
	this.UserColl = this.Client.Database("dronegraphy_db").Collection("users")
	this.VideoColl = this.Client.Database("dronegraphy_db").Collection("videos")

	Repo = this

	return this
}
