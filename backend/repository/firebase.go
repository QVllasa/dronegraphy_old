package repository

import (
	"context"
	"dronegraphy/backend/repository/model"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"google.golang.org/api/option"
	"net/http"
	"path/filepath"
	"strings"
)

type FirebaseClient struct {
	App    *firebase.App
	Client *auth.Client
}

var FbClient *FirebaseClient

func NewFirebaseClient() (this *FirebaseClient, err error) {
	this = new(FirebaseClient)

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

	return this, nil
}

func (this *FirebaseClient) VerifyToken(c echo.Context) (*auth.Token, error) {

	// Get token
	idToken, err := this.GetTokenFromRequest(c)
	if err != nil {
		log.Error(err)
		return nil, err
	}

	// Verify bearer token
	token, err := this.Client.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		log.Error(err)
		return nil, err
	}

	c.Set("token", token)

	return token, nil
}

func (this *FirebaseClient) GetTokenFromRequest(c echo.Context) (string, error) {

	// Get Bearer JWT Token from Header which comes from frontend
	authApp := c.Request().Header.Get("Authorization")
	idToken := strings.Replace(authApp, "Bearer ", "", 1)

	return idToken, nil
}

func (this *FirebaseClient) VerifyUser(c echo.Context) error {
	token, err := this.VerifyToken(c)
	if err != nil {
		log.Errorf("invalid token: %v", err)
		return echo.NewHTTPError(http.StatusForbidden, "invalid token")
	}

	claims := token.Claims
	//fmt.Println(claims["uid"].(string))
	//fmt.Println(c.Param("id"))
	if c.Param("id") != claims["user_id"] {
		log.Errorf("cannot match ids: %v", err)
		return echo.NewHTTPError(http.StatusForbidden, "action not allowed")
	}

	return nil
}

func (this *FirebaseClient) EmailVerified(c echo.Context) (bool, error) {

	token, err := this.VerifyToken(c)
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
		"roles": map[string]interface{}{
			"admin":   user.Roles.Admin,
			"creator": user.Roles.Creator,
			"member":  user.Roles.Member,
		},
	}

	if err := this.Client.SetCustomUserClaims(context.Background(), user.UID, claims); err != nil {
		log.Fatal(err)
		return err
	}

	return nil
}
