package handler

import (
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
