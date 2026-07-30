import { StarIcon } from '@/components/icons'

export const FavoritesPage = () => (
  <main>
    <section class="bg-gradient-to-b from-brand-surface to-brand-bg px-4 pt-8 sm:pt-10 pb-6">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-2xl sm:text-3xl font-display text-brand-text tracking-tight">
          Favoritos
        </h1>
        <p class="mt-1 text-sm text-brand-muted">
          Tus monedas marcadas y búsquedas guardadas
        </p>
      </div>
    </section>
    <section class="max-w-3xl mx-auto px-4 py-12 text-center">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center card-shadow">
        <StarIcon class="h-8 w-8 text-brand-muted" />
      </div>
      <h2 class="text-lg font-display font-semibold text-brand-text mb-2">Próximamente</h2>
      <p class="text-sm text-brand-muted max-w-sm mx-auto">
        Aquí podrás guardar monedas del catálogo mundial para agregarlas a tu colección más tarde.
      </p>
    </section>
  </main>
)
