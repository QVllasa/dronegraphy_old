package middleware

import (
	"context"
	"dronegraphy/backend/handler"
	firebase "firebase.google.com/go/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"google.golang.org/api/option"
	"net/http"
	"path/filepath"
	"strings"
)

func InitFirebase() (*firebase.App, error) {

	//Check if serviceAccountKey file exists
	serviceAccountKeyFilePath, err := filepath.Abs("./serviceAccountKey.json")
	if err != nil {
		panic("Unable to load serviceAccountKeys.json file")
	}
	opt := option.WithCredentialsFile(serviceAccountKeyFilePath)

	// Create new Firebase Connection
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	return app, nil
}

func Auth() echo.MiddlewareFunc {
	return authorize
}

//func UpdateClaims() echo.MiddlewareFunc {
//	return updateClaims
//}

func authorize(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		app, err := InitFirebase()
		if err != nil {
			log.Fatal(err)
			return err
		}

		// Instantiate Client for using Firebase API
		client, err := app.Auth(context.Background())
		if err != nil {
			return err
		}

		idToken, err := GetTokenFromRequest(c)
		if err != nil {
			log.Error(err)
			return c.JSON(http.StatusBadRequest, handler.ErrorMessage{Message: "no token found"})
		}

		// Verify bearer token
		token, err := client.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			log.Error(err)
			return c.JSON(http.StatusBadRequest, handler.ErrorMessage{Message: "invalid token"})
		}

		c.Set("token", token)

		return next(c)
	}
}

func UpdateClaims(app *firebase.App, uid string, claims map[string]interface{}) error {

	client, err := app.Auth(context.Background())
	if err != nil {
		return err
	}

	if err := client.SetCustomUserClaims(context.Background(), uid, claims); err != nil {
		log.Fatal(err)
		return err
	}

	return nil
}

func GetTokenFromRequest(ctx echo.Context) (string, error) {

	// Get Bearer JWT Token from Header which comes from frontend
	authApp := ctx.Request().Header.Get("Authorization")
	idToken := strings.Replace(authApp, "Bearer ", "", 1)

	return idToken, nil
}
