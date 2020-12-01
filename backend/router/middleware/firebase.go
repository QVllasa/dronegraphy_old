package middleware

import (
	"dronegraphy/backend/repository"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"net/http"
)

func Auth() echo.MiddlewareFunc {
	return authenticate
}

func authenticate(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		client, err := repository.NewFirebaseClient()

		if err != nil {
			log.Error(err)
			return echo.NewHTTPError(http.StatusBadRequest, "no connection to firebase")
		}

		_, err = client.VerifyToken(c)
		if err != nil {
			log.Error(err)
			return echo.NewHTTPError(http.StatusBadRequest, "invalid token")
		}

		return next(c)
	}
}
