import { classNames } from '@/helpers/classNames'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export const Switch = ({ checked, onChange, label }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    class={classNames(
      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-surface',
      checked ? 'bg-brand-accent' : 'bg-brand-border'
    )}
  >
    <span
      class={classNames(
        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        checked ? 'translate-x-5' : 'translate-x-0'
      )}
    />
  </button>
)
