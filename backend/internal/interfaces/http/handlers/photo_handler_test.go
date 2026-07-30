package handlers

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http/httptest"
	"net/textproto"
	"testing"

	"github.com/dimesmastist/backend/internal/infrastructure/storage"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestPhotoApp(t *testing.T) *fiber.App {
	tmpDir := t.TempDir()
	localStorage := storage.NewLocalDiskStrategy(tmpDir)
	handler := NewPhotoHandler(localStorage)

	app := fiber.New()
	app.Post("/api/v1/coins/:id/photos", handler.Upload)
	app.Get("/api/v1/photos/:provider/:ref", handler.Serve)
	return app
}

func TestUploadPhoto_201(t *testing.T) {
	app := newTestPhotoApp(t)

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	writer.WriteField("face", "anverso")
	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", `form-data; name="file"; filename="test.jpg"`)
	h.Set("Content-Type", "image/jpeg")
	part, _ := writer.CreatePart(h)
	part.Write([]byte("fake image data"))
	writer.Close()

	req := httptest.NewRequest("POST", "/api/v1/coins/1/photos", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 201, resp.StatusCode)

	bodyBytes := make([]byte, 1024)
	n, _ := resp.Body.Read(bodyBytes)
	bodyStr := string(bodyBytes[:n])
	assert.Contains(t, bodyStr, `"provider_id"`)
	assert.Contains(t, bodyStr, `"url"`)
	assert.Contains(t, bodyStr, `"local"`)
}

func TestUploadPhoto_400_MissingFile(t *testing.T) {
	app := newTestPhotoApp(t)

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	writer.WriteField("face", "anverso")
	writer.Close()

	req := httptest.NewRequest("POST", "/api/v1/coins/1/photos", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestUploadPhoto_400_InvalidFace(t *testing.T) {
	app := newTestPhotoApp(t)

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	writer.WriteField("face", "invalid")
	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", `form-data; name="file"; filename="test.jpg"`)
	h.Set("Content-Type", "image/jpeg")
	part, _ := writer.CreatePart(h)
	part.Write([]byte("data"))
	writer.Close()

	req := httptest.NewRequest("POST", "/api/v1/coins/1/photos", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestUploadPhoto_400_NonImageFile(t *testing.T) {
	app := newTestPhotoApp(t)

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	writer.WriteField("face", "anverso")
	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", `form-data; name="file"; filename="test.txt"`)
	h.Set("Content-Type", "text/plain")
	part, _ := writer.CreatePart(h)
	part.Write([]byte("not an image"))
	writer.Close()

	req := httptest.NewRequest("POST", "/api/v1/coins/1/photos", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestUploadPhoto_400_InvalidCoinID(t *testing.T) {
	app := newTestPhotoApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins/abc/photos", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestUploadPhoto_201_Reverso(t *testing.T) {
	app := newTestPhotoApp(t)

	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	writer.WriteField("face", "reverso")
	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", `form-data; name="file"; filename="back.jpg"`)
	h.Set("Content-Type", "image/jpeg")
	part, _ := writer.CreatePart(h)
	part.Write([]byte("back image"))
	writer.Close()

	req := httptest.NewRequest("POST", "/api/v1/coins/1/photos", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 201, resp.StatusCode)
}

func TestServePhoto_404_NonExistent(t *testing.T) {
	app := newTestPhotoApp(t)

	req := httptest.NewRequest("GET", "/api/v1/photos/local/nonexistent.jpg", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 404, resp.StatusCode)
}

func TestServePhoto_301_Redirect(t *testing.T) {
	app := newTestPhotoApp(t)

	// Upload first
	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	writer.WriteField("face", "anverso")
	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", `form-data; name="file"; filename="photo.jpg"`)
	h.Set("Content-Type", "image/jpeg")
	part, _ := writer.CreatePart(h)
	part.Write([]byte("fake image"))
	writer.Close()

	req := httptest.NewRequest("POST", "/api/v1/coins/1/photos", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	resp, _ := app.Test(req)

	bodyBytes := make([]byte, 1024)
	n, _ := resp.Body.Read(bodyBytes)

	var result struct {
		Data struct {
			ProviderID string `json:"provider_id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(bodyBytes[:n], &result))
	require.NotEmpty(t, result.Data.ProviderID)

	// Serve - redirect to local file
	req = httptest.NewRequest("GET", "/api/v1/photos/local/"+result.Data.ProviderID, nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 301, resp.StatusCode)
}

func TestServePhoto_404_WrongProvider(t *testing.T) {
	app := newTestPhotoApp(t)

	req := httptest.NewRequest("GET", "/api/v1/photos/gdrive/some-ref.jpg", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 404, resp.StatusCode)
}
