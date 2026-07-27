import { CoinFormChipsSelect } from './CoinFormChips'
import { CONDITIONS } from './coinConstants'

export const CoinFormSectionCondition = ({ form, onChange }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-display font-semibold text-brand-text text-base">
        Estado de conservación
      </h3>
      <p className="text-xs text-brand-muted">
        Selecciona el estado que mejor describa la moneda.
      </p>
      <CoinFormChipsSelect
        options={CONDITIONS}
        value={form.condition}
        onChange={(val) => onChange({ target: { name: 'condition', value: val } })}
      />
    </div>
  )
}
