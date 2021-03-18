package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type (
	User struct {
		ID               primitive.ObjectID `json:"-" bson:"_id,omitempty"`
		Key              int                `json:"key,omitempty" bson:"key,omitempty"`
		Email            string             `json:"email,omitempty" bson:"email,omitempty" validate:"required,email"`
		FirstName        string             `json:"firstName" bson:"firstName" validate:"required"`
		LastName         string             `json:"lastName" bson:"lastName"`
		UID              string             `json:"uid,omitempty" bson:"uid"`
		Role             string             `json:"-" bson:"role"`
		ProfileImage     string             `json:"profileImage,omitempty" bson:"profileImage,omitempty"`
		CreatedAt        time.Time          `json:"created_at,omitempty" bson:"created_at"`
		UpdatedAt        time.Time          `json:"updated_at,omitempty" bson:"updated_at"`
		FavoriteVideos   []string           `json:"favoriteVideos,omitempty" bson:"favoriteVideos"`
		DownloadedVideos []string           `json:"downloadedVideos,omitempty" bson:"downloadedVideos"`
		Orders           []string           `json:"orders,omitempty" bson:"orders"`
	}

	Creator struct {
		UID       string `json:"uid" bson:"uid"`
		FirstName string `json:"firstName" bson:"firstName"`
		LastName  string `json:"lastName" bson:"lastName"`
	}
)
