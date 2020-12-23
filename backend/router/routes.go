package router

import (
	"dronegraphy/backend/handler"
	mw "dronegraphy/backend/router/middleware"
	"github.com/casbin/casbin/v2"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

// Register the routes
func (this *Router) RegisterRoutes(routeGroup *echo.Group) {
	// Handler
	controller, err := handler.NewHandler(this.Echo, this.Enforcer)
	if err != nil {
		log.Fatal("failed to create handler")
		return
	}

	// Casbin enforcer (RBAC)
	//adapter, _ := mongodbadapter.NewAdapter("mongodb://localhost:27017")
	//enforcer, err := casbin.NewEnforcer("/Users/qendrimvllasa/Projects/dronegraphy/backend/config/rbac_model.conf", adapter)
	enforcer, err := casbin.NewEnforcer("/Users/qendrimvllasa/Projects/dronegraphy/backend/config/rbac_model.conf", "/Users/qendrimvllasa/Projects/dronegraphy/backend/config/policy.csv")
	if err != nil {
		log.Fatal(err)
	}
	_ = enforcer.LoadPolicy()
	this.Enforcer = enforcer

	// Admin Endpoints
	routeGroup.GET("/users", controller.GetUsers)

	// Creator Endpoints
	routeGroup.POST("/videos", controller.UploadVideo, mw.Auth(), mw.CasbinMiddleware(enforcer))
	//e.PUT("/videos/:id", h.UpdateVideo, middleware.BodyLimit("1M"), customMiddleware.Auth())
	//e.DELETE("/videos/:id", h.DeleteVideo, customMiddleware.Auth())

	// Member Endpoints
	routeGroup.POST("/users", controller.Register)
	routeGroup.GET("/users/:id", controller.GetUser, mw.Auth())
	routeGroup.PUT("/users/:id", controller.UpdateUser, mw.Auth())
	routeGroup.POST("/users/:id", controller.UploadPhoto, mw.Auth())
	routeGroup.GET("/photo/:id", controller.GetPhoto)

	//// Public Endpoints
	//e.GET("/videos", controller.GetVideos)
	routeGroup.GET("/videos/:id", controller.GetVideo)

}
