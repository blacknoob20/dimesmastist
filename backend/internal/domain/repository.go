package domain

import "context"

type CoinRepository interface {
	Create(ctx context.Context, coin *Coin) (*Coin, error)
	GetByCoinID(ctx context.Context, coinID uint64) (*Coin, error)
	List(ctx context.Context, filter ListFilter) ([]Coin, int64, error)
	Update(ctx context.Context, coin *Coin) (*Coin, error)
	Delete(ctx context.Context, coinID uint64) error
	GetHistory(ctx context.Context, coinID uint64) ([]Coin, error)
}

type ListFilter struct {
	Page      int
	Limit     int
	Condition string
	Country   string
	Query     string
	AllVersions bool
}
