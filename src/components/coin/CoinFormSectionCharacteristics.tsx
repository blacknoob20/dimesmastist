import { CoinFormField } from './CoinFormField'
import { form, setField } from '@/state/coinForm'

export const CoinFormSectionCharacteristics = () => {
  const f = form.value

  return (
    <div class="space-y-6">
      <h3 class="font-display font-semibold text-brand-text text-base">
        Características
      </h3>

      <div class="grid grid-cols-2 gap-4">
        <CoinFormField label="Metal" name="metal" value={f.metal} onChange={setField} placeholder="ej. Plata" />
        <CoinFormField label="KM" name="km" value={f.km} onChange={setField} placeholder="ej. KM#88" />
        <CoinFormField label="Peso" name="peso" value={f.peso} onChange={setField} placeholder="25" suffix="g" />
        <CoinFormField label="Diámetro" name="diametro" value={f.diametro} onChange={setField} placeholder="38" suffix="mm" />
        <CoinFormField label="Espesor" name="espesor" value={f.espesor} onChange={setField} placeholder="2.5" suffix="mm" />
        <CoinFormField label="Serie" name="serie" value={f.serie} onChange={setField} placeholder="ej. Serie A" />
      </div>

      <div class="grid grid-cols-3 gap-4">
        <CoinFormField label="Forma" name="forma" value={f.forma} onChange={setField} />
        <CoinFormField label="Orientación" name="orientacion" value={f.orientacion} onChange={setField} />
        <CoinFormField label="Canto" name="canto" value={f.canto} onChange={setField} placeholder="Estriado" />
      </div>

      <CoinFormField label="Ceca" name="ceca" value={f.ceca} onChange={setField} placeholder="ej. Quito" />
    </div>
  )
}
