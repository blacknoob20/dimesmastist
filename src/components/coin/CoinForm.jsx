import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon, XIcon } from '@heroicons/react/outline'
import { CoinFormSectionBasic } from './CoinFormSectionBasic'
import { CoinFormSectionCharacteristics } from './CoinFormSectionCharacteristics'
import { CoinFormSectionPhotos } from './CoinFormSectionPhotos'
import { CoinFormSectionCondition } from './CoinFormSectionCondition'
import { CoinFormSectionAdditional } from './CoinFormSectionAdditional'
import { CoinFormSectionTags } from './CoinFormSectionTags'
import { CoinFormPreview } from './CoinFormPreview'
import { INITIAL_FORM_STATE, CONDITION_COLORS } from './coinConstants'
import { classNames } from '../../helpers/classNames'

export const CoinForm = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE)
  const [showToast, setShowToast] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setForm(INITIAL_FORM_STATE)
  }

  const handleCancel = () => {
    setForm(INITIAL_FORM_STATE)
    navigate('/home')
  }

  const hasData = form.denomination || form.country || form.year

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 sm:pt-10 pb-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-display text-brand-text tracking-tight">
            Registrar moneda
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Añade una nueva moneda a tu colección
          </p>
        </div>
      </section>

      {/* Mobile preview banner */}
      {hasData && (
        <div className="lg:hidden sticky top-0 z-30 bg-brand-surface border-b border-brand-border px-4 py-2.5">
          <div className="flex items-center gap-3 max-w-5xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-display text-brand-accent font-bold">
                {form.denomination ? form.denomination.split(' ')[0] : '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-semibold text-brand-text truncate">
                {form.denomination || 'Sin denominación'}
              </p>
              <p className="text-xs text-brand-muted truncate">
                {form.country || 'Sin país'}
                {form.year ? ` · ${form.year}` : ''}
              </p>
            </div>
            {form.condition && (
              <span
                className={classNames(
                  'text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0',
                  CONDITION_COLORS[form.condition]
                )}
              >
                {form.condition}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form onSubmit={handleSubmit}>
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
            {/* Left column: sections */}
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionBasic form={form} onChange={handleChange} />
              </div>

              <div className="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionCharacteristics form={form} onChange={handleChange} />
              </div>

              <div className="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionPhotos form={form} onChange={handleChange} />
              </div>

              <div className="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionCondition form={form} onChange={handleChange} />
              </div>

              <div className="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionAdditional form={form} onChange={handleChange} />
              </div>

              <div className="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                <CoinFormSectionTags form={form} onChange={handleChange} />
              </div>
            </div>

            {/* Right column: preview (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <CoinFormPreview form={form} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-brand-border pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-text transition-colors rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={classNames(
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

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-xl shadow-lg px-4 py-3 card-shadow">
            <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span className="text-sm text-brand-text font-medium">
              Moneda registrada (mock)
            </span>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="ml-2 text-brand-muted hover:text-brand-text transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
