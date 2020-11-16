package handler

import (
	"context"
	"dronegraphy/backend/dbiface"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"gopkg.in/go-playground/validator.v9"
	"net/http"
)

type ErrorMessage struct {
	Message string `json:"message"`
}

var (
	v = validator.New()
)

type Video struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title      string             `json:"title" bson:"title"`
	Location   string             `json:"location" bson:"location"`
	Formats    []string           `json:"formats" bson:"formats"`
	Resolution string             `json:"resolution" bson:"resolution"`
	Length     int                `json:"length" bson:"length"`
	FPS        int                `json:"fps" bson:"fps"`
	Camera     string             `json:"camera" bson:"camera"`
	//Tags       []string           `json:"tags" bson:"tags"`
	//Sell       bool               `json:"sell" bson:"sell"`
	//Downloads  int                `json:"downloads" bson:"downloads"`
	//Views      int                `json:"views" bson:"views"`
}

type VideoHandler struct {
	Col dbiface.CollectionAPI
}

type VideoValidator struct {
	validator *validator.Validate
}

func (p *VideoValidator) Validate(i interface{}) error {
	return p.validator.Struct(i)
}

func insertVideos(ctx context.Context, videos []Video, collection dbiface.CollectionAPI) ([]interface{}, *echo.HTTPError) {
	var insertedIds []interface{}
	for _, video := range videos {
		video.ID = primitive.NewObjectID()
		insertID, err := collection.InsertOne(ctx, video)
		if err != nil {
			log.Errorf("Unable to insert to Database: %v", err)
			return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "unable to insert to database"})
		}
		insertedIds = append(insertedIds, insertID.InsertedID)
	}
	return insertedIds, nil
}

// Create new videos on Mongodb database
func (h *VideoHandler) CreateVideos(c echo.Context) error {
	var videos []Video
	c.Echo().Validator = &VideoValidator{validator: v}
	if err := c.Bind(&videos); err != nil {
		log.Errorf("Unable to bind : %v", err)
		return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{Message: "unable to parse request payload"})
	}

	for _, video := range videos {
		if err := c.Validate(video); err != nil {
			log.Errorf("Unable to validate the product %+v %v", video, err)
			return err
		}
	}

	IDs, err := insertVideos(context.Background(), videos, h.Col)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, IDs)
}
