package service

import (
	"crypto/tls"
	"fmt"
	gomail "gopkg.in/mail.v2"
)

type info struct {
	Name string
}

func (this *Service) SendEmail(from string, to string, subject string, body string) {

	//t := template.New("email.html")
	//
	//var err error
	//t, err = t.ParseFiles("/Users/qendrimvllasa/Projects/dronegraphy/backend/templates/email.html")
	//if err != nil {
	//	log.Println(err)
	//}
	//
	//var tpl bytes.Buffer
	//if err := t.Execute(&tpl, info{Name: "asdasdasd"}); err != nil {
	//	log.Println(err)
	//}
	//
	//result := tpl.String()

	m := gomail.NewMessage()

	// Set E-Mail sender
	m.SetHeader("From", from)

	// Set E-Mail receivers
	m.SetHeader("To", to)

	// Set E-Mail subject
	m.SetHeader("Subject", subject)

	// Set E-Mail body. You can set plain text or html with text/html
	m.SetBody("text/plain", body)

	// Settings for SMTP server
	d := gomail.NewDialer("mail.privateemail.com", 587, "info@dronegraphy.de", "Dominim123_!")

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
