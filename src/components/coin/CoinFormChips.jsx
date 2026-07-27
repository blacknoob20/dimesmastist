import { useState } from 'react'
import { XIcon } from '@heroicons/react/outline'
import { classNames } from '../../helpers/classNames'

export const CoinFormChipsSelect = ({ label, options, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium font-display text-brand-text">{label}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(isActive ? '' : opt.value)}
              className={classNames(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                isActive
                  ? 'bg-brand-accent text-white border-brand-accent'
                  : 'bg-brand-bg text-brand-text border-brand-border hover:border-brand-accent hover:text-brand-accent'
              )}
            >
              {opt.label || opt.value}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const CoinFormChipsInput = ({ label, value, onChange, placeholder = 'Añadir...' }) => {
  const [input, setInput] = useState('')

  const addItem = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInput('')
    }
  }

  const removeItem = (item) => {
    onChange(value.filter((v) => v !== item))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium font-display text-brand-text">{label}</label>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {value.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-accent/10 text-brand-accent border border-brand-accent/30"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              className="hover:text-brand-text transition-colors"
            >
              <XIcon className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addItem}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] bg-transparent border-none text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:ring-0 px-1"
        />
      </div>
    </div>
  )
}
