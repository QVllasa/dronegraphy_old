package repository

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

type Repository struct {
	Client      *mongo.Client
	UserColl    *mongo.Collection
	VideoColl   *mongo.Collection
	FirebaseApp *FirebaseClient
}

// Create a repository with the Database connection provided
func NewRepository(client *mongo.Client) (this *Repository, err error) {
	this = new(Repository)
	this.Client = client
	this.FirebaseApp, err = NewFirebaseClient()
	if err != nil {
		log.Error(err)
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "Connection to firebase failed")
	}
	this.UserColl = this.Client.Database("dronegraphy_db").Collection("users")
	this.VideoColl = this.Client.Database("dronegraphy_db").Collection("videos")
	return this, nil
}
