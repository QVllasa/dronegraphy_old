package middleware

import (
	"context"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"google.golang.org/api/option"
	"path/filepath"
	"strings"
)

func Auth() echo.MiddlewareFunc {
	return authenticate
}

func InitAuthClient() (*auth.Client, error) {

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

	// Instantiate Client for using Firebase API
	client, err := app.Auth(context.Background())
	if err != nil {
		return nil, err
	}

	return client, nil
}

func authenticate(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		client, err := InitAuthClient()
		if err != nil {
			log.Fatal(err)
			return err
		}

		if _, err := VerifyToken(c, client); err != nil {
			log.Error(err)
			return err
		}

		return next(c)
	}
}

func VerifyToken(c echo.Context, client *auth.Client) (*auth.Token, error) {

	// Get token
	idToken, err := GetTokenFromRequest(c)
	if err != nil {
		log.Error(err)
		return nil, err
	}

	// Verify bearer token
	token, err := client.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		log.Error(err)
		return nil, err
	}

	c.Set("token", token)

	return token, nil
}

func GetTokenFromRequest(ctx echo.Context) (string, error) {

	// Get Bearer JWT Token from Header which comes from frontend
	authApp := ctx.Request().Header.Get("Authorization")
	idToken := strings.Replace(authApp, "Bearer ", "", 1)

	return idToken, nil
}
