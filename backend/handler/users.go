package handler

import (
	"context"
	customMiddleware "dronegraphy/backend/middleware"
	"firebase.google.com/go/v4/auth"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"net/http"
)

type UsersHandler struct {
	Coll *mongo.Collection
}

type (
	Roles struct {
		Admin   bool `json:"admin" bson:"admin"`
		Creator bool `json:"creator" bson:"creator"`
		Member  bool `json:"member" bson:"member"`
	}
)

type (
	User struct {
		ID            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
		Email         string             `json:"email" validate:"required,email"`
		FirstName     string             `json:"firstName" validate:"required"`
		LastName      string             `json:"lastName" validate:"required"`
		UID           string             `json:"uid" validate:"required"`
		EmailVerified bool               `json:"emailVerified"`
		Roles         Roles              `json:"roles" validate:"required"`
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

	newUser, err := insertUser(context.Background(), newUser, this.Coll)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, newUser)
}

func (this *UsersHandler) GetUser(c echo.Context) error {
	var user User
	user, err := FindUser(context.Background(), c.Param("id"), this.Coll)
	if err != nil {
		log.Errorf("Unable to find User: %v", err)
		return err
	}

	client, err := customMiddleware.InitAuthClient()
	if err != nil {
		log.Fatal(err)
		return err
	}

	if err = UpdateRoles(client, user); err != nil {
		log.Error(err)
		return err
	}

	return c.JSON(http.StatusOK, user)
}

// Get Roles from Database and updates the JWT Token Claims
func UpdateRoles(client *auth.Client, user User) error {

	claims := map[string]interface{}{
		"admin":   user.Roles.Admin,
		"creator": user.Roles.Creator,
		"member":  user.Roles.Member}

	if err := client.SetCustomUserClaims(context.Background(), user.UID, claims); err != nil {
		log.Fatal(err)
		return err
	}

	return nil
}

func (this *UsersHandler) GetAllUser(c echo.Context) error {
	users, err := findAllUsers(context.Background(), this.Coll)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, users)
}

func FindUser(ctx context.Context, id string, collection *mongo.Collection) (User, error) {
	var user User
	filter := bson.M{"uid": id}
	res := collection.FindOne(ctx, filter)
	if err := res.Decode(&user); err != nil {
		return user, err
	}
	return user, nil
}

func findAllUsers(ctx context.Context, collection *mongo.Collection) ([]User, error) {
	var users []User

	cursor, err := collection.Find(ctx, bson.M{})

	if err != nil {
		log.Errorf("Unable to fetch videos from database: %v", err)
		return users, err
	}

	if err := cursor.All(ctx, &users); err != nil {
		log.Errorf("Unable to read the cursor: %v", err)
		return users, err
	}
	return users, nil
}

func insertUser(ctx context.Context, user User, collection *mongo.Collection) (User, error) {
	var newUser User
	res := collection.FindOne(ctx, bson.M{"email": user.Email})
	err := res.Decode(&newUser)
	if err != nil && err != mongo.ErrNoDocuments {
		log.Errorf("Unable to decode retrieved user: %v", err)
		return newUser, echo.NewHTTPError(500, "Unable to decode retrieved user")
	}
	if newUser.Email != "" {
		log.Errorf("Email already exists: %v", err)
		return newUser, echo.NewHTTPError(400, "User already exists")
	}
	ID, err := collection.InsertOne(ctx, user)
	if err != nil {
		log.Errorf("Unable to store in database: %s", err)
		return newUser, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Email already exists"})
	}

	res = collection.FindOne(ctx, bson.M{"_id": ID.InsertedID})
	if err := res.Decode(&newUser); err != nil {
		log.Errorf("Unable to fetch User: %v", err)
		return newUser, err
	}

	return newUser, nil
}
