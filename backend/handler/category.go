package handler

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"net/http"
)

func (this *Handler) GetCategories(c echo.Context) error {
	categories, err := this.repository.GetAllCategories()
	if err != nil {
		log.Error(err)
		return err
	}

	if len(categories) == 0 {
		return echo.NewHTTPError(http.StatusOK, "No Categories found")
	}

	return c.JSON(http.StatusOK, categories)
}
