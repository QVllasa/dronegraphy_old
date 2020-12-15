package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type (
	User struct {
		ID           primitive.ObjectID `json:"-" bson:"_id,omitempty"`
		Email        string             `json:"email" bson:"email" validate:"required,email"`
		FirstName    string             `json:"firstName" bson:"firstName"  validate:"required"`
		LastName     string             `json:"lastName" bson:"lastName"`
		UID          string             `json:"uid" bson:"uid" validate:"required"`
		Roles        []string           `json:"-" bson:"roles"`
		ProfileImage string             `json:"profileImage,omitempty" bson:"profileImage,omitempty"`

		//trait.Model
		//trait.Timestampable
	}
)
