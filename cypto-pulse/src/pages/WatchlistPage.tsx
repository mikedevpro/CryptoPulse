import FavoritesPanel from "../components/crypto/FavoritesPanel";
import EmptyState from "../ui/EmptyState";
import { useFavorites } from "../hooks/useFavorites";
import { useCryptoMarkets } from "../hooks/useCryptoMarkets";

export default function WatchlistPage() {
  const { coins, loading, error } = useCryptoMarkets("market_cap_desc");
  const { favorites } = useFavorites();

  const favoriteCoins = coins.filter((coin) => favorites.includes(coin.id));

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(16,185,129,0.08)] backdrop-blur-sm">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Your saved market view
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Watchlist
          </h1>

          <p className="text-lg leading-8 text-slate-300">
            Keep an eye on your favorite coins in one dedicated view.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
          Loading watchlist...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        favoriteCoins.length > 0 ? (
          <FavoritesPanel favoriteCoins={favoriteCoins} />
        ) : (
          <EmptyState
            title="Your watchlist is empty"
            description="Go back to the dashboard and favorite a few coins to build your personalized market view."
          />
        )
      ) : null}
    </div>
  );
}