package model

import (
	"time"
)

type (
	Video struct {
		Title      string   `json:"title" bson:"title" validate:"required"`
		Location   string   `json:"location" bson:"location" validate:"required"`
		Formats    []string `json:"formats" bson:"formats" validate:"required"`
		Height     int      `json:"height" bson:"height" validate:"required"`
		Width      int      `json:"width" bson:"width" validate:"required"`
		Length     int      `json:"length" bson:"length" validate:"required"`
		FPS        int      `json:"fps" bson:"fps" validate:"required"`
		Camera     string   `json:"camera" bson:"camera" validate:"required"`
		Tags       []string `json:"tags" bson:"tags"`
		Sell       bool     `json:"sell" bson:"sell"`
		Published  bool     `json:"published" bson:"published"`
		Categories []string `json:"categories" bson:"categories" validate:"required"`
		//Downloads  int                `json:"downloads" bson:"downloads"`
		//Views      int                `json:"views" bson:"views"`

		CreatedAt time.Time `json:"created_at,omitempty" bson:"created_at,omitempty"`
		UpdatedAt time.Time `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
		CreatorID string    `json:"creator_id" bson:"creator_id"`

		//trait.Model
		//trait.Timestampable
	}
)

//TODO:
//public downloads: number;
//public views: number;
//public thumbnail?: string;
