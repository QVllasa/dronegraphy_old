/// Based on the echo-contrib package
/// Extended to support JWT users
package middleware

import (
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
//func (this *Config) getUserIdFromToken(c echo.Context) string {
//	tokenUser, ok := c.Get("user").(*jwt.Token)
//	if !ok {
//		return ""
//	}
//	claims := tokenUser.Claims.(*service.JWTCustomClaims)
//	return strconv.Itoa(int(claims.Id))
//}

// GetUserName gets the user name from the request.
// Currently, only HTTP basic authentication is supported
func (this *Config) getUserName(c echo.Context) string {
	username, _, _ := c.Request().BasicAuth()
	return username
}

// CheckPermission checks the user/method/path combination from the request.
// Returns true (permission granted) or false (permission forbidden)
func (this *Config) CheckPermission(c echo.Context) (bool, error) {
	user := this.getUserName(c)
	//if user == "" {
	//	user = this.getUserFromJwtToken(c)
	//}
	method := c.Request().Method
	path := c.Request().URL.Path
	return this.Enforcer.Enforce(user, path, method)
}
