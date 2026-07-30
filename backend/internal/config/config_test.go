package config

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLoad_Defaults(t *testing.T) {
	t.Setenv("APP_PORT", "")
	t.Setenv("DB_PATH", "")
	t.Setenv("PHOTO_PROVIDER", "")
	t.Setenv("PHOTO_DIR", "")
	t.Setenv("CORS_ORIGINS", "")

	cfg := Load()
	assert.Equal(t, "8080", cfg.AppPort)
	assert.Equal(t, "tmp/dimes.db", cfg.DBPath)
	assert.Equal(t, "local", cfg.PhotoProvider)
	assert.Equal(t, "tmp/photos", cfg.PhotoDir)
	assert.Equal(t, "*", cfg.CORSOrigins)
}

func TestLoad_EnvOverrides(t *testing.T) {
	t.Setenv("APP_PORT", "9090")
	t.Setenv("DB_PATH", "/data/app.db")
	t.Setenv("PHOTO_PROVIDER", "s3")
	t.Setenv("PHOTO_DIR", "/data/photos")
	t.Setenv("CORS_ORIGINS", "http://localhost:5176")

	cfg := Load()
	assert.Equal(t, "9090", cfg.AppPort)
	assert.Equal(t, "/data/app.db", cfg.DBPath)
	assert.Equal(t, "s3", cfg.PhotoProvider)
	assert.Equal(t, "/data/photos", cfg.PhotoDir)
	assert.Equal(t, "http://localhost:5176", cfg.CORSOrigins)
}

func TestLoad_PartialEnv(t *testing.T) {
	t.Setenv("APP_PORT", "3000")
	t.Setenv("DB_PATH", "")
	t.Setenv("PHOTO_PROVIDER", "")
	t.Setenv("PHOTO_DIR", "")
	t.Setenv("CORS_ORIGINS", "")

	cfg := Load()
	assert.Equal(t, "3000", cfg.AppPort)
	assert.Equal(t, "tmp/dimes.db", cfg.DBPath) // default
}
