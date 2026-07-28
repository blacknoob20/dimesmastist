import { useRef } from 'preact/hooks'
import { CameraIcon, TrashIcon, PencilIcon } from '@/components/icons'
import { classNames } from '@/helpers/classNames'
import { setField, form } from '@/state/coinForm'

interface PhotoCardProps {
  label: string
  image: string | null
  field: 'anversoImg' | 'reversoImg'
}

const PhotoCard = ({ label, image, field }: PhotoCardProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setField(field, url)
    }
  }

  const remove = () => {
    setField(field, null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div class="flex-1">
      <label class="block text-sm font-medium font-display text-brand-text mb-2">
        {label}
      </label>
      <div
        class={classNames(
          'relative aspect-square rounded-xl border-2 border-dashed overflow-hidden transition-colors',
          image ? 'border-brand-accent/40' : 'border-brand-border hover:border-brand-accent/50',
          'bg-brand-bg'
        )}
      >
        {image ? (
          <>
            <img src={image} alt={label} class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                class="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <PencilIcon class="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={remove}
                class="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            class="w-full h-full flex flex-col items-center justify-center gap-2 text-brand-muted hover:text-brand-accent transition-colors"
          >
            <CameraIcon class="h-10 w-10" />
            <span class="text-sm font-medium">Subir foto</span>
            <span class="text-xs">Haz clic o arrastra</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} class="sr-only" />
      </div>
    </div>
  )
}

export const CoinFormSectionPhotos = () => {
  const f = form.value
  return (
    <div class="space-y-6">
      <h3 class="font-display font-semibold text-brand-text text-base">Fotografías</h3>
      <div class="grid grid-cols-2 gap-4">
        <PhotoCard label="Anverso" image={f.anversoImg} field="anversoImg" />
        <PhotoCard label="Reverso" image={f.reversoImg} field="reversoImg" />
      </div>
      <div class="rounded-xl border border-brand-border bg-brand-bg p-6 flex items-center gap-4">
        <div class="flex-shrink-0 w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center">
          <CameraIcon class="h-6 w-6 text-brand-accent" />
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium font-display text-brand-text">Registro asistido por IA</p>
          <p class="text-xs text-brand-muted">Próximamente: sube fotos y la IA detectará país, valor, año y más.</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-medium bg-brand-border/50 text-brand-muted uppercase tracking-wider">
          Próximamente
        </span>
      </div>
    </div>
  )
}
