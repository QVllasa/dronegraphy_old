package service

import (
	"context"
	"dronegraphy/backend/repository/model"
	"dronegraphy/backend/util"
	"github.com/disintegration/imaging"
	"github.com/labstack/gommon/log"
	"gopkg.in/vansante/go-ffprobe.v2"
	"mime/multipart"
	"os"
	"time"
)

var (
	StorageRoot  = "./backend/storage"
	Creator      = "/creators"
	ProfileImage = "/profileImage"
	Videos       = "/videos"
	Thumbnails   = "/thumbnails"
	HLS          = "/hls"
)

var (
	resOptions = []string{
		"360p",
		"480p",
		"720p",
		"1080p",
	}
	ffmpegPath = "/usr/local/bin/ffmpeg"
	mov        = "video/quicktime"
	mp4        = "video/mp4"
)

func (this *Service) SaveImage(file *multipart.FileHeader, target string, fileID string, resize bool, isThumbnail bool) (*os.File, error) {

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

	t := target + "/" + fileID + "_" + file.Filename
	f := util.SaveFile(file, t)

	if resize {
		if err := ResizeImage(f); err != nil {
			log.Error(err)
			return nil, err
		}
	}

	return f, nil

}

func (this *Service) SaveVideoFiles(files []*multipart.FileHeader, fileID string, c chan bool) ([]model.FileInfo, *ffprobe.ProbeData, error) {

	var fileList []model.FileInfo
	var cTypes []string
	var data *ffprobe.ProbeData

	filesPath := StorageRoot + Videos + "/" + fileID
	hlsPath := filesPath + HLS

	_ = os.MkdirAll(filesPath, 0777)
	_ = os.MkdirAll(hlsPath, 0777)

	for _, file := range files {

		f := model.FileInfo{
			Size:        file.Size,
			Name:        file.Filename,
			ContentType: file.Header.Values("Content-Type")[0],
		}

		fileList = append(fileList, f)

		t := filesPath + "/" + file.Filename
		dst := util.SaveFile(file, t)

		switch file.Header.Values("Content-Type")[0] {
		case mov:
			if !util.StringInSlice(mov, cTypes) {
				data = this.GetVideoMetaData(dst)
				ConvertToHls(dst, ffmpegPath, resOptions, hlsPath, c)
			}
		case mp4:
			if !util.StringInSlice(mp4, cTypes) {
				data = this.GetVideoMetaData(dst)
				ConvertToHls(dst, ffmpegPath, resOptions, hlsPath, c)
			}
		default:
			cTypes = append(cTypes, file.Header.Values("Content-Type")[0])
		}

		cTypes = append(cTypes, file.Header.Values("Content-Type")[0])
	}

	return fileList, data, nil
}

// Start Generation of HLS files out of MP4 or MOV files
func ConvertToHls(dst *os.File, ffmpegPath string, resOptions []string, hlsPath string, c chan bool) {
	srcPath := dst.Name()
	variants, _ := GenerateHLSVariant(resOptions, "")
	GeneratePlaylist(variants, hlsPath, "")

	go func() {
		for _, res := range resOptions {
			res := res
			GenerateHLS(ffmpegPath, srcPath, hlsPath, res)
		}
		c <- true
	}()
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

	src := StorageRoot + Thumbnails + "/" + fileName

	err := os.Remove(src)
	if err != nil {
		log.Error("cannot delete thumbnail")
		return err
	}
	return nil
}

// Delete Thumbnail when deleting video
func (this *Service) DeleteVideoFiles(storageRef string) error {

	src := StorageRoot + Videos + "/" + storageRef

	err := os.RemoveAll(src)
	if err != nil {
		log.Error("cannot delete videofiles")
		return err
	}
	return nil
}

func (this *Service) GetVideoMetaData(file *os.File) *ffprobe.ProbeData {

	ctx, cancelFn := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelFn()

	data, err := ffprobe.ProbeURL(ctx, file.Name())
	if err != nil {
		log.Error("Error getting data: %v", err)
	}

	return data
}
