package handler

import (
	"dronegraphy/backend/repository/model"
	"dronegraphy/backend/service"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"net/http"
)

func (this *Handler) UploadVideo(c echo.Context) error {

	var video *model.Video

	token, _ := service.FbClient.GetAndVerifyToken(c)

	if err := c.Bind(&video); err != nil {
		log.Errorf("Unable to bind : %v", err)
		return echo.NewHTTPError(http.StatusUnprocessableEntity, "Binding Error: unable to parse request payload")
	}

	if err := c.Validate(video); err != nil {
		log.Errorf("Unable to validate the product %+v %v", video, err)
		return c.JSON(http.StatusUnprocessableEntity, "Validation Error: unable to parse request payload")
	}

	if err := this.repository.CreateVideo(video, token.UID); err != nil {
		log.Error(err)
		return c.JSON(http.StatusInternalServerError, "Unable to store video")
	}

	//file, err := c.FormFile("thumbnail")
	//if err != nil {
	//	log.Fatal(err)
	//}

	return c.JSON(http.StatusOK, video)

	//return c.JSON(http.StatusOK, "allowed")
}

func (this *Handler) GetVideo(c echo.Context) error {

	video, err := this.repository.GetVideoById(c.Param("id"))
	if err != nil {
		log.Errorf("Unable to find video: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "video not found")
	}
	return c.JSON(http.StatusOK, video)
}

//func (this *Handler) GetVideos(c echo.Context) error {
//	videos, err := this.repository.GetVideos()
//	if err != nil {
//		return err
//	}
//	return c.JSON(http.StatusOK, videos)
//}

//func (this *Handler) DeleteVideo(c echo.Context) error {
//	delCount, err := deleteVideo(context.Background(), c.Param("id"), this.Coll)
//	if err != nil {
//		return err
//	}
//	return c.JSON(http.StatusOK, delCount)
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
