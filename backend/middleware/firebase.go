package middleware

import (
	"context"
	"dronegraphy/backend/handler"
	firebase "firebase.google.com/go/v4"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"google.golang.org/api/option"
	"net/http"
	"path/filepath"
	"strings"
)

func Auth() echo.MiddlewareFunc {
	return auth
}

func auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		//Check if serviceAccountKey file exists
		serviceAccountKeyFilePath, err := filepath.Abs("./serviceAccountKey.json")
		if err != nil {
			panic("Unable to load serviceAccountKeys.json file")
		}
		opt := option.WithCredentialsFile(serviceAccountKeyFilePath)

		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err != nil {
			return err
		}

		client, err := app.Auth(context.Background())
		if err != nil {
			return err
		}

		authApp := c.Request().Header.Get("Authorization")
		idToken := strings.Replace(authApp, "Bearer ", "", 1)
		token, err := client.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			log.Error(err)
			return c.JSON(http.StatusBadRequest, handler.ErrorMessage{Message: "invalid token"})
		}

		log.Printf("Verified ID token: %v\n", token)

		c.Set("token", token)

		fmt.Println(token)
		fmt.Println("Token verified!")

		return next(c)
	}
}
