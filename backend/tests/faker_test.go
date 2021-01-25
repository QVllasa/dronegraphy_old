package tests

import (
	"context"
	"dronegraphy/backend/repository"
	"dronegraphy/backend/repository/model"
	"dronegraphy/backend/service"
	"dronegraphy/backend/util"
	"firebase.google.com/go/v4/auth"
	"fmt"
	"github.com/brianvoe/gofakeit/v5"
	"github.com/labstack/gommon/log"
	"github.com/rs/xid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/api/iterator"
	"testing"
)

var (
	userCount     = 15
	videoCount    = 200
	categoryCount = 5
)

func TestLoadCategoryFixtures(t *testing.T) {

	gofakeit.Seed(123)

	if repository.DB == nil {
		repository.NewDatabase()
	}

	category := model.Category{}
	categories := repository.DB.Client.Database("dronegraphy_db").Collection("categories")
	_ = categories.Drop(context.Background())

	for i := 0; i < categoryCount; i++ {
		category.Value = gofakeit.Noun()
		category.UpdatedAt = gofakeit.Date()
		category.CreatedAt = gofakeit.Date()
		_, _ = categories.InsertOne(context.Background(), category)
	}

}

func TestDeleteUser(t *testing.T) {
	gofakeit.Seed(123)

	repository.NewDatabase()

	fbClient, err := service.NewFirebaseClient()
	if err != nil {
		fmt.Println(err)
	}

	iter := fbClient.Client.Users(context.Background(), "")
	for {
		user, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("error listing users: %s\n", err)
		}

		err = fbClient.Client.DeleteUser(context.Background(), user.UID)
		if err != nil {
			log.Fatalf("error deleting user: %v\n", err)
		}
		log.Printf("Successfully deleted user: %s\n", user.UID)
		log.Printf("read user user: %v\n", user)
	}

	//user := model.User{}
	users := repository.DB.Client.Database("dronegraphy_db").Collection("users")
	_ = users.Drop(context.Background())
}

func TestLoadUserFixtures(t *testing.T) {

	gofakeit.Seed(123)

	repository.NewDatabase()

	fbClient, err := service.NewFirebaseClient()
	if err != nil {
		fmt.Println(err)
	}

	iter := fbClient.Client.Users(context.Background(), "")
	for {
		user, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("error listing users: %s\n", err)
		}

		err = fbClient.Client.DeleteUser(context.Background(), user.UID)
		if err != nil {
			log.Fatalf("error deleting user: %v\n", err)
		}
		log.Printf("Successfully deleted user: %s\n", user.UID)
		log.Printf("read user user: %v\n", user)
	}

	user := model.User{}
	users := repository.DB.Client.Database("dronegraphy_db").Collection("users")
	_ = users.Drop(context.Background())

	for i := 0; i < userCount; i++ {

		roles := []string{
			"ROLE_MEMBER", "ROLE_CREATOR",
		}
		user.Role = gofakeit.RandomString(roles)
		user.FirstName = gofakeit.FirstName()
		user.LastName = gofakeit.LastName()
		user.Email = gofakeit.Email()
		user.CreatedAt = gofakeit.Date()
		user.UpdatedAt = gofakeit.Date()

		params := (&auth.UserToCreate{}).
			Email(user.Email).
			Password("Dominim123_!")
		u, err := fbClient.Client.CreateUser(context.Background(), params)
		if err != nil {
			log.Fatalf("error creating user: %v\n", err)
		}
		log.Printf("Successfully created user: %v\n", u)

		claims := map[string]interface{}{
			"role": user.Role,
		}

		if err := fbClient.Client.SetCustomUserClaims(context.Background(), user.UID, claims); err != nil {
			log.Errorf("setting custom claims failed: %v", err)
		}

		fbClient.Client.RevokeRefreshTokens(context.Background(), user.UID)

		user.UID = u.UID

		_, _ = users.InsertOne(context.Background(), user)
	}

}

