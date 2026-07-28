import { CoinFormChipsInput } from './CoinFormChips'

export const CoinFormSectionTags = () => (
  <div class="space-y-2">
    <h3 class="font-display font-semibold text-brand-text text-base">Etiquetas</h3>
    <p class="text-xs text-brand-muted">
      Añade etiquetas para organizar tu colección.
    </p>
    <CoinFormChipsInput field="etiquetas" placeholder="Plata, Colonial, Error..." />
  </div>
)
