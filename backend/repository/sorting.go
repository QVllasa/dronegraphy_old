package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
)

func (this *Repository) GetFilters() ([]model.SortOption, error) {
	var sortOptions []model.SortOption

	cursor, err := this.SortColl.Find(context.Background(), bson.M{})
	if err != nil {
		log.Errorf("Unable to fetch users from database: %v", err)
		return sortOptions, err
	}

	if err = cursor.All(context.Background(), &sortOptions); err != nil {
		log.Errorf("Unable to read the cursor: %v", err)
		return sortOptions, err
	}

	return sortOptions, nil
}
