import type { Condition } from './coin'

export interface CollectionInstance {
  id: number
  catalogCoinId: string
  condition: Condition
  acquisitionDate?: string
  pricePaid?: number
  provenance?: string
  notes?: string
  tags: string[]
  anversoImg?: string | null
  reversoImg?: string | null
  createdAt: string
  updatedAt: string
}

export type InstanceFormState = {
  catalogCoinId: string
  condition: Condition | ''
  acquisitionDate: string
  pricePaid: string
  provenance: string
  notes: string
  tags: string[]
  anversoImg: string | null
  reversoImg: string | null
}

export const INITIAL_INSTANCE_FORM: InstanceFormState = {
  catalogCoinId: '',
  condition: '',
  acquisitionDate: '',
  pricePaid: '',
  provenance: '',
  notes: '',
  tags: [],
  anversoImg: null,
  reversoImg: null,
}
