package service

import (
	"context"
	"dronegraphy/backend/repository/model"
	"dronegraphy/backend/util"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"google.golang.org/api/option"
	"net/http"
	"path/filepath"
)

type FirebaseClient struct {
	App    *firebase.App
	Client *auth.Client
}

var FbClient *FirebaseClient

func NewFirebaseClient() (this *FirebaseClient, err error) {
	this = new(FirebaseClient)

	fmt.Println("New FirebaseClient")

	//Check if serviceAccountKey file exists
	serviceAccountKeyFilePath, err := filepath.Abs("./backend/serviceAccountKey.json")
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

	this.App = app

	// Instantiate Client for using Firebase API
	client, err := app.Auth(context.Background())
	if err != nil {
		return nil, err
	}

	this.Client = client

	FbClient = this

	return this, nil
}

// Get token as struct to read claims
func (this *FirebaseClient) GetAndVerifyToken(c echo.Context) (*auth.Token, error) {

	// Get token
	idToken, err := util.GetTokenFromRequest(c)
	if err != nil {
		log.Error(err)
		return nil, err
	}

	// Verify bearer token
	token, err := this.Client.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		log.Info("no token found, continue as anonymous")
		return nil, err
	}

	c.Set("token", token)

	return token, nil
}

func (this *FirebaseClient) CheckPermission(c echo.Context) error {

	token, err := this.GetAndVerifyToken(c)
	if err != nil {
		log.Errorf("invalid token: %v", err)
		return echo.NewHTTPError(http.StatusForbidden, "invalid token")
	}

	claims := token.Claims
	if c.Param("id") != claims["user_id"] {
		log.Errorf("cannot match ids: %v", err)
		return echo.NewHTTPError(http.StatusForbidden, "action not allowed")
	}

	return nil
}

func (this *FirebaseClient) isEmailVerified(c echo.Context) (bool, error) {

	token, err := this.GetAndVerifyToken(c)
	if err != nil {
		log.Errorf("invalid token: %v", err)
		return false, echo.NewHTTPError(http.StatusForbidden, "invalid token")
	}

	claims := token.Claims
	if claims["email_verified"] == false {
		log.Errorf("email is not verified: %v", err)
		return false, echo.NewHTTPError(http.StatusForbidden, "email not verified")
	}

	return true, nil
}

func (this *FirebaseClient) UpdateRoleClaims(user *model.User) error {

	claims := map[string]interface{}{
		"role": user.Role,
	}

	if err := this.Client.SetCustomUserClaims(context.Background(), user.UID, claims); err != nil {
		log.Errorf("setting custom claims failed: %v", err)
		return err
	}

	return nil
}
