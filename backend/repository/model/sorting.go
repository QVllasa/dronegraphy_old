package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type (
	SortOption struct {
		ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
		Value string             `json:"value" bson:"value" validate:"required" `
		Key   int                `json:"key" bson:"key"`
	}
)
