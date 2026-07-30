package persistence

import (
	"context"
	"path/filepath"
	"testing"

	"github.com/dimesmastist/backend/internal/domain"
	"github.com/dimesmastist/backend/internal/infrastructure/persistence/models"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestPersistenceCertification(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "cert.db")

	// FASE 1: Abrir DB, escribir, CERRAR
	{
		db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
		require.NoError(t, err)
		require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

		repo := NewGormCoinRepository(db)
		ctx := context.Background()

		created, err := repo.Create(ctx, &domain.Coin{
			Country:      "Ecuador",
			Denomination: "1 Sucre",
			Condition:    "UNC",
			Metal:        "Níquel",
		})
		require.NoError(t, err)
		require.NotZero(t, created.CoinID)

		sqlDB, _ := db.DB()
		require.NoError(t, sqlDB.Close())
	}

	// FASE 2: REABRIR en una conexión NUEVA — simula reinicio del backend
	{
		db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
		require.NoError(t, err)
		require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

		repo := NewGormCoinRepository(db)
		ctx := context.Background()

		coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10})
		require.NoError(t, err)
		assert.Equal(t, int64(1), total)
		assert.Len(t, coins, 1)
		assert.True(t, coins[0].IsCurrent)
		assert.Equal(t, "Ecuador", coins[0].Country)
		assert.Equal(t, "1 Sucre", coins[0].Denomination)
		assert.Equal(t, "UNC", coins[0].Condition)
		assert.Equal(t, "Níquel", coins[0].Metal)
		assert.Equal(t, 1, coins[0].Version)

		sqlDB, _ := db.DB()
		sqlDB.Close()
	}
}

func TestPersistenceCertification_WithUpdate(t *testing.T) {
	tmpDir := t.TempDir()
	dbPath := filepath.Join(tmpDir, "cert_update.db")

	// FASE 1: Crear, actualizar, CERRAR
	{
		db, _ := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
		db.AutoMigrate(&models.CoinModel{})
		repo := NewGormCoinRepository(db)
		ctx := context.Background()

		created, _ := repo.Create(ctx, &domain.Coin{
			Country: "México", Denomination: "1 Peso", Metal: "Níquel",
		})
		_, err := repo.Update(ctx, &domain.Coin{
			CoinID: created.CoinID, Country: "México", Denomination: "1 Peso", Metal: "Plata",
		})
		require.NoError(t, err)

		sqlDB, _ := db.DB()
		sqlDB.Close()
	}

	// FASE 2: Reabrir — verificar 2 versiones SCD2
	{
		db, _ := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
		db.AutoMigrate(&models.CoinModel{})
		repo := NewGormCoinRepository(db)
		ctx := context.Background()

		// Current = v2
		coins, total, err := repo.List(ctx, domain.ListFilter{Page: 1, Limit: 10})
		require.NoError(t, err)
		assert.Equal(t, int64(1), total) // 1 unique coin
		assert.Equal(t, "Plata", coins[0].Metal)
		assert.Equal(t, 2, coins[0].Version)

		// History = 2 versions
		history, err := repo.GetHistory(ctx, coins[0].CoinID)
		require.NoError(t, err)
		assert.Len(t, history, 2)
		assert.Equal(t, "Níquel", history[1].Metal) // v1 (oldest)

		sqlDB, _ := db.DB()
		sqlDB.Close()
	}
}
