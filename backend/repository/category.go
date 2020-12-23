package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
)

func CreateCategory() {

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
