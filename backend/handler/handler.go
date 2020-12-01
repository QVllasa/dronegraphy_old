package handler

import (
	"dronegraphy/backend/repository"
	"dronegraphy/backend/service"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	echo       *echo.Echo
	repository *repository.Repository
	service    *service.Service
}

func NewHandler(echo *echo.Echo) (this *Handler) {
	this = new(Handler)
	this.echo = echo

	//TODO Warum muss ich "NewDatabase()" ausführen, wo ich es doch schon in main.go gemacht habe?

	this.repository = repository.NewRepository(repository.NewDatabase().Client)

	return this
}
