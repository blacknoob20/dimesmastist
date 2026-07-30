import { useRoute, Link } from 'wouter-preact'
import { myCollection, removeInstance } from '@/state/collection'
import { getCatalogCoin } from '@/state/catalog'
import { CONDITION_COLORS } from '@/types/coin'
import { classNames } from '@/helpers/classNames'

export const InstanceDetailPage = () => {
  const [, params] = useRoute('/mi-coleccion/:id')
  const id = params?.id ? Number(params.id) : 0
  const inst = myCollection.value.find((i) => i.id === id)
  const cat = inst ? getCatalogCoin(inst.catalogCoinId) : undefined

  if (!inst || !cat) {
    return (
      <main class="min-h-[60vh] flex items-center justify-center px-4">
        <div class="text-center">
          <h1 class="text-2xl font-display font-bold text-brand-text mb-2">Moneda no encontrada</h1>
          <p class="text-sm text-brand-muted mb-4">Esta instancia no existe en tu colección.</p>
          <Link to="/mi-coleccion" class="text-sm text-brand-accent hover:text-brand-accent-hover">Volver a mi colección</Link>
        </div>
      </main>
    )
  }

  const handleDelete = () => {
    if (confirm('¿Eliminar esta moneda de tu colección?')) {
      removeInstance(inst.id)
    }
  }

  return (
    <main>
      <section class="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 pb-6">
        <div class="max-w-4xl mx-auto">
          <Link to="/mi-coleccion" class="text-xs text-brand-muted hover:text-brand-accent transition-colors mb-4 inline-block">
            ← Volver a mi colección
          </Link>
        </div>
      </section>

      <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8">
          <div class="flex items-center justify-center mb-6 lg:mb-0">
            <div class="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 shadow-xl relative">
              <div class="coin-glow-strong absolute inset-0 rounded-full" />
              <span class="relative text-5xl sm:text-6xl font-display text-brand-accent font-bold drop-shadow-sm">
                {cat.denomination.split(' ')[0]}
              </span>
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <h1 class="text-2xl sm:text-3xl font-display font-bold text-brand-text">
                {cat.denomination}
              </h1>
              <p class="mt-1 text-sm text-brand-muted">
                {cat.country} · {cat.year} · {cat.km}
              </p>
              <span class={classNames(
                'inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ring-1 ring-inset ring-current/10',
                CONDITION_COLORS[inst.condition]
              )}>
                {inst.condition}
              </span>
            </div>

            <div class="bg-brand-surface-secondary rounded-xl border border-brand-border p-4 space-y-3">
              <h2 class="text-xs font-display font-semibold text-brand-text uppercase tracking-wider">Datos personales</h2>
              {inst.acquisitionDate && <InfoRow label="Fecha de adquisición" value={inst.acquisitionDate} />}
              {inst.pricePaid != null && <InfoRow label="Precio pagado" value={`$${inst.pricePaid}`} />}
              {inst.provenance && <InfoRow label="Procedencia" value={inst.provenance} />}
              {inst.notes && (
                <div class="pt-2 border-t border-brand-border">
                  <p class="text-xs text-brand-muted leading-relaxed">{inst.notes}</p>
                </div>
              )}
              {inst.tags.length > 0 && (
                <div class="flex flex-wrap gap-1 pt-1">
                  {inst.tags.map((t) => (
                    <span key={t} class="text-[10px] px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent">{t}</span>
                  ))}
                </div>
              )}
            </div>

            <div class="bg-brand-surface rounded-xl border border-brand-border p-4 space-y-3">
              <h2 class="text-xs font-display font-semibold text-brand-text uppercase tracking-wider">Datos numismáticos</h2>
              <InfoRow label="Metal" value={cat.metal} />
              {cat.ceca && <InfoRow label="Ceca" value={cat.ceca} />}
              {cat.weight && <InfoRow label="Peso" value={`${cat.weight} g`} />}
              {cat.diameter && <InfoRow label="Diámetro" value={`${cat.diameter} mm`} />}
              {cat.shape && <InfoRow label="Forma" value={cat.shape} />}
              {cat.edge && <InfoRow label="Canto" value={cat.edge} />}
              <Link to={`/catalogo/${cat.id}`} class="block text-xs text-brand-accent hover:text-brand-accent-hover mt-2">
                Ver ficha completa del catálogo →
              </Link>
            </div>

            <div class="flex items-center gap-2 pt-2">
              <Link
                to={`/mi-coleccion/registrar?catalogId=${cat.id}`}
                class="px-4 py-2 rounded-xl bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent-hover transition-colors"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                class="px-4 py-2 rounded-xl border border-red-300 text-red-600 dark:text-red-400 dark:border-red-800 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Eliminar
              </button>
            </div>
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
