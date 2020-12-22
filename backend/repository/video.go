package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
)

//func (this *Repository) UpdateVideo(id string, reqBody io.ReadCloser) (*model.Video, error) {
//
//	var video *model.Video
//	//user, err := this.GetUserById(id)
//	//if err != nil {
//	//	log.Errorf("User not found: %v", err)
//	//	return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "User not found"})
//	//}
//	//
//	//if err := json.NewDecoder(reqBody).Decode(&user); err != nil {
//	//	log.Errorf("Unable decode using request body: %v", err)
//	//	return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to decode JSON"})
//	//} else {
//	//	fmt.Printf("user: %v", user)
//	//}
//	//
//	////if err := handler.V.Struct(user); err != nil {
//	////	log.Errorf("Unable to validate the struct: %v", err)
//	////	return user, err
//	////}
//	//
//	//filter := bson.M{"uid": user.UID}
//	//
//	//_, err = this.UserColl.UpdateOne(context.Background(), filter, bson.M{"$set": user})
//	//if err != nil {
//	//	log.Errorf("Unable to update the user: %v", err)
//	//	return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to update the User"})
//	//}
//
//	return video, nil
//}

func (this *Repository) CreateVideo(model *model.Video, id string) error {

	ID, err := this.VideoColl.InsertOne(context.Background(), model)
	if err != nil {
		log.Errorf("Unable to store in database: %s", err)
		return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Video already exists"})
	}

	//TODO Hier ein Video einem Nutzer zuordnen

	res := this.VideoColl.FindOne(context.Background(), bson.M{"_id": ID.InsertedID})
	if err := res.Decode(&model); err != nil {
		log.Errorf("Unable to fetch Video ID: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to fetch Video ID"})
	}

	return nil
}

//func (this *Repository) GetVideos() ([]model.Video, error) {
//
//	var videos []model.Video
//	filter := make(map[string]interface{})
//	//for k, v := range q {
//	//	filter[k] = v[0]
//	//}
//	//if filter["_id"] != nil {
//	//	docID, err := primitive.ObjectIDFromHex(filter["_id"].(string))
//	//	if err != nil {
//	//		return videos, nil
//	//	}
//	//	filter["_id"] = docID
//	//}
//	cursor, err := this.VideoColl.Find(context.Background(), bson.M(filter))
//
//	if err != nil {
//		log.Errorf("Unable to fetch videos from database: %v", err)
//		return videos, err
//	}
//
//	if err := cursor.All(context.Background(), &videos); err != nil {
//		log.Errorf("Unable to read the cursor: %v", err)
//		return videos, err
//	}
//	return videos, nil
//}
//
//func (this *Repository) GetVideoById(id string) (*model.Video, error) {
//
//	var video model.Video
//	docID, err := primitive.ObjectIDFromHex(id)
//	if err != nil {
//		return &video, err
//	}
//	res := this.VideoColl.FindOne(context.Background(), bson.M{"_id": docID})
//	if err := res.Decode(&video); err != nil {
//		return &video, err
//	}
//	return &video, nil
//}

//func deleteVideo(ctx context.Context, id string, collection *mongo.Collection) (int64, error) {
//	docID, err := primitive.ObjectIDFromHex(id)
//	if err != nil {
//		return 0, err
//	}
//	res, err := collection.DeleteOne(ctx, bson.M{"_id": docID})
//	if err != nil {
//		return 0, err
//	}
//	return res.DeletedCount, nil
//}
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
