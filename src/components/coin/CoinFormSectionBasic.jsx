import { useState, useMemo, Fragment } from 'react'
import { Combobox, Switch, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/outline'
import { CoinFormField } from './CoinFormField'
import { COUNTRIES, coins } from './coinConstants'
import { classNames } from '../../helpers/classNames'

export const CoinFormSectionBasic = ({ form, onChange }) => {
  const [countryQuery, setCountryQuery] = useState('')

  const filteredCountries = useMemo(() => {
    if (!countryQuery) return COUNTRIES
    return COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(countryQuery.toLowerCase())
    )
  }, [countryQuery])

  const selectedCountry = COUNTRIES.find((c) => c.name === form.country) || null

  const suggestion = useMemo(() => {
    if (!form.country || !form.denomination) return null
    const match = coins.find(
      (c) =>
        c.country === form.country &&
        c.denomination.toLowerCase().includes(form.denomination.toLowerCase())
    )
    if (!match) return null
    return { metal: match.metal, km: match.km }
  }, [form.country, form.denomination])

  const applySuggestion = () => {
    if (!suggestion) return
    onChange({ target: { name: 'metal', value: suggestion.metal } })
    onChange({ target: { name: 'km', value: suggestion.km } })
  }

  return (
    <div className="space-y-6">
      <h3 className="font-display font-semibold text-brand-text text-base">
        Información básica
      </h3>

      <div>
        <label className="block text-sm font-medium font-display text-brand-text">
          País *
        </label>
        <Combobox
          value={selectedCountry}
          onChange={(country) =>
            onChange({ target: { name: 'country', value: country?.name || '' } })
          }
        >
          <div className="relative mt-1">
            <Combobox.Input
              className="w-full rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm py-2 pl-3 pr-10 focus:ring-brand-accent focus:border-brand-accent"
              displayValue={(country) => country?.name || ''}
              onChange={(e) => setCountryQuery(e.target.value)}
              placeholder="Buscar país..."
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-brand-muted" />
            </Combobox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-brand-surface border border-brand-border shadow-lg">
                {filteredCountries.length === 0 ? (
                  <div className="py-2 px-3 text-sm text-brand-muted">
                    Sin resultados
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                    <Combobox.Option
                      key={country.code}
                      value={country}
                      className={({ active }) =>
                        classNames(
                          'cursor-pointer select-none py-2 px-3 text-sm',
                          active ? 'bg-brand-bg text-brand-text' : 'text-brand-muted'
                        )
                      }
                    >
                      {({ selected }) => (
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                          {selected && (
                            <CheckIcon className="h-4 w-4 ml-auto text-brand-accent" />
                          )}
                        </span>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>

      <CoinFormField
        label="Denominación"
        name="denomination"
        value={form.denomination}
        onChange={onChange}
        placeholder="ej. 1 Sucre"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <CoinFormField
          label="Valor facial"
          name="valorFacial"
          value={form.valorFacial}
          onChange={onChange}
          placeholder="0"
          prefix="$"
        />
        <CoinFormField
          label="Año"
          name="year"
          value={form.year}
          onChange={onChange}
          placeholder="yyyy"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium font-display text-brand-text">
            Tipo de moneda
          </label>
          <p className="text-xs text-brand-muted">
            Circulación o conmemorativa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs ${
              !form.conmemorativa
                ? 'text-brand-text font-medium'
                : 'text-brand-muted'
            }`}
          >
            Circulación
          </span>
          <Switch
            checked={form.conmemorativa}
            onChange={(val) =>
              onChange({ target: { name: 'conmemorativa', value: val } })
            }
            className={classNames(
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-surface',
              form.conmemorativa ? 'bg-brand-accent' : 'bg-brand-border'
            )}
          >
            <span
              className={classNames(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                form.conmemorativa ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </Switch>
          <span
            className={`text-xs ${
              form.conmemorativa
                ? 'text-brand-text font-medium'
                : 'text-brand-muted'
            }`}
          >
            Conmemorativa
          </span>
        </div>
      </div>

      <CoinFormField
        label="Emitida por"
        name="emitidaPor"
        value={form.emitidaPor}
        onChange={onChange}
        placeholder="ej. Banco Central del Ecuador"
        hint="Institución que emitió la moneda"
      />

      {suggestion && (
        <div className="rounded-lg border border-brand-accent/30 bg-brand-accent/5 p-3 flex items-center justify-between">
          <div className="text-xs text-brand-muted">
            <span className="text-brand-accent font-medium">Sugerencia:</span>{' '}
            {suggestion.metal} · {suggestion.km}
          </div>
          <button
            type="button"
            onClick={applySuggestion}
            className="text-xs text-brand-accent hover:text-brand-accent-hover font-medium transition-colors"
          >
            Usar
          </button>
        </div>
      )}
    </div>
  )
}
