import { CoinFormField } from './CoinFormField'

export const CoinFormSectionAdditional = ({ form, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="font-display font-semibold text-brand-text text-base">
        Información adicional
      </h3>

      <div>
        <label
          htmlFor="field-descripcion"
          className="block text-sm font-medium font-display text-brand-text"
        >
          Descripción
        </label>
        <textarea
          id="field-descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={onChange}
          rows={3}
          placeholder="Describe la moneda, su historia, diseño..."
          className="mt-1 block w-full rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm placeholder-brand-muted focus:ring-brand-accent focus:border-brand-accent"
        />
      </div>

      <div>
        <label
          htmlFor="field-notas"
          className="block text-sm font-medium font-display text-brand-text"
        >
          Notas
        </label>
        <textarea
          id="field-notas"
          name="notas"
          value={form.notas}
          onChange={onChange}
          rows={2}
          placeholder="Notas personales, rareza, estado particular..."
          className="mt-1 block w-full rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm placeholder-brand-muted focus:ring-brand-accent focus:border-brand-accent"
        />
      </div>

      <div>
        <label
          htmlFor="field-procedencia"
          className="block text-sm font-medium font-display text-brand-text"
        >
          Procedencia
        </label>
        <textarea
          id="field-procedencia"
          name="procedencia"
          value={form.procedencia}
          onChange={onChange}
          rows={2}
          placeholder="De dónde viene la moneda, colección anterior, subasta..."
          className="mt-1 block w-full rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm placeholder-brand-muted focus:ring-brand-accent focus:border-brand-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CoinFormField
          label="Precio de compra"
          name="precioCompra"
          value={form.precioCompra}
          onChange={onChange}
          placeholder="0.00"
          prefix="$"
        />
        <CoinFormField
          label="Fecha de adquisición"
          name="fechaAdquisicion"
          value={form.fechaAdquisicion}
          onChange={onChange}
          type="date"
        />
      </div>
    </div>
  )
}
