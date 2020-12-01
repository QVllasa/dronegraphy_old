package model

type (
	User struct {
		//ID            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
		Email         string `json:"email"  validate:"required,email"`
		FirstName     string `json:"firstName"  validate:"required"`
		LastName      string `json:"lastName"  validate:"required"`
		UID           string `json:"uid"  validate:"required"`
		EmailVerified bool   `json:"emailVerified" `
		Roles         Roles  `json:"roles"  validate:"required"`
	}
)
