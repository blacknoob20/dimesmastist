package http

import (
	"github.com/dimesmastist/backend/internal/application"
	"github.com/dimesmastist/backend/internal/domain"
	"github.com/dimesmastist/backend/internal/interfaces/http/handlers"
	"github.com/gofiber/fiber/v2"
)

func NewRouter(coinService *application.CoinService, storage domain.PhotoStorageStrategy) *fiber.App {
	app := fiber.New()

	api := app.Group("/api/v1")

	health := &handlers.HealthHandler{}
	api.Get("/health", health.Check)

	coin := handlers.NewCoinHandler(coinService)
	api.Post("/coins", coin.Create)
	api.Get("/coins/:id", coin.Get)
	api.Get("/coins", coin.List)
	api.Put("/coins/:id", coin.Update)
	api.Delete("/coins/:id", coin.Delete)
	api.Get("/coins/:id/history", coin.History)

	photo := handlers.NewPhotoHandler(storage)
	api.Post("/coins/:id/photos", photo.Upload)
	api.Get("/photos/:provider/:ref", photo.Serve)

	return app
}
