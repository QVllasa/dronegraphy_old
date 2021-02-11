package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type (
	FilterOption struct {
		ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
		Value     string             `json:"value" bson:"value" validate:"required" `
		CreatedAt time.Time          `json:"createdAt,omitempty" bson:"created_at,omitempty" `
		UpdatedAt time.Time          `json:"updatedAt,omitempty" bson:"updated_at,omitempty" `
	}
)
