package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/dimesmastist/backend/internal/domain"
	"github.com/google/uuid"
)

type LocalDiskStrategy struct {
	baseDir string
}

func NewLocalDiskStrategy(baseDir string) *LocalDiskStrategy {
	return &LocalDiskStrategy{baseDir: baseDir}
}

func (s *LocalDiskStrategy) Provider() string {
	return "local"
}

func (s *LocalDiskStrategy) Upload(ctx context.Context, file io.Reader, filename, contentType string) (*domain.PhotoRef, error) {
	if err := os.MkdirAll(s.baseDir, 0755); err != nil {
		return nil, fmt.Errorf("create upload dir: %w", err)
	}

	ext := filepath.Ext(filename)
	if ext == "" {
		ext = ".bin"
	}
	ref := uuid.New().String() + ext
	dst := filepath.Join(s.baseDir, ref)

	out, err := os.Create(dst)
	if err != nil {
		return nil, fmt.Errorf("create file: %w", err)
	}
	defer out.Close()

	if _, err := io.Copy(out, file); err != nil {
		return nil, fmt.Errorf("write file: %w", err)
	}

	return &domain.PhotoRef{
		ProviderID: ref,
		URL:        "/api/v1/photos/local/" + ref,
		Provider:   "local",
	}, nil
}

func (s *LocalDiskStrategy) GetURL(ctx context.Context, ref string) (string, error) {
	path := filepath.Join(s.baseDir, ref)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return "", domain.ErrNotFound
	}
	return "/api/v1/photos/local/" + ref, nil
}

func (s *LocalDiskStrategy) Delete(ctx context.Context, ref string) error {
	path := filepath.Join(s.baseDir, ref)
	if err := os.Remove(path); os.IsNotExist(err) {
		return domain.ErrNotFound
	} else if err != nil {
		return fmt.Errorf("delete file: %w", err)
	}
	return nil
}
