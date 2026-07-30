package storage

import (
	"context"
	"fmt"
	"io"

	"github.com/dimesmastist/backend/internal/domain"
)

type OneDriveStrategy struct {
	ClientID     string
	ClientSecret string
	RefreshToken string
}

func NewOneDriveStrategy(clientID, clientSecret, refreshToken string) *OneDriveStrategy {
	return &OneDriveStrategy{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RefreshToken: refreshToken,
	}
}

func (s *OneDriveStrategy) Provider() string {
	return "onedrive"
}

func (s *OneDriveStrategy) Upload(ctx context.Context, file io.Reader, filename, contentType string) (*domain.PhotoRef, error) {
	return nil, fmt.Errorf("onedrive upload: %w", domain.ErrNotImplemented)
}

func (s *OneDriveStrategy) GetURL(ctx context.Context, ref string) (string, error) {
	return "", fmt.Errorf("onedrive get url: %w", domain.ErrNotImplemented)
}

func (s *OneDriveStrategy) Delete(ctx context.Context, ref string) error {
	return fmt.Errorf("onedrive delete: %w", domain.ErrNotImplemented)
}
