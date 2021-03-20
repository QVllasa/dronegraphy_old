package handler

import (
	"dronegraphy/backend/repository/model"
	"fmt"
	"github.com/labstack/echo/v4"
	"net/http"
)

// Register User in Firebase and in store in Database
func (this *Handler) Register(c echo.Context) error {

	// Check if password is present
	password := fmt.Sprintf("%v", c.Request().Header.Get("Pw"))
	if password == "" {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, "no password found")
	}

	newUser := model.User{}

	//Set Default Role for new Users which will be added to token claims from Firebase
	newUser.Role = "ROLE_MEMBER"

	// Validate Request Body
	if err := this.bindAndValidateRequest(c, &newUser); err != nil {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, err.Error())
	}

	// Create User in Firebase
	user, err := this.service.RegisterFirebaseUser(&newUser, password)
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, err.Error())
	}

	// Create User in Database
	if err := this.repository.CreateUser(user); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, newUser)
}
