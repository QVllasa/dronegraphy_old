package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
)

func (this *Repository) CreateCategory(model *model.Category) error {

	ID, err := this.CategoryColl.InsertOne(context.Background(), model)
	if err != nil {
		log.Errorf("Unable to store in database: %s", err)
		return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Category already exists"})
	}

	res := this.CategoryColl.FindOne(context.Background(), bson.M{"_id": ID.InsertedID})
	if err := res.Decode(&model); err != nil {
		log.Errorf("Unable to fetch User ID: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to fetch Category ID"})
	}

	return nil
}

func (this *Repository) GetAllCategories() ([]model.Category, error) {

	var category []model.Category

	cursor, err := this.CategoryColl.Find(context.Background(), bson.M{})
	if err != nil {
		log.Errorf("Unable to fetch users from database: %v", err)
		return category, err
	}

	if err = cursor.All(context.Background(), &category); err != nil {
		log.Errorf("Unable to read the cursor: %v", err)
		return category, err
	}
	return category, nil
}
