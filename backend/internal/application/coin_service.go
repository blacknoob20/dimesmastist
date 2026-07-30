package application

import (
	"context"

	"github.com/dimesmastist/backend/internal/domain"
)

type CoinService struct {
	repo domain.CoinRepository
}

func NewCoinService(repo domain.CoinRepository) *CoinService {
	return &CoinService{repo: repo}
}

func (s *CoinService) Create(ctx context.Context, coin *domain.Coin) (*domain.Coin, error) {
	if coin.Forma == "" {
		coin.Forma = "Circular"
	}
	if coin.Orientacion == "" {
		coin.Orientacion = "Estándar"
	}
	return s.repo.Create(ctx, coin)
}

func (s *CoinService) Get(ctx context.Context, coinID uint64) (*domain.Coin, error) {
	return s.repo.GetByCoinID(ctx, coinID)
}

func (s *CoinService) List(ctx context.Context, filter domain.ListFilter) ([]domain.Coin, int64, error) {
	return s.repo.List(ctx, filter)
}

func (s *CoinService) Update(ctx context.Context, coin *domain.Coin) (*domain.Coin, error) {
	current, err := s.repo.GetByCoinID(ctx, coin.CoinID)
	if err != nil {
		return nil, domain.ErrNotFound
	}
	mergeCoin(current, coin)
	return s.repo.Update(ctx, current)
}

func (s *CoinService) Delete(ctx context.Context, coinID uint64) error {
	return s.repo.Delete(ctx, coinID)
}

func (s *CoinService) GetHistory(ctx context.Context, coinID uint64) ([]domain.Coin, error) {
	return s.repo.GetHistory(ctx, coinID)
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
	if update.Conmemorativa != current.Conmemorativa {
		current.Conmemorativa = update.Conmemorativa
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
}
