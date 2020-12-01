package service

import (
	"dronegraphy/backend/repository"
	"firebase.google.com/go/v4/auth"
)

type Service struct {
	repository   *repository.Repository
	firebaseAuth *auth.Client
}

func NewService(repo *repository.Repository, fbClient *auth.Client) (this *Service) {
	this = new(Service)
	this.repository = repo
	this.firebaseAuth = fbClient
	return this
}
