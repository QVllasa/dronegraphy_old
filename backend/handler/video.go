package handler

import (
	"context"
	"dronegraphy/backend/repository/model"
	"dronegraphy/backend/service"
	"dronegraphy/backend/util"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"github.com/rs/xid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

type VideoResponse struct {
	TotalCount int64         `json:"totalcount"`
	TotalPages int           `json:"totalpages"`
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

	vID, err := this.repository.CreateVideo(video, token.UID)
	if err != nil {
		log.Error(err)
		return c.JSON(http.StatusInternalServerError, "Unable to store video")
	}

	return c.JSON(http.StatusOK, vID)

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

	return c.JSON(http.StatusOK, id)
}

func (this *Handler) UploadVideoFiles(c echo.Context) error {

	id := c.Param("id")
	docID, _ := primitive.ObjectIDFromHex(id)

	video, err := this.repository.GetVideoById(id)
	if err != nil {
		log.Error(err)
		return err
	}

	//user, err := this.repository.GetUserById(video.Creator.UID)
	//if err != nil {
	//	log.Error(err)
	//	return err
	//}

	if video.StorageRef != "" {
		if err = os.RemoveAll(service.StorageRoot + service.Videos + "/" + video.StorageRef); err != nil {
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
	channel := make(chan bool)

	fileList, data, err := this.service.SaveVideoFiles(files, fileID, channel)
	if err != nil {
		log.Error(err)
		return err
	}

	//Send Email when conversion is finished
	go func() {
		for {
			select {
			case <-channel:
				fmt.Println("Conversion Finished!")
				filter := bson.M{"_id": docID}
				_, err = this.repository.VideoColl.UpdateOne(context.Background(), filter,
					bson.D{
						{"$set",
							bson.D{
								{"converted", true}}},
					})
				this.service.SendEmail(
					//TODO generic -> replace with user.UID
					"qendrim.vllasa@gmail.com",
					1)
			}
		}
	}()

	fps, err := strconv.Atoi(strings.Replace(data.FirstVideoStream().AvgFrameRate, "/1", "", -1))
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
					{"length", data.Format.DurationSeconds},
					{"fps", fps},
					{"width", data.FirstVideoStream().Width},
					{"height", data.FirstVideoStream().Height},
					{"converted", false},
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

	return c.JSON(http.StatusOK, video.ID.Hex())
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
	categories := c.QueryParam("category")
	search := c.QueryParam("search")

	fmt.Println(categories)
	fmt.Println(search)

	// Defaults
	if page == 0 {
		page = 1
	}
	if limit == 0 {
		limit = 50
	}

	var response VideoResponse

	//filter := bson.M{}
	sorting := bson.M{}
	opt := options.Find()
	if limit != -1 {
		opt.SetSkip((page - 1) * limit)
		opt.SetLimit(limit)
	}

	switch sort, _ := strconv.ParseInt(c.QueryParam("sort"), 10, 64); sort {
	case 1:
		sorting = bson.M{"stuff_pick": true}
	case 2:
		opt.SetSort(bson.M{"createdAt": -1})
	case 3:
		sorting = bson.M{"sell": false}
	default:
		sorting = bson.M{}
	}

	// TODO build query with sorting, category and text search
	// Create indexes for all text search fields (title, location, camera etc.)
	// Example: {$and: [{$text: {$search:"port"}}, {sell: true}, {stuff_pick: true}]}
	// Example partial text search {$and: [{title: {$regex:"1"}}, {sell: true}, {stuff_pick: true}, {categories: {$all:[18]}}]}
	// Problem: partial text search works only on one field, which blows up the query while text search does not support partially text search
	filter := bson.M{"": sorting}

	if c.Param("id") != "" {
		fmt.Println(c.Param("id"))
		filter = bson.M{"creator.uid": c.Param("id")}
	}

	response.Videos, _ = this.repository.GetVideos(page, limit, filter, opt)

	response.TotalCount, _ = this.repository.VideoColl.CountDocuments(context.Background(), filter)

	response.TotalPages = int(math.Ceil(float64(response.TotalCount) / float64(limit)))
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

	_ = this.service.DeleteVideoFiles(video.StorageRef)

	return c.JSON(http.StatusOK, video.ID.Hex()+" deleted")
}

func (this *Handler) GetPlaylist(c echo.Context) error {
	id := c.Param("id")
	fmt.Println(id)
	filename := c.Param("file")
	return c.File(service.StorageRoot + service.Videos + "/" + id + "/hls/" + filename)
}

func (this *Handler) AddToFavorites(c echo.Context) error {
	token, err := this.service.FirebaseApp.GetAndVerifyToken(c)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "no token found")
	}

	u, err := this.repository.GetUserById(token.UID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "no user found")
	}

	u.FavoriteVideos = util.UniqueStringArray(append(u.FavoriteVideos, c.Param("id")))

	filter := bson.M{"uid": u.UID}
	u.UpdatedAt = time.Now()

	_, err = this.repository.UserColl.UpdateOne(context.Background(), filter, bson.M{"$set": u})
	if err != nil {
		log.Errorf("Unable to update the user: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Unable to add to favorites the User")
	}

	return c.JSON(http.StatusOK, u.FavoriteVideos)
}

func (this *Handler) RemoveFromFavorites(c echo.Context) error {
	token, err := this.service.FirebaseApp.GetAndVerifyToken(c)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "no token found")
	}

	u, err := this.repository.GetUserById(token.UID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "no user found")
	}

	u.FavoriteVideos = util.RemoveItemFromSlice(u.FavoriteVideos, c.Param("id"))

	filter := bson.M{"uid": u.UID}
	u.UpdatedAt = time.Now()

	_, err = this.repository.UserColl.UpdateOne(context.Background(), filter, bson.M{"$set": u})
	if err != nil {
		log.Errorf("Unable to update the user: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Unable to add to favorites the User")
	}

	return c.JSON(http.StatusOK, u.FavoriteVideos)
}

func (this *Handler) GetSortingOptions(c echo.Context) error {
	var f []model.SortOption

	f, err := this.repository.GetFilters()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "no filters found")
	}

	return c.JSON(http.StatusOK, f)
}
