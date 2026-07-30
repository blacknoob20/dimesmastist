package persistence

import (
	"testing"
	"time"

	"github.com/dimesmastist/backend/internal/infrastructure/persistence/models"
	"github.com/dimesmastist/backend/tests/helpers"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSCD2_Create_StartsAtV1(t *testing.T) {
	db := helpers.NewTestDB(t)
	require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

	now := time.Now().Truncate(time.Second)
	coin := models.CoinModel{
		CoinID:      1,
		Version:     1,
		ValidFrom:   now,
		IsCurrent:   true,
		Country:     "Ecuador",
		Denomination: "1 Sucre",
		Condition:   "UNC",
	}
	require.NoError(t, db.Create(&coin).Error)

	var loaded models.CoinModel
	require.NoError(t, db.Where("coin_id = ?", 1).First(&loaded).Error)

	assert.Equal(t, 1, loaded.Version)
	assert.True(t, loaded.IsCurrent)
	assert.True(t, loaded.ValidFrom.Equal(now))
	assert.Nil(t, loaded.ValidTo)
}

func TestSCD2_Update_ClosesPrevOpensNew(t *testing.T) {
	db := helpers.NewTestDB(t)
	require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

	v1 := models.CoinModel{
		CoinID:      1,
		Version:     1,
		ValidFrom:   time.Now().Add(-24 * time.Hour),
		IsCurrent:   true,
		Country:     "Ecuador",
		Denomination: "1 Sucre",
		Metal:       "Níquel",
	}
	require.NoError(t, db.Create(&v1).Error)

	// Close v1
	closeTime := time.Now().Truncate(time.Second)
	require.NoError(t, db.Model(&models.CoinModel{}).
		Where("coin_id = ? AND version = ?", 1, 1).
		Updates(map[string]interface{}{
			"valid_to":  closeTime,
			"is_current": false,
		}).Error)

	// Create v2
	v2 := models.CoinModel{
		CoinID:      1,
		Version:     2,
		ValidFrom:   closeTime,
		IsCurrent:   true,
		Country:     "Ecuador",
		Denomination: "1 Sucre",
		Metal:       "Plata",
	}
	require.NoError(t, db.Create(&v2).Error)

	var rows []models.CoinModel
	require.NoError(t, db.Where("coin_id = ?", 1).Order("version ASC").Find(&rows).Error)
	require.Len(t, rows, 2)

	assert.True(t, rows[0].IsCurrent == false)
	assert.NotNil(t, rows[0].ValidTo)
	assert.Equal(t, "Níquel", rows[0].Metal)

	assert.True(t, rows[1].IsCurrent)
	assert.Nil(t, rows[1].ValidTo)
	assert.Equal(t, "Plata", rows[1].Metal)
}

func TestSCD2_Update_5Times_6Versions(t *testing.T) {
	db := helpers.NewTestDB(t)
	require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

	metals := []string{"Níquel", "Plata", "Oro", "Acero", "Bronce", "Cobre"}
	now := time.Now().Truncate(time.Second)

	// Create v1
	require.NoError(t, db.Create(&models.CoinModel{
		CoinID: 1, Version: 1, ValidFrom: now, IsCurrent: true,
		Country: "México", Denomination: "1 Peso", Metal: metals[0],
	}).Error)

	for i := 1; i <= 5; i++ {
		closeTime := now.Add(time.Duration(i) * time.Hour)
		require.NoError(t, db.Model(&models.CoinModel{}).
			Where("coin_id = ? AND version = ?", 1, i).
			Updates(map[string]interface{}{
				"valid_to":  closeTime,
				"is_current": false,
			}).Error)

		require.NoError(t, db.Create(&models.CoinModel{
			CoinID: 1, Version: i + 1, ValidFrom: closeTime, IsCurrent: true,
			Country: "México", Denomination: "1 Peso", Metal: metals[i],
		}).Error)
	}

	var rows []models.CoinModel
	require.NoError(t, db.Where("coin_id = ?", 1).Order("version ASC").Find(&rows).Error)
	require.Len(t, rows, 6)

	for i, row := range rows {
		if i < 5 {
			assert.False(t, row.IsCurrent, "v%d should not be current", row.Version)
			assert.NotNil(t, row.ValidTo)
		} else {
			assert.True(t, row.IsCurrent, "v%d should be current", row.Version)
			assert.Nil(t, row.ValidTo)
		}
		assert.Equal(t, metals[i], row.Metal, "v%d metal mismatch", row.Version)
	}
}

func TestSCD2_Delete_ClosesWithoutNew(t *testing.T) {
	db := helpers.NewTestDB(t)
	require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

	require.NoError(t, db.Create(&models.CoinModel{
		CoinID: 1, Version: 1, ValidFrom: time.Now().Add(-time.Hour), IsCurrent: true,
		Country: "Ecuador", Denomination: "1 Sucre",
	}).Error)

	// Close (tombstone)
	closeTime := time.Now().Truncate(time.Second)
	require.NoError(t, db.Model(&models.CoinModel{}).
		Where("coin_id = ? AND version = ?", 1, 1).
		Updates(map[string]interface{}{
			"valid_to":  closeTime,
			"is_current": false,
		}).Error)

	var row models.CoinModel
	require.NoError(t, db.Where("coin_id = ?", 1).First(&row).Error)
	assert.False(t, row.IsCurrent)
	assert.NotNil(t, row.ValidTo)
}

func TestSCD2_ListDefault_HidesHistory(t *testing.T) {
	db := helpers.NewTestDB(t)
	require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

	now := time.Now().Truncate(time.Second)
	require.NoError(t, db.Create(&models.CoinModel{
		CoinID: 1, Version: 1, ValidFrom: now.Add(-time.Hour), IsCurrent: false,
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
		ValidTo: &now,
	}).Error)
	require.NoError(t, db.Create(&models.CoinModel{
		CoinID: 1, Version: 2, ValidFrom: now, IsCurrent: true,
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Plata",
	}).Error)

	var rows []models.CoinModel
	require.NoError(t, db.Where("coin_id = ? AND is_current = ?", 1, true).Find(&rows).Error)
	require.Len(t, rows, 1)
	assert.Equal(t, "Plata", rows[0].Metal)
}

func TestSCD2_ListAll_ReturnsHistoryOrdered(t *testing.T) {
	db := helpers.NewTestDB(t)
	require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

	now := time.Now().Truncate(time.Second)
	require.NoError(t, db.Create(&models.CoinModel{
		CoinID: 1, Version: 1, ValidFrom: now.Add(-2 * time.Hour), IsCurrent: false,
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
		ValidTo: &now,
	}).Error)
	require.NoError(t, db.Create(&models.CoinModel{
		CoinID: 1, Version: 2, ValidFrom: now, IsCurrent: true,
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Plata",
	}).Error)

	var rows []models.CoinModel
	require.NoError(t, db.Where("coin_id = ?", 1).Order("version DESC").Find(&rows).Error)
	require.Len(t, rows, 2)
	assert.Equal(t, "Plata", rows[0].Metal)
	assert.Equal(t, "Níquel", rows[1].Metal)
}

func TestSCD2_TransactionRollback(t *testing.T) {
	db := helpers.NewTestDB(t)
	require.NoError(t, db.AutoMigrate(&models.CoinModel{}))

	now := time.Now().Truncate(time.Second)
	require.NoError(t, db.Create(&models.CoinModel{
		CoinID: 1, Version: 1, ValidFrom: now.Add(-time.Hour), IsCurrent: true,
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Níquel",
	}).Error)

	// Transaction: close v1 then create v2 — but fail v2 creation
	tx := db.Begin()
	require.NoError(t, tx.Model(&models.CoinModel{}).
		Where("coin_id = ? AND version = ?", 1, 1).
		Updates(map[string]interface{}{
			"valid_to":  now,
			"is_current": false,
		}).Error)

	// This will fail due to unique constraint (same coin_id + version)
	err := tx.Create(&models.CoinModel{
		CoinID: 1, Version: 1, ValidFrom: now, IsCurrent: true,
		Country: "Ecuador", Denomination: "1 Sucre", Metal: "Plata",
	}).Error
	tx.Rollback()
	require.Error(t, err)

	// v1 should still be current (rollback worked)
	var row models.CoinModel
	require.NoError(t, db.Where("coin_id = ?", 1).First(&row).Error)
	assert.True(t, row.IsCurrent)
	assert.Nil(t, row.ValidTo)
}
