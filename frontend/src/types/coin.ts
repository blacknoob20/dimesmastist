export type Condition = 'UNC' | 'XF' | 'VF' | 'F' | 'VG' | 'G' | 'P'

export interface Country {
  name: string
  flag: string
  code: string
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
