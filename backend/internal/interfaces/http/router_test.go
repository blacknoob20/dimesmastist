package http

import (
	"path/filepath"
	"testing"

	"github.com/dimesmastist/backend/internal/application"
	"github.com/dimesmastist/backend/internal/infrastructure/persistence"
	"github.com/dimesmastist/backend/internal/infrastructure/persistence/models"
	"github.com/dimesmastist/backend/internal/infrastructure/storage"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestNewRouter_ReturnsApp(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(filepath.Join(t.TempDir(), "test.db")), &gorm.Config{})
	require.NoError(t, err)
	db.AutoMigrate(&models.CoinModel{})

	repo := persistence.NewGormCoinRepository(db)
	svc := application.NewCoinService(repo)
	photoStorage := storage.NewLocalDiskStrategy(t.TempDir())

	app := NewRouter(svc, photoStorage)
	assert.NotNil(t, app)
}

func TestNewRouter_HealthEndpoint(t *testing.T) {
	db, _ := gorm.Open(sqlite.Open(filepath.Join(t.TempDir(), "test.db")), &gorm.Config{})
	db.AutoMigrate(&models.CoinModel{})

	repo := persistence.NewGormCoinRepository(db)
	svc := application.NewCoinService(repo)
	photoStorage := storage.NewLocalDiskStrategy(t.TempDir())

	app := NewRouter(svc, photoStorage)

	handler := app.Stack()
	assert.NotNil(t, handler)
}
