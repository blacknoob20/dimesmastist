package storage

import (
	"context"
	"fmt"
	"io"

	"github.com/dimesmastist/backend/internal/domain"
)

type S3Strategy struct {
	Bucket    string
	Region    string
	AccessKey string
	SecretKey string
}

func NewS3Strategy(bucket, region, accessKey, secretKey string) *S3Strategy {
	return &S3Strategy{
		Bucket:    bucket,
		Region:    region,
		AccessKey: accessKey,
		SecretKey: secretKey,
	}
}

func (s *S3Strategy) Provider() string {
	return "s3"
}

func (s *S3Strategy) Upload(ctx context.Context, file io.Reader, filename, contentType string) (*domain.PhotoRef, error) {
	return nil, fmt.Errorf("s3 upload: %w", domain.ErrNotImplemented)
}

func (s *S3Strategy) GetURL(ctx context.Context, ref string) (string, error) {
	return "", fmt.Errorf("s3 get url: %w", domain.ErrNotImplemented)
}

func (s *S3Strategy) Delete(ctx context.Context, ref string) error {
	return fmt.Errorf("s3 delete: %w", domain.ErrNotImplemented)
}
