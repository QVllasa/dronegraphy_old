package handler

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

var (
	assetRoot = "backend/assets/"
)

func (this *Handler) GetUser(c echo.Context) error {

	if err := this.repository.FirebaseApp.VerifyUser(c); err != nil {
		return err
	}

	user, err := this.repository.GetUserById(c.Param("id"))
	if err != nil {
		log.Errorf("Unable to find User: %v", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "user not found")
	}

	if err = this.repository.FirebaseApp.UpdateRoleClaims(user); err != nil {
		log.Error(err)
		return err
	}

	return c.JSON(http.StatusOK, user)
}

func (this *Handler) UpdateUser(c echo.Context) error {

	if err := this.repository.FirebaseApp.VerifyUser(c); err != nil {
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

	users, err := this.repository.GetUsers()
	if err != nil {
		log.Error(err)
		return err
	}

	if len(users) == 0 {
		return echo.NewHTTPError(http.StatusOK, ErrorMessage{Message: "No Users found"})
	}

	return c.JSON(http.StatusOK, users)
}

func (this *Handler) UploadPhoto(c echo.Context) error {

	file, err := c.FormFile("file")
	if err != nil {
		log.Fatal(err)
	}

	id := c.Param("id")

	src, err := file.Open()
	if err != nil {
		log.Fatal(err)
	}
	defer src.Close()

	runes := []rune(id)
	// ... Convert back into a string from rune slice.
	dirID := string(runes[0:10])

	baseDir := assetRoot + dirID + "/"
	//Destination
	_ = os.MkdirAll(baseDir, 0777)

	dst, err := os.Create(baseDir + id + "_" + file.Filename)
	if err != nil {
		log.Fatal(err)
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		log.Fatal(err)
	}

	return c.JSON(http.StatusOK, dst.Name())
}

func (this *Handler) GetPhoto(c echo.Context) error {

	var allFiles []string

	id := c.Param("id")

	runes := []rune(id)
	dirID := string(runes[0:10])

	root := assetRoot + dirID
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
