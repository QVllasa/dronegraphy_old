package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type (
	User struct {
		ID            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
		Email         string             `json:"email" bson:"email" validate:"required,email"`
		FirstName     string             `json:"firstName" bson:"firstName"  validate:"required"`
		LastName      string             `json:"lastName" bson:"lastName" validate:"required"`
		UID           string             `json:"uid" bson:"uid" validate:"required"`
		EmailVerified bool               `json:"emailVerified" bson:"emailVerified"`
		Roles         Roles              `json:"roles" validate:"required"`

		//trait.Model
		//trait.Timestampable
	}
)
