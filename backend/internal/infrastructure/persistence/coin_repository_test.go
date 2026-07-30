package persistence

import (
	"context"
	"fmt"
	"testing"

	"github.com/dimesmastist/backend/internal/domain"
	"github.com/dimesmastist/backend/internal/infrastructure/persistence/models"
	"github.com/dimesmastist/backend/tests/helpers"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func newTestRepo(t *testing.T) (*GormCoinRepository, *gorm.DB) {
	db := helpers.NewTestDB(t)
	require.NoError(t, db.AutoMigrate(&models.CoinModel{}))
	return NewGormCoinRepository(db), db
}

func validCoin() *domain.Coin {
	return &domain.Coin{
		Country:      "Ecuador",
		Denomination: "1 Sucre",
		Condition:    "UNC",
		Metal:        "Níquel",
	}
}

func TestCreate_PersistsRow(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	created, err := repo.Create(ctx, validCoin())
	require.NoError(t, err)
	assert.NotZero(t, created.CoinID)
	assert.Equal(t, 1, created.Version)
	assert.True(t, created.IsCurrent)
	assert.Equal(t, "Ecuador", created.Country)
}

func TestGetByCoinID_ReturnsCurrent(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	created, _ := repo.Create(ctx, validCoin())
	fetched, err := repo.GetByCoinID(ctx, created.CoinID)
	require.NoError(t, err)
	assert.Equal(t, created.CoinID, fetched.CoinID)
	assert.Equal(t, "1 Sucre", fetched.Denomination)
}

func TestList_Pagination(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	for i := 0; i < 25; i++ {
		_, err := repo.Create(ctx, &domain.Coin{
			Country: "Ecuador", Denomination: "Coin",
		})
		require.NoError(t, err)
	}

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10})
	require.NoError(t, err)
	assert.Equal(t, int64(25), total)
	assert.Len(t, coins, 10)

	coins, _, err = repo.List(ctx, domain.ListFilter{Page: 2, Limit: 10})
	require.NoError(t, err)
	assert.Len(t, coins, 10)

	coins, _, err = repo.List(ctx, domain.ListFilter{Page: 3, Limit: 10})
	require.NoError(t, err)
	assert.Len(t, coins, 5)
}

func TestList_FilterByCondition(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "A", Condition: "UNC"})
	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "B", Condition: "VF"})
	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "C", Condition: "UNC"})

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10, Condition: "UNC"})
	require.NoError(t, err)
	assert.Equal(t, int64(2), total)
	assert.Len(t, coins, 2)
}

func TestList_FilterByCountry(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "A"})
	_, _ = repo.Create(ctx, &domain.Coin{Country: "México", Denomination: "B"})
	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "C"})

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10, Country: "Ecuador"})
	require.NoError(t, err)
	assert.Equal(t, int64(2), total)
	assert.Len(t, coins, 2)
}

func TestList_AllVersions(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	created, _ := repo.Create(ctx, &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
	})
	_, _ = repo.Update(ctx, &domain.Coin{
		CoinID: created.CoinID, Country: "Ecuador", Denomination: "1 Sucre", Metal: "Plata",
	})

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10, AllVersions: true})
	require.NoError(t, err)
	assert.Equal(t, int64(2), total)
	assert.Len(t, coins, 2)
}

func TestUpdate_CreatesNewVersion(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	created, _ := repo.Create(ctx, validCoin())
	updated, err := repo.Update(ctx, &domain.Coin{
		CoinID: created.CoinID,
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Plata",
	})
	require.NoError(t, err)
	assert.Equal(t, created.CoinID, updated.CoinID)
	assert.Equal(t, 2, updated.Version)
	assert.True(t, updated.IsCurrent)
	assert.Equal(t, "Plata", updated.Metal)
}

func TestDelete_ClosesVersion(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	created, _ := repo.Create(ctx, validCoin())
	err := repo.Delete(ctx, created.CoinID)
	require.NoError(t, err)

	fetched, err := repo.GetByCoinID(ctx, created.CoinID)
	assert.Nil(t, fetched)
	assert.Error(t, err)

	history, err := repo.GetHistory(ctx, created.CoinID)
	require.NoError(t, err)
	assert.Len(t, history, 1)
	assert.False(t, history[0].IsCurrent)
}

func TestGetHistory_ReturnsAllVersions(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	created, _ := repo.Create(ctx, &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
	})
	_, _ = repo.Update(ctx, &domain.Coin{
		CoinID: created.CoinID, Country: "Ecuador", Denomination: "1 Sucre", Metal: "Plata",
	})
	_, _ = repo.Update(ctx, &domain.Coin{
		CoinID: created.CoinID, Country: "Ecuador", Denomination: "1 Sucre", Metal: "Oro",
	})

	history, err := repo.GetHistory(ctx, created.CoinID)
	require.NoError(t, err)
	assert.Len(t, history, 3)
	assert.Equal(t, "Oro", history[0].Metal)
	assert.Equal(t, "Níquel", history[2].Metal)
}

