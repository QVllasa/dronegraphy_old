package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type (
	ChildCategory struct {
		ID             primitive.ObjectID `json:"id" bson:"_id"`
		Value          string             `json:"value" bson:"value"`
		ParentCategory ParentCategory     `json:"parent_category" bson:"parent_category"`
	}
	ParentCategory struct {
		ID    primitive.ObjectID `json:"id" bson:"_id"`
		Value string             `json:"value" bson:"value"`
	}
)
