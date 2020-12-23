package util

import (
	"github.com/labstack/echo/v4"
	"os"
	"strings"
)

// Get an environment variable or return the default value
func GetEnvOrDefault(key string, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultValue
}

// Get Idtoken from request
func GetTokenFromRequest(c echo.Context) (string, error) {

	// Get Bearer JWT Token from Header which comes from frontend
	token := c.Request().Header.Get("Authorization")
	idToken := strings.Replace(token, "Bearer ", "", 1)

	return idToken, nil
}
