import { signal, computed } from '@preact/signals'
import type { CollectionInstance } from '@/types/collection'

export const myCollection = signal<readonly CollectionInstance[]>([])
export const collectionQuery = signal('')
export const collectionFilters = signal<{ country?: string; metal?: string; condition?: string }>({})
export const isCollectionLoading = signal(false)

export const filteredCollection = computed(() => {
  const q = collectionQuery.value.toLowerCase().trim()
  const f = collectionFilters.value
  return myCollection.value.filter((inst) => {
    if (q && !inst.notes?.toLowerCase().includes(q) && !inst.tags.some((t) => t.toLowerCase().includes(q))) return false
    if (f.condition && inst.condition !== f.condition) return false
    return true
  })
})

export const collectionStats = computed(() => {
  const items = myCollection.value
  const total = items.length
  const totalValue = items.reduce((sum, i) => sum + (i.pricePaid ?? 0), 0)
  return { total, totalValue }
})

export const addInstance = (instance: CollectionInstance) => {
  myCollection.value = [instance, ...myCollection.value]
}

export const removeInstance = (id: number) => {
  myCollection.value = myCollection.value.filter((i) => i.id !== id)
}

export const updateInstance = (updated: CollectionInstance) => {
  myCollection.value = myCollection.value.map((i) => (i.id === updated.id ? updated : i))
}
