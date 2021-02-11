package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
)

func (this *Repository) GetFilters() ([]model.FilterOption, error) {
	var filterOptions  []model.FilterOption

	cursor, err := this.FilterColl.Find(context.Background(), bson.M{})
	if err != nil {
		log.Errorf("Unable to fetch users from database: %v", err)
		return filterOptions, err
	}

	if err = cursor.All(context.Background(), &filterOptions); err != nil {
		log.Errorf("Unable to read the cursor: %v", err)
		return filterOptions, err
	}

	return filterOptions, nil
}
