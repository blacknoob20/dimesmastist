package handlers

import (
	"strconv"

	"github.com/dimesmastist/backend/internal/application"
	"github.com/dimesmastist/backend/internal/domain"
	"github.com/dimesmastist/backend/internal/interfaces/http/dto"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type CoinHandler struct {
	svc      *application.CoinService
	validate *validator.Validate
}

func NewCoinHandler(svc *application.CoinService) *CoinHandler {
	return &CoinHandler{
		svc:      svc,
		validate: validator.New(),
	}
}

func (h *CoinHandler) Create(c *fiber.Ctx) error {
	var req dto.CreateCoinRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "invalid request body",
		})
	}

	if err := h.validate.Struct(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(h.validationErrors(err))
	}

	coin := h.createRequestToDomain(&req)
	created, err := h.svc.Create(c.Context(), coin)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(dto.DataResponse{
		Status:  "success",
		Message: "moneda creada",
		Data:    h.domainToResponse(created),
	})
}

func (h *CoinHandler) Get(c *fiber.Ctx) error {
	coinID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "invalid coin id",
		})
	}

	coin, err := h.svc.Get(c.Context(), coinID)
	if err == domain.ErrNotFound {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "moneda no encontrada",
		})
	}
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(dto.DataResponse{
		Status:  "success",
		Message: "ok",
		Data:    h.domainToResponse(coin),
	})
}

func (h *CoinHandler) List(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "20"))

	filter := domain.ListFilter{
		Page:        page,
		Limit:       limit,
		Condition:   c.Query("condition"),
		Country:     c.Query("country"),
		Query:       c.Query("q"),
		AllVersions: c.Query("all") == "true",
	}

	coins, total, err := h.svc.List(c.Context(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	items := make([]dto.CoinResponse, len(coins))
	for i, coin := range coins {
		items[i] = h.domainToResponse(&coin)
	}

	return c.Status(fiber.StatusOK).JSON(dto.ListResponse{
		Status:  "success",
		Message: "ok",
		Data: dto.ListData{
			Items:  items,
			Total:  total,
			Page:   page,
			Limit:  limit,
		},
	})
}

func (h *CoinHandler) Update(c *fiber.Ctx) error {
	coinID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "invalid coin id",
		})
	}

	var req dto.UpdateCoinRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "invalid request body",
		})
	}

	if err := h.validate.Struct(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(h.validationErrors(err))
	}

	coin := h.updateRequestToDomain(&req, coinID)
	updated, err := h.svc.Update(c.Context(), coin)
	if err == domain.ErrNotFound {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "moneda no encontrada",
		})
	}
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(dto.DataResponse{
		Status:  "success",
		Message: "moneda actualizada",
		Data:    h.domainToResponse(updated),
	})
}

func (h *CoinHandler) Delete(c *fiber.Ctx) error {
	coinID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "invalid coin id",
		})
	}

	if err := h.svc.Delete(c.Context(), coinID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	return c.Status(fiber.StatusNoContent).Send(nil)
}

func (h *CoinHandler) History(c *fiber.Ctx) error {
	coinID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: "invalid coin id",
		})
	}

	coins, err := h.svc.GetHistory(c.Context(), coinID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}

	items := make([]dto.CoinResponse, len(coins))
	for i, coin := range coins {
		items[i] = h.domainToResponse(&coin)
	}

	return c.Status(fiber.StatusOK).JSON(dto.ListResponse{
		Status:  "success",
		Message: "ok",
		Data: dto.ListData{
			Items: items,
			Total: int64(len(coins)),
		},
	})
}

func (h *CoinHandler) validationErrors(err error) dto.ErrorResponse {
	resp := dto.ErrorResponse{
		Status:  "error",
		Message: "validación fallida",
	}
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, e := range validationErrors {
			resp.Errors = append(resp.Errors, dto.FieldError{
				Field: e.Field(),
				Tag:   e.Tag(),
			})
		}
	}
	return resp
}

