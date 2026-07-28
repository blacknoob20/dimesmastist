import { classNames } from '@/helpers/classNames'
import type { CoinFormState } from '@/types/coin'

interface CoinFormFieldProps {
  label: string
  name: keyof CoinFormState
  type?: 'text' | 'date' | 'number' | 'email'
  placeholder?: string
  hint?: string
  value: string
  onChange: (name: keyof CoinFormState, value: string) => void
  required?: boolean
  prefix?: string
  suffix?: string
}

export const CoinFormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  hint,
  value,
  onChange,
  required = false,
  prefix,
  suffix,
}: CoinFormFieldProps) => {
  const inputId = `field-${name}`

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    onChange(name, target.value)
  }

  return (
    <div>
      <label htmlFor={inputId} class="block text-sm font-medium font-display text-brand-text">
        {label}{required && ' *'}
      </label>
      <div class="mt-1">
        {(prefix || suffix) ? (
          <div class="flex rounded-lg">
            {prefix && (
              <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-brand-border bg-brand-bg text-brand-muted text-sm">
                {prefix}
              </span>
            )}
            <input
              type={type}
              name={name}
              id={inputId}
              value={value}
              onInput={handleChange}
              placeholder={placeholder}
              class={classNames(
                'focus:ring-brand-accent focus:border-brand-accent flex-1 block sm:text-sm border-brand-border bg-brand-bg text-brand-text placeholder-brand-muted outline-none',
                prefix ? 'rounded-none rounded-r-lg border-l-0' : 'rounded-lg'
              )}
            />
          </div>
        ) : (
          <input
            type={type}
            name={name}
            id={inputId}
            value={value}
            onInput={handleChange}
            placeholder={placeholder}
            class="focus:ring-brand-accent focus:border-brand-accent block w-full rounded-lg sm:text-sm border-brand-border bg-brand-bg text-brand-text placeholder-brand-muted outline-none"
          />
        )}
      </div>
      {hint && <p class="mt-1 text-xs text-brand-muted">{hint}</p>}
    </div>
  )
}
