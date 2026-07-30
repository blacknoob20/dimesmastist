package config

import "os"

type Config struct {
	AppPort       string
	DBPath        string
	PhotoProvider string
	PhotoDir      string
	CORSOrigins   string
}

func Load() *Config {
	return &Config{
		AppPort:       getEnv("APP_PORT", "8080"),
		DBPath:        getEnv("DB_PATH", "tmp/dimes.db"),
		PhotoProvider: getEnv("PHOTO_PROVIDER", "local"),
		PhotoDir:      getEnv("PHOTO_DIR", "tmp/photos"),
		CORSOrigins:   getEnv("CORS_ORIGINS", "*"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
