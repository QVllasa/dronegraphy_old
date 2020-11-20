package main

import (
	"context"
	"dronegraphy/backend/config"
	"dronegraphy/backend/handler"
	customMiddleware "dronegraphy/backend/middleware"
	"fmt"
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	c         *mongo.Client
	db        *mongo.Database
	videoColl *mongo.Collection
	usersColl *mongo.Collection
	rolesColl *mongo.Collection
	cfg       config.Properties
)

//Init database and .env
func init() {

	if err := cleanenv.ReadEnv(&cfg); err != nil {
		log.Printf("Configuration cannot be read: %v", err)
	}
	connectURI := fmt.Sprintf("mongodb://%s:%s", cfg.DBHost, cfg.DBPort)

	// Default MongoDriver
	c, err := mongo.Connect(context.Background(), options.Client().ApplyURI(connectURI))
	if err != nil {
		log.Printf("Unable to connect to database: %v", err)
	}

	db = c.Database(cfg.DBName)
	videoColl = db.Collection(cfg.VideoCollection)
	usersColl = db.Collection(cfg.UsersCollection)
	rolesColl = db.Collection(cfg.RolesCollection)

	//Example of indexing email and make it unique
	isUserIndexUnique := true
	indexModel := mongo.IndexModel{
		Keys: bson.D{{"email", 1}},
		Options: &options.IndexOptions{
			Unique: &isUserIndexUnique,
		},
	}

	_, err = usersColl.Indexes().CreateOne(context.Background(), indexModel)
	if err != nil {
		log.Fatalf("Unable to create an index: %v", err)
	}

}

func main() {
	e := echo.New()
	e.Logger.SetLevel(log.DEBUG)
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		//AllowOrigins: []string{"*"},
		//AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
	e.Use()
	e.Pre(middleware.RemoveTrailingSlash())

	h := handler.VideoHandler{Coll: videoColl}
	u := handler.UsersHandler{Coll: usersColl}

	//Video Endpoints
	e.POST("/videos", h.CreateVideos, middleware.BodyLimit("1M"), customMiddleware.Auth())
	e.GET("/videos", h.GetAllVideos)
	e.PUT("/videos/:id", h.UpdateVideo, middleware.BodyLimit("1M"), customMiddleware.Auth())
	e.GET("/videos/:id", h.GetVideo)
	e.DELETE("/videos/:id", h.DeleteVideo, customMiddleware.Auth())

	//Users Endpoints
	e.POST("/users", u.SignUp)
	e.GET("/users/:id", u.GetUser, customMiddleware.Auth())
	e.GET("/users", u.GetAllUser, customMiddleware.Auth())

	e.Logger.Printf("Listening on %v:%v", cfg.Host, cfg.Port)
	e.Logger.Fatal(e.Start(fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)))
}

//Usage of Firebase Middleware Auth
//
//e.GET("/api/private", privateAPI, middleware.Auth())
//token := c.Get("token").(*auth.Token)
//claims := token.Claims
//name, ok := claims["name"].(string)
//email, ok := claims["email"].(string)
