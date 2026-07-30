import { useLocation, useRoute } from 'wouter-preact'
import { CheckCircleIcon, XIcon, SearchIcon } from '@/components/icons'
import { form, formStep, setField, selectCatalogCoin, goToStep1, reset, submitForm, isSubmitting, submitError, showToast, hasCatalogSelection } from '@/state/coinForm'
import { catalogQuery, filteredCatalog, getCatalogCoin } from '@/state/catalog'
import { CONDITION_COLORS, CONDITIONS } from '@/types/coin'
import { classNames } from '@/helpers/classNames'

const COUNTRY_FLAGS: Record<string, string> = {
  Ecuador: '🇪🇨', México: '🇲🇽', Argentina: '🇦🇷', Brasil: '🇧🇷', Perú: '🇵🇪',
  Colombia: '🇨🇴', Chile: '🇨🇱', Venezuela: '🇻🇪', Bolivia: '🇧🇴', Uruguay: '🇺🇾',
  Paraguay: '🇵🇾', USA: '🇺🇸', Alemania: '🇩🇪', Francia: '🇫🇷', España: '🇪🇸',
  Italia: '🇮🇹', 'Reino Unido': '🇬🇧', Japón: '🇯🇵', China: '🇨🇳', Egipto: '🇪🇬',
  Canadá: '🇨🇦', Australia: '🇦🇺',
}

