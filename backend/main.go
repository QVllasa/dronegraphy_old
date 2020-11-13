package main

import (
	"net/http"
)

type MyWebServer bool

func (m MyWebServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {

}

func main() {
	var k MyWebServer
	k.ServeHTTP()
	http.ListenAndServe("localhost:8080", nil)
}
