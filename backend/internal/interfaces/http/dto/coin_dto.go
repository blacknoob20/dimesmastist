package dto

import (
	"time"
)

type CreateCoinRequest struct {
	Country         string     `json:"country" validate:"required"`
	Denomination    string     `json:"denomination" validate:"required,min=1,max=80"`
	ValorFacial     *string    `json:"valor_facial,omitempty"`
	Year            *int       `json:"year,omitempty" validate:"omitempty,gte=0,lte=9999"`
	Conmemorativa   bool       `json:"conmemorativa"`
	EmitidaPor      string     `json:"emitida_por,omitempty" validate:"max=120"`
	Metal           string     `json:"metal,omitempty" validate:"max=60"`
	Peso            *float64   `json:"peso,omitempty" validate:"omitempty,gte=0"`
	Diametro        *float64   `json:"diametro,omitempty" validate:"omitempty,gte=0"`
	Espesor         *float64   `json:"espesor,omitempty" validate:"omitempty,gte=0"`
	Forma           string     `json:"forma,omitempty" validate:"max=40"`
	Orientacion     string     `json:"orientacion,omitempty" validate:"max=40"`
	Canto           string     `json:"canto,omitempty" validate:"max=40"`
	Ceca            string     `json:"ceca,omitempty" validate:"max=80"`
	KM              string     `json:"km,omitempty" validate:"max=20"`
	Serie           string     `json:"serie,omitempty" validate:"max=80"`
	AnversoImg      *string    `json:"anverso_img,omitempty"`
	ReversoImg      *string    `json:"reverso_img,omitempty"`
	Condition       string     `json:"condition" validate:"omitempty,oneof=UNC XF VF F VG G P"`
	Descripcion     string     `json:"descripcion,omitempty" validate:"max=2000"`
	Notas           string     `json:"notas,omitempty" validate:"max=1000"`
	Procedencia     string     `json:"procedencia,omitempty" validate:"max=1000"`
	PrecioCompra    *float64   `json:"precio_compra,omitempty" validate:"omitempty,gte=0"`
	FechaAdquisicion *time.Time `json:"fecha_adquisicion,omitempty"`
	Etiquetas       []string   `json:"etiquetas,omitempty" validate:"omitempty,dive,max=40"`
}

type UpdateCoinRequest struct {
	Country         *string    `json:"country,omitempty" validate:"omitempty"`
	Denomination    *string    `json:"denomination,omitempty" validate:"omitempty,min=1,max=80"`
	ValorFacial     *string    `json:"valor_facial,omitempty"`
	Year            *int       `json:"year,omitempty" validate:"omitempty,gte=0,lte=9999"`
	Conmemorativa   *bool      `json:"conmemorativa,omitempty"`
	EmitidaPor      *string    `json:"emitida_por,omitempty" validate:"omitempty,max=120"`
	Metal           *string    `json:"metal,omitempty" validate:"omitempty,max=60"`
	Peso            *float64   `json:"peso,omitempty" validate:"omitempty,gte=0"`
	Diametro        *float64   `json:"diametro,omitempty" validate:"omitempty,gte=0"`
	Espesor         *float64   `json:"espesor,omitempty" validate:"omitempty,gte=0"`
	Forma           *string    `json:"forma,omitempty" validate:"omitempty,max=40"`
	Orientacion     *string    `json:"orientacion,omitempty" validate:"omitempty,max=40"`
	Canto           *string    `json:"canto,omitempty" validate:"omitempty,max=40"`
	Ceca            *string    `json:"ceca,omitempty" validate:"omitempty,max=80"`
	KM              *string    `json:"km,omitempty" validate:"omitempty,max=20"`
	Serie           *string    `json:"serie,omitempty" validate:"omitempty,max=80"`
	AnversoImg      *string    `json:"anverso_img,omitempty"`
	ReversoImg      *string    `json:"reverso_img,omitempty"`
	Condition       *string    `json:"condition,omitempty" validate:"omitempty,oneof=UNC XF VF F VG G P"`
	Descripcion     *string    `json:"descripcion,omitempty" validate:"omitempty,max=2000"`
	Notas           *string    `json:"notas,omitempty" validate:"omitempty,max=1000"`
	Procedencia     *string    `json:"procedencia,omitempty" validate:"omitempty,max=1000"`
	PrecioCompra    *float64   `json:"precio_compra,omitempty" validate:"omitempty,gte=0"`
	FechaAdquisicion *time.Time `json:"fecha_adquisicion,omitempty"`
	Etiquetas       []string   `json:"etiquetas,omitempty" validate:"omitempty,dive,max=40"`
}

type CoinResponse struct {
	ID              uint64     `json:"id"`
	CoinID          uint64     `json:"coin_id"`
	Version         int        `json:"version"`
	ValidFrom       time.Time  `json:"valid_from"`
	ValidTo         *time.Time `json:"valid_to,omitempty"`
	IsCurrent       bool       `json:"is_current"`
	Country         string     `json:"country"`
	Denomination    string     `json:"denomination"`
	ValorFacial     *string    `json:"valor_facial,omitempty"`
	Year            *int       `json:"year,omitempty"`
	Conmemorativa   bool       `json:"conmemorativa"`
	EmitidaPor      string     `json:"emitida_por,omitempty"`
	Metal           string     `json:"metal,omitempty"`
	Peso            *float64   `json:"peso,omitempty"`
	Diametro        *float64   `json:"diametro,omitempty"`
	Espesor         *float64   `json:"espesor,omitempty"`
	Forma           string     `json:"forma,omitempty"`
	Orientacion     string     `json:"orientacion,omitempty"`
	Canto           string     `json:"canto,omitempty"`
	Ceca            string     `json:"ceca,omitempty"`
	KM              string     `json:"km,omitempty"`
	Serie           string     `json:"serie,omitempty"`
	AnversoImg      *string    `json:"anverso_img,omitempty"`
	ReversoImg      *string    `json:"reverso_img,omitempty"`
	Condition       string     `json:"condition,omitempty"`
	Descripcion     string     `json:"descripcion,omitempty"`
	Notas           string     `json:"notas,omitempty"`
	Procedencia     string     `json:"procedencia,omitempty"`
	PrecioCompra    *float64   `json:"precio_compra,omitempty"`
	FechaAdquisicion *time.Time `json:"fecha_adquisicion,omitempty"`
	Etiquetas       []string   `json:"etiquetas,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type ListResponse struct {
	Status  string         `json:"status"`
	Message string         `json:"message"`
	Data    ListData       `json:"data"`
}

type ListData struct {
	Items     []CoinResponse `json:"items"`
	Total     int64          `json:"total"`
	Page      int            `json:"page"`
	Limit     int            `json:"limit"`
}

type DataResponse struct {
	Status  string       `json:"status"`
	Message string       `json:"message"`
	Data    CoinResponse `json:"data"`
}

type MessageResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type ErrorResponse struct {
	Status string     `json:"status"`
	Message string    `json:"message"`
	Errors []FieldError `json:"errors,omitempty"`
}

type FieldError struct {
	Field string `json:"field"`
	Tag   string `json:"tag"`
	Value string `json:"value,omitempty"`
}