func (h *CoinHandler) createRequestToDomain(req *dto.CreateCoinRequest) *domain.Coin {
	return &domain.Coin{
		Country:         req.Country,
		Denomination:    req.Denomination,
		ValorFacial:     req.ValorFacial,
		Year:            req.Year,
		Conmemorativa:   req.Conmemorativa,
		EmitidaPor:      req.EmitidaPor,
		Metal:           req.Metal,
		Peso:            req.Peso,
		Diametro:        req.Diametro,
		Espesor:         req.Espesor,
		Forma:           req.Forma,
		Orientacion:     req.Orientacion,
		Canto:           req.Canto,
		Ceca:            req.Ceca,
		KM:              req.KM,
		Serie:           req.Serie,
		AnversoImg:      req.AnversoImg,
		ReversoImg:      req.ReversoImg,
		Condition:       req.Condition,
		Descripcion:     req.Descripcion,
		Notas:           req.Notas,
		Procedencia:     req.Procedencia,
		PrecioCompra:    req.PrecioCompra,
		FechaAdquisicion: req.FechaAdquisicion,
		Etiquetas:       req.Etiquetas,
	}
}

func (h *CoinHandler) updateRequestToDomain(req *dto.UpdateCoinRequest, coinID uint64) *domain.Coin {
	return &domain.Coin{
		CoinID:          coinID,
		Country:         derefStr(req.Country),
		Denomination:    derefStr(req.Denomination),
		ValorFacial:     req.ValorFacial,
		Year:            req.Year,
		Conmemorativa:   derefBool(req.Conmemorativa),
		EmitidaPor:      derefStr(req.EmitidaPor),
		Metal:           derefStr(req.Metal),
		Peso:            req.Peso,
		Diametro:        req.Diametro,
		Espesor:         req.Espesor,
		Forma:           derefStr(req.Forma),
		Orientacion:     derefStr(req.Orientacion),
		Canto:           derefStr(req.Canto),
		Ceca:            derefStr(req.Ceca),
		KM:              derefStr(req.KM),
		Serie:           derefStr(req.Serie),
		AnversoImg:      req.AnversoImg,
		ReversoImg:      req.ReversoImg,
		Condition:       derefStr(req.Condition),
		Descripcion:     derefStr(req.Descripcion),
		Notas:           derefStr(req.Notas),
		Procedencia:     derefStr(req.Procedencia),
		PrecioCompra:    req.PrecioCompra,
		FechaAdquisicion: req.FechaAdquisicion,
		Etiquetas:       req.Etiquetas,
	}
}

func derefStr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func derefBool(b *bool) bool {
	if b == nil {
		return false
	}
	return *b
}

func (h *CoinHandler) domainToResponse(c *domain.Coin) dto.CoinResponse {
	return dto.CoinResponse{
		ID:              c.ID,
		CoinID:          c.CoinID,
		Version:         c.Version,
		ValidFrom:       c.ValidFrom,
		ValidTo:         c.ValidTo,
		IsCurrent:       c.IsCurrent,
		Country:         c.Country,
		Denomination:    c.Denomination,
		ValorFacial:     c.ValorFacial,
		Year:            c.Year,
		Conmemorativa:   c.Conmemorativa,
		EmitidaPor:      c.EmitidaPor,
		Metal:           c.Metal,
		Peso:            c.Peso,
		Diametro:        c.Diametro,
		Espesor:         c.Espesor,
		Forma:           c.Forma,
		Orientacion:     c.Orientacion,
		Canto:           c.Canto,
		Ceca:            c.Ceca,
		KM:              c.KM,
		Serie:           c.Serie,
		AnversoImg:      c.AnversoImg,
		ReversoImg:      c.ReversoImg,
		Condition:       c.Condition,
		Descripcion:     c.Descripcion,
		Notas:           c.Notas,
		Procedencia:     c.Procedencia,
		PrecioCompra:    c.PrecioCompra,
		FechaAdquisicion: c.FechaAdquisicion,
		Etiquetas:       c.Etiquetas,
		CreatedAt:       c.CreatedAt,
		UpdatedAt:       c.UpdatedAt,
	}
}
