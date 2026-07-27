import { Globe2, Sparkles, Calendar, Award } from 'lucide-react';
import { classNames } from '../../../helpers/classNames';

const filters = [
  { label: 'País', Icon: Globe2 },
  { label: 'Metal', Icon: Sparkles },
  { label: 'Año', Icon: Calendar },
  { label: 'Estado', Icon: Award },
];

export const CoinLandingQuickFilters = () => {
  return (
    <section className="bg-parchment px-4 pb-5">
      <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2">
        {filters.map(({ label, Icon }) => (
          <button
            key={label}
            className={classNames(
              'inline-flex items-center gap-1.5 px-3.5 py-1.5',
              'rounded-full border border-brand-border bg-brand-surface/60 backdrop-blur-sm',
              'text-xs text-brand-muted font-normal tracking-wide',
              'hover:border-brand-accent hover:text-brand-accent',
              'transition-all duration-200'
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
