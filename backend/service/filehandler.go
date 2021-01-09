package service

import (
	"dronegraphy/backend/repository/model"
	"fmt"
	"github.com/disintegration/imaging"
	"github.com/labstack/gommon/log"
	hls "github.com/rendyfebry/go-hls-transcoder"
	hlsPlaylist "github.com/rendyfebry/go-hls-transcoder/playlist"
	"io"
	"mime/multipart"
	"os"
)

var (
	StorageRoot  = "backend/storage/"
	Creator      = "/creators/"
	ProfileImage = "/profileImage/"
	Videos       = "videos/"
	Thumbnails   = "thumbnails/"
	HLS          = "/hls/"
	Container    = "/container/"
)

func (this *Service) SaveImage(file *multipart.FileHeader, target string, fileID string, resize bool, isThumbnail bool) (*os.File, error) {

	src, err := file.Open()
	if err != nil {
		log.Fatal(err)
	}
	defer src.Close()

	if !isThumbnail {
		_ = os.MkdirAll(target, 0777)

		// Open the directory and read all its files.
		dirRead, _ := os.Open(target)
		dirFiles, _ := dirRead.Readdir(0)

		// Loop over the directory's files.
		for index := range dirFiles {
			fileHere := dirFiles[index]

			// Get name of file and its full path.
			nameHere := fileHere.Name()
			fullPath := target + nameHere

			// Remove the file.
			if err := os.Remove(fullPath); err != nil {
				return nil, err
			}
		}
	}

	f, err := os.Create(target + fileID + "_" + file.Filename)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	// Copy
	if _, err = io.Copy(f, src); err != nil {
		log.Fatal(err)
		return nil, err
	}

	if resize {
		if err := ResizeImage(f); err != nil {
			log.Error(err)
			return nil, err
		}
	}

	return f, nil

}

func (this *Service) SaveVideoFiles(files []*multipart.FileHeader, target string, fileID string) ([]model.FileInfo, error) {

	var fileList []model.FileInfo

	_ = os.MkdirAll(target+fileID, 0777)

	hlsPath := target + fileID + "/hls/"

	_ = os.MkdirAll(target+fileID+"/hls/", 0777)

	for _, file := range files {

		ffmpegPath := "/usr/local/bin/ffmpeg"
		srcPath := "/assets/raw/movie.mov"
		targetPath := hlsPath
		resOptions := []string{"480p", "720p"}

		variants, _ := hlsPlaylist.GenerateHLSVariant(resOptions, "")
		hlsPlaylist.GeneratePlaylist(variants, targetPath, "")

		for _, res := range resOptions {
			_ = hls.GenerateHLS(ffmpegPath, srcPath, targetPath, res)
		}

		f := model.FileInfo{
			Size:        file.Size,
			Title:       file.Filename,
			ContentType: file.Header["Content-Type"][0],
		}
		fmt.Println(file.Filename)
		fmt.Println(file.Header)
		// Source
		src, err := file.Open()
		if err != nil {
			log.Error(err)
			return nil, err
		}
		defer src.Close()

		// Destination
		dst, err := os.Create(target + fileID + "/" + file.Filename)
		if err != nil {
			log.Error(err)
			return nil, err
		}
		defer dst.Close()

		// Copy
		if _, err = io.Copy(dst, src); err != nil {
			log.Error(err)
			return nil, err
		}

		fileList = append(fileList, f)
	}

	return fileList, nil
}

func ResizeImage(file *os.File) error {
	imgSrc, err := imaging.Open(file.Name())
	if err != nil {
		log.Fatalf("failed to open image: %v", err)
	}

	// Resize the cropped image to width = 160px preserving the aspect ratio.
	imgSrc = imaging.Resize(imgSrc, 0, 160, imaging.Lanczos)

	if err := imaging.Save(imgSrc, file.Name()); err != nil {
		return err
	}

	return nil
}

// Delete Thumbnail when deleting video
func (this *Service) DeleteThumbnail(fileName string) error {

	src := StorageRoot + Thumbnails + fileName

	err := os.Remove(src)
	if err != nil {
		log.Error("cannot delete thumbnail")
		return err
	}
	return nil
}