func TestCreate_CoinIDAutoIncrement(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	c1, _ := repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "A"})
	c2, _ := repo.Create(ctx, &domain.Coin{Country: "México", Denomination: "B"})
	assert.Greater(t, c2.CoinID, c1.CoinID)
}

func TestList_DefaultPagination(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "A"})

	coins, total, err := repo.List(ctx, domain.ListFilter{})
	require.NoError(t, err)
	assert.Equal(t, int64(1), total)
	assert.Len(t, coins, 1)
}

func TestList_FilterByQuery(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "1 Sucre", KM: "KM#88"})
	_, _ = repo.Create(ctx, &domain.Coin{Country: "México", Denomination: "1 Peso", KM: "KM#407"})

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10, Query: "Sucre"})
	require.NoError(t, err)
	assert.Equal(t, int64(1), total)
	assert.Len(t, coins, 1)

	coins, total, err = repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10, Query: "KM#407"})
	require.NoError(t, err)
	assert.Equal(t, int64(1), total)
	assert.Len(t, coins, 1)
}

func TestList_QueryByCeca(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "A", Ceca: "Quito"})
	_, _ = repo.Create(ctx, &domain.Coin{Country: "México", Denomination: "B", Ceca: "CDMX"})

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10, Query: "Quito"})
	require.NoError(t, err)
	assert.Equal(t, int64(1), total)
	assert.Equal(t, "Quito", coins[0].Ceca)
}

func TestUpdate_PreservesAllFields(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	created, _ := repo.Create(ctx, &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
		Forma: "Circular", Orientacion: "Estándar",
		Condition: "UNC", KM: "KM#88",
	})
	updated, err := repo.Update(ctx, &domain.Coin{
		CoinID: created.CoinID, Country: "Ecuador", Denomination: "1 Sucre",
		Metal: "Plata", Condition: "VF",
	})
	require.NoError(t, err)
	assert.Equal(t, "Plata", updated.Metal)
	assert.Equal(t, "VF", updated.Condition)
	assert.Equal(t, "Circular", updated.Forma)
	assert.Equal(t, "KM#88", updated.KM)
}

func TestGetHistory_Empty(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	history, err := repo.GetHistory(ctx, 9999)
	require.NoError(t, err)
	assert.Len(t, history, 0)
}

func TestDomainToModel_WithEtiquetas(t *testing.T) {
	coin := &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
		Etiquetas: []string{"plata", "colonial", "rara"},
	}
	model := domainToModel(coin)
	assert.Contains(t, model.Etiquetas, "plata")
	assert.Contains(t, model.Etiquetas, "colonial")
}

func TestDomainToModel_NilPointers(t *testing.T) {
	coin := &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
	}
	model := domainToModel(coin)
	assert.Nil(t, model.ValorFacial)
	assert.Nil(t, model.Year)
	assert.Nil(t, model.Peso)
	assert.Nil(t, model.AnversoImg)
}

func TestModelToDomain_WithEtiquetas(t *testing.T) {
	model := &models.CoinModel{
		CoinID: 1, Version: 1, IsCurrent: true,
		Country: "Ecuador", Denomination: "1 Sucre",
		Etiquetas: `["plata","colonial"]`,
	}
	coin := modelToDomain(model)
	assert.Equal(t, []string{"plata", "colonial"}, coin.Etiquetas)
}

func TestModelToDomain_EmptyEtiquetas(t *testing.T) {
	model := &models.CoinModel{
		CoinID: 1, Version: 1, IsCurrent: true,
		Country: "Ecuador", Denomination: "1 Sucre",
	}
	coin := modelToDomain(model)
	assert.Nil(t, coin.Etiquetas)
}

func TestList_InvalidPageDefaultsToOne(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "A"})

	coins, _, err := repo.List(ctx, domain.ListFilter{Page: -1, Limit: 10})
	require.NoError(t, err)
	assert.Len(t, coins, 1)
}

func TestList_InvalidLimitDefaultsTo20(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	for i := 0; i < 25; i++ {
		_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "X"})
	}

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: -1})
	require.NoError(t, err)
	assert.Equal(t, int64(25), total)
	assert.Len(t, coins, 20)
}

func TestList_LimitOver100Clamped(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	for i := 0; i < 150; i++ {
		_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "X"})
	}

	coins, _, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 999})
	require.NoError(t, err)
	assert.Len(t, coins, 100)
}

func TestUpdate_ConmemorativaToggle(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	created, _ := repo.Create(ctx, &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre", Conmemorativa: false,
	})

	updated, err := repo.Update(ctx, &domain.Coin{
		CoinID: created.CoinID, Country: "Ecuador", Denomination: "1 Sucre", Conmemorativa: true,
	})
	require.NoError(t, err)
	assert.True(t, updated.Conmemorativa)
}

func TestGetByCoinID_NotFound(t *testing.T) {
	repo, _ := newTestRepo(t)
	_, err := repo.GetByCoinID(context.Background(), 9999)
	assert.ErrorIs(t, err, domain.ErrNotFound)
}

