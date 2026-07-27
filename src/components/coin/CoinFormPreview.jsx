import { CONDITION_COLORS } from './coinConstants'
import { classNames } from '../../helpers/classNames'

export const CoinFormPreview = ({ form, className }) => {
  const hasData = form.denomination || form.country || form.year

  return (
    <div
      className={classNames(
        'bg-brand-surface rounded-xl border border-brand-border overflow-hidden card-shadow',
        className
      )}
    >
      <div className="bg-gradient-to-b from-brand-surface-secondary to-brand-surface px-4 py-3 border-b border-brand-border">
        <h3 className="font-display font-semibold text-brand-text text-sm">
          Vista previa
        </h3>
      </div>

      <div className="p-4 space-y-4">
        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
          {form.anversoImg ? (
            <img
              src={form.anversoImg}
              alt="Anverso"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-lg">
              <span className="text-lg font-display text-brand-accent font-bold">
                {form.denomination ? form.denomination.split(' ')[0] : '?'}
              </span>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="font-display font-semibold text-brand-text text-base">
            {form.denomination || 'Sin denominación'}
          </p>
          <p className="text-sm text-brand-muted mt-0.5">
            {form.country || 'Sin país'}
            {form.year ? ` · ${form.year}` : ''}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {form.condition && (
            <span
              className={classNames(
                'text-[11px] font-medium px-2 py-0.5 rounded-full',
                CONDITION_COLORS[form.condition]
              )}
            >
              {form.condition}
            </span>
          )}
          {form.km && (
            <span className="text-[11px] font-mono text-brand-muted bg-brand-bg px-2 py-0.5 rounded">
              {form.km}
            </span>
          )}
          {form.metal && (
            <span className="text-[11px] text-brand-muted bg-brand-bg px-2 py-0.5 rounded">
              {form.metal}
            </span>
          )}
        </div>

        {form.etiquetas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 pt-2 border-t border-brand-border">
            {form.etiquetas.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {!hasData && (
          <p className="text-center text-xs text-brand-muted pt-2">
            Completa el formulario para ver la vista previa en vivo.
          </p>
        )}
      </div>
    </div>
  )
}
