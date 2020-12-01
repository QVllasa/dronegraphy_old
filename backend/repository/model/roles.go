package model

type (
	Roles struct {
		Admin   bool `json:"admin" bson:"admin"`
		Creator bool `json:"creator" bson:"creator"`
		Member  bool `json:"member" bson:"member"`
	}
)
