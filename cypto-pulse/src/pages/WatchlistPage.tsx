import FavoritesPanel from "../components/crypto/FavoritesPanel";
import EmptyState from "../ui/EmptyState";
import { useMemo, useState, useEffect } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { ApiError, getMarkets } from "../services/cryptoApi";
import type { CoinMarket } from "../types/crypto";

export default function WatchlistPage() {
  const { favorites } = useFavorites();
  const [favoriteCoins, setFavoriteCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);

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
      } catch (error) {
        if (active) {
          if (error instanceof ApiError) {
            setError(error.message);
          } else {
            setError("Something went wrong.");
          }
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
  }, [uniqueFavorites, refreshNonce]);

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_rgba(16,185,129,0.08)] backdrop-blur-sm sm:p-6 lg:rounded-[2rem] lg:p-8 lg:shadow-[0_0_60px_rgba(16,185,129,0.08)]">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 sm:text-sm sm:tracking-[0.25em]">
            Your saved market view
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Watchlist
          </h1>

          <p className="text-sm leading-6 text-slate-300 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
            Keep an eye on your favorite coins in one dedicated view.
          </p>

          <button
            type="button"
            onClick={() => setRefreshNonce((value) => value + 1)}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
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
