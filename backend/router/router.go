package router

import (
	"context"
	"dronegraphy/backend/util"
	"fmt"
	"github.com/casbin/casbin/v2"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

//
type Router struct {
	Echo     *echo.Echo
	Enforcer *casbin.Enforcer
}

// Create a new Echo router and configure some middlewares
func NewRouter() (this *Router) {
	this = new(Router)
	this.Echo = echo.New()

	// go-playground/validation
	this.Echo.Validator = NewValidator()

	// Logging
	this.Echo.Logger.SetLevel(log.DEBUG)

	// Global middlewares
	this.Echo.Pre(middleware.RemoveTrailingSlash())

	this.Echo.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))

	this.Echo.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		//AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	}))

	return this
}

// Start the server
func (this *Router) Run() {
	// Start server
	go func() {
		fmt.Println(fmt.Sprintf("[Router] Trying to start a server at %s:%s", util.GetEnvOrDefault("HOST", "0.0.0.0"), util.GetEnvOrDefault("PORT", "80")))
		if err := this.Echo.Start(fmt.Sprintf("%s:%s", "localhost", "8080")); err != nil {
			this.Echo.Logger.Info("Shutting down the server...")
		}
	}()
}

func (this *Router) Shutdown(ctx context.Context) {
	// return this.Echo.Shutdown(ctx)
	if err := this.Echo.Shutdown(ctx); err != nil {
		this.Echo.Logger.Fatal(err)
	}
}
