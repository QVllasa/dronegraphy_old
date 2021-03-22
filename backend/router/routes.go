package router

import (
	"dronegraphy/backend/handler"
	mw "dronegraphy/backend/router/middleware"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"os"
)

// RegisterFirebaseUser the routes
func (this *Router) RegisterRoutes(routeGroup *echo.Group) {
	// Handler
	controller, err := handler.NewHandler(this.Echo, this.Enforcer)
	if err != nil {
		log.Fatal("failed to create handler")
		return
	}

	// ADMIN
	routeGroup.GET("/users", controller.GetUsers)

	// CREATOR
	routeGroup.POST("/videos", controller.CreateVideo, mw.Auth())
	//routeGroup.POST("/videos/:id", controller.UpdateVideo, mw.Auth())
	routeGroup.PUT("/videos/:id", controller.UpdateVideo, mw.Auth())
	routeGroup.DELETE("/videos/:id", controller.DeleteVideo, mw.Auth())
	routeGroup.POST("/thumbnails/:id", controller.UploadThumbnail, mw.Auth())
	routeGroup.POST("/video_files/:id", controller.UploadVideoFiles)
	routeGroup.POST("/photos", controller.UploadPhoto, mw.Auth())
	routeGroup.GET("/users/:id/videos", controller.GetVideosByOwner, mw.Auth())
	//e.PUT("/videos/:id", h.UpdateVideo, middleware.BodyLimit("1M"), customMiddleware.Auth())
	//e.DELETE("/videos/:id", h.DeleteVideo, customMiddleware.Auth())

	// USER
	routeGroup.GET("/users/:uid", controller.GetUser, mw.Auth())
	routeGroup.PATCH("/users/:uid", controller.UpdateUser, mw.Auth())
	//routeGroup.POST("/users/:id", controller.UploadPhoto, mw.Auth())

	//// PUBLIC
	routeGroup.POST("/register", controller.Register)
	routeGroup.GET("/videos", controller.GetVideos)
	routeGroup.GET("/videos/:id", controller.GetVideo)
	routeGroup.GET("/:id/hls/:file", controller.GetPlaylist)

	routeGroup.GET("/creators", controller.GetCreators)
	routeGroup.GET("/creators/:key/videos", controller.GetVideos)
	routeGroup.GET("/creators/:id", controller.GetCreator)
	routeGroup.GET("/categories", controller.GetCategories)
	//routeGroup.GET("/parent_categories", controller.GetParentCategories)
	routeGroup.GET("/sorting", controller.GetSortingOptions)
	routeGroup.GET("/profileImages/:fileName", controller.GetProfileImage)

	//// STATIC Endpoints
	dir, _ := os.Getwd()
	routeGroup.Static("/img", dir+"/backend/storage/thumbnails")

}
