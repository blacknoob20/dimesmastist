import { GlobeIcon, SparklesIcon, CalendarIcon, AwardIcon } from '@/components/icons'
import { classNames } from '@/helpers/classNames'

const filters = [
  { label: 'País', Icon: GlobeIcon },
  { label: 'Metal', Icon: SparklesIcon },
  { label: 'Año', Icon: CalendarIcon },
  { label: 'Estado', Icon: AwardIcon },
]

export const CoinLandingQuickFilters = () => (
  <section class="bg-parchment px-4 pb-5">
    <div class="max-w-3xl mx-auto flex flex-wrap justify-center gap-2">
      {filters.map(({ label, Icon }) => (
        <button
          key={label}
          class={classNames(
            'inline-flex items-center gap-1.5 px-3.5 py-1.5',
            'rounded-full border border-brand-border bg-brand-surface/60 backdrop-blur-sm',
            'text-xs text-brand-muted font-normal tracking-wide',
            'hover:border-brand-accent hover:text-brand-accent',
            'transition-all duration-200'
          )}
        >
          <Icon class="h-3.5 w-3.5" stroke-width={1.75} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </section>
)
