package handler

import (
	"context"
	"dronegraphy/backend/repository/model"
	"firebase.google.com/go/v4/auth"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"net/http"
)

func (this *Handler) GetUser(c echo.Context) error {

	if err := this.repository.FirebaseApp.VerifyUser(c); err != nil {
		return err
	}

	user, err := this.repository.GetUserById(c.Param("id"))
	if err != nil {
		log.Errorf("Unable to find User: %v", err)
		return err
	}

	if err = UpdateRoles(this.repository.FirebaseApp.Client, user); err != nil {
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

// Get Roles from Database and updates the JWT Token Claims
func UpdateRoles(client *auth.Client, user *model.User) error {

	claims := map[string]interface{}{
		"admin":   user.Roles.Admin,
		"creator": user.Roles.Creator,
		"member":  user.Roles.Member,
	}

	if err := client.SetCustomUserClaims(context.Background(), user.ID.Hex(), claims); err != nil {
		log.Fatal(err)
		return err
	}

	return nil
}

//
//func (this *Handler) DeleteUser(c echo.Context) error {
//	return nil
//}
