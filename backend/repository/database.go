package repository

import (
	"context"
	"dronegraphy/backend/config"
	"fmt"
	"github.com/ilyakaznacheev/cleanenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

type Database struct {
	Client     *mongo.Client
	Cfg        config.Properties
	ConnectURI string
}

// A global reference to this database instance for later defer.close
var DB *Database

//Init database and .env
func NewDatabase() (this *Database) {

	fmt.Println("New Database")

	this = new(Database)

	if err := cleanenv.ReadEnv(&this.Cfg); err != nil {
		log.Fatalf("Configuration cannot be read: %v", err)
	}

	this.ConnectURI = fmt.Sprintf("mongodb://%s:%s", "localhost", "27017")

	////Example of indexing email and make it unique
	isUserIndexUnique := true
	indexModel := mongo.IndexModel{
		Keys: bson.D{{"email", 1}},
		Options: &options.IndexOptions{
			Unique: &isUserIndexUnique,
		},
	}

	// MongoDB Connection (if any)

	log.Print("[Database] Connecting to MongoDB: ", this.ConnectURI)
	client, err := mongo.NewClient(options.Client().ApplyURI(this.ConnectURI))
	if err != nil {
		log.Println("[Database] Error while creating a MongoDB client: ", err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Println("[Database] Error while connecting to MongoDB: ", err)
	}
	this.Client = client

	_, err = this.Client.Database("dronegraphy_db").Collection("users").Indexes().CreateOne(context.Background(), indexModel)
	if err != nil {
		log.Fatalf("Unable to create an index: %v", err)
	}

	DB = this

	return this

}
