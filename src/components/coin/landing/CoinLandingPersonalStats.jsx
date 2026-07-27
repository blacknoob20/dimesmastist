import { Coins, Globe2, Sparkles, Star } from 'lucide-react';
import { classNames } from '../../../helpers/classNames';

const personalStats = [
  {
    Icon: Coins,
    value: '9',
    label: 'Piezas',
    accent: 'bg-brand-accent/10 text-brand-accent',
  },
  {
    Icon: Globe2,
    value: '9',
    label: 'Países',
    accent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    Icon: Sparkles,
    value: '1',
    label: 'En Oro',
    accent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    Icon: Star,
    value: '2',
    label: 'En UNC',
    accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
];

export const CoinLandingPersonalStats = () => {
  return (
    <section className="bg-brand-surface-secondary border-y border-brand-border">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {personalStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-center gap-3">
              <div className={classNames(
                'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                stat.accent
              )}>
                <stat.Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="text-left">
                <p className="text-base sm:text-lg font-display font-bold text-brand-text leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] text-brand-muted uppercase tracking-widest mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
