package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"net/http"
	"time"
)

func (this *Repository) CreateVideo(video *model.Video, id string) (string, error) {

	u, _ := this.GetCreator(id)

	creator := model.User{
		Key:       u.Key,
		FirstName: u.FirstName,
		LastName:  u.LastName,
	}

	// Set CreatedAt
	video.CreatedAt = time.Now()
	video.Creator = creator
	video.Converted = false

	ID, err := this.VideoColl.InsertOne(context.Background(), video)
	if err != nil {
		log.Errorf("Unable to store in database: %s", err)
		return "", echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Video already exists"})
	}

	vID := ID.InsertedID.(primitive.ObjectID).Hex()

	fmt.Println(vID)

	return vID, nil
}

func (this *Repository) GetVideos(filter interface{}, opt *options.FindOptions) ([]model.Video, error) {

	var videos []model.Video

	cursor, err := this.VideoColl.Find(context.Background(), filter, opt)

	if err != nil {
		log.Errorf("Unable to fetch videos from database: %v", err)
		return videos, err
	}

	if err := cursor.All(context.Background(), &videos); err != nil {
		log.Errorf("Unable to read the cursor: %v", err)
		return videos, err
	}
	return videos, nil
}

func (this *Repository) GetVideoById(id string) (*model.Video, error) {

	var video *model.Video

	docID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return video, err
	}
	res := this.VideoColl.FindOne(context.Background(), bson.M{"_id": docID})
	if err := res.Decode(&video); err != nil {
		return video, err
	}
	return video, nil
}

func (this *Repository) UpdateVideo(id string, model map[string]interface{}) (*model.Video, error) {

	filter := bson.M{"_id": id}
	update := bson.M{"$set": model}

	_, err := this.VideoColl.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Errorf("Unable to update the video: %v", err)
		return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to update the Video"})
	}

	video, err := this.GetVideoById(id)
	if err != nil {
		log.Errorf("Video not found: %v", err)
		return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Video not found"})
	}

	return video, nil
}

func (this *Repository) DeleteVideo(id string) error {
	docID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	filter := bson.M{"_id": docID}

	_, err = this.VideoColl.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}

	return nil
}

//
//func modifyVideo(ctx context.Context, id string, reqBody io.ReadCloser, collection *mongo.Collection) (Video, error) {
//	var video Video
//	docID, err := primitive.ObjectIDFromHex(id)
//	if err != nil {
//		log.Errorf("Cannot convert to objectID: %v", err)
//		return video, err
//	}
//	filter := bson.M{"_id": docID}
//	res := collection.FindOne(ctx, filter)
//
//	if err := res.Decode(&video); err != nil {
//		log.Errorf("Unable to decode to video: %v", err)
//		return video, err
//	}
//
//	if err := json.NewDecoder(reqBody).Decode(&video); err != nil {
//		log.Errorf("Unable decode using request body: %v", err)
//		return video, err
//	}
//
//	if err := v.Struct(video); err != nil {
//		log.Errorf("Unable to validate the struct: %v", err)
//		return video, err
//	}
//
//	_, err = collection.UpdateOne(ctx, filter, bson.M{"$set": video})
//	if err != nil {
//		log.Errorf("Unable to update the video: %v", err)
//		return video, err
//	}
//
//	return video, nil
//}
//
//func insertVideo(ctx context.Context, videos []Video, collection *mongo.Collection) ([]interface{}, *echo.HTTPError) {
//	var insertedIds []interface{}
//	for _, video := range videos {
//		id, err := collection.InsertOne(ctx, video)
//		if err != nil {
//			log.Errorf("Unable to store in database: %s", err)
//			return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "unable to insert to database"})
//		}
//		insertedIds = append(insertedIds, id.InsertedID)
//	}
//	return insertedIds, nil
//}
//
//
