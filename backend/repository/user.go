package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"strconv"
	"time"
)

type ErrorMessage struct {
	Message string `json:"message"`
}

func (this *Repository) UpdateUser(model model.User) (*model.User, error) {

	filter := bson.M{"uid": model.UID}
	ts := time.Now()
	model.UpdatedAt = &ts

	_, err := this.UserColl.UpdateOne(context.Background(), filter, bson.M{"$set": model})
	if err != nil {
		log.Errorf("Unable to update the user: %v", err)
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "Unable to update the User")
	}

	return &model, nil
}

func (this *Repository) CreateUser(model *model.User) error {

	ts := time.Now()
	model.CreatedAt = &ts

	ID, err := this.UserColl.InsertOne(context.Background(), model)
	if err != nil {
		log.Errorf("Unable to store in database: %s", err)
		return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Email already exists"})
	}

	res := this.UserColl.FindOne(context.Background(), bson.M{"_id": ID.InsertedID})
	if err := res.Decode(&model); err != nil {
		log.Errorf("Unable to fetch User ID: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to fetch User ID"})
	}

	return nil
}

// Restricted
func (this *Repository) GetAllUsers() ([]model.User, error) {

	var users []model.User

	cursor, err := this.UserColl.Find(context.Background(), bson.M{})
	if err != nil {
		log.Errorf("Unable to fetch users from database: %v", err)
		return users, err
	}

	if err = cursor.All(context.Background(), &users); err != nil {
		log.Errorf("Unable to read the cursor: %v", err)
		return users, err
	}
	return users, nil

}

// TODO replace with *model.... everywhere
func (this *Repository) GetUser(id string) (*model.User, error) {
	var user model.User
	filter := bson.M{"uid": id}
	err := this.UserColl.FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		log.Info("No user found")
		return &user, err
	}
	return &user, nil
}

func (this *Repository) GetAllCreators() (*[]model.User, error) {

	var creators []model.User

	filter := bson.M{"role": "ROLE_CREATOR"}
	projection := bson.D{
		{"uid", 0},
		{"email", 0},
		{"orders", 0},
		{"createdAt", 0},
		{"updatedAt", 0},
		{"downloadedVideos", 0},
		{"favoriteVideos", 0},
	}

	cursor, err := this.UserColl.Find(context.Background(), filter, options.Find().SetProjection(projection))
	if err != nil {
		log.Errorf("Unable to fetch creators from database: %v", err)
		return &creators, err
	}

	if err = cursor.All(context.Background(), &creators); err != nil {
		log.Errorf("Unable to read the cursor: %v", err)
		return &creators, err
	}
	return &creators, nil
}

// Fetch Creator either by UID or by Key
func (this *Repository) GetCreator(id string) (*model.User, error) {
	var user model.User

	// Check if you get a creator by Key (for creator page) or by UID (for login)
	key, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		key = 0
		return &user, err
	}
	filter := bson.M{"key": key}
	projection := bson.D{
		{"uid", 0},
		{"email", 0},
		{"orders", 0},
		{"createdAt", 0},
		{"updatedAt", 0},
		{"downloadedVideos", 0},
		{"favoriteVideos", 0},
	}
	err = this.UserColl.FindOne(context.Background(), filter, options.FindOne().SetProjection(projection)).Decode(&user)
	if err != nil {
		log.Error("No user found")
		return &user, err
	}

	return &user, nil
}
