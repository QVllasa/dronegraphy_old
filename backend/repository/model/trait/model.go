package trait

import "go.mongodb.org/mongo-driver/bson/primitive"

//
type Model struct {
	ID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
}
