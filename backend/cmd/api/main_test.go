package main

import (
	"path/filepath"
	"testing"

	"github.com/dimesmastist/backend/internal/config"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewApp_Success(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "test.db")
	t.Setenv("APP_PORT", "0")
	t.Setenv("DB_PATH", dbPath)
	t.Setenv("PHOTO_PROVIDER", "local")
	t.Setenv("PHOTO_DIR", t.TempDir())

	cfg := config.Load()
	app, err := newApp(cfg)
	require.NoError(t, err)
	assert.NotNil(t, app)
}

func TestNewApp_InvalidDBPath(t *testing.T) {
	t.Setenv("APP_PORT", "0")
	t.Setenv("DB_PATH", "/nonexistent/path/db.sqlite")
	t.Setenv("PHOTO_PROVIDER", "local")
	t.Setenv("PHOTO_DIR", t.TempDir())

	cfg := config.Load()
	_, err := newApp(cfg)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "connect to database")
}

func TestNewApp_DefaultConfig(t *testing.T) {
	t.Setenv("APP_PORT", "")
	t.Setenv("DB_PATH", "")
	t.Setenv("PHOTO_PROVIDER", "")
	t.Setenv("PHOTO_DIR", "")
	t.Setenv("CORS_ORIGINS", "")

	cfg := config.Load()
	assert.Equal(t, "8080", cfg.AppPort)
	assert.Equal(t, "tmp/dimes.db", cfg.DBPath)
}
