import { computed } from '@preact/signals'
import { coins, searchQuery } from '@/state/coins'
import { CONDITION_COLORS } from '@/types/coin'
import { classNames } from '@/helpers/classNames'
import { CoinLandingFeatured } from './CoinLandingFeatured'

const filteredCoins = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return coins.value.filter((c) => c.id !== 9)
  return coins.value.filter((c) =>
    c.id !== 9 && (
      c.denomination.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.metal.toLowerCase().includes(q) ||
      c.condition.toLowerCase().includes(q) ||
      String(c.year).includes(q)
    )
  )
})

export const CoinLandingCollectionGrid = () => (
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {!searchQuery.value && <CoinLandingFeatured />}

      {filteredCoins.value.map((coin) => (
        <div
          key={coin.id}
          class={classNames(
            'group bg-brand-surface rounded-xl border border-brand-border overflow-hidden',
            'card-shadow-elegant relative',
            'transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent cursor-pointer'
          )}
        >
          <div class="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden relative">
            <div class="coin-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-800 dark:to-zinc-800 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 shadow-lg transition-all duration-300">
              <span class="text-xl sm:text-2xl font-display text-brand-accent font-bold drop-shadow-sm dark:drop-shadow-[0_1px_4px_rgba(200,155,60,0.3)]">
                {coin.denomination.split(' ')[0]}
              </span>
            </div>
          </div>

          <div class="p-3.5 sm:p-4">
            <h3 class="font-display font-semibold text-brand-text text-sm sm:text-base">
              {coin.denomination}
            </h3>
            <div class="mt-0.5 flex items-center gap-2 text-xs text-brand-muted">
              <span>{coin.country}</span>
              <span class="text-brand-border">·</span>
              <span>{coin.year}</span>
            </div>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-[11px] font-mono text-brand-muted bg-brand-bg px-2 py-0.5 rounded">
                {coin.km}
              </span>
              <span class={classNames(
                'text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ring-current/10',
                CONDITION_COLORS[coin.condition] ?? 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
              )}>
                {coin.condition}
              </span>
            </div>
          </div>
        </div>
      ))}

      {filteredCoins.value.length === 0 && (
        <div class="col-span-full text-center py-12">
          <p class="text-brand-muted text-sm">No se encontraron monedas para "{searchQuery.value}"</p>
        </div>
      )}
    </div>
  </section>
)
