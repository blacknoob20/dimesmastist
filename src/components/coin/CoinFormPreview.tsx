import { form } from '@/state/coinForm'
import { CONDITION_COLORS } from '@/types/coin'
import { classNames } from '@/helpers/classNames'

interface Props {
  className?: string
}

export const CoinFormPreview = ({ className }: Props) => {
  const f = form.value
  const hasData = f.denomination || f.country || f.year

  return (
    <div
      class={classNames(
        'bg-brand-surface rounded-xl border border-brand-border overflow-hidden card-shadow',
        className
      )}
    >
      <div class="bg-gradient-to-b from-brand-surface-secondary to-brand-surface px-4 py-3 border-b border-brand-border">
        <h3 class="font-display font-semibold text-brand-text text-sm">
          Vista previa
        </h3>
      </div>

      <div class="p-4 space-y-4">
        <div class="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
          {f.anversoImg ? (
            <img
              src={f.anversoImg}
              alt="Anverso"
              class="w-full h-full object-cover"
            />
          ) : (
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-lg">
              <span class="text-lg font-display text-brand-accent font-bold">
                {f.denomination ? f.denomination.split(' ')[0] : '?'}
              </span>
            </div>
          )}
        </div>

        <div class="text-center">
          <p class="font-display font-semibold text-brand-text text-base">
            {f.denomination || 'Sin denominación'}
          </p>
          <p class="text-sm text-brand-muted mt-0.5">
            {f.country || 'Sin país'}
            {f.year ? ` · ${f.year}` : ''}
          </p>
        </div>

        <div class="flex items-center justify-center gap-2 flex-wrap">
          {f.condition && (
            <span
              class={classNames(
                'text-[11px] font-medium px-2 py-0.5 rounded-full',
                CONDITION_COLORS[f.condition as keyof typeof CONDITION_COLORS] ?? ''
              )}
            >
              {f.condition}
            </span>
          )}
          {f.km && (
            <span class="text-[11px] font-mono text-brand-muted bg-brand-bg px-2 py-0.5 rounded">
              {f.km}
            </span>
          )}
          {f.metal && (
            <span class="text-[11px] text-brand-muted bg-brand-bg px-2 py-0.5 rounded">
              {f.metal}
            </span>
          )}
        </div>

        {f.etiquetas.length > 0 && (
          <div class="flex flex-wrap justify-center gap-1.5 pt-2 border-t border-brand-border">
            {f.etiquetas.map((tag) => (
              <span
                key={tag}
                class="text-[10px] px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {!hasData && (
          <p class="text-center text-xs text-brand-muted pt-2">
            Completa el formulario para ver la vista previa en vivo.
          </p>
        )}
      </div>
    </div>
  )
}
