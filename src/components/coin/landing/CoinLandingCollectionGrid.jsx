import { classNames } from '../../../helpers/classNames';
import { CONDITION_COLORS } from '../coinConstants';
import { coins } from '../coinConstants';
import { CoinLandingFeatured } from './CoinLandingFeatured';

export const CoinLandingCollectionGrid = () => {
  const gridCoins = coins.filter((c) => c.id !== 9);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Spotlight — ocupa 2 cols en lg */}
        <CoinLandingFeatured />

        {/* 8 restantes */}
        {gridCoins.map((coin) => (
          <div
            key={coin.id}
            className={classNames(
              'group bg-brand-surface rounded-xl border border-brand-border overflow-hidden',
              'card-shadow-elegant relative',
              'transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent cursor-pointer'
            )}
          >
            {/* Imagen */}
            <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden relative">
              <div className="coin-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-zinc-800 dark:to-zinc-800 flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 shadow-lg transition-all duration-300">
                <span className="text-xl sm:text-2xl font-display text-brand-accent font-bold drop-shadow-sm dark:drop-shadow-[0_1px_4px_rgba(200,155,60,0.3)]">
                  {coin.denomination.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3.5 sm:p-4">
              <h3 className="font-display font-semibold text-brand-text text-sm sm:text-base">
                {coin.denomination}
              </h3>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-brand-muted">
                <span>{coin.country}</span>
                <span className="text-brand-border">·</span>
                <span>{coin.year}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-brand-muted bg-brand-bg px-2 py-0.5 rounded">
                  {coin.km}
                </span>
                <span className={classNames(
                  'text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ring-current/10',
                  CONDITION_COLORS[coin.condition] || 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                )}>
                  {coin.condition}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
