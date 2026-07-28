export type Condition = 'UNC' | 'XF' | 'VF' | 'F' | 'VG' | 'G' | 'P'

export interface Country {
  name: string
  flag: string
  code: string
}

export interface Coin {
  id: number
  denomination: string
  country: string
  year: number
  km: string
  condition: Condition
  metal: string
}

export interface CoinFormState {
  country: string
  denomination: string
  valorFacial: string
  year: string
  conmemorativa: boolean
  emitidaPor: string
  metal: string
  peso: string
  diametro: string
  espesor: string
  forma: string
  orientacion: string
  canto: string
  ceca: string
  km: string
  serie: string
  anversoImg: string | null
  reversoImg: string | null
  condition: Condition | ''
  descripcion: string
  notas: string
  procedencia: string
  precioCompra: string
  fechaAdquisicion: string
  etiquetas: string[]
}

export const INITIAL_FORM_STATE: CoinFormState = {
  country: '',
  denomination: '',
  valorFacial: '',
  year: '',
  conmemorativa: false,
  emitidaPor: '',
  metal: '',
  peso: '',
  diametro: '',
  espesor: '',
  forma: 'Circular',
  orientacion: 'Estándar',
  canto: '',
  ceca: '',
  km: '',
  serie: '',
  anversoImg: null,
  reversoImg: null,
  condition: '',
  descripcion: '',
  notas: '',
  procedencia: '',
  precioCompra: '',
  fechaAdquisicion: '',
  etiquetas: [],
}

export const CONDITIONS: readonly { value: Condition; label: string }[] = [
  { value: 'UNC', label: 'UNC' },
  { value: 'XF', label: 'XF' },
  { value: 'VF', label: 'VF' },
  { value: 'F', label: 'F' },
  { value: 'VG', label: 'VG' },
  { value: 'G', label: 'G' },
  { value: 'P', label: 'P' },
]

export const CONDITION_COLORS: Record<Condition, string> = {
  UNC: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
  XF: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  VF: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  F: 'bg-stone-100 text-stone-600 dark:bg-stone-800/60 dark:text-stone-400',
  VG: 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300',
  G: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
  P: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700/60 dark:text-zinc-300',
}

export const METALS: readonly string[] = [
  'Oro', 'Plata', 'Plata 0.900', 'Plata 0.720', 'Plata 0.680',
  'Níquel', 'Cobre', 'Cobre-Níquel', 'Acero', 'Aluminio', 'Bronce',
  'Zinc', 'Bimetálica', 'Latón', 'Estaño',
]

export const COUNTRIES: readonly Country[] = [
  { name: 'Ecuador', flag: '🇪🇨', code: 'EC' },
  { name: 'México', flag: '🇲🇽', code: 'MX' },
  { name: 'Argentina', flag: '🇦🇷', code: 'AR' },
  { name: 'Brasil', flag: '🇧🇷', code: 'BR' },
  { name: 'Perú', flag: '🇵🇪', code: 'PE' },
  { name: 'Colombia', flag: '🇨🇴', code: 'CO' },
  { name: 'Chile', flag: '🇨🇱', code: 'CL' },
  { name: 'Venezuela', flag: '🇻🇪', code: 'VE' },
  { name: 'Bolivia', flag: '🇧🇴', code: 'BO' },
  { name: 'Uruguay', flag: '🇺🇾', code: 'UY' },
  { name: 'Paraguay', flag: '🇵🇾', code: 'PY' },
  { name: 'USA', flag: '🇺🇸', code: 'US' },
  { name: 'Alemania', flag: '🇩🇪', code: 'DE' },
  { name: 'Francia', flag: '🇫🇷', code: 'FR' },
  { name: 'España', flag: '🇪🇸', code: 'ES' },
  { name: 'Italia', flag: '🇮🇹', code: 'IT' },
  { name: 'Reino Unido', flag: '🇬🇧', code: 'GB' },
  { name: 'Japón', flag: '🇯🇵', code: 'JP' },
  { name: 'China', flag: '🇨🇳', code: 'CN' },
  { name: 'Egipto', flag: '🇪🇬', code: 'EG' },
  { name: 'Canadá', flag: '🇨🇦', code: 'CA' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU' },
]

export const MOCK_COINS: readonly Coin[] = [
  { id: 1, denomination: '1 Sucre', country: 'Ecuador', year: 1994, km: 'KM#88', condition: 'UNC', metal: 'Níquel' },
  { id: 2, denomination: '1 Peso', country: 'México', year: 1898, km: 'KM#407', condition: 'VF', metal: 'Plata 0.720' },
  { id: 3, denomination: '2 Euros', country: 'Alemania', year: 2002, km: 'KM#215', condition: 'XF', metal: 'Bimetálica' },
  { id: 4, denomination: '50 Centavos', country: 'Brasil', year: 1970, km: 'KM#575', condition: 'UNC', metal: 'Acero' },
  { id: 5, denomination: '1 Dólar', country: 'USA', year: 1921, km: 'KM#150', condition: 'F', metal: 'Plata 0.900' },
  { id: 6, denomination: '10 Pesos', country: 'Argentina', year: 1887, km: 'KM#31', condition: 'VF', metal: 'Oro' },
  { id: 7, denomination: '5 Soles', country: 'Perú', year: 1975, km: 'KM#265', condition: 'XF', metal: 'Cobre-Níquel' },
  { id: 8, denomination: '1 Franco', country: 'Francia', year: 1960, km: 'KM#940', condition: 'UNC', metal: 'Níquel' },
  { id: 9, denomination: '1 Libra', country: 'Egipto', year: 1968, km: 'KM#420', condition: 'VF', metal: 'Plata 0.680' },
]
