import { signal, computed, effect } from '@preact/signals'
import { INITIAL_FORM_STATE, type CoinFormState } from '@/types/coin'

export const form = signal<CoinFormState>(INITIAL_FORM_STATE)
export const showToast = signal(false)

export const hasData = computed(() =>
  !!form.value.denomination || !!form.value.country || !!form.value.year
)

export const setField = <K extends keyof CoinFormState>(
  name: K,
  value: CoinFormState[K]
) => {
  form.value = { ...form.value, [name]: value }
}

export const reset = () => {
  form.value = INITIAL_FORM_STATE
  try { localStorage.removeItem('dimes:form-draft') } catch {}
}

let toastTimer = 0
export const submitForm = () => {
  showToast.value = true
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => { showToast.value = false }, 3000)
  reset()
}

if (typeof window !== 'undefined') {
  effect(() => {
    try { localStorage.setItem('dimes:form-draft', JSON.stringify(form.value)) } catch {}
  })

  try {
    const saved = localStorage.getItem('dimes:form-draft')
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<CoinFormState>
      form.value = { ...INITIAL_FORM_STATE, ...parsed }
    }
  } catch {}
}
