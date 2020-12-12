package repository

import (
	"dronegraphy/backend/repository/model"
	"go.mongodb.org/mongo-driver/bson"
	"io"
)

func (this *Repository) UpdateVideo(id string, reqBody io.ReadCloser) (*model.Video, error) {

	//user, err := this.GetUserById(id)
	//if err != nil {
	//	log.Errorf("User not found: %v", err)
	//	return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "User not found"})
	//}
	//
	//if err := json.NewDecoder(reqBody).Decode(&user); err != nil {
	//	log.Errorf("Unable decode using request body: %v", err)
	//	return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to decode JSON"})
	//} else {
	//	fmt.Printf("user: %v", user)
	//}
	//
	////if err := handler.V.Struct(user); err != nil {
	////	log.Errorf("Unable to validate the struct: %v", err)
	////	return user, err
	////}
	//
	//filter := bson.M{"uid": user.UID}
	//
	//_, err = this.UserColl.UpdateOne(context.Background(), filter, bson.M{"$set": user})
	//if err != nil {
	//	log.Errorf("Unable to update the user: %v", err)
	//	return nil, echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to update the User"})
	//}

	return user, nil
}

func (this *Repository) CreateVideo(model *model.Video) error {

	//ID, err := this.UserColl.InsertOne(context.Background(), model)
	//if err != nil {
	//	log.Errorf("Unable to store in database: %s", err)
	//	return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Email already exists"})
	//}
	//
	//res := this.UserColl.FindOne(context.Background(), bson.M{"_id": ID.InsertedID})
	//if err := res.Decode(&model); err != nil {
	//	log.Errorf("Unable to fetch User ID: %v", err)
	//	return echo.NewHTTPError(http.StatusInternalServerError, ErrorMessage{Message: "Unable to fetch User ID"})
	//}

	return nil
}

func (this *Repository) GetVideos() ([]model.Video, error) {

	//var users []model.User
	//
	//cursor, err := this.UserColl.Find(context.Background(), bson.M{})
	//if err != nil {
	//	log.Errorf("Unable to fetch users from database: %v", err)
	//	return users, err
	//}
	//
	//if err = cursor.All(context.Background(), &users); err != nil {
	//	log.Errorf("Unable to read the cursor: %v", err)
	//	return users, err
	//}
	return users, nil

}

func (this *Repository) GetVideoById(id string) (*model.Video, error) {
	var user model.User
	filter := bson.M{"uid": id}
	err := this.UserColl.FindOne(context.Background(), filter).Decode(&user)
	if err != nil {
		return &user, err
	}
	return &user, nil
}
