package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type (
	Video struct {
		ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
		Key            int                `json:"key" bson:"key,omitempty"`
		Title          string             `json:"title" bson:"title" validate:"required"`
		Camera         string             `json:"camera" bson:"camera" validate:"required"`
		Location       string             `json:"location" bson:"location" validate:"required"`
		Formats        []string           `json:"formats" bson:"formats" validate:"required"`
		Height         int                `json:"height" bson:"height"`
		Width          int                `json:"width" bson:"width"`
		Length         float64            `json:"length" bson:"length"`
		FPS            int                `json:"fps" bson:"fps"`
		Tags           []string           `json:"tags" bson:"tags"`
		Sell           bool               `json:"sell" bson:"sell"`
		StuffPick      bool               `json:"stuff_pick" bson:"stuff_pick"`
		Published      bool               `json:"published" bson:"published"`
		Converted      bool               `json:"converted" bson:"converted"`
		Categories     []int              `json:"categories" bson:"categories" validate:"required"`
		Downloads      int                `json:"downloads" bson:"downloads"`
		Views          int                `json:"views" bson:"views"`
		Thumbnail      string             `json:"thumbnail" bson:"thumbnail"`
		StorageRef     string             `json:"storageRef" bson:"storageRef"`
		StorageContent []FileInfo         `json:"storageContent" bson:"storageContent"`
		CreatedAt      time.Time          `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
		UpdatedAt      time.Time          `json:"updatedAt,omitempty" bson:"updatedAt,omitempty"`
		Creator        Creator            `json:"creator" bson:"creator"`
	}

	FileInfo struct {
		Size        int64  `json:"size" bson:"size"`
		ContentType string `json:"contentType" bson:"contentType"`
		Name        string `json:"name" bson:"name"`
	}
)
