package handler

import (
	"dronegraphy/backend/config"
	"fmt"
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/kamva/mgm/v3"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

var (
	c    *mongo.Client
	db   *mongo.Database
	coll mgm.Collection
	cfg  config.Properties
	h    VideoHandler
)

//Init database and .env
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

	coll = *mgm.Coll(&Video{})
}

func TestVideo(t *testing.T) {
	t.Run("test create video", func(t *testing.T) {
		body := `
			[{
				"title": "asdadsad",
				"location": "germany",
				"formats": ["mp4", "mov" ],
				"resolution":"1920x1080",
				"length":123,
				"fps":24,
				"camera":"sony"
			}]
			`

		req := httptest.NewRequest("POST", "/videos", strings.NewReader(body))
		res := httptest.NewRecorder()
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		e := echo.New()
		c := e.NewContext(req, res)
		h.Coll = coll
		err := h.CreateVideos(c)
		assert.Nil(t, err)
	})
}
