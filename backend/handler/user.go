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
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// Member Functions
func (this *Handler) GetUser(c echo.Context) error {

	user, err := this.repository.GetUser(c.Param("uid"))
	if err != nil {
		log.Errorf("Unable to find User: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "user not found")
	}

	if err = this.service.FirebaseApp.UpdateRoleClaims(user); err != nil {
		log.Error(err)
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

	if len(*users) == 0 {
		return echo.NewHTTPError(http.StatusOK, "No Users found")
	}

	return c.JSON(http.StatusOK, users)
}

func (this *Handler) UpdateUser(c echo.Context) error {

	// TODO only owner can update
	uid := c.Param("uid")
	updates := make(map[string]interface{})

	if err := this.bindRequest(c, &updates); err != nil {
		log.Errorf("Unable decode using request body: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Unable to decode JSON")
	}

	// Update User in database
	user, err := this.repository.UpdateUser(uid, updates)
	if err != nil {
		log.Errorf("Unable to update User: %v", err)
		return err
	}

	return c.JSON(http.StatusOK, user)
}

// Creator Functions
func (this *Handler) GetCreators(c echo.Context) error {
	creators, err := this.repository.GetAllCreators()
	if err != nil {
		log.Error(err)
		return err
	}
	if len(*creators) == 0 {
		return echo.NewHTTPError(http.StatusOK, "No Creators found")
	}
	return c.JSON(http.StatusOK, creators)
}

// Returns either Userdata for Owner or for Public
func (this *Handler) GetCreator(c echo.Context) error {

	var creator *model.User
	id := c.Param("id")

	// If token is not present and id is not equal to token.UID,
	//then return small set of data of user (creator) for public access
	// else return whole data of a creator for owner access
	t, err := this.service.FirebaseApp.GetAndVerifyToken(c)

	// Public
	if err != nil || t.UID != id {
		log.Info(err)
		creator, err = this.repository.GetCreator(id)
		if err != nil {
			log.Error(err)
			return echo.NewHTTPError(http.StatusOK, "No Creator found")
		}
		//	Private
	} else if t.UID == id {
		creator, err = this.repository.GetUser(id)
		if err != nil {
			log.Error(err)
			return echo.NewHTTPError(http.StatusOK, "No User found")
		}
	}

	return c.JSON(http.StatusOK, creator)
}

func (this *Handler) UploadPhoto(c echo.Context) error {

	token, _ := this.service.FirebaseApp.GetAndVerifyToken(c)

	file, err := c.FormFile("file")
	if err != nil {
		log.Fatal(err)
		return c.JSON(http.StatusBadRequest, "no file in request")
	}

	//Validate File of type image
	if !strings.Contains(file.Header["Content-Type"][0], "image") {
		return c.JSON(http.StatusBadRequest, "Content-Type not supported")
	}

	fileID := xid.New().String()
	target := service.StorageRoot + service.Creator + "/" + token.UID + service.ProfileImage

	fmt.Println(target)
	f, err := this.service.SaveImage(file, target, fileID, true, false)
	if err != nil {
		log.Error(err)
		return c.JSON(http.StatusBadRequest, "something went wrong")
	}

	fileName := filepath.Base(f.Name())

	filter := bson.M{"uid": token.UID}
	update := bson.D{{"$set", bson.D{{"profileImage", fileName}}}}

	_, err = this.repository.UserColl.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Error(err)
		_ = os.Remove(f.Name())
		return c.JSON(http.StatusInternalServerError, "unable to set fileID")
	}

	return c.JSON(http.StatusOK, fileName)
}

func (this *Handler) GetProfileImage(c echo.Context) error {

	var allFiles []string
	var user model.User

	id := c.Param("fileName")

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
