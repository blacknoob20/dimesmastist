import { useLocation } from 'wouter-preact'
import { CheckCircleIcon, XIcon } from '@/components/icons'
import { CoinFormSectionBasic } from './CoinFormSectionBasic'
import { CoinFormSectionCharacteristics } from './CoinFormSectionCharacteristics'
import { CoinFormSectionPhotos } from './CoinFormSectionPhotos'
import { CoinFormSectionCondition } from './CoinFormSectionCondition'
import { CoinFormSectionAdditional } from './CoinFormSectionAdditional'
import { CoinFormSectionTags } from './CoinFormSectionTags'
import { CoinFormPreview } from './CoinFormPreview'
import { CONDITION_COLORS } from '@/types/coin'
import { form, showToast, hasData, reset, submitForm } from '@/state/coinForm'
import { classNames } from '@/helpers/classNames'

export const CoinForm = () => {
  const [, navigate] = useLocation()
  const f = form.value

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    submitForm()
  }

  const handleCancel = () => {
    reset()
    navigate('/home')
  }

  return (
    <main>
      <section class="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 sm:pt-10 pb-6">
        <div class="max-w-5xl mx-auto text-center">
          <h1 class="text-2xl sm:text-3xl font-display text-brand-text tracking-tight">
            Registrar moneda
          </h1>
          <p class="mt-1 text-sm text-brand-muted">
            Añade una nueva moneda a tu colección
          </p>
        </div>
      </section>

      {hasData.value && (
        <div class="lg:hidden sticky top-0 z-30 bg-brand-surface border-b border-brand-border px-4 py-2.5">
          <div class="flex items-center gap-3 max-w-5xl mx-auto">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center flex-shrink-0">
              <span class="text-xs font-display text-brand-accent font-bold">
                {f.denomination ? f.denomination.split(' ')[0] : '?'}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-display font-semibold text-brand-text truncate">
                {f.denomination || 'Sin denominación'}
              </p>
              <p class="text-xs text-brand-muted truncate">
                {f.country || 'Sin país'}{f.year ? ` · ${f.year}` : ''}
              </p>
            </div>
            {f.condition && (
              <span class={classNames(
                'text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0',
                CONDITION_COLORS[f.condition as keyof typeof CONDITION_COLORS] ?? ''
              )}>
                {f.condition}
              </span>
            )}
          </div>
        </div>
      )}

      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form onSubmit={handleSubmit}>
          <div class="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
            <div class="space-y-6 sm:space-y-8">
              <div class="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionBasic />
              </div>
              <div class="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionCharacteristics />
              </div>
              <div class="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionPhotos />
              </div>
              <div class="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionCondition />
              </div>
              <div class="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionAdditional />
              </div>
              <div class="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionTags />
              </div>
            </div>

            <div class="hidden lg:block">
              <div class="sticky top-24">
                <CoinFormPreview />
              </div>
            </div>
          </div>

          <div class="mt-8 flex items-center justify-end gap-3 border-t border-brand-border pt-6">
            <button
              type="button"
              onClick={handleCancel}
              class="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-text transition-colors rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class={classNames(
                'px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white transition-colors',
                'bg-brand-accent hover:bg-brand-accent-hover',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-accent'
              )}
            >
              Guardar moneda
            </button>
          </div>
        </form>
      </section>

      {showToast.value && (
        <div class="fixed bottom-6 right-6 z-50">
          <div class="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-xl shadow-lg px-4 py-3 card-shadow">
            <CheckCircleIcon class="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span class="text-sm text-brand-text font-medium">Moneda registrada (mock)</span>
            <button
              type="button"
              onClick={() => { showToast.value = false }}
              class="ml-2 text-brand-muted hover:text-brand-text transition-colors"
            >
              <XIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
