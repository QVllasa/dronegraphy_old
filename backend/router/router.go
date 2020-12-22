package router

import (
	"context"
	"dronegraphy/backend/util"
	"fmt"
	"github.com/casbin/casbin/v2"
	mongodbadapter "github.com/casbin/mongodb-adapter/v3"
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

	// Logging
	this.Echo.Logger.SetLevel(log.DEBUG)
	//if debug, _ := strconv.ParseBool(util.GetEnvOrDefault("DEBUG", "false")); debug {
	//	this.Echo.Logger.SetLevel(log.DEBUG)
	//}

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

	// Casbin enforcer (RBAC)
	adapter, _ := mongodbadapter.NewAdapter("mongodb://localhost:27017")
	enforcer, err := casbin.NewEnforcer("/Users/qendrimvllasa/Projects/dronegraphy/backend/config/rbac_with_all_pattern_model.conf", adapter)
	if err != nil {
		log.Fatal(err)
	}
	_ = enforcer.LoadPolicy()
	this.Enforcer = enforcer
	//this.Echo.Use(mw.CasbinMiddleware(enforcer))

	return this
}

// Start the server
func (this *Router) Run() {
	// Start server
	//go func() {
	fmt.Println(fmt.Sprintf("[Router] Trying to start a server at %s:%s", util.GetEnvOrDefault("HOST", "0.0.0.0"), util.GetEnvOrDefault("PORT", "80")))
	if err := this.Echo.Start(fmt.Sprintf("%s:%s", "localhost", "8080")); err != nil {
		this.Echo.Logger.Info("Shutting down the server...")
	}
	//}()
}

//
//e.Logger.Printf("Listening on %v:%v", db.Cfg.Host, db.Cfg.Port)
//e.Logger.Fatal(e.Start(fmt.Sprintf("%s:%s", db.Cfg.Host, db.Cfg.Port)))

//
func (this *Router) Shutdown(ctx context.Context) {
	// return this.Echo.Shutdown(ctx)
	if err := this.Echo.Shutdown(ctx); err != nil {
		this.Echo.Logger.Fatal(err)
	}
}
