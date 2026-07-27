import { CoinFormField } from './CoinFormField'

export const CoinFormSectionCharacteristics = ({ form, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="font-display font-semibold text-brand-text text-base">
        Características
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <CoinFormField
          label="Metal"
          name="metal"
          value={form.metal}
          onChange={onChange}
          placeholder="ej. Plata"
        />
        <CoinFormField
          label="KM"
          name="km"
          value={form.km}
          onChange={onChange}
          placeholder="ej. KM#88"
        />
        <CoinFormField
          label="Peso"
          name="peso"
          value={form.peso}
          onChange={onChange}
          placeholder="25"
          suffix="g"
        />
        <CoinFormField
          label="Diámetro"
          name="diametro"
          value={form.diametro}
          onChange={onChange}
          placeholder="38"
          suffix="mm"
        />
        <CoinFormField
          label="Espesor"
          name="espesor"
          value={form.espesor}
          onChange={onChange}
          placeholder="2.5"
          suffix="mm"
        />
        <CoinFormField
          label="Serie"
          name="serie"
          value={form.serie}
          onChange={onChange}
          placeholder="ej. Serie A"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <CoinFormField
          label="Forma"
          name="forma"
          value={form.forma}
          onChange={onChange}
        />
        <CoinFormField
          label="Orientación"
          name="orientacion"
          value={form.orientacion}
          onChange={onChange}
        />
        <CoinFormField
          label="Canto"
          name="canto"
          value={form.canto}
          onChange={onChange}
          placeholder="Estriado"
        />
      </div>

      <CoinFormField
        label="Ceca"
        name="ceca"
        value={form.ceca}
        onChange={onChange}
        placeholder="ej. Quito"
      />
    </div>
  )
}
