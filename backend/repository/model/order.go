package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type (
	Order struct {
		ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
		Cart      []string           `json:"cart" bson:"cart"`
		Active    bool               `json:"active" bson:"active"`
		CreatedAt time.Time          `json:"createdAt,omitempty" bson:"created_at,omitempty" `
		UpdatedAt time.Time          `json:"updatedAt,omitempty" bson:"updated_at,omitempty" `
	}
)
