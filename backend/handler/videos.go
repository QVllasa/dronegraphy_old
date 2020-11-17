package handler

import (
	"github.com/go-playground/validator/v10"
	"github.com/kamva/mgm/v3"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"net/http"
)

type ErrorMessage struct {
	Message string `json:"message"`
}

type VideoHandler struct {
	Coll mgm.Collection
}

type (
	Video struct {
		mgm.DefaultModel `bson:",inline"`
		Titles           string   `json:"titles" bson:"titles" validate:"required"`
		Location         string   `json:"location" bson:"location" validate:"required"`
		Formats          []string `json:"formats" bson:"formats" validate:"required"`
		Resolution       string   `json:"resolution" bson:"resolution" validate:"required"`
		Length           int      `json:"length" bson:"length" validate:"required"`
		FPS              int      `json:"fps" bson:"fps" validate:"required"`
		Camera           string   `json:"camera" bson:"camera" validate:"required"`
		//Tags       []string           `json:"tags" bson:"tags"`
		//Sell       bool               `json:"sell" bson:"sell"`
		//Downloads  int                `json:"downloads" bson:"downloads"`
		//Views      int                `json:"views" bson:"views"`
	}

	VideoValidator struct {
		Validator *validator.Validate
	}
)

func (this *VideoValidator) Validate(i interface{}) error {
	return this.Validator.Struct(i)
}

func InsertVideo(videos []Video, collection mgm.Collection) ([]interface{}, *echo.HTTPError) {
	var insertedIds []interface{}
	for _, video := range videos {
		id, err := collection.InsertOne(mgm.Ctx(), video)
		if err != nil {
			log.Printf("Unable to store in database: %s", err)
			return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "unable to insert to database"})
		}
		insertedIds = append(insertedIds, id.InsertedID)
	}

	return insertedIds, nil
}

func (this *VideoHandler) CreateVideos(c echo.Context) error {
	var videos []Video
	c.Echo().Validator = &VideoValidator{Validator: validator.New()}
	if err := c.Bind(videos); err != nil {
		log.Printf("Unable to bind : %v", err)
		return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{Message: "Binding Error: unable to parse request payload"})
	}
	for _, video := range videos {
		if err := c.Validate(video); err != nil {
			log.Errorf("Unable to validate the product %+v %v", video, err)
			return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{Message: "Validation Error: unable to parse request payload"})
		}
	}

	IDs, err := InsertVideo(videos, this.Coll)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, IDs)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
