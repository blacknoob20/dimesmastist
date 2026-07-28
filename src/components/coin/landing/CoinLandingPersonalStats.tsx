import { CoinsIcon, GlobeIcon, SparklesIcon, StarIcon } from '@/components/icons'
import { classNames } from '@/helpers/classNames'
import type { IconProps } from '@/types/icons'

interface Stat {
  Icon: (props: IconProps) => preact.JSX.Element
  value: string | number
  label: string
  accent: string
}

const personalStats: readonly Stat[] = [
  { Icon: CoinsIcon, value: '9', label: 'Piezas', accent: 'bg-brand-accent/10 text-brand-accent' },
  { Icon: GlobeIcon, value: '9', label: 'Países', accent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { Icon: SparklesIcon, value: '1', label: 'En Oro', accent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { Icon: StarIcon, value: '2', label: 'En UNC', accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
]

export const CoinLandingPersonalStats = () => (
  <section class="bg-brand-surface-secondary border-y border-brand-border">
    <div class="max-w-3xl mx-auto px-4 py-4">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {personalStats.map((stat) => (
          <div key={stat.label} class="flex items-center justify-center gap-3">
            <div class={classNames('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', stat.accent)}>
              <stat.Icon class="h-4 w-4" stroke-width={1.75} />
            </div>
            <div class="text-left">
              <p class="text-base sm:text-lg font-display font-bold text-brand-text leading-none">
                {stat.value}
              </p>
              <p class="text-[10px] text-brand-muted uppercase tracking-widest mt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
