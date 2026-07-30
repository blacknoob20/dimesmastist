package domain

import "time"

type Coin struct {
	ID          uint64     `json:"id"`
	CoinID      uint64     `json:"coin_id"`
	Version     int        `json:"version"`
	ValidFrom   time.Time  `json:"valid_from"`
	ValidTo     *time.Time `json:"valid_to,omitempty"`
	IsCurrent   bool       `json:"is_current"`

	Country      string   `json:"country" validate:"required"`
	Denomination string   `json:"denomination" validate:"required,min=1,max=80"`
	ValorFacial  *string  `json:"valor_facial,omitempty"`
	Year         *int     `json:"year,omitempty" validate:"omitempty,gte=0,lte=9999"`
	Conmemorativa bool    `json:"conmemorativa"`
	EmitidaPor   string   `json:"emitida_por,omitempty" validate:"max=120"`
	Metal        string   `json:"metal,omitempty"`
	Peso         *float64 `json:"peso,omitempty" validate:"omitempty,gte=0"`
	Diametro     *float64 `json:"diametro,omitempty" validate:"omitempty,gte=0"`
	Espesor      *float64 `json:"espesor,omitempty" validate:"omitempty,gte=0"`
	Forma        string   `json:"forma,omitempty" validate:"max=40"`
	Orientacion  string   `json:"orientacion,omitempty" validate:"max=40"`
	Canto        string   `json:"canto,omitempty" validate:"max=40"`
	Ceca         string   `json:"ceca,omitempty" validate:"max=80"`
	KM           string   `json:"km,omitempty" validate:"max=20"`
	Serie        string   `json:"serie,omitempty" validate:"max=80"`

	AnversoImg *string `json:"anverso_img,omitempty"`
	ReversoImg *string `json:"reverso_img,omitempty"`

	Condition string `json:"condition" validate:"omitempty,oneof=UNC XF VF F VG G P"`

	Descripcion   string     `json:"descripcion,omitempty" validate:"max=2000"`
	Notas         string     `json:"notas,omitempty" validate:"max=1000"`
	Procedencia   string     `json:"procedencia,omitempty" validate:"max=1000"`
	PrecioCompra  *float64   `json:"precio_compra,omitempty" validate:"omitempty,gte=0"`
	FechaAdquisicion *time.Time `json:"fecha_adquisicion,omitempty"`
	Etiquetas     []string   `json:"etiquetas,omitempty" validate:"omitempty,dive,max=40"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}
