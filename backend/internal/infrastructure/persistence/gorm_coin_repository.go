package persistence

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/dimesmastist/backend/internal/domain"
	"github.com/dimesmastist/backend/internal/infrastructure/persistence/models"
	"gorm.io/gorm"
)

type GormCoinRepository struct {
	db   *gorm.DB
	scd2 *SCD2Helper
}

func NewGormCoinRepository(db *gorm.DB) *GormCoinRepository {
	return &GormCoinRepository{db: db, scd2: NewSCD2Helper(db)}
}

func (r *GormCoinRepository) Create(ctx context.Context, coin *domain.Coin) (*domain.Coin, error) {
	model := domainToModel(coin)

	coinID, err := r.scd2.NextCoinID()
	if err != nil {
		return nil, fmt.Errorf("generate coin id: %w", err)
	}
	model.CoinID = coinID

	if err := r.scd2.CreateInitial(model); err != nil {
		return nil, fmt.Errorf("create coin: %w", err)
	}
	return modelToDomain(model), nil
}

func (r *GormCoinRepository) GetByCoinID(ctx context.Context, coinID uint64) (*domain.Coin, error) {
	model, err := r.scd2.GetCurrent(coinID)
	if err != nil {
		return nil, domain.ErrNotFound
	}
	return modelToDomain(model), nil
}

func (r *GormCoinRepository) List(ctx context.Context, filter domain.ListFilter) ([]domain.Coin, int64, error) {
	page := filter.Page
	if page < 1 {
		page = 1
	}
	limit := filter.Limit
	if limit < 1 {
		limit = 20
	} else if limit > 100 {
		limit = 100
	}

	q := r.db.Model(&models.CoinModel{})

	if !filter.AllVersions {
		q = q.Where("is_current = ?", true)
	}
	if filter.Condition != "" {
		q = q.Where("condition = ?", filter.Condition)
	}
	if filter.Country != "" {
		q = q.Where("country = ?", filter.Country)
	}
	if filter.Query != "" {
		q = q.Where("(denomination LIKE ? OR km LIKE ? OR ceca LIKE ?)",
			"%"+filter.Query+"%", "%"+filter.Query+"%", "%"+filter.Query+"%")
	}

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, fmt.Errorf("list coins count: %w", err)
	}

	var rows []models.CoinModel
	if err := q.Order("created_at DESC").
		Offset((page - 1) * limit).
		Limit(limit).
		Find(&rows).Error; err != nil {
		return nil, 0, fmt.Errorf("list coins: %w", err)
	}

	coins := make([]domain.Coin, len(rows))
	for i, m := range rows {
		coins[i] = *modelToDomain(&m)
	}
	return coins, total, nil
}

func (r *GormCoinRepository) Update(ctx context.Context, coin *domain.Coin) (*domain.Coin, error) {
	current, err := r.scd2.GetCurrent(coin.CoinID)
	if err != nil {
		return nil, domain.ErrNotFound
	}

	domainCurrent := modelToDomain(current)
	mergeCoin(domainCurrent, coin)

	newModel := domainToModel(domainCurrent)
	if err := r.scd2.SupersedeAndInsert(current.Version, coin.CoinID, newModel); err != nil {
		return nil, fmt.Errorf("update coin: %w", err)
	}
	return modelToDomain(newModel), nil
}

func (r *GormCoinRepository) Delete(ctx context.Context, coinID uint64) error {
	return r.scd2.CloseCurrent(coinID)
}

func (r *GormCoinRepository) GetHistory(ctx context.Context, coinID uint64) ([]domain.Coin, error) {
	rows, err := r.scd2.GetHistory(coinID)
	if err != nil {
		return nil, fmt.Errorf("get history: %w", err)
	}
	coins := make([]domain.Coin, len(rows))
	for i, m := range rows {
		coins[i] = *modelToDomain(&m)
	}
	return coins, nil
}

