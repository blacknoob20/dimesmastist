package application

import (
	"context"
	"testing"
	"time"

	"github.com/dimesmastist/backend/internal/domain"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockRepo struct {
	coins    map[uint64]*domain.Coin
	nextID   uint64
	history  map[uint64][]domain.Coin
}

func newMockRepo() *mockRepo {
	return &mockRepo{
		coins:   make(map[uint64]*domain.Coin),
		history: make(map[uint64][]domain.Coin),
	}
}

func (m *mockRepo) Create(ctx context.Context, coin *domain.Coin) (*domain.Coin, error) {
	m.nextID++
	coin.CoinID = m.nextID
	coin.Version = 1
	coin.IsCurrent = true
	m.coins[m.nextID] = coin
	return coin, nil
}

func (m *mockRepo) GetByCoinID(ctx context.Context, coinID uint64) (*domain.Coin, error) {
	c, ok := m.coins[coinID]
	if !ok || !c.IsCurrent {
		return nil, domain.ErrNotFound
	}
	return c, nil
}

func (m *mockRepo) List(ctx context.Context, filter domain.ListFilter) ([]domain.Coin, int64, error) {
	var result []domain.Coin
	for _, c := range m.coins {
		if c.IsCurrent {
			result = append(result, *c)
		}
	}
	return result, int64(len(result)), nil
}

func (m *mockRepo) Update(ctx context.Context, coin *domain.Coin) (*domain.Coin, error) {
	prev := m.coins[coin.CoinID]
	if prev != nil {
		prev.IsCurrent = false
		m.history[coin.CoinID] = append(m.history[coin.CoinID], *prev)
	}
	coin.Version++
	coin.IsCurrent = true
	m.coins[coin.CoinID] = coin
	return coin, nil
}

func (m *mockRepo) Delete(ctx context.Context, coinID uint64) error {
	if c, ok := m.coins[coinID]; ok {
		c.IsCurrent = false
	}
	return nil
}

func (m *mockRepo) GetHistory(ctx context.Context, coinID uint64) ([]domain.Coin, error) {
	return m.history[coinID], nil
}

func TestCoinService_Create_SetsDefaults(t *testing.T) {
	repo := newMockRepo()
	svc := NewCoinService(repo)

	coin, err := svc.Create(context.Background(), &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
	})
	require.NoError(t, err)
	assert.Equal(t, "Circular", coin.Forma)
	assert.Equal(t, "Estándar", coin.Orientacion)
}

func TestCoinService_Create_PreservesExplicitValues(t *testing.T) {
	repo := newMockRepo()
	svc := NewCoinService(repo)

	coin, err := svc.Create(context.Background(), &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
		Forma: "Octogonal", Orientacion: "Horizontal",
	})
	require.NoError(t, err)
	assert.Equal(t, "Octogonal", coin.Forma)
	assert.Equal(t, "Horizontal", coin.Orientacion)
}

func TestCoinService_Get(t *testing.T) {
	repo := newMockRepo()
	svc := NewCoinService(repo)

	created, _ := svc.Create(context.Background(), &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
	})
	got, err := svc.Get(context.Background(), created.CoinID)
	require.NoError(t, err)
	assert.Equal(t, "Ecuador", got.Country)
}

func TestCoinService_Get_NotFound(t *testing.T) {
	repo := newMockRepo()
	svc := NewCoinService(repo)

	_, err := svc.Get(context.Background(), 9999)
	assert.ErrorIs(t, err, domain.ErrNotFound)
}

func TestCoinService_List(t *testing.T) {
	repo := newMockRepo()
	svc := NewCoinService(repo)

	svc.Create(context.Background(), &domain.Coin{Country: "Ecuador", Denomination: "A"})
	svc.Create(context.Background(), &domain.Coin{Country: "México", Denomination: "B"})

	coins, total, err := svc.List(context.Background(), domain.ListFilter{Page: 1, Limit: 10})
	require.NoError(t, err)
	assert.Equal(t, int64(2), total)
	assert.Len(t, coins, 2)
}

func TestCoinService_Update_MergesFields(t *testing.T) {
	repo := newMockRepo()
	svc := NewCoinService(repo)

	created, _ := svc.Create(context.Background(), &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
	})

	updated, err := svc.Update(context.Background(), &domain.Coin{
		CoinID: created.CoinID, Metal: "Plata",
	})
	require.NoError(t, err)
	assert.Equal(t, "Plata", updated.Metal)
	assert.Equal(t, "Ecuador", updated.Country) // preserved
	assert.Equal(t, "1 Sucre", updated.Denomination) // preserved
}

