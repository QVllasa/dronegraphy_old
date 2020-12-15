package main

import (
	"dronegraphy/backend/handler"
	"dronegraphy/backend/repository"
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

func main() {

	db := repository.NewDatabase()
	if db.Client != nil {
		defer db.Client.Disconnect(nil)
	}

	e := echo.New()
	e.Logger.SetLevel(log.DEBUG)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		//AllowOrigins: []string{"*"},
		//AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
	e.Use()
	e.Pre(middleware.RemoveTrailingSlash())

	controller, err := handler.NewHandler(e)
	if err != nil {
		log.Fatal("failed to create handler")
		return
	}

	// Admin Endpoints
	e.GET("/users", controller.GetUsers)

	// Creator Endpoints
	// e.GET("/creators")
	//e.POST("/videos", controller.CreateVideos, middleware.BodyLimit("1M"), customMiddleware.Auth())
	// e.PUT("/videos/:id", h.UpdateVideo, middleware.BodyLimit("1M"), customMiddleware.Auth())
	// e.DELETE("/videos/:id", h.DeleteVideo, customMiddleware.Auth())

	// Member Endpoints
	e.POST("/users", controller.Register)
	e.GET("/users/:id", controller.GetUser)
	e.PUT("/users/:id", controller.UpdateUser)
	e.POST("/users/:id", controller.UploadPhoto)
	e.GET("/photo/:id", controller.GetPhoto)

	//// Public Endpoints
	//e.GET("/videos", controller.GetVideos)
	//e.GET("/videos/:id", controller.GetVideo)

	e.Logger.Printf("Listening on %v:%v", db.Cfg.Host, db.Cfg.Port)
	e.Logger.Fatal(e.Start(fmt.Sprintf("%s:%s", db.Cfg.Host, db.Cfg.Port)))
}
