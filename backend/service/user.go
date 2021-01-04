package service

import (
	"context"
	"dronegraphy/backend/repository/model"
	"firebase.google.com/go/v4/auth"
	"github.com/labstack/gommon/log"
)

func (this *Service) Register(user *model.User, password string) error {

	params := (&auth.UserToCreate{}).
		Email(user.Email).
		Password(password)

	fbUser, err := this.FirebaseApp.Client.CreateUser(context.Background(), params)
	if err != nil {
		log.Fatal(err)
		return err
	}

	user.UID = fbUser.UID

	if err = this.FirebaseApp.UpdateRoleClaims(user); err != nil {
		return err
	}

	// Create
	if err := this.repository.CreateUser(user); err != nil {
		return err
	}

	return nil
}
