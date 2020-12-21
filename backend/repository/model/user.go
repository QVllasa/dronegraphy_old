package model

import (
	"dronegraphy/backend/repository/model/trait"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type (
	User struct {
		ID           primitive.ObjectID `json:"-" bson:"_id,omitempty"`
		Email        string             `json:"email" bson:"email" validate:"required,email"`
		FirstName    string             `json:"firstName" bson:"firstName"  validate:"required"`
		LastName     string             `json:"lastName" bson:"lastName"`
		UID          string             `json:"uid" bson:"uid" validate:"required"`
		Role         string             `json:"-" bson:"role"`
		ProfileImage string             `json:"profileImage,omitempty" bson:"profileImage,omitempty"`
		Videos       []string           `json:"videos,omitempty" bson:"videos,omitempty"`

		//trait.Model
		trait.Timestampable
	}
)