func mergeCoin(current, update *domain.Coin) {
	if update.Country != "" {
		current.Country = update.Country
	}
	if update.Denomination != "" {
		current.Denomination = update.Denomination
	}
	if update.ValorFacial != nil {
		current.ValorFacial = update.ValorFacial
	}
	if update.Year != nil {
		current.Year = update.Year
	}
	if update.EmitidaPor != "" {
		current.EmitidaPor = update.EmitidaPor
	}
	if update.Metal != "" {
		current.Metal = update.Metal
	}
	if update.Peso != nil {
		current.Peso = update.Peso
	}
	if update.Diametro != nil {
		current.Diametro = update.Diametro
	}
	if update.Espesor != nil {
		current.Espesor = update.Espesor
	}
	if update.Forma != "" {
		current.Forma = update.Forma
	}
	if update.Orientacion != "" {
		current.Orientacion = update.Orientacion
	}
	if update.Canto != "" {
		current.Canto = update.Canto
	}
	if update.Ceca != "" {
		current.Ceca = update.Ceca
	}
	if update.KM != "" {
		current.KM = update.KM
	}
	if update.Serie != "" {
		current.Serie = update.Serie
	}
	if update.AnversoImg != nil {
		current.AnversoImg = update.AnversoImg
	}
	if update.ReversoImg != nil {
		current.ReversoImg = update.ReversoImg
	}
	if update.Condition != "" {
		current.Condition = update.Condition
	}
	if update.Descripcion != "" {
		current.Descripcion = update.Descripcion
	}
	if update.Notas != "" {
		current.Notas = update.Notas
	}
	if update.Procedencia != "" {
		current.Procedencia = update.Procedencia
	}
	if update.PrecioCompra != nil {
		current.PrecioCompra = update.PrecioCompra
	}
	if update.FechaAdquisicion != nil {
		current.FechaAdquisicion = update.FechaAdquisicion
	}
	if len(update.Etiquetas) > 0 {
		current.Etiquetas = update.Etiquetas
	}
	current.Conmemorativa = update.Conmemorativa
}

func domainToModel(c *domain.Coin) *models.CoinModel {
	var etiquetasJSON string
	if len(c.Etiquetas) > 0 {
		b, _ := json.Marshal(c.Etiquetas)
		etiquetasJSON = string(b)
	}

	return &models.CoinModel{
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
		Etiquetas:       etiquetasJSON,
		CreatedAt:       c.CreatedAt,
		UpdatedAt:       c.UpdatedAt,
	}
}

func modelToDomain(m *models.CoinModel) *domain.Coin {
	var etiquetas []string
	if m.Etiquetas != "" {
		json.Unmarshal([]byte(m.Etiquetas), &etiquetas)
	}

	now := time.Now()
	return &domain.Coin{
		ID:              m.ID,
		CoinID:          m.CoinID,
		Version:         m.Version,
		ValidFrom:       m.ValidFrom,
		ValidTo:         m.ValidTo,
		IsCurrent:       m.IsCurrent,
		Country:         m.Country,
		Denomination:    m.Denomination,
		ValorFacial:     m.ValorFacial,
		Year:            m.Year,
		Conmemorativa:   m.Conmemorativa,
		EmitidaPor:      m.EmitidaPor,
		Metal:           m.Metal,
		Peso:            m.Peso,
		Diametro:        m.Diametro,
		Espesor:         m.Espesor,
		Forma:           m.Forma,
		Orientacion:     m.Orientacion,
		Canto:           m.Canto,
		Ceca:            m.Ceca,
		KM:              m.KM,
		Serie:           m.Serie,
		AnversoImg:      m.AnversoImg,
		ReversoImg:      m.ReversoImg,
		Condition:       m.Condition,
		Descripcion:     m.Descripcion,
		Notas:           m.Notas,
		Procedencia:     m.Procedencia,
		PrecioCompra:    m.PrecioCompra,
		FechaAdquisicion: m.FechaAdquisicion,
		Etiquetas:       etiquetas,
		CreatedAt:       m.CreatedAt,
		UpdatedAt:       now,
	}
}
