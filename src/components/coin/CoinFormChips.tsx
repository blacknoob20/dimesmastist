import { useState } from 'preact/hooks'
import { XIcon } from '@/components/icons'
import { classNames } from '@/helpers/classNames'
import type { CoinFormState, Condition } from '@/types/coin'
import { setField, form } from '@/state/coinForm'

interface ChipsSelectProps {
  options: readonly { value: Condition; label: string }[]
}

export const CoinFormChipsSelect = ({ options }: ChipsSelectProps) => {
  const value = form.value.condition

  const toggle = (val: Condition) => {
    setField('condition', value === val ? '' : val)
  }

  return (
    <div>
      <label class="block text-sm font-medium font-display text-brand-text">Estado</label>
      <div class="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              class={classNames(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                isActive
                  ? 'bg-brand-accent text-white border-brand-accent'
                  : 'bg-brand-bg text-brand-text border-brand-border hover:border-brand-accent hover:text-brand-accent'
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface ChipsInputProps {
  field: 'etiquetas'
  placeholder?: string
}

export const CoinFormChipsInput = ({ field, placeholder = 'Añadir...' }: ChipsInputProps) => {
  const [input, setInput] = useState('')
  const value = form.value[field]

  const addItem = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      setField(field, [...value, trimmed])
      setInput('')
    }
  }

  const removeItem = (item: string) => {
    setField(field, value.filter((v) => v !== item))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
  }

  return (
    <div>
      <label class="block text-sm font-medium font-display text-brand-text">Etiquetas</label>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        {value.map((item) => (
          <span
            key={item}
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-accent/10 text-brand-accent border border-brand-accent/30"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              class="hover:text-brand-text transition-colors"
            >
              <XIcon class="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={handleKeyDown}
          onBlur={addItem}
          placeholder={placeholder}
          class="flex-1 min-w-[120px] bg-transparent border-none text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:ring-0 px-1"
        />
      </div>
    </div>
  )
}
