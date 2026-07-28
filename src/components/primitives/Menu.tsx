import { useState, useRef, useEffect } from 'preact/hooks'
import type { ComponentChildren } from 'preact'

interface MenuProps {
  trigger: preact.ComponentChildren
  children: ComponentChildren | ((args: { open: boolean; close: () => void }) => ComponentChildren)
}

export const Menu = ({ trigger, children }: MenuProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = () => setOpen(false)

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
    <div ref={ref} class="relative inline-block">
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      {open && (
        <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-brand-surface ring-1 ring-brand-border focus:outline-none z-50">
          {typeof children === 'function' ? children({ open, close }) : children}
        </div>
      )}
    </div>
  )
}
