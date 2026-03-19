import FavoritesPanel from "../components/crypto/FavoritesPanel";
import EmptyState from "../ui/EmptyState";
import { useMemo, useState, useEffect } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { getMarkets } from "../services/cryptoApi";
import type { CoinMarket } from "../types/crypto";

export default function WatchlistPage() {
  const { favorites } = useFavorites();
  const [favoriteCoins, setFavoriteCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const uniqueFavorites = useMemo(
    () => Array.from(new Set(favorites)),
    [favorites]
  );

  useEffect(() => {
    let active = true;

    async function load() {
      if (uniqueFavorites.length === 0) {
        if (active) {
          setFavoriteCoins([]);
          setLoading(false);
          setError("");
        }
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await getMarkets({
          coinIds: uniqueFavorites,
          perPage: Math.min(250, Math.max(uniqueFavorites.length, 1)),
        });

        if (!active) return;

        const coinById = new Map(data.map((coin) => [coin.id, coin]));
        const orderedFavorites = uniqueFavorites
          .map((id) => coinById.get(id))
          .filter((coin): coin is CoinMarket => Boolean(coin));

        setFavoriteCoins(orderedFavorites);
      } catch {
        if (active) {
          setError("Unable to load watchlist data right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [uniqueFavorites]);

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
        <div
          role="status"
          aria-live="polite"
          className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300"
        >
          Loading watchlist...
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300"
        >
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
