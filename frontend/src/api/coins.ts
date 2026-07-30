const API_URL = import.meta.env.VITE_API_URL || '/api/v1'
import type { CatalogCoin } from '@/types/catalog'
import type { CollectionInstance } from '@/types/collection'

interface CoinData {
  id: number
  coin_id: number
  version: number
  valid_from: string
  valid_to?: string
  is_current: boolean
  country: string
  denomination: string
  valor_facial?: string
  year?: number
  conmemorativa: boolean
  emitida_por?: string
  metal?: string
  peso?: number
  diametro?: number
  espesor?: number
  forma?: string
  orientacion?: string
  canto?: string
  ceca?: string
  km?: string
  serie?: string
  anverso_img?: string
  reverso_img?: string
  condition?: string
  descripcion?: string
  notas?: string
  procedencia?: string
  precio_compra?: number
  fecha_adquisicion?: string
  etiquetas?: string[]
  created_at: string
  updated_at: string
}

interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

interface ListData {
  items: CoinData[]
  total: number
  page: number
  limit: number
}

export type { CoinData, ApiResponse, ListData }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(body.message || `HTTP ${res.status}`)
  }
  if (res.status === 204) return null as T
  return res.json()
}

function mapToInstance(data: CoinData): CollectionInstance {
  return {
    id: data.coin_id,
    catalogCoinId: data.km ?? `api-${data.coin_id}`,
    condition: (data.condition ?? 'UNC') as CollectionInstance['condition'],
    acquisitionDate: data.fecha_adquisicion,
    pricePaid: data.precio_compra,
    provenance: data.procedencia,
    notes: data.notas,
    tags: data.etiquetas ?? [],
    anversoImg: data.anverso_img ?? null,
    reversoImg: data.reverso_img ?? null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapToCatalog(data: CoinData): CatalogCoin {
  return {
    id: data.km ?? `api-${data.coin_id}`,
    denomination: data.denomination,
    country: data.country,
    year: data.year ?? 0,
    metal: data.metal ?? '',
    km: data.km ?? '',
    ceca: data.ceca,
    weight: data.peso,
    diameter: data.diametro,
    shape: data.forma,
    edge: data.canto,
    description: data.descripcion,
  }
}

export { mapToInstance, mapToCatalog }

export const coinsApi = {
  create: (coin: Record<string, unknown>) =>
    request<ApiResponse<CoinData>>('/coins', {
      method: 'POST',
      body: JSON.stringify(coin),
    }),

  get: (coinId: number) =>
    request<ApiResponse<CoinData>>(`/coins/${coinId}`),

  list: (params?: { page?: number; limit?: number; condition?: string; country?: string; q?: string }) => {
    const qs = new URLSearchParams()
    if (params?.page) qs.set('page', String(params.page))
    if (params?.limit) qs.set('limit', String(params.limit))
    if (params?.condition) qs.set('condition', params.condition)
    if (params?.country) qs.set('country', params.country)
    if (params?.q) qs.set('q', params.q)
    const query = qs.toString()
    return request<ApiResponse<ListData>>(`/coins${query ? '?' + query : ''}`)
  },

  update: (coinId: number, data: Record<string, unknown>) =>
    request<ApiResponse<CoinData>>(`/coins/${coinId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (coinId: number) =>
    request<null>(`/coins/${coinId}`, { method: 'DELETE' }),

  history: (coinId: number) =>
    request<ApiResponse<ListData>>(`/coins/${coinId}/history`),

  uploadPhoto: async (coinId: number, file: File, face: 'anverso' | 'reverso') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('face', face)
    const res = await fetch(`${API_URL}/coins/${coinId}/photos`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: res.statusText }))
      throw new Error(body.message || `HTTP ${res.status}`)
    }
    return res.json()
  },

  fetchMyCollection: async (): Promise<CollectionInstance[]> => {
    try {
      const res = await coinsApi.list({ limit: 100 })
      return res.data.items.filter((c) => c.is_current).map(mapToInstance)
    } catch {
      return []
    }
  },
}
