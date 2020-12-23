package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type (
	Category struct {
		ID        primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
		Value     string             `json:"value" bson:"value" validate:"required"`
		CreatedAt time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
		UpdatedAt time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	}
)
