package handler

import (
	"context"
	"dronegraphy/backend/repository/model"
	"dronegraphy/backend/service"
	"encoding/json"
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
)

type VideoResponse struct {
	TotalCount int64         `json:"totalcount"`
	TotalPages int           `json:"totalpages"`
	Key        int64         `json:"key,omitempty"`
	Page       int64         `json:"page,omitempty"`
	Limit      int64         `json:"limit,omitempty"`
	Count      int           `json:"count,omitempty"`
	Videos     []model.Video `json:"videos,omitempty"`
}

func (this *Handler) CreateVideo(c echo.Context) error {
	token, _ := this.service.FirebaseApp.GetAndVerifyToken(c)

	u, _ := this.repository.GetCreator(token.UID)

	video := &model.Video{
		Creator: model.User{
			Key:       u.Key,
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

	id := c.Param("id")
	updates := make(map[string]interface{})

	if err := this.bindRequest(c, &updates); err != nil {
		log.Errorf("Unable decode using request body: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Unable to decode JSON")
	}

	video, err := this.repository.UpdateVideo(id, updates)
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
		_ = os.Remove(f.Name())
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

	//user, err := this.repository.GetMemberById(video.Creator.UID)
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

// TODO get only published videos for public and all videos for owner
func (this *Handler) GetVideos(c echo.Context) error {

	page, err := strconv.ParseInt(c.QueryParam("page"), 10, 64)
	if err != nil {
		// Defaults
		page = 1
	}

	key, err := strconv.ParseInt(c.Param("key"), 10, 64)
	if err != nil {
		key = 0
	}

	limit, err := strconv.ParseInt(c.QueryParam("limit"), 10, 64)
	if err != nil {
		// Defaults
		limit = 50
	}

	categoryKeys := getCategoriesFromString(c.QueryParam("category"))

	search := c.QueryParam("search")

	// Options
	opt := options.Find()
	sortKey, err := strconv.ParseInt(c.QueryParam("sort"), 10, 64)
	if err != nil {
		fmt.Println("sortkey: ", err)
	}

	if limit != -1 {
		opt.SetSkip((page - 1) * limit)
		opt.SetLimit(limit)
	}
	if sortKey == 0 {
		opt.SetSort(bson.M{"downloads": -1})
	}
	if sortKey == 2 {
		opt.SetSort(bson.M{"createdAt": -1})
	}

	// Filter
	filter := map[string][]map[string]interface{}{}

	if search != "" {
		fmt.Println("search: ", search)
		filter["$and"] = append(filter["$and"], bson.M{"$text": bson.M{"$search": search}})
	}

	// Sortieren nach besondere Auswahl
	if sortKey == 1 {
		filter["$and"] = append(filter["$and"], bson.M{"stuff_pick": true})
	}

	// Sortieren nach Kostenlos
	if sortKey == 3 {
		filter["$and"] = append(filter["$and"], bson.M{"sell": false})
	}

	// All
	if sortKey == 4 {
		filter["$and"] = append(filter["$and"], bson.M{})
	}
	if len(categoryKeys) > 0 {
		var c []bson.M
		for _, j := range categoryKeys {
			fmt.Println(j)
			c = append(c, bson.M{"$elemMatch": bson.M{"$eq": j}})
		}

		f := bson.M{
			"categories": bson.M{
				"$all": c,
			},
		}
		filter["$and"] = append(filter["$and"], f)
	}

	var response VideoResponse

	if key != 0 {
		filter["$and"] = append(filter["$and"], bson.M{"creator.key": key})
		response.Key = key
	}

	// Load only published Videos
	filter["$and"] = append(filter["$and"], bson.M{"published": true})

	fmt.Println("final filter:", filter)

	response.Videos, err = this.repository.GetVideos(filter, opt)
	if err != nil {
		log.Error(err)
		return echo.NewHTTPError(http.StatusInternalServerError, "no videos found")
	}

	response.TotalCount, _ = this.repository.VideoColl.CountDocuments(context.Background(), filter)
	response.TotalPages = int(math.Ceil(float64(response.TotalCount) / float64(limit)))
	response.Limit = limit
	response.Page = page
	response.Count = len(response.Videos)

	return c.JSON(http.StatusOK, response)
}

func (this *Handler) GetVideosByOwner(c echo.Context) error {
	var response VideoResponse

	uid := c.Param("id")
	token, _ := this.service.FirebaseApp.GetAndVerifyToken(c)

	if token.UID != uid {
		log.Error("token UID != UID")
		return echo.NewHTTPError(http.StatusInternalServerError, "invalid token")
	}

	u, _ := this.repository.GetUser(token.UID)

	filter := bson.M{"creator.key": u.Key}
	opt := options.Find()

	videos, err := this.repository.GetVideos(filter, opt)
	if err != nil {
		log.Error(err)
		return err
	}

	response.Videos = videos
	response.TotalCount, _ = this.repository.VideoColl.CountDocuments(context.Background(), filter)
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

func (this *Handler) GetSortingOptions(c echo.Context) error {
	var f []model.SortOption

	f, err := this.repository.GetFilters()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "no filters found")
	}

	return c.JSON(http.StatusOK, f)
}

func getCategoriesFromString(categories string) []int64 {
	var c []int64
	var keys []int64
	_ = json.Unmarshal([]byte(categories), &keys)

	if len(keys) != 0 {
		for _, key := range keys {
			c = append(c, key)
		}
	}
	return c
}
