package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type (
	Video struct {
		ID         primitive.ObjectID `json:"id" bson:"_id,omitempty"`
		Title      string             `json:"title" bson:"title" validate:"required"`
		Location   string             `json:"location" bson:"location" validate:"required"`
		Formats    []string           `json:"formats" bson:"formats" validate:"required"`
		Height     int                `json:"height" bson:"height" validate:"required"`
		Width      int                `json:"width" bson:"width" validate:"required"`
		Length     int                `json:"length" bson:"length" validate:"required"`
		FPS        int                `json:"fps" bson:"fps" validate:"required"`
		Camera     string             `json:"camera" bson:"camera" validate:"required"`
		Tags       []string           `json:"tags" bson:"tags"`
		Sell       bool               `json:"sell" bson:"sell"`
		Published  bool               `json:"published" bson:"published"`
		Categories []string           `json:"categories" bson:"categories" validate:"required"`
		Downloads  int                `json:"downloads" bson:"downloads"`
		Views      int                `json:"views" bson:"views"`
		Source     string             `json:"source" bson:"source"`
		HLS        string             `json:"hls" bson:"hls"`
		Thumbnail  string             `json:"thumbnail" bson:"thumbnail"`
		StorageRef string             `json:"storage_ref" bson:"storge_ref"`

		CreatedAt time.Time `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
		UpdatedAt time.Time `json:"updatedAt,omitempty" bson:"updatedAt,omitempty"`
		Creator   Creator   `json:"creator" bson:"creator"`
	}
)
