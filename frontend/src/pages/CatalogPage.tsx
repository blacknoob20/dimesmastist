import { Link } from 'wouter-preact'
import { catalogQuery, filteredCatalog } from '@/state/catalog'
import { CONDITION_COLORS } from '@/types/coin'
import { classNames } from '@/helpers/classNames'

const COUNTRY_FLAGS: Record<string, string> = {
  Ecuador: '🇪🇨', México: '🇲🇽', Argentina: '🇦🇷', Brasil: '🇧🇷', Perú: '🇵🇪',
  Colombia: '🇨🇴', Chile: '🇨🇱', Venezuela: '🇻🇪', Bolivia: '🇧🇴', Uruguay: '🇺🇾',
  Paraguay: '🇵🇾', USA: '🇺🇸', Alemania: '🇩🇪', Francia: '🇫🇷', España: '🇪🇸',
  Italia: '🇮🇹', 'Reino Unido': '🇬🇧', Japón: '🇯🇵', China: '🇨🇳', Egipto: '🇪🇬',
  Canadá: '🇨🇦', Australia: '🇦🇺',
}

export const CatalogPage = () => (
  <main>
    <section class="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 sm:pt-10 pb-6">
      <div class="max-w-5xl mx-auto text-center">
        <h1 class="text-2xl sm:text-3xl font-display text-brand-text tracking-tight">
          Catálogo <span class="text-brand-accent">mundial</span>
        </h1>
        <p class="mt-1 text-sm text-brand-muted">
          Monedas documentadas de todo el mundo
        </p>
        <div class="mt-4 max-w-xl mx-auto">
          <div class="relative group">
            <input
              type="text"
              placeholder="Buscar por denominación, país, metal o KM..."
              value={catalogQuery.value}
              onInput={(e) => { catalogQuery.value = (e.target as HTMLInputElement).value }}
              class="w-full pl-5 pr-12 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder-brand-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all duration-300"
            />
            <button class="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <p class="text-xs text-brand-muted mb-4">{filteredCatalog.value.length} monedas encontradas</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCatalog.value.map((coin) => (
          <Link key={coin.id} to={`/catalogo/${coin.id}`}>
            <div
              class={classNames(
                'group bg-brand-surface rounded-xl border border-brand-border overflow-hidden',
                'card-shadow relative',
                'transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent cursor-pointer'
              )}
            >
              <div class="aspect-[4/3] bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden relative">
                <div class="coin-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-lg transition-all duration-300">
                  <span class="text-lg sm:text-xl font-display text-brand-accent font-bold">
                    {coin.denomination.split(' ')[0]}
                  </span>
                </div>
              </div>
              <div class="p-3">
                <h3 class="font-display font-semibold text-brand-text text-sm">
                  {coin.denomination}
                </h3>
                <div class="mt-0.5 flex items-center gap-1.5 text-xs text-brand-muted">
                  <span>{COUNTRY_FLAGS[coin.country] ?? ''} {coin.country}</span>
                  <span>·</span>
                  <span>{coin.year}</span>
                </div>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-[10px] font-mono text-brand-muted bg-brand-bg px-1.5 py-0.5 rounded">
                    {coin.km}
                  </span>
                  <span class="text-[10px] text-brand-muted">{coin.metal}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCatalog.value.length === 0 && (
        <div class="text-center py-12">
          <p class="text-brand-muted text-sm">No se encontraron monedas para "{catalogQuery.value}"</p>
        </div>
      )}
    </section>
  </main>
)
