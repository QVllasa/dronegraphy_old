package main

import (
	"dronegraphy/backend/config"
	"dronegraphy/backend/handler"
	"fmt"
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/kamva/mgm/v3"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

var (
	c    *mongo.Client
	db   *mongo.Database
	coll mgm.Collection
	cfg  config.Properties
)

//Init database and .env
func init() {
	if err := cleanenv.ReadEnv(&cfg); err != nil {
		log.Printf("Configuration cannot be read: %v", err)
	}
	connectURI := fmt.Sprintf("mongodb://%s:%s", cfg.DBHost, cfg.DBPort)

	// Setup mgm default config using ODM
	err := mgm.SetDefaultConfig(&mgm.Config{CtxTimeout: 12 * time.Second}, cfg.DBName, options.Client().ApplyURI(connectURI))
	if err != nil {
		log.Printf("Unable to connect to database: %v", err)
	}

	// Default MongoDriver
	//c, err := mongo.Connect(context.Background(), options.Client().ApplyURI(connectURI))
	//if err != nil {
	//	log.Printf("Unable to connect to database: %v", err)
	//}

	coll = *mgm.Coll(&handler.Video{})
}

func main() {
	e := echo.New()
	//e.Pre(middleware.RemoveTrailingSlash())
	h := handler.VideoHandler{Coll: coll}
	e.POST("/videos", h.CreateVideos)
	e.Logger.Printf("Listening on %v:%v", cfg.Host, cfg.Port)
	e.Logger.Fatal(e.Start(fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)))
}
