package handler

import (
	"dronegraphy/backend/repository/model"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"net/http"
)

//If User does not exist, store User Struct in database

func (this *Handler) Register(c echo.Context) error {
	var newUser model.User
	c.Echo().Validator = &UserValidator{Validator: v}

	if err := c.Bind(&newUser); err != nil {
		log.Errorf("Unable to bind : %v", err)
		return echo.NewHTTPError(http.StatusUnprocessableEntity, ErrorMessage{Message: "Binding Error: unable to parse request payload"})
	}

	if err := c.Validate(newUser); err != nil {
		log.Errorf("Unable to validate the product %+v %v", newUser, err)
		return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{Message: "Validation Error: unable to parse request payload"})
	}

	err := this.repository.CreateUser(&newUser)
	if err != nil {
		log.Errorf("Unable to create User %+v %v", newUser, err)
		return err
	}

	return c.JSON(http.StatusOK, newUser)
}