func TestCoinService_Update_NotFound(t *testing.T) {
	repo := newMockRepo()
	svc := NewCoinService(repo)

	_, err := svc.Update(context.Background(), &domain.Coin{CoinID: 9999, Metal: "Plata"})
	assert.ErrorIs(t, err, domain.ErrNotFound)
}

func TestCoinService_Delete(t *testing.T) {
	repo := newMockRepo()
	svc := NewCoinService(repo)

	created, _ := svc.Create(context.Background(), &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
	})
	err := svc.Delete(context.Background(), created.CoinID)
	require.NoError(t, err)

	_, err = svc.Get(context.Background(), created.CoinID)
	assert.ErrorIs(t, err, domain.ErrNotFound)
}

func TestCoinService_GetHistory(t *testing.T) {
	repo := newMockRepo()
	svc := NewCoinService(repo)

	created, _ := svc.Create(context.Background(), &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
	})
	svc.Update(context.Background(), &domain.Coin{
		CoinID: created.CoinID, Country: "Ecuador", Denomination: "1 Sucre", Metal: "Plata",
	})

	history, err := svc.GetHistory(context.Background(), created.CoinID)
	require.NoError(t, err)
	assert.Len(t, history, 1) // 1 previous version in mock
}

func TestMergeCoin_AllFields(t *testing.T) {
	year := 1994
	peso := 25.0
	diametro := 38.0
	espesor := 2.5
	valorFacial := "0.50"
	precioCompra := 15.0
	anversoImg := "anverso.jpg"
	reversoImg := "reverso.jpg"
	fecha := time.Now()
	conmemorativa := true

	current := &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
		Forma: "Circular", Orientacion: "Estándar",
	}
	update := &domain.Coin{
		Country: "México", Denomination: "1 Peso",
		ValorFacial: &valorFacial, Year: &year,
		Conmemorativa: conmemorativa, EmitidaPor: "Banco de México",
		Metal: "Plata", Peso: &peso, Diametro: &diametro,
		Espesor: &espesor, Forma: "Octogonal",
		Orientacion: "Horizontal", Canto: "Estriado",
		Ceca: "CDMX", KM: "KM#407", Serie: "Serie A",
		AnversoImg: &anversoImg, ReversoImg: &reversoImg,
		Condition: "VF", Descripcion: "Moneda histórica",
		Notas: "Rara", Procedencia: "Subasta",
		PrecioCompra: &precioCompra, FechaAdquisicion: &fecha,
		Etiquetas: []string{"plata", "colonial"},
	}

	mergeCoin(current, update)

	assert.Equal(t, "México", current.Country)
	assert.Equal(t, "1 Peso", current.Denomination)
	assert.Equal(t, &valorFacial, current.ValorFacial)
	assert.Equal(t, &year, current.Year)
	assert.True(t, current.Conmemorativa)
	assert.Equal(t, "Banco de México", current.EmitidaPor)
	assert.Equal(t, "Plata", current.Metal)
	assert.Equal(t, &peso, current.Peso)
	assert.Equal(t, &diametro, current.Diametro)
	assert.Equal(t, &espesor, current.Espesor)
	assert.Equal(t, "Octogonal", current.Forma)
	assert.Equal(t, "Horizontal", current.Orientacion)
	assert.Equal(t, "Estriado", current.Canto)
	assert.Equal(t, "CDMX", current.Ceca)
	assert.Equal(t, "KM#407", current.KM)
	assert.Equal(t, "Serie A", current.Serie)
	assert.Equal(t, &anversoImg, current.AnversoImg)
	assert.Equal(t, &reversoImg, current.ReversoImg)
	assert.Equal(t, "VF", current.Condition)
	assert.Equal(t, "Moneda histórica", current.Descripcion)
	assert.Equal(t, "Rara", current.Notas)
	assert.Equal(t, "Subasta", current.Procedencia)
	assert.Equal(t, &precioCompra, current.PrecioCompra)
	assert.Equal(t, &fecha, current.FechaAdquisicion)
	assert.Equal(t, []string{"plata", "colonial"}, current.Etiquetas)
}

func TestMergeCoin_OnlyNilFieldsPreserved(t *testing.T) {
	current := &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
		Metal: "Níquel", Conmemorativa: false,
	}
	update := &domain.Coin{
		Metal: "Plata",
	}

	mergeCoin(current, update)

	assert.Equal(t, "Ecuador", current.Country)
	assert.Equal(t, "1 Sucre", current.Denomination)
	assert.Equal(t, "Plata", current.Metal)
	assert.False(t, current.Conmemorativa)
}
