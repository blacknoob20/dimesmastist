package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCoinModel_Fields(t *testing.T) {
	m := CoinModel{
		ID:           1,
		CoinID:       1,
		Version:      1,
		IsCurrent:    true,
		Country:      "Ecuador",
		Denomination: "1 Sucre",
		Condition:    "UNC",
		Metal:        "Níquel",
		Forma:        "Circular",
		Orientacion:  "Estándar",
	}
	assert.Equal(t, uint64(1), m.CoinID)
	assert.Equal(t, 1, m.Version)
	assert.True(t, m.IsCurrent)
	assert.Equal(t, "Ecuador", m.Country)
	assert.Equal(t, "Circular", m.Forma)
	assert.Equal(t, "Estándar", m.Orientacion)
}

func TestCoinModel_PointerFields(t *testing.T) {
	year := 1994
	peso := 25.0
	m := CoinModel{
		Year:  &year,
		Peso:  &peso,
		KM:    "KM#88",
		Serie: "Serie A",
	}
	assert.NotNil(t, m.Year)
	assert.Equal(t, 1994, *m.Year)
	assert.NotNil(t, m.Peso)
	assert.Equal(t, 25.0, *m.Peso)
}
