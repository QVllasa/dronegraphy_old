/// Based on the echo-contrib package
/// Extended to support JWT users
package middleware

import (
	"dronegraphy/backend/service"
	"fmt"
	"github.com/casbin/casbin/v2"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
)

type (
	// Config defines the config for CasbinAuth middleware.
	Config struct {
		// Skipper defines a function to skip middleware.
		Skipper middleware.Skipper

		// Enforcer CasbinAuth main rule.
		// Required.
		Enforcer *casbin.Enforcer
	}
)

var (
	// DefaultConfig is the default CasbinAuth middleware config.
	DefaultConfig = Config{
		Skipper: middleware.DefaultSkipper,
	}
)

// Middleware returns a CasbinAuth middleware.
//
// For valid credentials it calls the next handler.
// For missing or invalid credentials, it sends "401 - Unauthorized" response.
func CasbinMiddleware(ce *casbin.Enforcer) echo.MiddlewareFunc {
	c := DefaultConfig
	c.Enforcer = ce
	return CasbinMiddlewareWithConfig(c)
}

// MiddlewareWithConfig returns a CasbinAuth middleware with config.
// See `Middleware()`.
func CasbinMiddlewareWithConfig(config Config) echo.MiddlewareFunc {
	// Defaults
	if config.Skipper == nil {
		config.Skipper = DefaultConfig.Skipper
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if config.Skipper(c) {
				return next(c)
			}

			//config.CheckPermission(c)

			if pass, err := config.CheckPermission(c); err == nil && pass {
				return next(c)
			} else if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
			}

			return echo.ErrForbidden
		}
	}
}

//
func (this *Config) getUserDataFromToken(c echo.Context) (token string, id string, error error) {

	idToken, err := service.FbClient.GetToken(c)
	if err != nil {
		return "ROLE_ANONYMOUS", "nil", err
	}

	fmt.Println("firebase token")

	return idToken.Claims["role"].(string), idToken.UID, nil
}

// CheckPermission checks the role/method/path combination from the request.
// Returns true (permission granted) or false (permission forbidden)
func (this *Config) CheckPermission(c echo.Context) (bool, error) {

	role, id, err := this.getUserDataFromToken(c)
	if err != nil {
		return false, err
	}

	fmt.Println(role, id)

	method := c.Request().Method
	path := c.Request().URL.Path

	fmt.Println(this.Enforcer.Enforce(role, path, method))

	return this.Enforcer.Enforce(role, path, method)
}

// Custom Matcher Function
//func isOwner(role string, id string, path string) bool {
//	i := strings.Index(path, id)
//	if i == -1 {
//		return key1 == key2
//	}
//
//	if len(key1) > i {
//		return key1[:i] == key2[:i]
//	}
//	return key1 == key2[:i]
//}
//
//func IsOwnerFunc(args ...interface{}) (interface{}, error) {
//	name1 := args[0].(string)
//	name2 := args[1].(string)
//
//	return (bool)(isOwner(name1, name2)), nil
//}
