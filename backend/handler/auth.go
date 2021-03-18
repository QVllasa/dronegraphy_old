package handler

import (
	"dronegraphy/backend/repository/model"
	"fmt"
	"github.com/labstack/echo/v4"
	"net/http"
)

func (this *Handler) Register(c echo.Context) error {

	password := fmt.Sprintf("%v", c.Request().Header.Get("Pw"))
	fmt.Println(password)

	if password == "" {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, "no password found")
	}

	newUser := model.Member{}

	//Set Default Role
	newUser.Role = "ROLE_MEMBER"

	if err := this.bindAndValidateRequest(c, &newUser); err != nil {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, err.Error())
	}

	if err := this.service.Register(&newUser, password); err != nil {
		return c.JSON(http.StatusUnprocessableEntity, err.Error())
	}

	return c.JSON(http.StatusOK, newUser)
}
