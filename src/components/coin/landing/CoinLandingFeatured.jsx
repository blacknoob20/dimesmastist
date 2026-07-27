import { classNames } from '../../../helpers/classNames';
import { CONDITION_COLORS } from '../coinConstants';

const featured = {
  denomination: '1 Libra',
  country: 'Egipto',
  year: 1968,
  km: 'KM#420',
  condition: 'VF',
  metal: 'Plata 0.680',
  id: 9,
};

export const CoinLandingFeatured = () => {
  return (
    <div
      className={classNames(
        'group bg-gradient-to-br from-brand-surface to-brand-surface-secondary',
        'border-2 border-brand-accent/30 rounded-2xl p-5',
        'card-shadow-elegant relative overflow-hidden',
        'hover:border-brand-accent hover:-translate-y-1',
        'transition-all duration-300 hover:shadow-2xl hover:shadow-brand-accent/10',
        'lg:col-span-2 cursor-pointer'
      )}
    >
      {/* Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-accent/15 text-brand-accent text-[11px] font-medium ring-1 ring-brand-accent/30">
          Recién agregada
        </span>
        <span className="text-xs text-brand-muted">
          Agregada hace 3 días
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Moneda visual */}
        <div className="flex-shrink-0 relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-800 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 shadow-lg transition-all duration-300 group-hover:shadow-xl">
            <div className="coin-glow-strong absolute inset-0 rounded-full" />
            <span className="relative text-3xl sm:text-4xl font-display text-brand-accent font-bold drop-shadow-sm dark:drop-shadow-[0_1px_4px_rgba(200,155,60,0.3)]">
              1
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-display font-semibold text-brand-text">
            {featured.denomination}
          </h3>
          <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 text-sm text-brand-muted">
            <span>{featured.country}</span>
            <span className="text-brand-border">·</span>
            <span>{featured.year}</span>
          </div>
          <div className="mt-2 flex items-center justify-center sm:justify-start gap-2.5">
            <span className="text-[11px] font-mono text-brand-muted bg-brand-bg px-2 py-0.5 rounded">
              {featured.km}
            </span>
            <span className="text-[11px] text-brand-muted">
              {featured.metal}
            </span>
            <span className={classNames(
              'text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ring-current/10',
              CONDITION_COLORS[featured.condition]
            )}>
              {featured.condition}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
