package service

import (
	"dronegraphy/backend/repository"
	"github.com/casbin/casbin/v2"
)

type Service struct {
	repository  *repository.Repository
	FirebaseApp *FirebaseClient
	enforcer    *casbin.Enforcer
}

func NewService(repo *repository.Repository, enforcer *casbin.Enforcer) (this *Service) {
	this = new(Service)
	if repo == nil {
		this.repository = repository.NewRepository(repository.DB.Client)
	} else {
		this.repository = repo
	}
	this.FirebaseApp, _ = NewFirebaseClient()
	return this
}
