package repository

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Repository struct {
	Client       *mongo.Client
	UserColl     *mongo.Collection
	VideoColl    *mongo.Collection
	CategoryColl *mongo.Collection
	SortColl     *mongo.Collection
}

var Repo *Repository

// Create a repository with the Database connection provided
func NewRepository(client *mongo.Client) (this *Repository) {
	this = new(Repository)
	fmt.Println("New Repository")
	this.Client = client
	this.UserColl = this.Client.Database("dronegraphy_db").Collection("users")
	_, _ = this.UserColl.Indexes().CreateOne(context.Background(), newUserIndex())

	this.VideoColl = this.Client.Database("dronegraphy_db").Collection("videos")
	_, _ = this.VideoColl.Indexes().CreateOne(context.Background(), newVideoIndex())

	this.CategoryColl = this.Client.Database("dronegraphy_db").Collection("categories")
	this.SortColl = this.Client.Database("dronegraphy_db").Collection("sorting")
	Repo = this

	return this
}

func newUserIndex() mongo.IndexModel {
	isUserIndexUnique := true
	indexModel := mongo.IndexModel{
		Keys: bson.D{{"email", 1}},
		Options: &options.IndexOptions{
			Unique: &isUserIndexUnique,
		},
	}
	return indexModel
}

func newVideoIndex() mongo.IndexModel {
	indexModel := mongo.IndexModel{
		Keys: bson.D{
			{"title", "text"},
			{"location", "text"},
			{"camera", "text"},
		},
		Options: &options.IndexOptions{
			Weights: map[string]int{
				"title":    9,
				"location": 7,
				"camera":   6,
			},
		},
	}
	return indexModel
}

// Generic function
//func AddIndex(dbName string, collection string, indexKeys interface{}) error {
//	db := getNewDbClient() // get clients of mongodb connection
//	serviceCollection := db.Database(dbName).Collection(collection)
//	indexName, err := serviceCollection.Indexes().CreateOne(mtest.Background, mongo.IndexModel{
//		Keys: indexKeys,
//	})
//	if err != nil {
//		return err
//	}
//	fmt.Println(indexName)
//	return nil
//}