func TestLoadVideoFixtures(t *testing.T) {

	gofakeit.Seed(123)

	if repository.DB == nil {
		repository.NewDatabase()
	}

	var categories []string

	catProjection := bson.D{
		{"_id", 1},
		{"value", 0},
		{"updated_at", 0},
		{"created_at", 0},
	}

	catsColl := repository.DB.Client.Database("dronegraphy_db").Collection("categories")
	catsCursor, err := catsColl.Find(context.Background(), bson.M{}, options.Find().SetProjection(catProjection))
	if err != nil {
		fmt.Println(err)
	}
	defer catsCursor.Close(context.Background())

	for catsCursor.Next(context.Background()) {
		var category model.Category
		if err = catsCursor.Decode(&category); err != nil {
			log.Fatal(err)
		}
		categories = append(categories, category.ID.Hex())
		fmt.Println(categories)
	}

	var creators []model.Creator

	usersColl := repository.DB.Client.Database("dronegraphy_db").Collection("users")
	usersCursor, err := usersColl.Find(context.Background(), bson.M{"role": "ROLE_CREATOR"})
	if err != nil {
		fmt.Println(err)
	}
	defer usersCursor.Close(context.Background())

	if err := usersCursor.All(context.Background(), &creators); err != nil {
		fmt.Println(err)
	}

	//for usersCursor.Next(context.Background()) {
	//	var user model.User
	//	if err = usersCursor.Decode(&user); err != nil {
	//		log.Fatal(err)
	//	}
	//	if user.Role == "ROLE_CREATOR" {
	//		creators = append(creators, user)
	//	}
	//}

	video := model.Video{}
	videos := repository.DB.Client.Database("dronegraphy_db").Collection("videos")
	_ = videos.Drop(context.Background())

	formats := []string{
		"HD mp4",
		"HQ mp4",
		"4k mov",
	}

	tags := []string{
		"wald",
		"meer",
		"action",
		"sport",
	}

	for i := 0; i < videoCount; i++ {

		video.Title = gofakeit.LoremIpsumSentence(4)
		video.Camera = "DJI Mavic Pro"
		video.Categories = []string{gofakeit.RandomString(categories)}
		video.Formats = []string{gofakeit.RandomString(formats)}
		video.Width = gofakeit.Number(240, 2160)
		video.Height = gofakeit.Number(720, 3840)
		video.FPS = gofakeit.Number(24, 120)
		video.Length = float64(gofakeit.Number(30, 300))
		video.Location = gofakeit.City() + ", " + gofakeit.Country()
		video.Published = gofakeit.Bool()
		video.Converted = true
		video.Sell = gofakeit.Bool()
		video.Formats = []string{gofakeit.RandomString(tags)}
		video.Views = gofakeit.Number(0, 99999)
		video.Downloads = gofakeit.Number(0, 99999)
		video.Creator = model.Creator{
			UID:       creators[gofakeit.Number(0, len(creators)-1)].UID,
			FirstName: creators[gofakeit.Number(0, len(creators)-1)].FirstName,
			LastName:  creators[gofakeit.Number(0, len(creators)-1)].LastName,
		}
		video.CreatedAt = gofakeit.Date()
		video.UpdatedAt = gofakeit.Date()

		ID, _ := videos.InsertOne(context.Background(), video)

		fileID := xid.New().String()
		vID := xid.New().String()
		target := "../storage/thumbnails/"

		if err = util.DownloadFile(gofakeit.ImageURL(640, 360)+".jpg", target+fileID+".jpg"); err != nil {
			log.Error(err)
		}

		if err = util.CopyDir("./testfiles", "../../"+service.StorageRoot+service.Videos+"/"+vID); err != nil {
			log.Error(err)
		}

		filter := bson.M{"_id": ID.InsertedID}
		update := bson.D{{"$set", bson.D{
			{"thumbnail", fileID + ".jpg"},
			{"storageRef", vID},
		}}}

		_, err = videos.UpdateOne(context.Background(), filter, update)
		//if err != nil {
		//	log.Error(err)
		//	os.Remove(f.Name())
		//}

	}
}
