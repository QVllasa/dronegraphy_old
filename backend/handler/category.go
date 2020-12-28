package handler

import (
	"dronegraphy/backend/repository/model"
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

func (this *Handler) CreateCategory(c echo.Context) error {

	var category *model.Category

	if err := c.Bind(&category); err != nil {
		log.Errorf("Unable to bind : %v", err)
		return echo.NewHTTPError(http.StatusUnprocessableEntity, "Binding Error: unable to parse request payload")
	}

	if err := c.Validate(category); err != nil {
		log.Errorf("Unable to validate the category %+v %v", category, err)
		return c.JSON(http.StatusUnprocessableEntity, "Validation Error: unable to parse request payload")
	}

	if err := this.repository.CreateCategory(category); err != nil {
		log.Error(err)
		return c.JSON(http.StatusInternalServerError, "Unable to store category")
	}

	return c.JSON(http.StatusOK, category)
}
