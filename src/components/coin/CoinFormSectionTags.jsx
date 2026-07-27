import { CoinFormChipsInput } from './CoinFormChips'

export const CoinFormSectionTags = ({ form, onChange }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-display font-semibold text-brand-text text-base">
        Etiquetas
      </h3>
      <p className="text-xs text-brand-muted">
        Añade etiquetas para organizar tu colección.
      </p>
      <CoinFormChipsInput
        value={form.etiquetas}
        onChange={(val) => onChange({ target: { name: 'etiquetas', value: val } })}
        placeholder="Plata, Colonial, Error..."
      />
    </div>
  )
}
