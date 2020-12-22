package main

import (
	"context"
	"dronegraphy/backend/router"
	"os"
	"os/signal"
	"time"
)

// A runnable type
type Runnable interface {
	Run()
	Shutdown(ctx context.Context)
}

func main() {

	// Init Echo
	r := router.NewRouter()
	r.RegisterRoutes(r.Echo.Group(""))

	// RUN
	run(r)

}

// RUN
func run(runners ...Runnable) {
	// Start everything
	for _, runner := range runners {
		runner.Run()
	}

	// Wait for interrupt signal to gracefully shutdown everything after a timeout of 10 seconds
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Try to gracefully shutdown everything
	for _, runner := range runners {
		runner.Shutdown(ctx)
	}

}
