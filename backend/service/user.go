package service

import (
	"context"
	"dronegraphy/backend/repository/model"
	"firebase.google.com/go/v4/auth"
	"github.com/labstack/gommon/log"
)

func (this *Service) RegisterFirebaseUser(user *model.User, password string) (*model.User, error) {

	// See Firebase Documentation how to create User Object in Firebase
	params := (&auth.UserToCreate{}).
		Email(user.Email).
		Password(password)

	// See Firebase Documentation how to create User in Firebase
	fbUser, err := this.FirebaseApp.Client.CreateUser(context.Background(), params)
	if err != nil {
		log.Fatal(err)
		return user, err
	}

	user.UID = fbUser.UID

	// See Firebase Documentation how to update Claims in token from Firebase
	if err = this.FirebaseApp.UpdateRoleClaims(user); err != nil {
		return user, err
	}

	return user, nil
}
