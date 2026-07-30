package domain

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCoin_ErrorsAreDefined(t *testing.T) {
	assert.Error(t, ErrNotFound)
	assert.Error(t, ErrValidation)
	assert.Error(t, ErrConflict)
	assert.Error(t, ErrInternal)
	assert.Error(t, ErrNotImplemented)
}

func TestCoin_StructCanBeCreated(t *testing.T) {
	coin := Coin{
		Country:      "Ecuador",
		Denomination: "1 Sucre",
		Year:         intPtr(1994),
		Condition:    "UNC",
		Metal:        "Níquel",
		IsCurrent:    true,
		Version:      1,
	}
	assert.Equal(t, "Ecuador", coin.Country)
	assert.Equal(t, 1994, *coin.Year)
}

func intPtr(i int) *int { return &i }
