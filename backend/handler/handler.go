package handler

import (
	"dronegraphy/backend/repository"
	"dronegraphy/backend/service"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

type Handler struct {
	echo       *echo.Echo
	repository *repository.Repository
	service    *service.Service
}

func NewHandler(echo *echo.Echo) (this *Handler, err error) {
	this = new(Handler)
	this.echo = echo

	//TODO Warum muss ich "NewDatabase()" ausführen, wo ich es doch schon in main.go gemacht habe?

	this.repository, err = repository.NewRepository(repository.NewDatabase().Client)
	if err != nil {
		log.Error("repository creating failed")
		return nil, err
	}
	//
	//this.service = service.NewService(this.repository, this.repository.FirebaseApp.Client)

	return this, nil
}
