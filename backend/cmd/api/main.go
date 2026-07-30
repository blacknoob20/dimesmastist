package main

import (
	"fmt"
	"log"
	"os"

	"github.com/dimesmastist/backend/internal/application"
	"github.com/dimesmastist/backend/internal/config"
	"github.com/dimesmastist/backend/internal/infrastructure/persistence"
	"github.com/dimesmastist/backend/internal/infrastructure/persistence/models"
	"github.com/dimesmastist/backend/internal/infrastructure/storage"
	httpRouter "github.com/dimesmastist/backend/internal/interfaces/http"
	"github.com/glebarez/sqlite"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func newApp(cfg *config.Config) (*fiber.App, error) {
	db, err := gorm.Open(sqlite.Open(cfg.DBPath), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("connect to database: %w", err)
	}

	if err := db.AutoMigrate(&models.CoinModel{}); err != nil {
		return nil, fmt.Errorf("migrate database: %w", err)
	}

	repo := persistence.NewGormCoinRepository(db)
	svc := application.NewCoinService(repo)
	photoStorage := storage.NewPhotoStorageStrategy()
	app := httpRouter.NewRouter(svc, photoStorage)

	return app, nil
}

func main() {
	cfg := config.Load()

	app, err := newApp(cfg)
	if err != nil {
		log.Fatalf("failed to initialize: %v", err)
	}

	log.Printf("dimes backend starting on :%s", cfg.AppPort)
	if err := app.Listen(":" + cfg.AppPort); err != nil {
		fmt.Fprintf(os.Stderr, "failed to start server: %v\n", err)
		os.Exit(1)
	}
}
