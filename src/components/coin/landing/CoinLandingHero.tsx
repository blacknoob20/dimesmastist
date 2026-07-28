import { SearchIcon, SunIcon, MoonIcon, SunsetIcon } from '@/components/icons'
import { searchQuery } from '@/state/coins'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Buenos días', Icon: SunIcon }
  if (hour < 19) return { text: 'Buenas tardes', Icon: SunsetIcon }
  return { text: 'Buenas noches', Icon: MoonIcon }
}

export const CoinLandingHero = () => {
  const { text, Icon } = getGreeting()

  return (
    <section class="bg-parchment px-4 pt-5 sm:pt-6 pb-4">
      <div class="max-w-3xl mx-auto text-center">
        <div class="flex items-center justify-center gap-2 mb-1">
          <Icon class="h-4 w-4 text-brand-accent" stroke-width={1.75} />
          <span class="text-sm text-brand-muted font-normal tracking-wide">
            {text}, Tom
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl font-display text-brand-text tracking-tight">
          Tu <span class="text-brand-accent">colección</span>
        </h1>
        <p class="mt-1 text-sm sm:text-base text-brand-muted">
          9 piezas únicas reunidas pieza a pieza desde 1887
        </p>

        <div class="mt-4 max-w-xl mx-auto">
          <div class="relative group">
            <input
              type="text"
              placeholder="Buscar moneda..."
              value={searchQuery.value}
              onInput={(e) => { searchQuery.value = (e.target as HTMLInputElement).value }}
              class="w-full pl-5 pr-12 py-3.5 rounded-2xl border border-brand-border bg-brand-surface text-brand-text placeholder-brand-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent focus:shadow-lg focus:shadow-brand-accent/10 transition-all duration-300"
            />
            <button class="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-brand-accent text-white hover:bg-brand-accent-hover shadow-md shadow-brand-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/30">
              <SearchIcon class="h-5 w-5" stroke-width={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
