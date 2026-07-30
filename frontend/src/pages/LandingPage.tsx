import { Link } from 'wouter-preact'
import { SearchIcon, GlobeIcon, CoinsIcon, StarIcon } from '@/components/icons'
import { catalogQuery } from '@/state/catalog'

const features = [
  { Icon: GlobeIcon, title: 'Explorar', desc: 'Busca en el catálogo mundial de monedas por país, metal, año o código KM.' },
  { Icon: CoinsIcon, title: 'Coleccionar', desc: 'Registra las monedas que posees y construye tu colección personal.' },
  { Icon: StarIcon, title: 'Favoritos', desc: 'Guarda monedas del catálogo para agregarlas a tu colección más tarde.' },
]

export const LandingPage = () => (
  <main>
    <section class="bg-parchment px-4 pt-10 sm:pt-16 pb-8">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl sm:text-5xl font-display text-brand-text tracking-tight leading-tight">
          Catálogo <span class="text-brand-accent">numismático</span> mundial
        </h1>
        <p class="mt-3 text-base sm:text-lg text-brand-muted max-w-lg mx-auto leading-relaxed">
          Explora monedas de todo el mundo. Cuando encuentres una que posees, agrégala a tu colección personal con un clic.
        </p>

        <div class="mt-6 max-w-xl mx-auto">
          <div class="relative group">
            <input
              type="text"
              placeholder="Buscar moneda..."
              value={catalogQuery.value}
              onInput={(e) => { catalogQuery.value = (e.target as HTMLInputElement).value }}
              class="w-full pl-5 pr-12 py-3.5 rounded-2xl border border-brand-border bg-brand-surface text-brand-text placeholder-brand-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent focus:shadow-lg focus:shadow-brand-accent/10 transition-all duration-300"
            />
            <button class="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-brand-accent text-white hover:bg-brand-accent-hover shadow-md shadow-brand-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/30">
              <SearchIcon class="h-5 w-5" stroke-width={2} />
            </button>
          </div>
          <p class="mt-2 text-xs text-brand-muted">198 países · 47.000+ monedas catalogadas</p>
        </div>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map(({ Icon, title, desc }) => (
          <div key={title} class="text-center">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-accent/10 flex items-center justify-center">
              <Icon class="h-5 w-5 text-brand-accent" stroke-width={1.75} />
            </div>
            <h3 class="font-display font-semibold text-brand-text text-sm">{title}</h3>
            <p class="mt-1 text-xs text-brand-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section class="border-t border-brand-border bg-brand-surface-secondary">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h2 class="text-xl font-display font-semibold text-brand-text mb-3">
          ¿Listo para explorar?
        </h2>
        <p class="text-sm text-brand-muted mb-5 max-w-md mx-auto">
          Navega por el catálogo y descubre monedas de todo el mundo.
        </p>
        <Link
          to="/catalogo"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-accent text-white font-medium text-sm hover:bg-brand-accent-hover transition-colors shadow-md shadow-brand-accent/20"
        >
          <SearchIcon class="h-4 w-4" />
          Explorar catálogo
        </Link>
      </div>
    </section>
  </main>
)
