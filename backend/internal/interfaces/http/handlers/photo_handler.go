package handlers

import (
	"fmt"
	"strings"

	"github.com/dimesmastist/backend/internal/domain"
	"github.com/dimesmastist/backend/internal/interfaces/http/dto"
	"github.com/gofiber/fiber/v2"
)

type PhotoHandler struct {
	storage domain.PhotoStorageStrategy
}

func NewPhotoHandler(storage domain.PhotoStorageStrategy) *PhotoHandler {
	return &PhotoHandler{storage: storage}
}

func (h *PhotoHandler) Upload(c *fiber.Ctx) error {
	coinID := c.Params("id")
	if coinID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "missing coin id",
		})
	}

	face := c.FormValue("face")
	if face != "anverso" && face != "reverso" {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "face must be 'anverso' or 'reverso'",
		})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "file is required",
		})
	}

	if file.Size > 5*1024*1024 {
		return c.Status(fiber.StatusRequestEntityTooLarge).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "file too large (max 5MB)",
		})
	}

	contentType := file.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "file must be an image",
		})
	}

	src, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "failed to open uploaded file",
		})
	}
	defer src.Close()

	ref, err := h.storage.Upload(c.Context(), src, file.Filename, contentType)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("failed to upload: %v", err),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(dto.PhotoUploadResponse{
		Status:  "success",
		Message: "foto subida",
		Data: dto.PhotoData{
			ProviderID: ref.ProviderID,
			URL:        ref.URL,
			Provider:   ref.Provider,
		},
	})
}

func (h *PhotoHandler) Serve(c *fiber.Ctx) error {
	provider := c.Params("provider")
	ref := c.Params("ref")

	if provider != h.storage.Provider() {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "photo not found",
		})
	}

	url, err := h.storage.GetURL(c.Context(), ref)
	if err == domain.ErrNotFound {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "photo not found",
		})
	}
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	return c.Redirect(url, fiber.StatusMovedPermanently)
}
