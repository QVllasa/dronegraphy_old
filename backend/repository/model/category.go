package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type (
	SubCategory struct {
		ID     primitive.ObjectID `json:"id" bson:"_id,omitempty"`
		Value  string             `json:"sub_category" bson:"sub_category"`
		Parent string     `json:"parent_category" bson:"parent_category"`
	}
)
