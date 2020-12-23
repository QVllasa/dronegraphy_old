package handler

import (
	"context"
	"dronegraphy/backend/repository/model"
	"github.com/disintegration/imaging"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"github.com/rs/xid"
	"go.mongodb.org/mongo-driver/bson"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

var (
	assetRoot    = "backend/storage/"
	profileImage = "/profileImage/"
)

func (this *Handler) GetUser(c echo.Context) error {

	// TODO: use casbin instead
	//if err := this.service.FirebaseApp.CheckPermission(c); err != nil {
	//	return err
	//}

	user, err := this.repository.GetUserById(c.Param("id"))
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

func (this *Handler) UpdateUser(c echo.Context) error {

	// TODO: use casbin instead
	if err := this.service.FirebaseApp.CheckPermission(c); err != nil {
		return err
	}

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

	// TODO: use casbin instead
	if err := this.service.FirebaseApp.CheckPermission(c); err != nil {
		return err
	}

	file, err := c.FormFile("file")
	if err != nil {
		log.Fatal(err)
	}

	//Validate File of type image
	if !strings.Contains(file.Header["Content-Type"][0], "image") {
		return c.JSON(http.StatusBadRequest, "Content-Type not supported")
	}

	id := c.Param("id")

	src, err := file.Open()
	if err != nil {
		log.Fatal(err)
	}
	defer src.Close()

	baseDir := assetRoot + id + profileImage

	_ = os.MkdirAll(baseDir, 0777)

	// Open the directory and read all its files.
	dirRead, _ := os.Open(baseDir)
	dirFiles, _ := dirRead.Readdir(0)

	// Loop over the directory's files.
	for index := range dirFiles {
		fileHere := dirFiles[index]

		// Get name of file and its full path.
		nameHere := fileHere.Name()
		fullPath := baseDir + nameHere

		// Remove the file.
		if err := os.Remove(fullPath); err != nil {
			return nil
		}
	}

	fileID := xid.New().String()

	dst, err := os.Create(baseDir + fileID + "_" + file.Filename)
	if err != nil {
		log.Fatal(err)
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		log.Fatal(err)
		return c.JSON(http.StatusInternalServerError, "unable to save file")
	}

	imgSrc, err := imaging.Open(dst.Name())
	if err != nil {
		log.Fatalf("failed to open image: %v", err)
	}

	// Resize the cropped image to width = 160px preserving the aspect ratio.
	imgSrc = imaging.Resize(imgSrc, 0, 160, imaging.Lanczos)

	if err := imaging.Save(imgSrc, dst.Name()); err != nil {
		log.Error(err)
		return c.JSON(http.StatusInternalServerError, "failed to crop image")
	}

	filter := bson.M{"uid": id}
	update := bson.D{{"$set", bson.D{{"profileImage", fileID}}}}

	_, err = this.repository.UserColl.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Error(err)
		os.Remove(dst.Name())
		return c.JSON(http.StatusInternalServerError, "unable to set fileID")
	}

	return c.JSON(http.StatusOK, fileID)
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

	root := assetRoot + user.UID + profileImage
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
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
