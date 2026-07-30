import { useState, useRef, useEffect } from 'preact/hooks'
import { classNames } from '@/helpers/classNames'
import { ChevronDownIcon, CheckIcon } from '@/components/icons'

interface ComboboxProps<T> {
  value: T | null
  onChange: (value: T | null) => void
  options: readonly T[]
  filter: (opt: T, query: string) => boolean
  displayValue: (opt: T) => string
  placeholder?: string
  renderOption?: (opt: T, state: { active: boolean; selected: boolean }) => preact.ComponentChildren
}

export function Combobox<T>({
  value,
  onChange,
  options,
  filter,
  displayValue,
  placeholder = '',
  renderOption,
}: ComboboxProps<T>) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = options.filter((opt) => filter(opt, query))
  const inputDisplay = value ? displayValue(value) : query

  useEffect(() => {
    setActiveIdx(-1)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('.combobox-root')?.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectItem = (opt: T) => {
    onChange(opt)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIdx((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIdx >= 0 && filtered[activeIdx]) selectItem(filtered[activeIdx])
        break
      case 'Escape':
        setOpen(false)
        setQuery('')
        inputRef.current?.blur()
        break
    }
  }

  const activeId = activeIdx >= 0 ? `combobox-option-${activeIdx}` : undefined

  return (
    <div class="combobox-root relative">
      <div class="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="combobox-listbox"
          aria-activedescendant={activeId}
          value={inputDisplay}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onInput={(e) => {
            setQuery((e.target as HTMLInputElement).value)
            setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          class="w-full rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm py-2 pl-3 pr-10 focus:ring-brand-accent focus:border-brand-accent outline-none"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => { inputRef.current?.focus(); setOpen(!open) }}
          class="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronDownIcon class="h-5 w-5 text-brand-muted" />
        </button>
      </div>
      {open && (
        <ul
          id="combobox-listbox"
          ref={listRef}
          role="listbox"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-brand-surface border border-brand-border shadow-lg"
        >
          {filtered.length === 0 ? (
            <li class="py-2 px-3 text-sm text-brand-muted">Sin resultados</li>
          ) : (
            filtered.map((opt, i) => {
              const isSelected = value && displayValue(value) === displayValue(opt)
              const isActive = i === activeIdx
              return (
                <li
                  key={i}
                  id={`combobox-option-${i}`}
                  role="option"
                  aria-selected={isSelected ? 'true' : undefined}
                  class={classNames(
                    'cursor-pointer select-none py-2 px-3 text-sm',
                    isActive ? 'bg-brand-bg text-brand-text' : 'text-brand-muted'
                  )}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => selectItem(opt)}
                >
                  {renderOption ? (
                    renderOption(opt, { active: isActive, selected: !!isSelected })
                  ) : (
                    <span class="flex items-center gap-2">
                      <span>{displayValue(opt)}</span>
                      {isSelected && <CheckIcon class="h-4 w-4 ml-auto text-brand-accent" />}
                    </span>
                  )}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
