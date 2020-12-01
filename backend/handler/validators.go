package handler

import "gopkg.in/go-playground/validator.v9"

var (
	v = validator.New()
)

type UserValidator struct {
	Validator *validator.Validate
}

func (this *UserValidator) Validate(i interface{}) error {
	return this.Validator.Struct(i)
}

type VideoValidator struct {
	Validator *validator.Validate
}

func (this *VideoValidator) Validate(i interface{}) error {
	return this.Validator.Struct(i)
}
