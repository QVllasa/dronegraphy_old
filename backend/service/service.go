package service

import (
	"dronegraphy/backend/repository"
	"firebase.google.com/go/v4/auth"
)

type Service struct {
	repository   *repository.Repository
	firebaseAuth *auth.Client
}
