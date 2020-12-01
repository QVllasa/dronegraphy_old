package repository

import (
	firebase "firebase.google.com/go/v4"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository struct {
	Client    *mongo.Client
	UserColl  *mongo.Collection
	VideoColl *mongo.Collection
	Firebase  *firebase.App
}

// Create a repository with the Database connection provided
func NewRepository(client *mongo.Client) (this *Repository) {
	this = new(Repository)
	this.Client = client
	this.UserColl = this.Client.Database("dronegraphy_db").Collection("users")
	this.VideoColl = this.Client.Database("dronegraphy_db").Collection("videos")
	return this
}
