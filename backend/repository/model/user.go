package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type (
	User struct {
		ID               primitive.ObjectID `json:"-" bson:"_id,omitempty"`
		Email            string             `json:"email,omitempty" bson:"email,omitempty" validate:"required,email"`
		FirstName        string             `json:"firstName" bson:"firstName" validate:"required"`
		LastName         string             `json:"lastName" bson:"lastName"`
		UID              string             `json:"uid" bson:"uid"`
		Role             string             `json:"-" bson:"role"`
		ProfileImage     string             `json:"profileImage,omitempty" bson:"profileImage,omitempty"`
		CreatedAt        time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
		UpdatedAt        time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
		FavoriteVideos   []string           `json:"favoriteVideos" bson:"favoriteVideos"`
		DownloadedVideos []string           `json:"downloadedVideos" bson:"downloadedVideos"`
	}

	Creator struct {
		UID       string `json:"uid" bson:"uid"`
		FirstName string `json:"firstName" bson:"firstName"`
		LastName  string `json:"lastName" bson:"lastName"`
	}
)
