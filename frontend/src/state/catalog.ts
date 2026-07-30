import { signal, computed } from '@preact/signals'
import type { CatalogCoin } from '@/types/catalog'
import { CATALOG_SEED } from '@/data/catalogSeed'

export const catalogCoins = signal<readonly CatalogCoin[]>(CATALOG_SEED)
export const catalogQuery = signal('')
export const catalogFilters = signal<{ country?: string; metal?: string; yearFrom?: number; yearTo?: number }>({})

export const filteredCatalog = computed(() => {
  const q = catalogQuery.value.toLowerCase().trim()
  const f = catalogFilters.value
  return catalogCoins.value.filter((c) => {
    if (q && !c.denomination.toLowerCase().includes(q) && !c.country.toLowerCase().includes(q) && !c.km.toLowerCase().includes(q) && !String(c.year).includes(q) && !c.metal.toLowerCase().includes(q)) return false
    if (f.country && c.country !== f.country) return false
    if (f.metal && c.metal !== f.metal) return false
    if (f.yearFrom && c.year < f.yearFrom) return false
    if (f.yearTo && c.year > f.yearTo) return false
    return true
  })
})

export const getCatalogCoin = (id: string): CatalogCoin | undefined =>
  catalogCoins.value.find((c) => c.id === id)
