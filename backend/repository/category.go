package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
)

func (this *Repository) CreateCategory(model *model.ChildCategory) error {

	ID, err := this.ChildCategoryColl.InsertOne(context.Background(), model)
	if err != nil {
		log.Errorf("Unable to store in database: %s", err)
		return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Category already exists"})
	}

	res := this.ChildCategoryColl.FindOne(context.Background(), bson.M{"_id": ID.InsertedID})
	if err := res.Decode(&model); err != nil {
		log.Errorf("Unable to fetch User ID: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to fetch Category ID"})
	}

	return nil
}

func (this *Repository) GetAllChildCategories() ([]model.ChildCategory, error) {

	var category []model.ChildCategory

	cursor, err := this.ChildCategoryColl.Find(context.Background(), bson.M{})
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

func (this *Repository) GetAllParentCategories() ([]model.ParentCategory, error) {

	var category []model.ParentCategory

	cursor, err := this.ParentCategoryColl.Find(context.Background(), bson.M{})
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

func GetCategoryById() {

}

func UpdateCategory() {

}

func DeleteCategory() {

}

//
//func (this *Repository) GetAllUsers() ([]model.User, error) {
//
//
//
//}
