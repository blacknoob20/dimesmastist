import { Search, Sun, Moon, Sunset } from 'lucide-react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Buenos días', Icon: Sun };
  if (hour < 19) return { text: 'Buenas tardes', Icon: Sunset };
  return { text: 'Buenas noches', Icon: Moon };
};

export const CoinLandingHero = () => {
  const { text, Icon } = getGreeting();

  return (
    <section className="bg-parchment px-4 pt-5 sm:pt-6 pb-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-brand-accent" strokeWidth={1.75} />
          <span className="text-sm text-brand-muted font-normal tracking-wide">
            {text}, Tom
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display text-brand-text tracking-tight">
          Tu{' '}
          <span className="text-brand-accent">colección</span>
        </h1>
        <p className="mt-1 text-sm sm:text-base text-brand-muted">
          9 piezas únicas reunidas pieza a pieza desde 1887
        </p>

        {/* Search premium */}
        <div className="mt-4 max-w-xl mx-auto">
          <div className="relative group">
            <input
              type="text"
              placeholder="Buscar moneda..."
              className="w-full pl-5 pr-12 py-3.5 rounded-2xl border border-brand-border bg-brand-surface text-brand-text placeholder-brand-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent focus:shadow-lg focus:shadow-brand-accent/10 transition-all duration-300"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-brand-accent text-white hover:bg-brand-accent-hover shadow-md shadow-brand-accent/20 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/30">
              <Search className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
