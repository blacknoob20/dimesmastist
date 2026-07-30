package persistence

import (
	"time"

	"github.com/dimesmastist/backend/internal/infrastructure/persistence/models"
	"gorm.io/gorm"
)

type SCD2Helper struct {
	db *gorm.DB
}

func NewSCD2Helper(db *gorm.DB) *SCD2Helper {
	return &SCD2Helper{db: db}
}

func (h *SCD2Helper) NextCoinID() (uint64, error) {
	var maxCoinID int64
	err := h.db.Model(&models.CoinModel{}).
		Select("COALESCE(MAX(coin_id), 0)").
		Scan(&maxCoinID).Error
	return uint64(maxCoinID) + 1, err
}

func (h *SCD2Helper) CreateInitial(coin *models.CoinModel) error {
	coin.Version = 1
	coin.ValidFrom = time.Now()
	coin.IsCurrent = true
	return h.db.Create(coin).Error
}

func (h *SCD2Helper) SupersedeAndInsert(prevVersion int, coinID uint64, newCoin *models.CoinModel) error {
	return h.db.Transaction(func(tx *gorm.DB) error {
		closeTime := time.Now().Truncate(time.Second)

		if err := tx.Model(&models.CoinModel{}).
			Where("coin_id = ? AND version = ? AND is_current = ?", coinID, prevVersion, true).
			Updates(map[string]interface{}{
				"valid_to":  closeTime,
				"is_current": false,
			}).Error; err != nil {
			return err
		}

		newCoin.CoinID = coinID
		newCoin.Version = prevVersion + 1
		newCoin.ValidFrom = closeTime
		newCoin.IsCurrent = true
		return tx.Create(newCoin).Error
	})
}

func (h *SCD2Helper) CloseCurrent(coinID uint64) error {
	return h.db.Model(&models.CoinModel{}).
		Where("coin_id = ? AND is_current = ?", coinID, true).
		Updates(map[string]interface{}{
			"valid_to":  time.Now().Truncate(time.Second),
			"is_current": false,
		}).Error
}

func (h *SCD2Helper) GetCurrent(coinID uint64) (*models.CoinModel, error) {
	var coin models.CoinModel
	err := h.db.Where("coin_id = ? AND is_current = ?", coinID, true).First(&coin).Error
	return &coin, err
}

func (h *SCD2Helper) GetHistory(coinID uint64) ([]models.CoinModel, error) {
	var rows []models.CoinModel
	err := h.db.Where("coin_id = ?", coinID).Order("version DESC").Find(&rows).Error
	return rows, err
}
