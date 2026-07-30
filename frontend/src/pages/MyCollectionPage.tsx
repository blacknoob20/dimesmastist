import { useEffect } from 'preact/hooks'
import { Link } from 'wouter-preact'
import { CoinsIcon, GlobeIcon, DollarIcon, PlusIcon } from '@/components/icons'
import { myCollection, collectionQuery, filteredCollection, collectionStats, isCollectionLoading } from '@/state/collection'
import { getCatalogCoin } from '@/state/catalog'
import { CONDITION_COLORS } from '@/types/coin'
import { classNames } from '@/helpers/classNames'
import { coinsApi } from '@/api/coins'

export const MyCollectionPage = () => {
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      isCollectionLoading.value = true
      const instances = await coinsApi.fetchMyCollection()
      if (!cancelled) {
        myCollection.value = instances
        isCollectionLoading.value = false
      }
    }
    if (myCollection.value.length === 0) load()
    return () => { cancelled = true }
  }, [])

  const stats = collectionStats.value

  return (
    <main>
      <section class="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 sm:pt-10 pb-6">
        <div class="max-w-5xl mx-auto">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl sm:text-3xl font-display text-brand-text tracking-tight">
                Hola <span class="text-brand-accent">Cristian</span>
              </h1>
              <p class="mt-1 text-sm text-brand-muted">
                {stats.total} {stats.total === 1 ? 'pieza' : 'piezas'} en tu colección
              </p>
            </div>
            <Link
              to="/mi-coleccion/registrar"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent-hover transition-colors shadow-md shadow-brand-accent/20"
            >
              <PlusIcon class="h-4 w-4" />
              Nueva
            </Link>
          </div>
        </div>
      </section>

      <section class="bg-brand-surface-secondary border-y border-brand-border">
        <div class="max-w-5xl mx-auto px-4 py-4">
          <div class="grid grid-cols-3 gap-4">
            <StatCard Icon={CoinsIcon} value={stats.total} label="Piezas" accent="bg-brand-accent/10 text-brand-accent" />
            <StatCard Icon={GlobeIcon} value={new Set(myCollection.value.map((i) => {
              const cat = getCatalogCoin(i.catalogCoinId)
              return cat?.country ?? ''
            })).size} label="Países" accent="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
            <StatCard Icon={DollarIcon} value={stats.totalValue > 0 ? `$${stats.totalValue.toFixed(2)}` : '$0'} label="Valor total" accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </section>

      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="max-w-xl mb-5">
          <input
            type="text"
            placeholder="Buscar en tu colección..."
            value={collectionQuery.value}
            onInput={(e) => { collectionQuery.value = (e.target as HTMLInputElement).value }}
            class="w-full pl-4 pr-4 py-2.5 rounded-xl border border-brand-border bg-brand-surface text-brand-text text-sm placeholder-brand-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all duration-300"
          />
        </div>

        {isCollectionLoading.value && (
          <div class="text-center py-12">
            <p class="text-sm text-brand-muted">Cargando tu colección...</p>
          </div>
        )}

        {!isCollectionLoading.value && filteredCollection.value.length === 0 && (
          <div class="text-center py-12">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center card-shadow">
              <CoinsIcon class="h-8 w-8 text-brand-muted" />
            </div>
            <h2 class="text-lg font-display font-semibold text-brand-text mb-2">
              {stats.total === 0 ? 'Tu colección está vacía' : 'No se encontraron monedas'}
            </h2>
            <p class="text-sm text-brand-muted mb-4 max-w-sm mx-auto">
              {stats.total === 0
                ? 'Explora el catálogo y agrega tu primera moneda.'
                : 'Intenta con otros términos de búsqueda.'}
            </p>
            {stats.total === 0 && (
              <Link
                to="/catalogo"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent-hover transition-colors"
              >
                Explorar catálogo
              </Link>
            )}
          </div>
        )}

        {!isCollectionLoading.value && filteredCollection.value.length > 0 && (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollection.value.map((inst) => {
              const cat = getCatalogCoin(inst.catalogCoinId)
              return (
                <Link key={inst.id} to={`/mi-coleccion/${inst.id}`}>
                  <div class={classNames(
                    'group bg-brand-surface rounded-xl border border-brand-border overflow-hidden',
                    'card-shadow relative',
                    'transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent cursor-pointer'
                  )}>
                    <div class="aspect-[4/3] bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center relative">
                      <div class="coin-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-lg">
                        <span class="text-lg sm:text-xl font-display text-brand-accent font-bold">
                          {cat?.denomination?.split(' ')[0] ?? '?'}
                        </span>
                      </div>
                    </div>
                    <div class="p-3">
                      <h3 class="font-display font-semibold text-brand-text text-sm">
                        {cat?.denomination ?? 'Moneda'}
                      </h3>
                      <div class="mt-0.5 flex items-center gap-1.5 text-xs text-brand-muted">
                        <span>{cat?.country ?? ''}</span>
                        {cat?.year && <><span>·</span><span>{cat.year}</span></>}
                      </div>
                      <div class="mt-2 flex items-center justify-between">
                        <span class="text-[10px] font-mono text-brand-muted bg-brand-bg px-1.5 py-0.5 rounded">
                          {cat?.km ?? inst.catalogCoinId}
                        </span>
                        <span class={classNames(
                          'text-[10px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ring-current/10',
                          CONDITION_COLORS[inst.condition]
                        )}>
                          {inst.condition}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

const StatCard = ({ Icon, value, label, accent }: {
  Icon: (p: { class?: string; 'stroke-width'?: number }) => preact.JSX.Element
  value: string | number
  label: string
  accent: string
}) => (
  <div class="flex items-center justify-center gap-3">
    <div class={classNames('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', accent)}>
      <Icon class="h-4 w-4" stroke-width={1.75} />
    </div>
    <div class="text-left">
      <p class="text-base sm:text-lg font-display font-bold text-brand-text leading-none">{value}</p>
      <p class="text-[10px] text-brand-muted uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  </div>
)
