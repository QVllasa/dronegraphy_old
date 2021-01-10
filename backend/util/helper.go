package util

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
)

// Get an environment variable or return the default value
func GetEnvOrDefault(key string, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultValue
}

// Get Idtoken from request
func GetTokenFromRequest(c echo.Context) (string, error) {

	// Get Bearer JWT Token from Header which comes from frontend
	token := c.Request().Header.Get("Authorization")
	idToken := strings.Replace(token, "Bearer ", "", 1)

	return idToken, nil
}

func DownloadFile(URL, fileName string) error {
	//Get the response bytes from the url

	fmt.Println(URL)
	response, err := http.Get(URL)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		fmt.Println(response.StatusCode)
	}
	//Create a empty file
	file, err := os.Create(fileName)
	if err != nil {
		log.Error(err)
		return err
	}
	defer file.Close()

	//Write the bytes to the fiel
	_, err = io.Copy(file, response.Body)
	if err != nil {
		log.Error(err)
		return err
	}

	fmt.Println(file.Name())

	return nil
}

func SaveFile(file *multipart.FileHeader, target string) *os.File {
	// Source
	src, err := file.Open()
	if err != nil {
		log.Error(err)
	}
	defer src.Close()

	// Destination
	dst, err := os.Create(target)
	if err != nil {
		log.Error(err)
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		log.Error(err)
	}

	return dst
}
