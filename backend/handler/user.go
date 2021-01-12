package handler

import (
	"context"
	"dronegraphy/backend/repository/model"
	"dronegraphy/backend/service"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"github.com/rs/xid"
	"go.mongodb.org/mongo-driver/bson"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func (this *Handler) GetUser(c echo.Context) error {

	user, err := this.repository.GetUserById(c.Param("id"))
	if err != nil {
		log.Errorf("Unable to find User: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "user not found")
	}

	if err = this.service.FirebaseApp.UpdateRoleClaims(&user); err != nil {
		log.Error(err)
		return err
	}

	return c.JSON(http.StatusOK, user)
}

func (this *Handler) UpdateUser(c echo.Context) error {

	// Update User in database
	user, err := this.repository.UpdateUser(c.Param("id"), c.Request().Body)
	if err != nil {
		log.Errorf("Unable to update User: %v", err)
		return err
	}

	return c.JSON(http.StatusOK, user)
}

func (this *Handler) GetUsers(c echo.Context) error {

	users, err := this.repository.GetAllUsers()
	if err != nil {
		log.Error(err)
		return err
	}

	if len(users) == 0 {
		return echo.NewHTTPError(http.StatusOK, "No Users found")
	}

	return c.JSON(http.StatusOK, users)
}

func (this *Handler) UploadPhoto(c echo.Context) error {

	token, _ := this.service.FirebaseApp.GetAndVerifyToken(c)

	file, err := c.FormFile("file")
	if err != nil {
		log.Fatal(err)
	}

	//Validate File of type image
	if !strings.Contains(file.Header["Content-Type"][0], "image") {
		return c.JSON(http.StatusBadRequest, "Content-Type not supported")
	}

	fileID := xid.New().String()
	target := service.StorageRoot + service.Creator + "/" + token.UID + service.ProfileImage

	f, err := this.service.SaveImage(file, target, fileID, true, false)

	fileName := filepath.Base(f.Name())

	filter := bson.M{"uid": token.UID}
	update := bson.D{{"$set", bson.D{{"profileImage", fileName}}}}

	_, err = this.repository.UserColl.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Error(err)
		os.Remove(f.Name())
		return c.JSON(http.StatusInternalServerError, "unable to set fileID")
	}

	return c.JSON(http.StatusOK, fileName)
}

func (this *Handler) GetPhoto(c echo.Context) error {

	var allFiles []string
	var user model.User

	id := c.Param("id")

	res := this.repository.UserColl.FindOne(context.Background(), bson.M{"profileImage": id})
	if err := res.Decode(&user); err != nil {
		log.Error(err)
		return c.JSON(http.StatusNotFound, "image not found")
	}

	src := service.StorageRoot + service.Creator + "/" + user.UID + service.ProfileImage
	err := filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		allFiles = append(allFiles, path)
		return nil
	})
	if err != nil {
		panic(err)
	}
	for _, file := range allFiles {
		if strings.Contains(file, id) {
			return c.File(file)
		}
	}

	return c.JSON(http.StatusNotFound, "not found")
}
