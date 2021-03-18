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
	db := repository.NewDatabase()
	this.repository = repository.NewRepository(db.Client)
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	this.service = service.NewService(this.repository, enforcer)

	return this, nil
}

// Generic binding of requests to models and validating against go.validate
func (this *Handler) bindAndValidateRequest(c echo.Context, model interface{}) error {
	if err := this.bindRequest(c, model); err != nil {
		return err
	}
	if err := this.validateRequest(c, model); err != nil {
		return err
	}
	return nil
}

// Generic binding of requests to models
func (this *Handler) bindRequest(c echo.Context, model interface{}) error {
	if err := c.Bind(model); err != nil {
		return err
	}
	return nil
}

// Generic validation of requests against go.validate
func (this *Handler) validateRequest(c echo.Context, dto interface{}) error {
	if err := c.Validate(dto); err != nil {
		return err
	}
	return nil
}


