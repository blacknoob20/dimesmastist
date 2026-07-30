package handlers

import (
	"github.com/gofiber/fiber/v2"
)

type HealthHandler struct{}

func (h *HealthHandler) Check(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status":  "ok",
		"message": "service is healthy",
		"data":    nil,
	})
}
