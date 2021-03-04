package util

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// Get an environment variable or return the default value
func GetEnvOrDefault(key string, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultValue
}

// Get Idtoken from request
func GetTokenFromRequest(c echo.Context) (string, error) {

	// Get Bearer JWT Token from Header which comes from frontend
	token := c.Request().Header.Get("Authorization")
	idToken := strings.Replace(token, "Bearer ", "", 1)

	return idToken, nil
}

func DownloadFile(URL, fileName string) error {
	//Get the response bytes from the url

	fmt.Println(URL)
	response, err := http.Get(URL)
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		fmt.Println(response.StatusCode)
	}
	//Create a empty file
	file, err := os.Create(fileName)
	if err != nil {
		log.Error(err)
		return err
	}
	defer file.Close()

	//Write the bytes to the fiel
	_, err = io.Copy(file, response.Body)
	if err != nil {
		log.Error(err)
		return err
	}

	fmt.Println(file.Name())

	return nil
}

func SaveFile(file *multipart.FileHeader, target string) *os.File {
	// Source
	src, err := file.Open()
	if err != nil {
		log.Error(err)
	}
	defer src.Close()

	// Destination
	dst, err := os.Create(target)
	if err != nil {
		log.Error(err)
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		log.Error(err)
	}

	return dst
}

func GetFileNames(searchDir string) ([]string, error) {

	var fileList []string

	files, err := ioutil.ReadDir(searchDir)
	if err != nil {
		log.Fatal(err)
	}

	for _, file := range files {
		fileList = append(fileList, file.Name())
		//fmt.Println(file.Name())
	}
	return fileList, nil
}

func StringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}

// CopyFile copies the contents of the file named src to the file named
// by dst. The file will be created if it does not already exist. If the
// destination file exists, all it's contents will be replaced by the contents
// of the source file. The file mode will be copied from the source and
// the copied data is synced/flushed to stable storage.
func CopyFile(src, dst string) (err error) {
	in, err := os.Open(src)
	if err != nil {
		return
	}
	defer in.Close()

	out, err := os.Create(dst)
	if err != nil {
		return
	}
	defer func() {
		if e := out.Close(); e != nil {
			err = e
		}
	}()

	_, err = io.Copy(out, in)
	if err != nil {
		return
	}

	err = out.Sync()
	if err != nil {
		return
	}

	si, err := os.Stat(src)
	if err != nil {
		return
	}
	err = os.Chmod(dst, si.Mode())
	if err != nil {
		return
	}

	return
}

// CopyDir recursively copies a directory tree, attempting to preserve permissions.
// Source directory must exist, destination directory must *not* exist.
// Symlinks are ignored and skipped.
func CopyDir(src string, dst string) (err error) {
	src = filepath.Clean(src)
	dst = filepath.Clean(dst)

	si, err := os.Stat(src)
	if err != nil {
		return err
	}
	if !si.IsDir() {
		return fmt.Errorf("source is not a directory")
	}

	_, err = os.Stat(dst)
	if err != nil && !os.IsNotExist(err) {
		return
	}
	if err == nil {
		return fmt.Errorf("destination already exists")
	}

	err = os.MkdirAll(dst, si.Mode())
	if err != nil {
		return
	}

	entries, err := ioutil.ReadDir(src)
	if err != nil {
		return
	}

	for _, entry := range entries {
		srcPath := filepath.Join(src, entry.Name())
		dstPath := filepath.Join(dst, entry.Name())

		if entry.IsDir() {
			err = CopyDir(srcPath, dstPath)
			if err != nil {
				return
			}
		} else {
			// Skip symlinks.
			if entry.Mode()&os.ModeSymlink != 0 {
				continue
			}

			err = CopyFile(srcPath, dstPath)
			if err != nil {
				return
			}
		}
	}

	return
}

func UniqueStringArray(stringSlice []string) []string {
	keys := make(map[string]bool)
	var list []string
	for _, entry := range stringSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}

func UniqueIntArray(stringSlice []int) []int {
	keys := make(map[int]bool)
	var list []int
	for _, entry := range stringSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}

func RemoveItemFromSlice(items []string, item string) []string {
	newitems := []string{}
	for _, i := range items {
		if i != item {
			newitems = append(newitems, i)
		}
	}
	return newitems
}
