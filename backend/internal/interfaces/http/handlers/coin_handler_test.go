package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/dimesmastist/backend/internal/application"
	"github.com/dimesmastist/backend/internal/infrastructure/persistence"
	"github.com/dimesmastist/backend/internal/infrastructure/persistence/models"
	"github.com/dimesmastist/backend/tests/helpers"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func newTestCoinApp(t *testing.T) (*fiber.App, *application.CoinService) {
	db := helpers.NewTestDB(t)
	require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

	repo := persistence.NewGormCoinRepository(db)
	svc := application.NewCoinService(repo)

	app := fiber.New()
	handler := NewCoinHandler(svc)

	api := app.Group("/api/v1")
	api.Post("/coins", handler.Create)
	api.Get("/coins/:id", handler.Get)
	api.Get("/coins", handler.List)
	api.Put("/coins/:id", handler.Update)
	api.Delete("/coins/:id", handler.Delete)
	api.Get("/coins/:id/history", handler.History)

	return app, svc
}

func validCoinJSON() string {
	return `{
		"country": "Ecuador",
		"denomination": "1 Sucre",
		"condition": "UNC",
		"metal": "Níquel",
		"year": 1994
	}`
}

func TestPostCoins_201_AndPersisted(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins", strings.NewReader(validCoinJSON()))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 201, resp.StatusCode)

	body := make([]byte, 2048)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"status":"success"`)
	assert.Contains(t, bodyStr, `"coin_id"`)
	assert.Contains(t, bodyStr, `"Ecuador"`)
}

func TestPostCoins_400_MissingCountry(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{"denomination":"1 Sucre"}`))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)

	body := make([]byte, 1024)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"validación fallida"`)
	assert.Contains(t, bodyStr, `"errors"`)
}

func TestPostCoins_400_MissingDenomination(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{"country":"Ecuador"}`))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestPostCoins_400_InvalidCondition(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{"country":"Ecuador","denomination":"1 Sucre","condition":"BROKEN"}`))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestGetCoins_200_ReturnsCoin(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins", strings.NewReader(validCoinJSON()))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	coinID := extractCoinID(t, resp)

	req = httptest.NewRequest("GET", fmt.Sprintf("/api/v1/coins/%d", coinID), nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestGetCoins_404_OnNonExistent(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("GET", "/api/v1/coins/9999", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 404, resp.StatusCode)
}

func TestGetCoins_400_InvalidID(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("GET", "/api/v1/coins/abc", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestListCoins_200_Paginated(t *testing.T) {
	app, _ := newTestCoinApp(t)

	for i := 0; i < 5; i++ {
		req := httptest.NewRequest("POST", "/api/v1/coins",
			strings.NewReader(fmt.Sprintf(`{"country":"Ecuador","denomination":"Coin%d"}`, i)))
		req.Header.Set("Content-Type", "application/json")
		app.Test(req)
	}

	req := httptest.NewRequest("GET", "/api/v1/coins?page=1&limit=2", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	body := make([]byte, 4096)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"total":5`)
	assert.Contains(t, bodyStr, `"items"`)
}

func TestListCoins_200_FilterByCondition(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{"country":"Ecuador","denomination":"A","condition":"UNC"}`))
	req.Header.Set("Content-Type", "application/json")
	app.Test(req)

	req = httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{"country":"Ecuador","denomination":"B","condition":"VF"}`))
	req.Header.Set("Content-Type", "application/json")
	app.Test(req)

	req = httptest.NewRequest("GET", "/api/v1/coins?condition=UNC", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	body := make([]byte, 4096)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"total":1`)
}

func TestPutCoins_200_CreatesNewVersion(t *testing.T) {
	app, _ := newTestCoinApp(t)

	// Create
	req := httptest.NewRequest("POST", "/api/v1/coins", strings.NewReader(validCoinJSON()))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	coinID := extractCoinID(t, resp)

	// Update
	updateBody := `{"metal":"Plata 0.900"}`
	req = httptest.NewRequest("PUT", fmt.Sprintf("/api/v1/coins/%d", coinID),
		strings.NewReader(updateBody))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	body := make([]byte, 2048)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"Plata 0.900"`)
}

func TestPutCoins_404_OnNonExistent(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("PUT", "/api/v1/coins/9999",
		strings.NewReader(`{"metal":"Plata"}`))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 404, resp.StatusCode)
}

func TestDeleteCoins_204(t *testing.T) {
	app, _ := newTestCoinApp(t)

	// Create
	req := httptest.NewRequest("POST", "/api/v1/coins", strings.NewReader(validCoinJSON()))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	coinID := extractCoinID(t, resp)

	// Delete
	req = httptest.NewRequest("DELETE", fmt.Sprintf("/api/v1/coins/%d", coinID), nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 204, resp.StatusCode)

	// Verify deleted
	req = httptest.NewRequest("GET", fmt.Sprintf("/api/v1/coins/%d", coinID), nil)
	resp, err = app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 404, resp.StatusCode)
}

