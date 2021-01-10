package handler

import (
	"context"
	"dronegraphy/backend/repository/model"
	"dronegraphy/backend/service"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"github.com/rs/xid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type VideoResponse struct {
	TotalCount int64         `json:"totalcount"`
	TotalPages int           `json:"totlapages"`
	Page       int64         `json:"page"`
	Limit      int64         `json:"limit"`
	Count      int           `json:"count"`
	Videos     []model.Video `json:"videos,omitempty"`
}

func (this *Handler) CreateVideo(c echo.Context) error {

	token, _ := this.service.FirebaseApp.GetAndVerifyToken(c)

	u, _ := this.repository.GetUserById(token.UID)

	video := &model.Video{
		Creator: model.Creator{
			UID:       u.UID,
			FirstName: u.FirstName,
			LastName:  u.LastName,
		},
	}

	if err := c.Bind(&video); err != nil {
		log.Errorf("Unable to bind : %v", err)
		return echo.NewHTTPError(http.StatusUnprocessableEntity, "Binding Error: unable to parse request payload")
	}

	if err := c.Validate(video); err != nil {
		log.Errorf("Unable to validate the payload %+v %v", video, err)
		return c.JSON(http.StatusUnprocessableEntity, "Validation Error: unable to parse request payload")
	}

	if err := this.repository.CreateVideo(video, token.UID); err != nil {
		log.Error(err)
		return c.JSON(http.StatusInternalServerError, "Unable to store video")
	}

	return c.JSON(http.StatusOK, video)

}

func (this *Handler) UpdateVideo(c echo.Context) error {

	video, err := this.repository.UpdateVideo(c.Param("id"), c.Request().Body)
	if err != nil {
		log.Errorf("Unable to update Video: %v", err)
		return err
	}

	return c.JSON(http.StatusOK, video)
}

func (this *Handler) UploadThumbnail(c echo.Context) error {

	id := c.Param("id")

	vID, _ := primitive.ObjectIDFromHex(id)

	file, err := c.FormFile("thumbnail")
	if err != nil {
		return c.JSON(http.StatusBadRequest, "thumbnail is missing")
	}

	//Validate File of type image
	if !strings.Contains(file.Header["Content-Type"][0], "image") {
		return c.JSON(http.StatusBadRequest, "Content-Type not supported")
	}

	fileID := xid.New().String()
	//target := service.StorageRoot + service.Videos + id + service.Thumbnail
	target := service.StorageRoot + service.Thumbnails

	f, _ := this.service.SaveImage(file, target, fileID, false, true)

	fileName := filepath.Base(f.Name())

	filter := bson.M{"_id": vID}
	update := bson.D{{"$set", bson.D{{"thumbnail", fileName}}}}

	_, err = this.repository.VideoColl.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Error(err)
		os.Remove(f.Name())
		return c.JSON(http.StatusInternalServerError, "unable to set fileID")
	}

	fmt.Println(fileName)

	return c.JSON(http.StatusOK, fileName)
}

//TODO finish file uploads
func (this *Handler) UploadVideoFiles(c echo.Context) error {

	id := c.Param("id")
	docID, _ := primitive.ObjectIDFromHex(id)

	video, err := this.repository.GetVideoById(id)
	if err != nil {
		log.Error(err)
		return err
	}

	if video.StorageRef != "" {
		if err = os.RemoveAll(service.StorageRoot + service.Videos + video.StorageRef); err != nil {
			log.Error(err)
			return err
		}
	}

	// Multipart form
	form, err := c.MultipartForm()
	if err != nil {
		return err
	}
	files := form.File["videoFiles[]"]

	fileID := xid.New().String()
	target := service.StorageRoot + service.Videos

	fileList, err := this.service.SaveVideoFiles(files, target, fileID)
	if err != nil {
		log.Error(err)
		return err
	}

	filter := bson.M{"_id": docID}
	_, err = this.repository.VideoColl.UpdateOne(context.Background(), filter,
		bson.D{
			{"$set",
				bson.D{
					{"storageRef", fileID},
					{"storageContent", fileList}}},
		})
	if err != nil {
		log.Error(err)
		return err
	}

	video, err = this.repository.GetVideoById(id)
	if err != nil {
		log.Error(err)
		return err
	}

	return c.JSON(http.StatusOK, video)
}

func (this *Handler) GetVideo(c echo.Context) error {

	video, err := this.repository.GetVideoById(c.Param("id"))
	if err != nil {
		log.Errorf("Unable to find video: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "video not found")
	}
	return c.JSON(http.StatusOK, video)
}

func (this *Handler) GetVideos(c echo.Context) error {

	page, _ := strconv.ParseInt(c.QueryParam("page"), 10, 64)
	limit, _ := strconv.ParseInt(c.QueryParam("limit"), 10, 64)

	// Defaults
	if page == 0 {
		page = 1
	}
	if limit == 0 {
		limit = 30
	}

	var response VideoResponse

	filter := bson.M{}

	if c.Param("id") != "" {
		fmt.Println(c.Param("id"))
		filter = bson.M{"creator.uid": c.Param("id")}
	}

	response.Videos, _ = this.repository.GetVideos(page, limit, filter)

	response.TotalCount, _ = this.repository.VideoColl.CountDocuments(context.Background(), filter)

	response.TotalPages = int(math.Round(float64(response.TotalCount) / float64(limit)))
	response.Limit = limit
	response.Page = page
	response.Count = len(response.Videos)

	return c.JSON(http.StatusOK, response)
}

func (this *Handler) DeleteVideo(c echo.Context) error {

	video, _ := this.repository.GetVideoById(c.Param("id"))

	err := this.repository.DeleteVideo(c.Param("id"))
	if err != nil {
		return err
	}

	_ = this.service.DeleteThumbnail(video.Thumbnail)

	return c.JSON(http.StatusOK, video.ID.Hex()+" deleted")
}

//func (this *Handler) ServeHls(c echo.Context) error{
//
//	id := c.Param("id")
//
//
//
//
//	return c.File()
//}

//func (this *Handler) UpdateVideo(c echo.Context) error {
//	video, err := modifyVideo(context.Background(), c.Param("id"), c.Request().Body, this.Coll)
//	if err != nil {
//		return err
//	}
//	return c.JSON(http.StatusOK, video)
//}

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
