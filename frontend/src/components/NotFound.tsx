import { Link } from 'wouter-preact'
import { HomeIcon } from '@/components/icons'

export const NotFound = () => (
  <main class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="text-center">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center card-shadow">
        <HomeIcon class="h-8 w-8 text-brand-muted" />
      </div>
      <h1 class="text-3xl font-display font-bold text-brand-text mb-2">404</h1>
      <p class="text-brand-muted mb-6">Esta página no existe o fue movida.</p>
      <Link
        href="/"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-white font-medium text-sm hover:bg-brand-accent-hover transition-colors"
      >
        <HomeIcon class="h-4 w-4" />
        Volver al catálogo
      </Link>
    </div>
  </main>
)
