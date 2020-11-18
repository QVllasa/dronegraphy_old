package handler

import (
	"context"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

type UsersHandler struct {
	Coll *mongo.Collection
}

type (
	User struct {
		Email     string `json:"email" validate:"required,email"`
		FirstName string `json:"firstName" validate:"required"`
		LastName  string `json:"lastName" validate:"required"`
		UID       string `json:"uid" validate:"required"`
	}

	UserValidator struct {
		Validator *validator.Validate
	}
)

func (this *UserValidator) Validate(i interface{}) error {
	return this.Validator.Struct(i)
}

//If User does not exist, store User Struct in database
func (this *UsersHandler) SignUp(c echo.Context) error {
	var newUser User
	c.Echo().Validator = &UserValidator{Validator: validator.New()}

	if err := c.Bind(&newUser); err != nil {
		log.Errorf("Unable to bind : %v", err)
		return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{Message: "Binding Error: unable to parse request payload"})
	}

	if err := c.Validate(newUser); err != nil {
		log.Errorf("Unable to validate the product %+v %v", newUser, err)
		return c.JSON(http.StatusUnprocessableEntity, ErrorMessage{Message: "Validation Error: unable to parse request payload"})
	}

	ID, err := insertUser(context.Background(), newUser, this.Coll)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, ID)
}

func insertUser(ctx context.Context, user User, collection *mongo.Collection) (interface{}, error) {
	var newUser User
	res := collection.FindOne(ctx, bson.M{"email": user.Email})
	err := res.Decode(&newUser)
	if err != nil && err != mongo.ErrNoDocuments {
		log.Errorf("Unable to decode retrieved user: %v", err)
		return nil, echo.NewHTTPError(500, "Unable to decode retrieved user")
	}
	if newUser.Email != "" {
		log.Errorf("Email already exists: %v", err)
		return nil, echo.NewHTTPError(400, "User already exists")
	}
	ID, err := collection.InsertOne(ctx, user)
	if err != nil {
		log.Errorf("Unable to store in database: %s", err)
		return ID, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Email already exists"})
	}

	return ID, nil
}

// Check if User is authenticated via firebase and retrieve his info from database
func AuthorizeUser() {

}
