package tests

import (
	"context"
	"dronegraphy/backend/repository"
	"dronegraphy/backend/repository/model"
	"dronegraphy/backend/service"
	"dronegraphy/backend/util"
	"firebase.google.com/go/v4/auth"
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/labstack/gommon/log"
	"github.com/rs/xid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/api/iterator"
	"io/ioutil"
	"os"
	"path"
	"testing"
)

var (
	userCount   = 15
	videoCount  = 400
	childCount  = 16
	parentCount = 3
)

func TestLoadCategoryFixtures(t *testing.T) {

	gofakeit.Seed(123)

	if repository.DB == nil {
		repository.NewDatabase()
	}

	var c []model.Category
	cColl := repository.DB.Client.Database("dronegraphy_db").Collection("categories")
	_ = cColl.Drop(context.Background())

	//generate parent categories
	for i := 1; i < parentCount; i++ {
		parent := model.Category{
			Value: gofakeit.Noun(),
			Key:   i,
			ID:    primitive.NewObjectID(),
		}
		c = append(c, parent)
	}

	//Generate child categories
	for i := 0; i < childCount; i++ {
		child := model.Category{
			Value:     gofakeit.Noun(),
			Key:       gofakeit.Number(3, 100),
			ID:        primitive.NewObjectID(),
			ParentKey: gofakeit.Number(1, 2),
		}
		c = append(c, child)
	}

	//Mix child with parents
	for _, i := range c {
		_, _ = cColl.InsertOne(context.Background(), i)
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

	target := "../storage/creators/"

	udir, _ := ioutil.ReadDir(target)
	for _, d := range udir {
		os.RemoveAll(path.Join([]string{target, d.Name()}...))
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

		if user.Role == "ROLE_CREATOR" {
			user.Key = gofakeit.Number(100, 10000)
		}
		user.FirstName = gofakeit.FirstName()
		user.LastName = gofakeit.LastName()
		user.Email = gofakeit.Email()
		user.FavoriteVideos = []string{}
		user.DownloadedVideos = []string{}
		user.CreatedAt = gofakeit.Date()
		user.UpdatedAt = gofakeit.Date()

		params := (&auth.UserToCreate{}).
			Email(user.Email).
			Password("Dominim123_!")
		u, err := fbClient.Client.CreateUser(context.Background(), params)
		if err != nil {
			log.Fatalf("error creating user: %v\n", err)
			panic(err)
		}
		log.Printf("Successfully created user: %v\n", u)

		claims := map[string]interface{}{
			"role": user.Role,
		}

		if err := fbClient.Client.SetCustomUserClaims(context.Background(), u.UID, claims); err != nil {
			log.Errorf("setting custom claims failed: %v", err)
			panic(err)
		}

		_ = fbClient.Client.RevokeRefreshTokens(context.Background(), user.UID)

		user.UID = u.UID

		fileID := xid.New().String()

		t := target + user.UID + "/profileImage"

		if _, err := os.Stat(t); os.IsNotExist(err) {
			if err = os.MkdirAll(t, os.ModePerm); err != nil {
				panic(err)
			}
		}


		//https://thispersondoesnotexist.com/image
		if err = util.DownloadFile("https://thispersondoesnotexist.com/image", target+user.UID+"/profileImage/"+fileID+".jpg"); err != nil {
			log.Error(err)
			panic(err)
		}

		user.ProfileImage = fileID + ".jpg"

		_, _ = users.InsertOne(context.Background(), user)
	}

}

func TestLoadVideoFixtures(t *testing.T) {

	gofakeit.Seed(123)

	if repository.DB == nil {
		repository.NewDatabase()
	}

	var categories []int

	catProjection := bson.D{
		//{"key", 1},
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

		if category.ParentKey != 0 {
			categories = append(categories, category.Key)
		}

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

	video := model.Video{}
	videos := repository.DB.Client.Database("dronegraphy_db").Collection("videos")
	_ = videos.Drop(context.Background())

	target := "../storage/thumbnails/"

	tbdir, _ := ioutil.ReadDir(target)
	for _, d := range tbdir {
		os.RemoveAll(path.Join([]string{target, d.Name()}...))
	}

	viddir, _ := ioutil.ReadDir("../../" + service.StorageRoot + service.Videos)
	for _, d := range viddir {
		os.RemoveAll(path.Join([]string{"../../" + service.StorageRoot + service.Videos, d.Name()}...))
	}

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

		var c []int
		for i := 1; i < gofakeit.Number(2, 5); i++ {
			c = append(c, gofakeit.RandomInt(categories))
		}
		video.Categories = c

		video.Width = gofakeit.Number(240, 2160)
		video.Height = gofakeit.Number(720, 3840)
		video.FPS = gofakeit.Number(24, 120)
		video.Length = float64(gofakeit.Number(30, 300))
		video.Location = gofakeit.City() + ", " + gofakeit.Country()
		video.Published = gofakeit.Bool()
		video.Converted = true
		video.Sell = gofakeit.Bool()
		video.StuffPick = gofakeit.Bool()
		video.Formats = []string{gofakeit.RandomString(formats)}
		video.Tags = []string{gofakeit.RandomString(tags)}
		video.Views = gofakeit.Number(0, 99999)
		video.Downloads = gofakeit.Number(0, 99999)

		owner := creators[gofakeit.Number(0, len(creators)-1)]
		video.Creator = model.Creator{
			UID:       owner.UID,
			FirstName: owner.FirstName,
			LastName:  owner.LastName,
		}
		video.CreatedAt = gofakeit.Date()
		video.UpdatedAt = gofakeit.Date()

		ID, _ := videos.InsertOne(context.Background(), video)

		fileID := xid.New().String()

		if err = util.DownloadFile(gofakeit.ImageURL(640, 360)+".jpg", target+fileID+".jpg"); err != nil {
			log.Error(err)
		}

		vID := xid.New().String()

		if err = util.CopyDir("./testfiles", "../../"+service.StorageRoot+service.Videos+"/"+vID+"/hls"); err != nil {
			log.Error(err)
		}

		content := []model.FileInfo{{Name: "4k_H264.mov", ContentType: "mov", Size: int64(30)},
			{Name: "4k.mov", ContentType: "mov", Size: int64(30)},
			{Name: "hd.mov", ContentType: "mov", Size: int64(30)},
			{Name: "sample-videos.zip", ContentType: "mov", Size: int64(30)}}

		filter := bson.M{"_id": ID.InsertedID}
		update := bson.D{{"$set", bson.D{
			{"thumbnail", fileID + ".jpg"},
			{"storageRef", vID},
			{"storageContent", content},
		}}}

		_, err = videos.UpdateOne(context.Background(), filter, update)
		//if err != nil {
		//	log.Error(err)
		//	os.Remove(f.Name())
		//}

	}
}

func TestLoadFilterFixtures(t *testing.T) {
	gofakeit.Seed(123)

	if repository.DB == nil {
		repository.NewDatabase()
	}

	filters := repository.DB.Client.Database("dronegraphy_db").Collection("sorting")
	_ = filters.Drop(context.Background())

	f := []model.SortOption{
		{Value: "Nach Downloads", Key: 0},
		{Value: "Unsere Auswahl", Key: 1},
		{Value: "Neueste", Key: 2},
		{Value: "Kostenlos", Key: 3},
		{Value: "Alle", Key: 4},
	}

	for _, i := range f {
		_, _ = filters.InsertOne(context.Background(), i)
	}

}
