package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"time"
)

type ErrorMessage struct {
	Message string `json:"message"`
}

func (this *Repository) UpdateUser(member model.Member) (*model.Member, error) {

	fmt.Println(member)

	filter := bson.M{"user.uid": member.UID}
	member.UpdatedAt = time.Now()

	_, err := this.UserColl.UpdateOne(context.Background(), filter, bson.M{"$set": member})
	if err != nil {
		log.Errorf("Unable to update the user: %v", err)
		return nil, echo.NewHTTPError(http.StatusInternalServerError, "Unable to update the User")
	}

	return &member, nil
}

func (this *Repository) CreateUser(model *model.Member) error {

	model.CreatedAt = time.Now()

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
func (this *Repository) GetAllMembers() ([]model.Member, error) {

	var users []model.Member

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
func (this *Repository) GetMemberById(id string) (*model.Member, error) {
	var user model.Member
	filter := bson.M{"user.uid": id}
	err := this.UserColl.FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		log.Info("No user found")
		return &user, err
	}
	return &user, nil
}

func (this *Repository) GetAllCreators() (*[]model.Creator, error) {

	var creators []model.Creator

	filter := bson.M{"user.role": "ROLE_CREATOR"}
	projection := bson.D{
		//{"firstName", 1},
		//{"lastName", 1},
		{"user.uid", 0},
		{"user.email", 0},
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

func (this *Repository) GetCreator(key int64) (model.Creator, error) {
	var user model.Creator
	filter := bson.M{"key": key}
	projection := bson.D{
		//{"firstName", 1},
		//{"lastName", 1},
		{"user.uid", 0},
		{"user.email", 0},
	}

	err := this.UserColl.FindOne(context.Background(), filter, options.FindOne().SetProjection(projection)).Decode(&user)
	if err != nil {
		log.Info("No user found")
		return user, err
	}
	return user, nil
}

func (this *Repository) GetCreatorById(id string) (*model.Creator, error) {
	var user model.Creator
	filter := bson.M{"uid": id}
	err := this.UserColl.FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		log.Info("No user found")
		return &user, err
	}
	return &user, nil
}
