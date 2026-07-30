package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func newTestApp() *fiber.App {
	app := fiber.New()
	h := &HealthHandler{}
	app.Get("/api/v1/health", h.Check)
	return app
}

func TestHealthCheck_Returns200(t *testing.T) {
	app := newTestApp()

	req := httptest.NewRequest("GET", "/api/v1/health", nil)
	resp, err := app.Test(req)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
}

func TestHealthCheck_ReturnsJSON(t *testing.T) {
	app := newTestApp()

	req := httptest.NewRequest("GET", "/api/v1/health", nil)
	resp, err := app.Test(req)
	assert.NoError(t, err)
	assert.Equal(t, "application/json", resp.Header.Get("Content-Type"))
}

func TestHealthCheck_ReturnsValidEnvelope(t *testing.T) {
	app := newTestApp()

	req := httptest.NewRequest("GET", "/api/v1/health", nil)
	resp, err := app.Test(req)
	assert.NoError(t, err)

	body := make([]byte, 1024)
	n, _ := resp.Body.Read(body)
	body = body[:n]
	bodyStr := string(body)
	assert.Contains(t, bodyStr, `"status"`)
	assert.Contains(t, bodyStr, `"ok"`)
}
