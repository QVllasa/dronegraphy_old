package handler

import "go.mongodb.org/mongo-driver/mongo"

type UsersHandler struct {
	Coll *mongo.Collection
}

type User struct {
	Email     string
	FirstName string
	LastName  string
}
