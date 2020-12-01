package handler

//
//import (
//	"context"
//	"encoding/json"
//	"github.com/labstack/echo/v4"
//	"github.com/labstack/gommon/log"
//	"go.mongodb.org/mongo-driver/bson"
//	"go.mongodb.org/mongo-driver/bson/primitive"
//	"go.mongodb.org/mongo-driver/mongo"
//	"io"
//	"net/http"
//	"net/url"
//)
//
//
//
//
//
//func (this *Handler) DeleteVideo(c echo.Context) error {
//	delCount, err := deleteVideo(context.Background(), c.Param("id"), this.Coll)
//	if err != nil {
//		return err
//	}
//	return c.JSON(http.StatusOK, delCount)
//}
//
//func (this *Handler) GetVideo(c echo.Context) error {
//
//	video, err := findVideo(context.Background(), c.Param("id"), this.Coll)
//	if err != nil {
//		return err
//	}
//	return c.JSON(http.StatusOK, video)
//}
//
//func (this *Handler) UpdateVideo(c echo.Context) error {
//	video, err := modifyVideo(context.Background(), c.Param("id"), c.Request().Body, this.Coll)
//	if err != nil {
//		return err
//	}
//	return c.JSON(http.StatusOK, video)
//}
//
//func (this *Handler) GetAllVideos(c echo.Context) error {
//	videos, err := findAllVideos(context.Background(), c.QueryParams(), this.Coll)
//	if err != nil {
//		return err
//	}
//	return c.JSON(http.StatusOK, videos)
//}
//
//func (this *Handler) CreateVideos(c echo.Context) error {
//	var videos []Video
//	c.Echo().Validator = &VideoValidator{Validator: v}
//	if err := c.Bind(&videos); err != nil {
//		log.Errorf("Unable to bind : %v", err)
//		return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{Message: "Binding Error: unable to parse request payload"})
//	}
//	for _, video := range videos {
//		if err := c.Validate(video); err != nil {
//			log.Errorf("Unable to validate the product %+v %v", video, err)
//			return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{Message: "Validation Error: unable to parse request payload"})
//		}
//	}
//
//	IDs, err := insertVideo(context.Background(), videos, this.Coll)
//	if err != nil {
//		return err
//	}
//
//	return c.JSON(http.StatusOK, IDs)
//}
//
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
//func findVideo(ctx context.Context, id string, collection *mongo.Collection) (Video, error) {
//	var video Video
//	docID, err := primitive.ObjectIDFromHex(id)
//	if err != nil {
//		return video, err
//	}
//	res := collection.FindOne(ctx, bson.M{"_id": docID})
//	if err := res.Decode(&video); err != nil {
//		return video, err
//	}
//	return video, nil
//}
//
//func findAllVideos(ctx context.Context, q url.Values, collection *mongo.Collection) ([]Video, error) {
//	var videos []Video
//	filter := make(map[string]interface{})
//	for k, v := range q {
//		filter[k] = v[0]
//	}
//	if filter["_id"] != nil {
//		docID, err := primitive.ObjectIDFromHex(filter["_id"].(string))
//		if err != nil {
//			return videos, nil
//		}
//		filter["_id"] = docID
//	}
//
//	cursor, err := collection.Find(ctx, bson.M(filter))
//
//	if err != nil {
//		log.Errorf("Unable to fetch videos from database: %v", err)
//		return videos, err
//	}
//
//	if err := cursor.All(ctx, &videos); err != nil {
//		log.Errorf("Unable to read the cursor: %v", err)
//		return videos, err
//	}
//	return videos, nil
//}
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
