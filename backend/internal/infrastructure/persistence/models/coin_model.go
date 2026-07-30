package models

import "time"

type CoinModel struct {
	ID      uint64 `gorm:"primaryKey;autoIncrement"`
	CoinID  uint64 `gorm:"uniqueIndex:idx_coin_id_version"`
	Version int    `gorm:"uniqueIndex:idx_coin_id_version"`

	ValidFrom time.Time  `gorm:"index"`
	ValidTo   *time.Time `gorm:"index"`
	IsCurrent bool       `gorm:"index"`

	Country      string  `gorm:"size:80;not null"`
	Denomination string  `gorm:"size:80;not null"`
	ValorFacial  *string `gorm:"size:40"`
	Year         *int
	Conmemorativa bool
	EmitidaPor   string  `gorm:"size:120"`
	Metal        string  `gorm:"size:60"`
	Peso         *float64
	Diametro     *float64
	Espesor      *float64
	Forma        string  `gorm:"size:40;default:'Circular'"`
	Orientacion  string  `gorm:"size:40;default:'Estándar'"`
	Canto        string  `gorm:"size:40"`
	Ceca         string  `gorm:"size:80"`
	KM           string  `gorm:"size:20"`
	Serie        string  `gorm:"size:80"`

	AnversoImg *string
	ReversoImg *string

	Condition string `gorm:"size:10"`

	Descripcion   string `gorm:"type:text"`
	Notas         string `gorm:"type:text"`
	Procedencia   string `gorm:"type:text"`
	PrecioCompra  *float64
	FechaAdquisicion *time.Time

	Etiquetas string `gorm:"type:text"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `gorm:"index"`
}
