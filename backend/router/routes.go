package router

import (
	"dronegraphy/backend/handler"
	mw "dronegraphy/backend/router/middleware"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

// Register the routes
func (this *Router) RegisterRoutes(rootGroup *echo.Group) {
	// Handler
	controller, err := handler.NewHandler(this.Echo, this.Enforcer)
	if err != nil {
		log.Fatal("failed to create handler")
		return
	}

	// Admin Endpoints
	rootGroup.GET("/users", controller.GetUsers)

	// Creator Endpoints
	rootGroup.POST("/videos", controller.UploadVideo, mw.Auth())
	//e.PUT("/videos/:id", h.UpdateVideo, middleware.BodyLimit("1M"), customMiddleware.Auth())
	//e.DELETE("/videos/:id", h.DeleteVideo, customMiddleware.Auth())

	// Member Endpoints
	rootGroup.POST("/users", controller.Register)
	rootGroup.GET("/users/:id", controller.GetUser, mw.Auth())
	rootGroup.PUT("/users/:id", controller.UpdateUser, mw.Auth())
	rootGroup.POST("/users/:id", controller.UploadPhoto, mw.Auth())
	rootGroup.GET("/photo/:id", controller.GetPhoto)

	//// Public Endpoints
	//e.GET("/videos", controller.GetVideos)
	//e.GET("/videos/:id", controller.GetVideo)

}
