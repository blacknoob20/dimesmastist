import { CoinLandingHero } from './landing/CoinLandingHero';
import { CoinLandingQuickFilters } from './landing/CoinLandingQuickFilters';
import { CoinLandingPersonalStats } from './landing/CoinLandingPersonalStats';
import { CoinLandingCollectionGrid } from './landing/CoinLandingCollectionGrid';

export const CoinPage = () => {
  return (
    <main>
      <CoinLandingHero />
      <CoinLandingQuickFilters />
      <CoinLandingPersonalStats />
      <CoinLandingCollectionGrid />
    </main>
  );
};
