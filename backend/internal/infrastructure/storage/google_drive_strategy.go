package storage

import (
	"context"
	"fmt"
	"io"

	"github.com/dimesmastist/backend/internal/domain"
)

type GoogleDriveStrategy struct {
	ClientID     string
	ClientSecret string
	RefreshToken string
}

func NewGoogleDriveStrategy(clientID, clientSecret, refreshToken string) *GoogleDriveStrategy {
	return &GoogleDriveStrategy{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RefreshToken: refreshToken,
	}
}

func (s *GoogleDriveStrategy) Provider() string {
	return "gdrive"
}

func (s *GoogleDriveStrategy) Upload(ctx context.Context, file io.Reader, filename, contentType string) (*domain.PhotoRef, error) {
	return nil, fmt.Errorf("google drive upload: %w", domain.ErrNotImplemented)
}

func (s *GoogleDriveStrategy) GetURL(ctx context.Context, ref string) (string, error) {
	return "", fmt.Errorf("google drive get url: %w", domain.ErrNotImplemented)
}

func (s *GoogleDriveStrategy) Delete(ctx context.Context, ref string) error {
	return fmt.Errorf("google drive delete: %w", domain.ErrNotImplemented)
}
