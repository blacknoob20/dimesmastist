package dto

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateCoinRequest_Fields(t *testing.T) {
	req := CreateCoinRequest{
		Country:      "Ecuador",
		Denomination: "1 Sucre",
		Condition:    "UNC",
		Metal:        "Níquel",
	}
	assert.Equal(t, "Ecuador", req.Country)
	assert.Equal(t, "1 Sucre", req.Denomination)
}

func TestCoinResponse_Fields(t *testing.T) {
	resp := CoinResponse{
		CoinID:      1,
		Version:     1,
		IsCurrent:   true,
		Country:     "Ecuador",
		Denomination: "1 Sucre",
	}
	assert.Equal(t, uint64(1), resp.CoinID)
	assert.True(t, resp.IsCurrent)
}

func TestListResponse_Fields(t *testing.T) {
	resp := ListResponse{
		Status:  "success",
		Message: "ok",
		Data: ListData{
			Items: []CoinResponse{{Country: "Ecuador"}},
			Total: 1,
			Page:  1,
			Limit: 20,
		},
	}
	assert.Equal(t, "success", resp.Status)
	assert.Len(t, resp.Data.Items, 1)
}

func TestErrorResponse_Fields(t *testing.T) {
	resp := ErrorResponse{
		Status:  "error",
		Message: "validation failed",
		Errors: []FieldError{
			{Field: "country", Tag: "required"},
		},
	}
	assert.Equal(t, "error", resp.Status)
	assert.Len(t, resp.Errors, 1)
}

func TestMessageResponse_Fields(t *testing.T) {
	resp := MessageResponse{
		Status:  "success",
		Message: "deleted",
	}
	assert.Equal(t, "success", resp.Status)
}

func TestPhotoUploadResponse_Fields(t *testing.T) {
	resp := PhotoUploadResponse{
		Status:  "success",
		Message: "uploaded",
		Data: PhotoData{
			ProviderID: "abc-123",
			URL:        "/api/v1/photos/local/abc-123",
			Provider:   "local",
		},
	}
	assert.Equal(t, "abc-123", resp.Data.ProviderID)
}

func TestListData_DefaultValues(t *testing.T) {
	data := ListData{}
	assert.Equal(t, int64(0), data.Total)
	assert.Equal(t, 0, data.Page)
	assert.Equal(t, 0, data.Limit)
	assert.Nil(t, data.Items)
}

func TestFieldError_Fields(t *testing.T) {
	fe := FieldError{Field: "metal", Tag: "required"}
	assert.Equal(t, "metal", fe.Field)
	assert.Equal(t, "required", fe.Tag)
}
