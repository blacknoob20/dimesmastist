import { signal, computed, effect } from '@preact/signals'
import { INITIAL_INSTANCE_FORM, type InstanceFormState } from '@/types/collection'
import { coinsApi } from '@/api/coins'

export const form = signal<InstanceFormState>(INITIAL_INSTANCE_FORM)
export const formStep = signal<1 | 2>(1)
export const showToast = signal(false)
export const isSubmitting = signal(false)
export const submitError = signal<string | null>(null)

export const hasCatalogSelection = computed(() => !!form.value.catalogCoinId)
export const hasPersonalData = computed(() =>
  !!form.value.condition || !!form.value.acquisitionDate || !!form.value.pricePaid
)

export const setField = <K extends keyof InstanceFormState>(
  name: K,
  value: InstanceFormState[K]
) => {
  form.value = { ...form.value, [name]: value }
}

export const selectCatalogCoin = (catalogCoinId: string) => {
  form.value = { ...form.value, catalogCoinId }
  formStep.value = 2
}

export const goToStep1 = () => {
  formStep.value = 1
  form.value = { ...form.value, catalogCoinId: '' }
}

export const reset = () => {
  form.value = INITIAL_INSTANCE_FORM
  formStep.value = 1
  submitError.value = null
  try { localStorage.removeItem('dimes:instance-draft') } catch {}
}

let toastTimer = 0
export const submitForm = async () => {
  const f = form.value
  if (!f.catalogCoinId) {
    submitError.value = 'Selecciona una moneda del catálogo'
    return
  }
  if (!f.condition) {
    submitError.value = 'El estado de conservación es requerido'
    return
  }

  isSubmitting.value = true
  submitError.value = null

  try {
    const payload: Record<string, unknown> = {
      denomination: '',
      country: '',
      condition: f.condition || undefined,
      notas: f.notes || undefined,
      procedencia: f.provenance || undefined,
      precio_compra: f.pricePaid ? Number(f.pricePaid) : undefined,
      fecha_adquisicion: f.acquisitionDate || undefined,
      etiquetas: f.tags.length > 0 ? f.tags : undefined,
    }

    const res = await coinsApi.create(payload)
    const coinId = res.data.coin_id

    if (f.anversoImg) {
      const resp = await fetch(f.anversoImg)
      const blob = await resp.blob()
      const file = new File([blob], 'anverso.jpg', { type: blob.type })
      await coinsApi.uploadPhoto(coinId, file, 'anverso')
    }
    if (f.reversoImg) {
      const resp = await fetch(f.reversoImg)
      const blob = await resp.blob()
      const file = new File([blob], 'reverso.jpg', { type: blob.type })
      await coinsApi.uploadPhoto(coinId, file, 'reverso')
    }

    showToast.value = true
    clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => { showToast.value = false }, 3000)
    reset()
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Error al guardar'
  } finally {
    isSubmitting.value = false
  }
}

if (typeof window !== 'undefined') {
  effect(() => {
    try { localStorage.setItem('dimes:instance-draft', JSON.stringify(form.value)) } catch {}
  })

  try {
    const saved = localStorage.getItem('dimes:instance-draft')
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<InstanceFormState>
      form.value = { ...INITIAL_INSTANCE_FORM, ...parsed }
    }
  } catch {}
}
