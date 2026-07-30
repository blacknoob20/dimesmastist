import { useRoute, Link } from 'wouter-preact'
import { getCatalogCoin } from '@/state/catalog'
import { classNames } from '@/helpers/classNames'

const COUNTRY_FLAGS: Record<string, string> = {
  Ecuador: '🇪🇨', México: '🇲🇽', Argentina: '🇦🇷', Brasil: '🇧🇷', Perú: '🇵🇪',
  Colombia: '🇨🇴', Chile: '🇨🇱', Venezuela: '🇻🇪', Bolivia: '🇧🇴', Uruguay: '🇺🇾',
  Paraguay: '🇵🇾', USA: '🇺🇸', Alemania: '🇩🇪', Francia: '🇫🇷', España: '🇪🇸',
  Italia: '🇮🇹', 'Reino Unido': '🇬🇧', Japón: '🇯🇵', China: '🇨🇳', Egipto: '🇪🇬',
  Canadá: '🇨🇦', Australia: '🇦🇺',
}

export const CatalogDetailPage = () => {
  const [, params] = useRoute('/catalogo/:id')
  const coin = params?.id ? getCatalogCoin(params.id) : undefined

  if (!coin) {
    return (
      <main class="min-h-[60vh] flex items-center justify-center px-4">
        <div class="text-center">
          <h1 class="text-2xl font-display font-bold text-brand-text mb-2">Moneda no encontrada</h1>
          <p class="text-sm text-brand-muted mb-4">Esta moneda no existe en el catálogo.</p>
          <Link to="/catalogo" class="text-sm text-brand-accent hover:text-brand-accent-hover">Volver al catálogo</Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <section class="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 pb-6">
        <div class="max-w-4xl mx-auto">
          <Link to="/catalogo" class="text-xs text-brand-muted hover:text-brand-accent transition-colors mb-4 inline-block">
            ← Volver al catálogo
          </Link>
        </div>
      </section>

      <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8">
          <div class="flex items-center justify-center mb-6 lg:mb-0">
            <div class="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 shadow-xl relative">
              <div class="coin-glow-strong absolute inset-0 rounded-full" />
              <span class="relative text-5xl sm:text-6xl font-display text-brand-accent font-bold drop-shadow-sm">
                {coin.denomination.split(' ')[0]}
              </span>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <h1 class="text-2xl sm:text-3xl font-display font-bold text-brand-text">
                {coin.denomination}
              </h1>
              <p class="mt-1 text-sm text-brand-muted">
                {COUNTRY_FLAGS[coin.country] ?? ''} {coin.country} · {coin.year}
              </p>
            </div>

            <div class="bg-brand-surface-secondary rounded-xl border border-brand-border p-4 space-y-3">
              <InfoRow label="KM" value={coin.km} />
              <InfoRow label="Metal" value={coin.metal} />
              {coin.ceca && <InfoRow label="Ceca" value={coin.ceca} />}
              {coin.weight && <InfoRow label="Peso" value={`${coin.weight} g`} />}
              {coin.diameter && <InfoRow label="Diámetro" value={`${coin.diameter} mm`} />}
              {coin.shape && <InfoRow label="Forma" value={coin.shape} />}
              {coin.edge && <InfoRow label="Canto" value={coin.edge} />}
              {coin.description && (
                <div class="pt-2 border-t border-brand-border">
                  <p class="text-xs text-brand-muted leading-relaxed">{coin.description}</p>
                </div>
              )}
            </div>

            <Link
              to={`/mi-coleccion/registrar?catalogId=${coin.id}`}
              class={classNames(
                'block w-full text-center px-6 py-3 rounded-xl font-medium text-sm',
                'bg-brand-accent text-white hover:bg-brand-accent-hover',
                'shadow-md shadow-brand-accent/20 transition-all duration-300',
                'hover:shadow-lg hover:shadow-brand-accent/30'
              )}
            >
              + Agregar a mi colección
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div class="flex items-center justify-between text-sm">
    <span class="text-brand-muted">{label}</span>
    <span class="font-medium text-brand-text">{value}</span>
  </div>
)
