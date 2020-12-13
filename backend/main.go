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
	//
	//file := os.Args[1] //os.Args[1] = testfile.zip
	//filename := path.Base(file)
	//UploadFile(file, filename)

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
	e.GET("/assets/:id", controller.GetPhoto, middleware.Static("/assets"))

	//// Public Endpoints
	//e.GET("/videos", controller.GetVideos)
	//e.GET("/videos/:id", controller.GetVideo)

	e.Logger.Printf("Listening on %v:%v", db.Cfg.Host, db.Cfg.Port)
	e.Logger.Fatal(e.Start(fmt.Sprintf("%s:%s", db.Cfg.Host, db.Cfg.Port)))
}

// Testing
//
//func InitiateMongoClient() *mongo.Client {
//	var err error
//	var client *mongo.Client
//	uri := "mongodb://localhost:27017"
//	opts := options.Client()
//	opts.ApplyURI(uri)
//	opts.SetMaxPoolSize(5)
//	if client, err = mongo.Connect(context.Background(), opts); err != nil {
//		fmt.Println(err.Error())
//	}
//	return client
//}
//
//func UploadFile(file, filename string) {
//
//	data, err := ioutil.ReadFile(file)
//	if err != nil {
//		log.Fatal(err)
//	}
//	conn := InitiateMongoClient()
//	bucket, err := gridfs.NewBucket(
//		conn.Database("myfiles"),
//	)
//	if err != nil {
//		log.Fatal(err)
//		os.Exit(1)
//	}
//	uploadStream, err := bucket.OpenUploadStream(
//		filename,
//	)
//	if err != nil {
//		fmt.Println(err)
//		os.Exit(1)
//	}
//	defer uploadStream.Close()
//
//	fileSize, err := uploadStream.Write(data)
//	if err != nil {
//		log.Fatal(err)
//		os.Exit(1)
//	}
//	log.Printf("Write file to DB was successful. File size: %d M\n", fileSize)
//}
