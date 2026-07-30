package storage

import (
	"bytes"
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/dimesmastist/backend/internal/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestLocalDiskStrategy_RoundTrip(t *testing.T) {
	tmpDir := t.TempDir()
	strategy := NewLocalDiskStrategy(tmpDir)
	ctx := context.Background()

	content := []byte("fake image bytes")
	reader := bytes.NewReader(content)

	ref, err := strategy.Upload(ctx, reader, "test.jpg", "image/jpeg")
	require.NoError(t, err)
	assert.NotEmpty(t, ref.ProviderID)
	assert.Equal(t, "local", ref.Provider)
	assert.Contains(t, ref.URL, "/api/v1/photos/local/")

	// Verify file exists on disk
	path := filepath.Join(tmpDir, ref.ProviderID)
	data, err := os.ReadFile(path)
	require.NoError(t, err)
	assert.Equal(t, content, data)

	// GetURL
	url, err := strategy.GetURL(ctx, ref.ProviderID)
	require.NoError(t, err)
	assert.Equal(t, ref.URL, url)

	// Delete
	err = strategy.Delete(ctx, ref.ProviderID)
	require.NoError(t, err)

	// Verify deleted
	_, err = os.Stat(path)
	assert.True(t, os.IsNotExist(err))

	// GetURL after delete
	_, err = strategy.GetURL(ctx, ref.ProviderID)
	assert.ErrorIs(t, err, domain.ErrNotFound)
}

func TestLocalDiskStrategy_Delete_NonExistent(t *testing.T) {
	tmpDir := t.TempDir()
	strategy := NewLocalDiskStrategy(tmpDir)
	err := strategy.Delete(context.Background(), "nonexistent.jpg")
	assert.ErrorIs(t, err, domain.ErrNotFound)
}

func TestLocalDiskStrategy_Provider(t *testing.T) {
	s := NewLocalDiskStrategy(t.TempDir())
	assert.Equal(t, "local", s.Provider())
}

func TestLocalDiskStrategy_Upload_CreatesDir(t *testing.T) {
	tmpDir := filepath.Join(t.TempDir(), "nested", "deep")
	strategy := NewLocalDiskStrategy(tmpDir)

	ref, err := strategy.Upload(context.Background(), strings.NewReader("data"), "a.txt", "text/plain")
	require.NoError(t, err)
	assert.FileExists(t, filepath.Join(tmpDir, ref.ProviderID))
}

func TestGoogleDriveStrategy_ReturnsNotImplemented(t *testing.T) {
	s := NewGoogleDriveStrategy("id", "secret", "token")
	assert.Equal(t, "gdrive", s.Provider())

	_, err := s.Upload(context.Background(), nil, "f.jpg", "image/jpeg")
	assert.ErrorIs(t, err, domain.ErrNotImplemented)

	_, err = s.GetURL(context.Background(), "ref")
	assert.ErrorIs(t, err, domain.ErrNotImplemented)

	err = s.Delete(context.Background(), "ref")
	assert.ErrorIs(t, err, domain.ErrNotImplemented)
}

func TestOneDriveStrategy_ReturnsNotImplemented(t *testing.T) {
	s := NewOneDriveStrategy("id", "secret", "token")
	assert.Equal(t, "onedrive", s.Provider())

	_, err := s.Upload(context.Background(), nil, "f.jpg", "image/jpeg")
	assert.ErrorIs(t, err, domain.ErrNotImplemented)

	_, err = s.GetURL(context.Background(), "ref")
	assert.ErrorIs(t, err, domain.ErrNotImplemented)

	err = s.Delete(context.Background(), "ref")
	assert.ErrorIs(t, err, domain.ErrNotImplemented)
}

func TestS3Strategy_ReturnsNotImplemented(t *testing.T) {
	s := NewS3Strategy("bucket", "us-east-1", "key", "secret")
	assert.Equal(t, "s3", s.Provider())

	_, err := s.Upload(context.Background(), nil, "f.jpg", "image/jpeg")
	assert.ErrorIs(t, err, domain.ErrNotImplemented)

	_, err = s.GetURL(context.Background(), "ref")
	assert.ErrorIs(t, err, domain.ErrNotImplemented)

	err = s.Delete(context.Background(), "ref")
	assert.ErrorIs(t, err, domain.ErrNotImplemented)
}

func TestFactory_DefaultsToLocal(t *testing.T) {
	os.Unsetenv("PHOTO_PROVIDER")
	os.Unsetenv("PHOTO_DIR")
	s := NewPhotoStorageStrategy()
	assert.Equal(t, "local", s.Provider())
}

func TestFactory_SelectsLocal(t *testing.T) {
	t.Setenv("PHOTO_PROVIDER", "local")
	t.Setenv("PHOTO_DIR", t.TempDir())
	s := NewPhotoStorageStrategy()
	assert.Equal(t, "local", s.Provider())
}

func TestFactory_SelectsGDrive(t *testing.T) {
	t.Setenv("PHOTO_PROVIDER", "gdrive")
	t.Setenv("GOOGLE_CLIENT_ID", "id")
	t.Setenv("GOOGLE_CLIENT_SECRET", "secret")
	t.Setenv("GOOGLE_REFRESH_TOKEN", "token")
	s := NewPhotoStorageStrategy()
	assert.Equal(t, "gdrive", s.Provider())
}

func TestFactory_SelectsOneDrive(t *testing.T) {
	t.Setenv("PHOTO_PROVIDER", "onedrive")
	s := NewPhotoStorageStrategy()
	assert.Equal(t, "onedrive", s.Provider())
}

func TestFactory_SelectsS3(t *testing.T) {
	t.Setenv("PHOTO_PROVIDER", "s3")
	s := NewPhotoStorageStrategy()
	assert.Equal(t, "s3", s.Provider())
}

func TestFactory_UnknownProvider_FallsBackToLocal(t *testing.T) {
	t.Setenv("PHOTO_PROVIDER", "unknown_backend")
	t.Setenv("PHOTO_DIR", t.TempDir())
	s := NewPhotoStorageStrategy()
	assert.Equal(t, "local", s.Provider())
}

func TestLocalDiskStrategy_GetURL_NonExistent(t *testing.T) {
	s := NewLocalDiskStrategy(t.TempDir())
	_, err := s.GetURL(context.Background(), "nonexistent.jpg")
	assert.ErrorIs(t, err, domain.ErrNotFound)
}

func TestLocalDiskStrategy_Upload_EmptyFile(t *testing.T) {
	s := NewLocalDiskStrategy(t.TempDir())
	ref, err := s.Upload(context.Background(), bytes.NewReader([]byte{}), "empty.jpg", "image/jpeg")
	require.NoError(t, err)
	assert.NotEmpty(t, ref.ProviderID)

	data, _ := os.ReadFile(filepath.Join(t.TempDir(), ref.ProviderID))
	assert.Empty(t, data)
}

func TestLocalDiskStrategy_Upload_NoExtension(t *testing.T) {
	s := NewLocalDiskStrategy(t.TempDir())
	ref, err := s.Upload(context.Background(), bytes.NewReader([]byte("data")), "noext", "image/jpeg")
	require.NoError(t, err)
	assert.Contains(t, ref.ProviderID, ".bin")
}
