package domain

import (
	"context"
	"io"
)

type PhotoStorageStrategy interface {
	Provider() string
	Upload(ctx context.Context, file io.Reader, filename, contentType string) (*PhotoRef, error)
	GetURL(ctx context.Context, ref string) (string, error)
	Delete(ctx context.Context, ref string) error
}

type PhotoRef struct {
	ProviderID string
	URL        string
	Provider   string
}
