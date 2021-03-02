package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type (
	Category struct {
		ID        primitive.ObjectID `json:"id" bson:"_id"`
		Value     string             `json:"value" bson:"value"`
		Key       int                `json:"key" bson:"key"`
		ParentKey int                `json:"parent_key" bson:"parent_key,omitempty"`
	}
)
