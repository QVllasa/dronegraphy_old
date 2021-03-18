package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type (
	User struct {
		ID        primitive.ObjectID `json:"-" bson:"_id,omitempty"`
		Email     string             `json:"email,omitempty" bson:"email,omitempty" validate:"required,email"`
		FirstName string             `json:"firstName" bson:"firstName" validate:"required"`
		LastName  string             `json:"lastName" bson:"lastName"`
		UID       string             `json:"uid,omitempty" bson:"uid"`
		Role      string             `json:"-" bson:"role"`
		CreatedAt time.Time          `json:"createdAt,omitempty" bson:"createdAt"`
		UpdatedAt time.Time          `json:"updatedAt,omitempty" bson:"updatedAt"`
	}
	Member struct {
		User
		FavoriteVideos   []string `json:"favoriteVideos,omitempty" bson:"favoriteVideos,omitempty"`
		DownloadedVideos []string `json:"downloadedVideos,omitempty" bson:"downloadedVideos,omitempty"`
		Orders           []string `json:"orders,omitempty" bson:"orders,omitempty"`
	}

	Creator struct {
		User
		Key          int64  `json:"key,omitempty" bson:"key,omitempty"`
		ProfileImage string `json:"profileImage,omitempty" bson:"profileImage,omitempty"`
		Location     string `json:"location,omitempty" bson:"location,omitempty"`
		Slogan       string `json:"slogan,omitempty" bson:"slogan,omitempty"`
	}
)
