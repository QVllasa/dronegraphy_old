package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Media struct {
	ID primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	//Author      string             `bson:"author"`
	Caption     string `bson:"caption"`
	ContentType string `bson:"contentType"`
	//DateTime    string             `bson:"dateTime"`
	FileID   primitive.ObjectID `bson:"fileID"`
	FileSize int64              `bson:"fileSize"`
	//Height      int                `bson:"height"`
	Name string `bson:"name"`
	//Width       int                `bson:"width"`
}
