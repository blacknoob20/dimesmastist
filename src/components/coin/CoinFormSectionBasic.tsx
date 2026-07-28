import { useMemo } from 'preact/hooks'
import { Combobox } from '@/components/primitives/Combobox'
import { Switch } from '@/components/primitives/Switch'
import { CoinFormField } from './CoinFormField'
import { COUNTRIES, MOCK_COINS } from '@/types/coin'
import type { Country } from '@/types/coin'
import { form, setField } from '@/state/coinForm'

export const CoinFormSectionBasic = () => {
  const f = form.value

  const filteredCountries = useMemo(() => COUNTRIES, [])

  const selectedCountry = COUNTRIES.find((c) => c.name === f.country) || null

  const suggestion = useMemo(() => {
    if (!f.country || !f.denomination) return null
    const match = MOCK_COINS.find(
      (c) =>
        c.country === f.country &&
        c.denomination.toLowerCase().includes(f.denomination.toLowerCase())
    )
    if (!match) return null
    return { metal: match.metal, km: match.km }
  }, [f.country, f.denomination])

  const applySuggestion = () => {
    if (!suggestion) return
    setField('metal', suggestion.metal)
    setField('km', suggestion.km)
  }

  return (
    <div class="space-y-6">
      <h3 class="font-display font-semibold text-brand-text text-base">
        Información básica
      </h3>

      <div>
        <label class="block text-sm font-medium font-display text-brand-text">
          País *
        </label>
        <div class="mt-1">
          <Combobox<Country>
            value={selectedCountry}
            onChange={(country) => setField('country', country?.name ?? '')}
            options={filteredCountries}
            filter={(opt, q) => !q || opt.name.toLowerCase().includes(q.toLowerCase())}
            displayValue={(country) => country.name}
            placeholder="Buscar país..."
            renderOption={(country, { selected }) => (
              <span class="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </span>
            )}
          />
        </div>
      </div>

      <CoinFormField
        label="Denominación"
        name="denomination"
        value={f.denomination}
        onChange={setField}
        placeholder="ej. 1 Sucre"
        required
      />

      <div class="grid grid-cols-2 gap-4">
        <CoinFormField
          label="Valor facial"
          name="valorFacial"
          value={f.valorFacial}
          onChange={setField}
          placeholder="0"
          prefix="$"
        />
        <CoinFormField
          label="Año"
          name="year"
          value={f.year}
          onChange={setField}
          placeholder="yyyy"
          required
        />
      </div>

      <div class="flex items-center justify-between">
        <div>
          <label class="text-sm font-medium font-display text-brand-text">
            Tipo de moneda
          </label>
          <p class="text-xs text-brand-muted">
            Circulación o conmemorativa
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class={`text-xs ${!f.conmemorativa ? 'text-brand-text font-medium' : 'text-brand-muted'}`}>
            Circulación
          </span>
          <Switch
            checked={f.conmemorativa}
            onChange={(val) => setField('conmemorativa', val)}
          />
          <span class={`text-xs ${f.conmemorativa ? 'text-brand-text font-medium' : 'text-brand-muted'}`}>
            Conmemorativa
          </span>
        </div>
      </div>

      <CoinFormField
        label="Emitida por"
        name="emitidaPor"
        value={f.emitidaPor}
        onChange={setField}
        placeholder="ej. Banco Central del Ecuador"
        hint="Institución que emitió la moneda"
      />

      {suggestion && (
        <div class="rounded-lg border border-brand-accent/30 bg-brand-accent/5 p-3 flex items-center justify-between">
          <div class="text-xs text-brand-muted">
            <span class="text-brand-accent font-medium">Sugerencia:</span>{' '}
            {suggestion.metal} · {suggestion.km}
          </div>
          <button
            type="button"
            onClick={applySuggestion}
            class="text-xs text-brand-accent hover:text-brand-accent-hover font-medium transition-colors"
          >
            Usar
          </button>
        </div>
      )}
    </div>
  )
}
