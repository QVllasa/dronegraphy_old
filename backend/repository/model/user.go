package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type (
	User struct {
		ID               primitive.ObjectID `json:"-" bson:"_id,omitempty"`
		Email            string             `json:"email,omitempty" bson:"email,omitempty" validate:"required,email"`
		FirstName        string             `json:"firstName,omitempty" bson:"firstName" validate:"required"`
		LastName         string             `json:"lastName,omitempty" bson:"lastName"`
		UID              string             `json:"uid,omitempty" bson:"uid,omitempty"`
		Role             string             `json:"-" bson:"role"`
		CreatedAt        *time.Time         `json:"createdAt,omitempty" bson:"createdAt"`
		UpdatedAt        *time.Time         `json:"updatedAt,omitempty" bson:"updatedAt"`
		FavoriteVideos   []string           `json:"favoriteVideos,omitempty" bson:"favoriteVideos"`
		FavoriteCreators []string           `json:"favoriteCreators,omitempty" bson:"favoriteCreators"`
		DownloadedVideos []string           `json:"downloadedVideos,omitempty" bson:"downloadedVideos"`
		Orders           []string           `json:"orders,omitempty" bson:"orders"`
		Key              int64              `json:"key" bson:"key"`
		ProfileImage     string             `json:"profileImage" bson:"profileImage"`
		Location         string             `json:"location" bson:"location"`
		Slogan           string             `json:"slogan" bson:"slogan"`
		ActiveCart       []string           `json:"activeCart,omitempty" bson:"activeCart"`
		VideoHeader      []string           `json:"videoHeader,omitempty" bson:"videoHeader,omitempty"`
		Credits          int                `json:"credits,omitempty" bson:"credits"`
	}
)
