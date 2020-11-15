package handler

import "go.mongodb.org/mongo-driver/bson/primitive"

type Video struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title      string             `json:"title" bson:"title"`
	Location   string             `json:"location" bson:"location"`
	Formats    []string           `json:"formats" bson:"formats"`
	Resolution string             `json:"resolution" bson:"resolution"`
	Length     int                `json:"length" bson:"length"`
	FPS        int                `json:"fps" bson:"fps"`
	Camera     string             `json:"camera" bson:"camera"`
	Tags       []string           `json:"tags" bson:"tags"`
	Sell       bool               `json:"sell" bson:"sell"`
	Downloads  int                `json:"downloads" bson:"downloads"`
	Views      int                `json:"views" bson:"views"`
}

//TODO
//creator: IUser;
//poster: string;
//itemPath: string;
//category: string[];
//upload: Date;
//profileBackground: boolean;
//chosen: boolean;
