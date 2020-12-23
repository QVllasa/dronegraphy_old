package service

import (
	"dronegraphy/backend/repository/model"
)

func (this *Service) Register(user *model.User) error {

	// Create
	if err := this.repository.CreateUser(user); err != nil {
		return err
	}

	return nil
}
