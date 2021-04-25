package service

import (
	"errors"
	"fmt"
	"github.com/labstack/gommon/log"
	"os"
	"os/exec"
	"path/filepath"
)

// Variant is HLS variant that gonna be use to generate HLS master playlist
type Variant struct {
	// URL indicate the location of the variant playlist.
	// If variant located on remote server, this url should
	// contain the full url
	URL string

	// Bandwidth is an integer that is the upper bound of
	// the overall bitrate for each media file, in bits per second
	Bandwidth string

	// Resolution is display size, in pixels, at which to display
	// all of the video in the playlist
	Resolution string

	// Codecs is quoted string containing a comma-separated list of formats,
	// where each format specifies a media sample type that's present
	// in a media segment in the playlist file. Valid format identifiers are
	// those in the ISO file format name space defined by RFC 6381
	Codecs string
}

// GenerateHLS will generate HLS file based on resolution presets.
// The available resolutions are: 360p, 480p, 720p and 1080p.
func GenerateHLS(ffmpegPath, srcPath, targetPath, res string) error {
	fmt.Println(
		fmt.Sprintf("Start generating HLS for %v", res),
	)
	options, err := getOptions(srcPath, targetPath, res)
	if err != nil {
		log.Fatal(err)
		return err
	}

	cmd := exec.Command(ffmpegPath, options...)
	if err := cmd.Start(); err != nil {
		log.Fatal(err)
	}

	if err = cmd.Wait(); err != nil {
		log.Fatal(err)
	}

	return err
}

// GenerateHLSVariant will generate variants info from the given resolutions.
// The available resolutions are: 360p, 480p, 720p and 1080p.
func GenerateHLSVariant(resOptions []string, locPrefix string) ([]*Variant, error) {
	if len(resOptions) == 0 {
		return nil, errors.New("Please give at least 1 resolutions.")
	}

	var variants []*Variant

	for _, r := range resOptions {
		c, err := getConfig(r)
		if err != nil {
			continue
		}

		url := fmt.Sprintf("%s.m3u8", c.Name)
		if locPrefix != "" {
			url = locPrefix + "/" + url
		}

		v := &Variant{
			URL:        url,
			Bandwidth:  c.Bandwidth,
			Resolution: c.Resolution,
		}

		variants = append(variants, v)
	}

	if len(variants) == 0 {
		return nil, errors.New("No valid resolutions found.")
	}

	return variants, nil
}

// GeneratePlaylist will generate playlist file from the given variants.
// Variant itself can be generate from GenerateHLSVariant() function of
// suplied by the caller
func GeneratePlaylist(variants []*Variant, targetPath, filename string) {
	// Set default filename
	if filename == "" {
		filename = "playlist.m3u8"
	}

	// M3U Header
	data := "#EXTM3U\n"
	data += "#EXT-X-VERSION:3\n"

	// Add M3U Info for each variant
	for _, v := range variants {
		// URL & bandwidth is required,
		// if not found we will excluded them from the playlist
		if v.URL == "" || v.Bandwidth == "" {
			continue
		}

		data += "#EXT-X-STREAM-INF:"
		data += fmt.Sprintf("BANDWIDTH=%s", v.Bandwidth)
		if v.Resolution != "" {
			data += fmt.Sprintf(",RESOLUTION=%s", v.Resolution)
		}
		if v.Codecs != "" {
			data += fmt.Sprintf(",CODECS=%s", v.Codecs)
		}

		data += fmt.Sprintf("\n%s\n", v.URL)
	}

	// Write everything to the file
	f, _ := os.Create(filepath.Join(targetPath, filename))
	defer f.Close()

	f.Write([]byte(data))
}

func getOptions(srcPath, targetPath, res string) ([]string, error) {
	config, err := getConfig(res)
	if err != nil {
		return nil, err
	}

	filenameTS := filepath.Join(targetPath, res+"_%03d.ts")
	filenameM3U8 := filepath.Join(targetPath, res+".m3u8")

	options := []string{
		"-v", "verbose",
		"-hide_banner",
		"-y",
		"-i", srcPath,
		"-vf", "scale=trunc(oh*a/2)*2:1080",
		//"-vf ","scale=w=1280:h=720:force_original_aspect_ratio=decrease",
		"-c:a", "aac",
		"-ar", "48000",
		"-c:v", "h264",
		"-profile:v", "main",
		"-crf", "20",
		"-sc_threshold", "0",
		"-g", "48",
		"-keyint_min", "48",
		"-hls_time", "10",
		"-hls_playlist_type", "vod",
		"-b:v", config.VideoBitrate,
		"-maxrate", config.Maxrate,
		"-bufsize", config.BufSize,
		"-b:a", config.AudioBitrate,
		"-preset", "veryslow",
		"-hls_segment_filename", filenameTS,
		filenameM3U8,
	}

	return options, nil
}

type config struct {
	Name         string
	VideoBitrate string
	Maxrate      string
	BufSize      string
	AudioBitrate string
	Resolution   string
	Bandwidth    string
}

var preset = map[string]*config{
	"360p": {
		Name:         "360p",
		VideoBitrate: "800k",
		Maxrate:      "856k",
		BufSize:      "1200k",
		AudioBitrate: "96k",
		Resolution:   "640x360",
		Bandwidth:    "800000",
	},
	"480p": {
		Name:         "480p",
		VideoBitrate: "1400k",
		Maxrate:      "1498k",
		BufSize:      "2100k",
		AudioBitrate: "128k",
		Resolution:   "842x480",
		Bandwidth:    "1400000",
	},
	"720p": {
		Name:         "720p",
		VideoBitrate: "2800k",
		Maxrate:      "2996k",
		BufSize:      "4200k",
		AudioBitrate: "128k",
		Resolution:   "1280x720",
		Bandwidth:    "2800000",
	},
	"1080p": {
		Name:         "1080p",
		VideoBitrate: "5000k",
		Maxrate:      "5350k",
		BufSize:      "7500k",
		AudioBitrate: "192k",
		Resolution:   "1920x1080",
		Bandwidth:    "5000000",
	},
}

// getConfig return config from the available preset
func getConfig(res string) (*config, error) {
	cfg, ok := preset[res]
	if !ok {
		return nil, errors.New("Preset not found")
	}

	return cfg, nil
}
