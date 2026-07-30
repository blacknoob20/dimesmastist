import { useState, useRef, useEffect } from 'preact/hooks'
import type { User, NavDropdownItem } from '@/types/nav'
import { classNames } from '@/helpers/classNames'

interface Props {
  user: User
  items: readonly NavDropdownItem[]
}

export const TopbarDropdown = ({ user, items }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} class="ml-3 relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        class={classNames(
          'max-w-xs rounded-full flex items-center text-sm focus:outline-none',
          'focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent',
          'ring-2 ring-brand-border hover:ring-brand-accent transition-all'
        )}
      >
        <span class="sr-only">Open user menu</span>
        <img class="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
      </button>
      {open && (
        <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-brand-surface ring-1 ring-brand-border focus:outline-none z-50">
          {items.map((item) => (
            <a
              key={item.name}
              href={item.href}
              class="block px-4 py-2 text-sm text-brand-text hover:bg-brand-surface-secondary transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
