package handler

import (
	"dronegraphy/backend/repository"
	"dronegraphy/backend/service"
	"github.com/casbin/casbin/v2"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	echo       *echo.Echo
	enforcer   *casbin.Enforcer
	repository *repository.Repository
	service    *service.Service
}

func NewHandler(echo *echo.Echo, enforcer *casbin.Enforcer) (this *Handler, err error) {
	this = new(Handler)
	this.echo = echo

	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//TODO Warum muss ich hier "NewDatabase()" ausführen, wo ich es doch in main.go machen muss?
	this.repository = repository.NewRepository(repository.NewDatabase().Client)
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	this.service = service.NewService(this.repository, enforcer)

	return this, nil
}
