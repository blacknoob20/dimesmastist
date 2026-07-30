import { InfoIcon } from '@/components/icons'

export const AboutPage = () => (
  <main>
    <section class="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 sm:pt-10 pb-6">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-2xl sm:text-3xl font-display text-brand-text tracking-tight">
          Acerca de Dimesmatist
        </h1>
        <p class="mt-1 text-sm text-brand-muted">
          Un catálogo numismático personal
        </p>
      </div>
    </section>
    <section class="max-w-3xl mx-auto px-4 py-8">
      <div class="bg-brand-surface rounded-xl border border-brand-border p-6 card-shadow space-y-6">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
            <InfoIcon class="h-5 w-5 text-brand-accent" />
          </div>
          <div>
            <h2 class="text-base font-display font-semibold text-brand-text">La idea</h2>
            <p class="mt-1 text-sm text-brand-muted leading-relaxed">
              Dimesmatist es un catálogo numismático personal. Cada moneda tiene dos dimensiones:
              la información canónica del catálogo mundial y tu relación personal con ella como coleccionista.
            </p>
          </div>
        </div>

        <div class="border-t border-brand-border pt-4">
          <h2 class="text-base font-display font-semibold text-brand-text mb-2">Arquitectura</h2>
          <p class="text-sm text-brand-muted leading-relaxed">
            Separar el catálogo mundial de tu colección personal es una decisión de diseño que permite
            funciones como estadísticas globales, intercambio entre coleccionistas y listas de deseos,
            sin tener que rediseñar la aplicación más adelante.
          </p>
        </div>

        <div class="border-t border-brand-border pt-4">
          <h2 class="text-base font-display font-semibold text-brand-text mb-2">Stack</h2>
          <p class="text-sm text-brand-muted leading-relaxed">
            Preact 10 + @preact/signals + wouter-preact · TypeScript · TailwindCSS 4 · Go 1.24 + Fiber v2 + GORM + SQLite · Docker Compose
          </p>
        </div>
      </div>
    </section>
  </main>
)
