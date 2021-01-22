package service

import (
	"bytes"
	"crypto/tls"
	"dronegraphy/backend/util"
	"fmt"
	gomail "gopkg.in/mail.v2"
	"html/template"
	"log"
	"os"
)

type info struct {
	Name string
}

var (
	Username = "admin@dronegraphy.de"
	Password = "Dominim123_!"
)

func (this *Service) SendEmail(to string, actionCode int) {

	dir, _ := os.Getwd()

	var html string
	var subject string
	var from string
	var content string

	switch actionCode {
	case 0:
		html = "Welcome"
	case 1:
		html = dir + "/backend/templates/notify/ready/index.html"
		content = dir + "/backend/templates/notify/ready/images"
		from = "noreply@dronegraphy.de"
		subject = "Deine Aufnahme Ist Fertig!"
	default:
		html = "no action"
	}

	t := template.New("index.html")

	var err error
	t, err = t.ParseFiles(html)
	if err != nil {
		log.Println(err)
	}

	var tpl bytes.Buffer
	if err := t.Execute(&tpl, info{Name: ""}); err != nil {
		log.Println(err)
	}

	result := tpl.String()

	m := gomail.NewMessage()

	// Set E-Mail sender
	m.SetHeader("From", from)

	// Set E-Mail receivers
	m.SetHeader("To", to)

	// Set E-Mail subject
	m.SetHeader("Subject", subject)

	fileList, _ := util.GetFileNames(content)

	for _, c := range fileList {
		m.Embed(content + "/" + c)
	}

	// Set E-Mail body. You can set plain text or html with text/html
	m.SetBody("text/html", result)

	// Settings for SMTP server
	d := gomail.NewDialer("mail.privateemail.com", 587, Username, Password)

	// This is only needed when SSL/TLS certificate is not valid on server.
	// In production this should be set to false.
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	// Now send E-Mail
	if err := d.DialAndSend(m); err != nil {
		fmt.Println(err)
		panic(err)
	}

	return
}