func TestCreate_AllOptionalFields(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	valorFacial := "0.50"
	year := 1994
	peso := 25.5
	diametro := 38.0
	espesor := 2.5
	anversoImg := "anverso.jpg"
	reversoImg := "reverso.jpg"
	precioCompra := 15.0

	created, err := repo.Create(ctx, &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
		ValorFacial: &valorFacial, Year: &year,
		Conmemorativa: true, EmitidaPor: "Banco Central",
		Metal: "Níquel", Peso: &peso, Diametro: &diametro,
		Espesor: &espesor, Forma: "Octogonal", Orientacion: "Horizontal",
		Canto: "Estriado", Ceca: "Quito", KM: "KM#88", Serie: "Serie A",
		AnversoImg: &anversoImg, ReversoImg: &reversoImg,
		Condition: "UNC", Descripcion: "Moneda rara",
		Notas: "Buena conservación", Procedencia: "Subasta",
		PrecioCompra: &precioCompra,
		Etiquetas: []string{"rara", "plata"},
	})
	require.NoError(t, err)
	assert.Equal(t, "Octogonal", created.Forma)
	assert.Equal(t, "KM#88", created.KM)
	assert.True(t, created.Conmemorativa)
}

func TestDelete_NonExistent(t *testing.T) {
	repo, _ := newTestRepo(t)
	err := repo.Delete(context.Background(), 9999)
	assert.NoError(t, err)
}

func TestList_EmptyResult(t *testing.T) {
	repo, _ := newTestRepo(t)
	coins, total, err := repo.List(context.Background(), domain.ListFilter{Page: 1, Limit: 10})
	require.NoError(t, err)
	assert.Equal(t, int64(0), total)
	assert.Len(t, coins, 0)
}

func TestGetHistory_MultipleVersions(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	created, _ := repo.Create(ctx, &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
	})
	for i := 0; i < 4; i++ {
		_, _ = repo.Update(ctx, &domain.Coin{
			CoinID: created.CoinID, Country: "Ecuador", Denomination: "1 Sucre",
			Metal: fmt.Sprintf("Metal%d", i),
		})
	}

	history, err := repo.GetHistory(ctx, created.CoinID)
	require.NoError(t, err)
	assert.Len(t, history, 5) // v1 + 4 updates
	assert.Equal(t, "Metal3", history[0].Metal) // latest
	assert.Equal(t, "Níquel", history[4].Metal) // original
}

func TestMergeCoin_Persistence_AllBranches(t *testing.T) {
	valorFacial := "0.50"
	year := 1994
	peso := 25.5
	diametro := 38.0
	espesor := 2.5
	anversoImg := "anverso.jpg"
	reversoImg := "reverso.jpg"
	precio := 15.0

	current := &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre",
		Forma: "Circular", Orientacion: "Estándar",
		Conmemorativa: false,
	}
	update := &domain.Coin{
		Country: "México", Denomination: "1 Peso",
		ValorFacial: &valorFacial, Year: &year,
		Conmemorativa: true, EmitidaPor: "Banco",
		Metal: "Plata", Peso: &peso, Diametro: &diametro,
		Espesor: &espesor, Forma: "Octogonal",
		Orientacion: "Horizontal", Canto: "Estriado",
		Ceca: "CDMX", KM: "KM#407", Serie: "Serie B",
		AnversoImg: &anversoImg, ReversoImg: &reversoImg,
		Condition: "VF", Descripcion: "Desc",
		Notas: "Notas", Procedencia: "Proc",
		PrecioCompra: &precio,
		Etiquetas: []string{"a", "b"},
	}

	mergeCoin(current, update)

	assert.Equal(t, "México", current.Country)
	assert.Equal(t, "1 Peso", current.Denomination)
	assert.Equal(t, "Plata", current.Metal)
	assert.Equal(t, "Octogonal", current.Forma)
	assert.Equal(t, "KM#407", current.KM)
	assert.True(t, current.Conmemorativa)
	assert.Equal(t, []string{"a", "b"}, current.Etiquetas)
}

func TestMergeCoin_Persistence_OnlyChangedFields(t *testing.T) {
	current := &domain.Coin{
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
		Condition: "UNC",
	}
	update := &domain.Coin{
		Metal: "Plata",
	}

	mergeCoin(current, update)

	assert.Equal(t, "Ecuador", current.Country)
	assert.Equal(t, "Plata", current.Metal)
	assert.Equal(t, "UNC", current.Condition)
}

func TestList_ConditionFilterNoMatch(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "A", Condition: "UNC"})

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10, Condition: "VF"})
	require.NoError(t, err)
	assert.Equal(t, int64(0), total)
	assert.Len(t, coins, 0)
}

func TestList_CountryFilterNoMatch(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "A"})

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10, Country: "México"})
	require.NoError(t, err)
	assert.Equal(t, int64(0), total)
	assert.Len(t, coins, 0)
}

func TestList_QueryFilterNoMatch(t *testing.T) {
	repo, _ := newTestRepo(t)
	ctx := context.Background()

	_, _ = repo.Create(ctx, &domain.Coin{Country: "Ecuador", Denomination: "1 Sucre"})

	coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10, Query: "Peso"})
	require.NoError(t, err)
	assert.Equal(t, int64(0), total)
	assert.Len(t, coins, 0)
}
