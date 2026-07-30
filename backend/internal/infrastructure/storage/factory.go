package storage

import (
	"fmt"
	"os"

	"github.com/dimesmastist/backend/internal/domain"
)

func NewPhotoStorageStrategy() domain.PhotoStorageStrategy {
	provider := os.Getenv("PHOTO_PROVIDER")
	if provider == "" {
		provider = "local"
	}

	switch provider {
	case "local":
		dir := os.Getenv("PHOTO_DIR")
		if dir == "" {
			dir = "tmp/photos"
		}
		return NewLocalDiskStrategy(dir)

	case "gdrive":
		return NewGoogleDriveStrategy(
			os.Getenv("GOOGLE_CLIENT_ID"),
			os.Getenv("GOOGLE_CLIENT_SECRET"),
			os.Getenv("GOOGLE_REFRESH_TOKEN"),
		)

	case "onedrive":
		return NewOneDriveStrategy(
			os.Getenv("ONEDRIVE_CLIENT_ID"),
			os.Getenv("ONEDRIVE_CLIENT_SECRET"),
			os.Getenv("ONEDRIVE_REFRESH_TOKEN"),
		)

	case "s3":
		return NewS3Strategy(
			os.Getenv("S3_BUCKET"),
			os.Getenv("S3_REGION"),
			os.Getenv("S3_ACCESS_KEY"),
			os.Getenv("S3_SECRET_KEY"),
		)

	default:
		fmt.Fprintf(os.Stderr, "unknown PHOTO_PROVIDER %q, falling back to local\n", provider)
		dir := os.Getenv("PHOTO_DIR")
		if dir == "" {
			dir = "tmp/photos"
		}
		return NewLocalDiskStrategy(dir)
	}
}
