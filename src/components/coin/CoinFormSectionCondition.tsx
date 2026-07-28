import { CoinFormChipsSelect } from './CoinFormChips'
import { CONDITIONS } from '@/types/coin'

export const CoinFormSectionCondition = () => (
  <div class="space-y-2">
    <h3 class="font-display font-semibold text-brand-text text-base">
      Estado de conservación
    </h3>
    <p class="text-xs text-brand-muted">
      Selecciona el estado que mejor describa la moneda.
    </p>
    <CoinFormChipsSelect options={CONDITIONS} />
  </div>
)
