package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type (
	Category struct {
		ID         primitive.ObjectID `json:"id" bson:"_id"`
		Value      string             `json:"value" bson:"value"`
		Level      int                `json:"level" bsoon:"level"`
		Children   []Category         `json:"children" bson:"children"`
		Expandable bool               `json:"expandable" bson:"expandable"`
	}
)
