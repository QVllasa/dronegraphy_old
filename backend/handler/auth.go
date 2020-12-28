package handler

import (
	"dronegraphy/backend/repository/model"
	"github.com/labstack/echo/v4"
	"net/http"
)

func (this *Handler) Register(c echo.Context) error {

	newUser := model.User{}

	//Set Default Role
	newUser.Role = "ROLE_MEMBER"

	if err := this.bindAndValidateRequest(c, &newUser); err != nil {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, err.Error())
	}

	if err := this.service.Register(&newUser); err != nil {
		return c.JSON(http.StatusUnprocessableEntity, err.Error())
	}

	return c.JSON(http.StatusOK, newUser)
}
