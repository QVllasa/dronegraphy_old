package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type (
	Video struct {
		ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
		Title      string             `json:"title" bson:"title" validate:"required"`
		Location   string             `json:"location" bson:"location" validate:"required"`
		Formats    []string           `json:"formats" bson:"formats" validate:"required"`
		Resolution string             `json:"resolution" bson:"resolution" validate:"required"`
		Length     int                `json:"length" bson:"length" validate:"required"`
		FPS        int                `json:"fps" bson:"fps" validate:"required"`
		Camera     string             `json:"camera" bson:"camera" validate:"required"`
		//Tags       []string           `json:"tags" bson:"tags"`
		//Sell       bool               `json:"sell" bson:"sell"`
		//Downloads  int                `json:"downloads" bson:"downloads"`
		//Views      int                `json:"views" bson:"views"`
	}
)