export const InstanceFormPage = () => {
  const [, navigate] = useLocation()
  const [, params] = useRoute('/mi-coleccion/registrar')
  const f = form.value

  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const catalogId = urlParams.get('catalogId')
  const selectedCoin = f.catalogCoinId ? getCatalogCoin(f.catalogCoinId) : undefined

  if (catalogId && !hasCatalogSelection.value) {
    selectCatalogCoin(catalogId)
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    submitForm().then(() => {
      if (!submitError.value) navigate('/mi-coleccion')
    })
  }

  const handleCancel = () => {
    reset()
    navigate('/mi-coleccion')
  }

  return (
    <main>
      <section class="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 sm:pt-10 pb-6">
        <div class="max-w-5xl mx-auto text-center">
          <h1 class="text-2xl sm:text-3xl font-display text-brand-text tracking-tight">
            Nueva instancia
          </h1>
          <p class="mt-1 text-sm text-brand-muted">
            {formStep.value === 1 ? 'Selecciona una moneda del catálogo' : 'Completa los datos personales'}
          </p>
          <div class="mt-4 flex items-center justify-center gap-2">
            <StepIndicator step={1} label="Catálogo" active={formStep.value === 1} done={hasCatalogSelection.value} />
            <div class="w-8 h-px bg-brand-border" />
            <StepIndicator step={2} label="Personales" active={formStep.value === 2} done={false} />
          </div>
        </div>
      </section>

      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {formStep.value === 1 ? (
          <Step1SelectCoin onSelect={selectCatalogCoin} />
        ) : (
          <form onSubmit={handleSubmit}>
            <div class="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
              <div class="space-y-6">
                {selectedCoin && (
                  <div class="bg-brand-surface-secondary rounded-xl border border-brand-border p-4 flex items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span class="text-lg font-display text-brand-accent font-bold">
                        {selectedCoin.denomination.split(' ')[0]}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-display font-semibold text-brand-text truncate">{selectedCoin.denomination}</p>
                      <p class="text-xs text-brand-muted">{COUNTRY_FLAGS[selectedCoin.country] ?? ''} {selectedCoin.country} · {selectedCoin.year} · {selectedCoin.km}</p>
                    </div>
                    <button type="button" onClick={goToStep1} class="text-xs text-brand-accent hover:text-brand-accent-hover">Cambiar</button>
                  </div>
                )}

                <div class="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow">
                  <h2 class="text-sm font-display font-semibold text-brand-text mb-4">Estado de conservación</h2>
                  <div class="flex flex-wrap gap-2">
                    {CONDITIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setField('condition', value)}
                        class={classNames(
                          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                          f.condition === value
                            ? 'ring-2 ring-brand-accent shadow-md ' + (CONDITION_COLORS[value] ?? '')
                            : 'bg-brand-surface-secondary border border-brand-border text-brand-muted hover:border-brand-accent'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div class="bg-brand-surface rounded-xl border border-brand-border p-4 sm:p-6 card-shadow space-y-4">
                  <h2 class="text-sm font-display font-semibold text-brand-text">Datos personales</h2>
                  <Field label="Fecha de adquisición" type="date" value={f.acquisitionDate} onChange={(v) => setField('acquisitionDate', v)} />
                  <Field label="Precio pagado" type="number" placeholder="0.00" value={f.pricePaid} onChange={(v) => setField('pricePaid', v)} />
                  <Field label="Procedencia" placeholder="De quién lo obtuviste" value={f.provenance} onChange={(v) => setField('provenance', v)} />
                  <div>
                    <label class="block text-xs font-medium text-brand-muted mb-1">Notas</label>
                    <textarea
                      value={f.notes}
                      onInput={(e) => setField('notes', (e.target as HTMLTextAreaElement).value)}
                      rows={3}
                      placeholder="Observaciones, historia, estado detallado..."
                      class="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-brand-text text-sm placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div class="hidden lg:block">
                <div class="sticky top-24">
                  <div class="bg-brand-surface rounded-xl border border-brand-border p-4 card-shadow">
                    <h3 class="text-xs font-display font-semibold text-brand-text mb-3">Resumen</h3>
                    {selectedCoin && (
                      <div class="space-y-2 text-sm">
                        <p class="text-brand-muted"><span class="font-medium text-brand-text">Moneda:</span> {selectedCoin.denomination}</p>
                        <p class="text-brand-muted"><span class="font-medium text-brand-text">País:</span> {selectedCoin.country}</p>
                        <p class="text-brand-muted"><span class="font-medium text-brand-text">Año:</span> {selectedCoin.year}</p>
                        <p class="text-brand-muted"><span class="font-medium text-brand-text">Metal:</span> {selectedCoin.metal}</p>
                        <p class="text-brand-muted"><span class="font-medium text-brand-text">KM:</span> {selectedCoin.km}</p>
                        {f.condition && <p class="text-brand-muted"><span class="font-medium text-brand-text">Estado:</span> {f.condition}</p>}
                        {f.pricePaid && <p class="text-brand-muted"><span class="font-medium text-brand-text">Precio:</span> ${f.pricePaid}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {submitError.value && (
              <div class="mt-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
                {submitError.value}
              </div>
            )}

            <div class="mt-8 flex items-center justify-end gap-3 border-t border-brand-border pt-6">
              <button type="button" onClick={handleCancel} class="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-text transition-colors rounded-lg">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting.value}
                class={classNames(
                  'px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white transition-colors',
                  isSubmitting.value
                    ? 'bg-brand-accent/60 cursor-not-allowed'
                    : 'bg-brand-accent hover:bg-brand-accent-hover',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-accent'
                )}
              >
                {isSubmitting.value ? 'Guardando...' : 'Guardar en mi colección'}
              </button>
            </div>
          </form>
        )}
      </section>

      {showToast.value && (
        <div class="fixed bottom-6 right-6 z-50">
          <div class="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-xl shadow-lg px-4 py-3 card-shadow">
            <CheckCircleIcon class="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <span class="text-sm text-brand-text font-medium">Moneda agregada a tu colección</span>
            <button type="button" onClick={() => { showToast.value = false }} class="ml-2 text-brand-muted hover:text-brand-text transition-colors">
              <XIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

const StepIndicator = ({ step, label, active, done }: { step: number; label: string; active: boolean; done: boolean }) => (
  <div class="flex items-center gap-1.5">
    <span class={classNames(
      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
      active ? 'bg-brand-accent text-white' : done ? 'bg-emerald-500 text-white' : 'bg-brand-border text-brand-muted'
    )}>
      {step}
    </span>
    <span class={classNames('text-xs', active ? 'text-brand-text font-medium' : 'text-brand-muted')}>{label}</span>
  </div>
)

const Step1SelectCoin = ({ onSelect }: { onSelect: (id: string) => void }) => (
  <div>
    <div class="max-w-xl mb-6">
      <div class="relative">
        <SearchIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
        <input
          type="text"
          placeholder="Buscar moneda por denominación, país, KM..."
          value={catalogQuery.value}
          onInput={(e) => { catalogQuery.value = (e.target as HTMLInputElement).value }}
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-brand-text text-sm placeholder-brand-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {filteredCatalog.value.map((coin) => (
        <button
          key={coin.id}
          type="button"
          onClick={() => onSelect(coin.id)}
          class="flex items-center gap-3 p-3 rounded-xl border border-brand-border bg-brand-surface hover:border-brand-accent hover:shadow-md transition-all duration-200 text-left"
        >
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center flex-shrink-0">
            <span class="text-xs font-display text-brand-accent font-bold">{coin.denomination.split(' ')[0]}</span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-brand-text truncate">{coin.denomination}</p>
            <p class="text-[11px] text-brand-muted truncate">{COUNTRY_FLAGS[coin.country] ?? ''} {coin.country} · {coin.year} · {coin.km}</p>
          </div>
        </button>
      ))}
    </div>

    {filteredCatalog.value.length === 0 && (
      <div class="text-center py-12">
        <p class="text-sm text-brand-muted">No se encontraron monedas para "{catalogQuery.value}"</p>
      </div>
    )}
  </div>
)

const Field = ({ label, type = 'text', placeholder, value, onChange }: {
  label: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void
}) => (
  <div>
    <label class="block text-xs font-medium text-brand-muted mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onInput={(e) => onChange((e.target as HTMLInputElement).value)}
      class="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-surface text-brand-text text-sm placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all"
    />
  </div>
)
