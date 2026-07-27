import { coins } from './coinConstants'

const stats = [
  { label: 'Monedas', value: '12,453' },
  { label: 'Países', value: '124' },
  { label: 'Cecas', value: '250' },
  { label: 'Metales', value: '95' },
];

const filters = [
  { label: 'País', icon: '🌎' },
  { label: 'Metal', icon: '🥇' },
  { label: 'Año', icon: '📅' },
  { label: 'Estado', icon: '🏅' },
];

const conditionColor = {
  UNC: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
  XF: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  VF: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  F: 'bg-stone-100 text-stone-600 dark:bg-stone-800/60 dark:text-stone-400',
  VG: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300',
  G: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
  P: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700/60 dark:text-zinc-300',
};

const statsIcons = ['🪙', '🌍', '🏛', '🥇'];

export const CoinPage = () => {
    return (
        <main>
            {/* Hero */}
            <section className="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 sm:pt-10 pb-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-2xl sm:text-3xl font-display text-brand-text tracking-tight">
                        Descubre monedas de todo el mundo
                    </h1>
                    <p className="mt-1 text-sm text-brand-muted">
                        Busca por país, año, KM, metal o denominación
                    </p>

                    {/* Search */}
                    <div className="mt-5 max-w-xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar moneda..."
                                className="w-full pl-5 pr-12 py-3 rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder-brand-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent focus:shadow-lg transition-shadow"
                            />
                            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand-accent text-white hover:bg-brand-accent-hover transition-colors">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Chips = filtros rápidos */}
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.label}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-brand-border bg-brand-surface text-xs text-brand-muted hover:border-brand-accent hover:text-brand-accent transition-colors"
                            >
                                <span>{filter.icon}</span>
                                <span>{filter.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats band */}
            <section className="bg-brand-surface-secondary border-y border-brand-border">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <div key={stat.label} className="flex items-center justify-center gap-2">
                                <span className="text-sm">{statsIcons[i]}</span>
                                <div className="text-left">
                                    <p className="text-sm sm:text-base font-display font-bold text-brand-text">{stat.value}</p>
                                    <p className="text-[10px] text-brand-muted uppercase tracking-wider">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {coins.map((coin) => (
                        <div
                            key={coin.id}
                            className="group bg-brand-surface rounded-xl border border-brand-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent cursor-pointer card-shadow"
                        >
                            {/* Image */}
                            <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden relative">
                                <div className="coin-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-800 dark:to-zinc-800 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 shadow-lg transition-all duration-300">
                                    <span className="text-xl sm:text-2xl font-display text-brand-accent font-bold drop-shadow-sm dark:drop-shadow-[0_1px_4px_rgba(200,155,60,0.3)]">
                                        {coin.denomination.split(' ')[0]}
                                    </span>
                                </div>
                            </div>
                            {/* Info */}
                            <div className="p-3.5 sm:p-4">
                                <h3 className="font-display font-semibold text-brand-text text-sm sm:text-base">
                                    {coin.denomination}
                                </h3>
                                <div className="mt-0.5 flex items-center gap-2 text-xs text-brand-muted">
                                    <span>{coin.country}</span>
                                    <span className="text-brand-border">·</span>
                                    <span>{coin.year}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[11px] font-mono text-brand-muted bg-brand-bg px-2 py-0.5 rounded">
                                        {coin.km}
                                    </span>
                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${conditionColor[coin.condition] || 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                        {coin.condition}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
