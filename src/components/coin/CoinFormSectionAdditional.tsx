import { CoinFormField } from './CoinFormField'
import { form, setField } from '@/state/coinForm'

export const CoinFormSectionAdditional = () => {
  const f = form.value

  return (
    <div class="space-y-6">
      <h3 class="font-display font-semibold text-brand-text text-base">
        Información adicional
      </h3>

      <div>
        <label for="field-descripcion" class="block text-sm font-medium font-display text-brand-text">
          Descripción
        </label>
        <textarea
          id="field-descripcion"
          name="descripcion"
          value={f.descripcion}
          onInput={(e) => setField('descripcion', (e.target as HTMLTextAreaElement).value)}
          rows={3}
          placeholder="Describe la moneda, su historia, diseño..."
          class="mt-1 block w-full rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm placeholder-brand-muted focus:ring-brand-accent focus:border-brand-accent outline-none"
        />
      </div>

      <div>
        <label for="field-notas" class="block text-sm font-medium font-display text-brand-text">
          Notas
        </label>
        <textarea
          id="field-notas"
          name="notas"
          value={f.notas}
          onInput={(e) => setField('notas', (e.target as HTMLTextAreaElement).value)}
          rows={2}
          placeholder="Notas personales, rareza, estado particular..."
          class="mt-1 block w-full rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm placeholder-brand-muted focus:ring-brand-accent focus:border-brand-accent outline-none"
        />
      </div>

      <div>
        <label for="field-procedencia" class="block text-sm font-medium font-display text-brand-text">
          Procedencia
        </label>
        <textarea
          id="field-procedencia"
          name="procedencia"
          value={f.procedencia}
          onInput={(e) => setField('procedencia', (e.target as HTMLTextAreaElement).value)}
          rows={2}
          placeholder="De dónde viene la moneda, colección anterior, subasta..."
          class="mt-1 block w-full rounded-lg border border-brand-border bg-brand-bg text-brand-text text-sm placeholder-brand-muted focus:ring-brand-accent focus:border-brand-accent outline-none"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <CoinFormField label="Precio de compra" name="precioCompra" value={f.precioCompra} onChange={setField} placeholder="0.00" prefix="$" />
        <CoinFormField label="Fecha de adquisición" name="fechaAdquisicion" value={f.fechaAdquisicion} onChange={setField} type="date" />
      </div>
    </div>
  )
}
