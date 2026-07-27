import { useRef } from 'react'
import { CameraIcon, TrashIcon, PencilIcon } from '@heroicons/react/outline'
import { classNames } from '../../helpers/classNames'

const PhotoCard = ({ label, image, name, onChange }) => {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onChange({ target: { name, value: url } })
    }
  }

  const remove = () => {
    onChange({ target: { name, value: null } })
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex-1">
      <label className="block text-sm font-medium font-display text-brand-text mb-2">
        {label}
      </label>
      <div
        className={classNames(
          'relative aspect-square rounded-xl border-2 border-dashed overflow-hidden transition-colors',
          image
            ? 'border-brand-accent/40'
            : 'border-brand-border hover:border-brand-accent/50',
          'bg-brand-bg'
        )}
      >
        {image ? (
          <>
            <img
              src={image}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={remove}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-brand-muted hover:text-brand-accent transition-colors"
          >
            <CameraIcon className="h-10 w-10" />
            <span className="text-sm font-medium">Subir foto</span>
            <span className="text-xs">Haz clic o arrastra</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="sr-only"
        />
      </div>
    </div>
  )
}

export const CoinFormSectionPhotos = ({ form, onChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="font-display font-semibold text-brand-text text-base">
        Fotografías
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <PhotoCard
          label="Anverso"
          image={form.anversoImg}
          name="anversoImg"
          onChange={onChange}
        />
        <PhotoCard
          label="Reverso"
          image={form.reversoImg}
          name="reversoImg"
          onChange={onChange}
        />
      </div>

      <div className="rounded-xl border border-brand-border bg-brand-bg p-6 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center">
          <CameraIcon className="h-6 w-6 text-brand-accent" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium font-display text-brand-text">
            Registro asistido por IA
          </p>
          <p className="text-xs text-brand-muted">
            Próximamente: sube fotos y la IA detectará país, valor, año y más.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-brand-border/50 text-brand-muted uppercase tracking-wider">
          Próximamente
        </span>
      </div>
    </div>
  )
}