func TestHistoryCoins_200(t *testing.T) {
	app, _ := newTestCoinApp(t)

	// Create
	req := httptest.NewRequest("POST", "/api/v1/coins", strings.NewReader(validCoinJSON()))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	coinID := extractCoinID(t, resp)

	// Update
	req = httptest.NewRequest("PUT", fmt.Sprintf("/api/v1/coins/%d", coinID),
		strings.NewReader(`{"metal":"Plata"}`))
	req.Header.Set("Content-Type", "application/json")
	app.Test(req)

	// History
	req = httptest.NewRequest("GET", fmt.Sprintf("/api/v1/coins/%d/history", coinID), nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	body := make([]byte, 4096)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"total":2`)
}

func TestResponseEnvelope_Standard(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins", strings.NewReader(validCoinJSON()))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	body := make([]byte, 2048)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"status"`)
	assert.Contains(t, bodyStr, `"message"`)
	assert.Contains(t, bodyStr, `"data"`)
}

func TestPostCoins_400_InvalidJSON(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{invalid json`))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestDerefBool_Nil(t *testing.T) {
	assert.False(t, derefBool(nil))
}

func TestDerefBool_True(t *testing.T) {
	v := true
	assert.True(t, derefBool(&v))
}

func TestDerefBool_False(t *testing.T) {
	v := false
	assert.False(t, derefBool(&v))
}

func TestDerefStr_Nil(t *testing.T) {
	assert.Equal(t, "", derefStr(nil))
}

func TestDerefStr_Value(t *testing.T) {
	v := "hello"
	assert.Equal(t, "hello", derefStr(&v))
}

func TestPostCoins_201_WithOptionalFields(t *testing.T) {
	app, _ := newTestCoinApp(t)

	body := `{
		"country": "Ecuador",
		"denomination": "1 Sucre",
		"condition": "UNC",
		"metal": "Níquel",
		"year": 1994,
		"conmemorativa": true,
		"emitidaPor": "Banco Central",
		"peso": 25.5,
		"diametro": 38.0,
		"espesor": 2.5,
		"forma": "Octogonal",
		"orientacion": "Horizontal",
		"canto": "Estriado",
		"ceca": "Quito",
		"km": "KM#88",
		"serie": "Serie A",
		"descripcion": "Moneda rara",
		"notas": "Buena conservación",
		"procedencia": "Subasta",
		"precio_compra": 15.0,
		"etiquetas": ["rara", "plata"]
	}`

	req := httptest.NewRequest("POST", "/api/v1/coins", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 201, resp.StatusCode)

	bodyBytes := make([]byte, 2048)
	n, _ := resp.Body.Read(bodyBytes)
	bodyStr := string(bodyBytes[:n])
	assert.Contains(t, bodyStr, `"Octogonal"`)
	assert.Contains(t, bodyStr, `"KM#88"`)
}

func TestPutCoins_400_InvalidJSON(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("PUT", "/api/v1/coins/1",
		strings.NewReader(`{bad json`))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestPutCoins_400_InvalidID(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("PUT", "/api/v1/coins/abc",
		strings.NewReader(`{"metal":"Plata"}`))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestDeleteCoins_400_InvalidID(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("DELETE", "/api/v1/coins/abc", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestHistoryCoins_400_InvalidID(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("GET", "/api/v1/coins/abc/history", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestListCoins_200_EmptyResult(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("GET", "/api/v1/coins?page=1&limit=10", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	body := make([]byte, 4096)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"total":0`)
	assert.Contains(t, bodyStr, `"items":[]`)
}

func TestListCoins_200_FilterByCountry(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{"country":"Ecuador","denomination":"A"}`))
	req.Header.Set("Content-Type", "application/json")
	app.Test(req)

	req = httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{"country":"México","denomination":"B"}`))
	req.Header.Set("Content-Type", "application/json")
	app.Test(req)

	req = httptest.NewRequest("GET", "/api/v1/coins?country=Ecuador", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	body := make([]byte, 4096)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"total":1`)
}

func TestListCoins_200_FilterByQuery(t *testing.T) {
	app, _ := newTestCoinApp(t)

	req := httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{"country":"Ecuador","denomination":"1 Sucre","km":"KM#88"}`))
	req.Header.Set("Content-Type", "application/json")
	app.Test(req)

	req = httptest.NewRequest("POST", "/api/v1/coins",
		strings.NewReader(`{"country":"México","denomination":"1 Peso","km":"KM#407"}`))
	req.Header.Set("Content-Type", "application/json")
	app.Test(req)

	req = httptest.NewRequest("GET", "/api/v1/coins?q=Sucre", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	body := make([]byte, 4096)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"total":1`)
}

func TestGetCoins_200_AllVersions(t *testing.T) {
	app, _ := newTestCoinApp(t)

	// Create
	req := httptest.NewRequest("POST", "/api/v1/coins", strings.NewReader(validCoinJSON()))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)
	coinID := extractCoinID(t, resp)

	// Update
	req = httptest.NewRequest("PUT", fmt.Sprintf("/api/v1/coins/%d", coinID),
		strings.NewReader(`{"metal":"Plata"}`))
	req.Header.Set("Content-Type", "application/json")
	app.Test(req)

	// List all versions
	req = httptest.NewRequest("GET", "/api/v1/coins?all=true", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)

	body := make([]byte, 4096)
	n, _ := resp.Body.Read(body)
	bodyStr := string(body[:n])
	assert.Contains(t, bodyStr, `"total":2`)
}

func extractCoinID(t *testing.T, resp *http.Response) uint64 {
	t.Helper()
	body := make([]byte, 2048)
	n, _ := resp.Body.Read(body)

	var result struct {
		Data struct {
			CoinID uint64 `json:"coin_id"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(body[:n], &result))
	require.NotZero(t, result.Data.CoinID)
	return result.Data.CoinID
}
