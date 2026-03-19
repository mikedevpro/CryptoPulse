import { useEffect, useMemo, useState } from "react";
import CoinTable from "../components/crypto/CoinTable";
import FavoritesPanel from "../components/crypto/FavoritesPanel";
import MarketStats from "../components/crypto/MarketStats";
import SearchBar from "../components/crypto/SearchBar";
import SortSelect from "../components/crypto/SortSelect";
import TopMovers from "../components/crypto/TopMovers";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import { useFavorites } from "../hooks/useFavorites";
import { useCryptoMarkets } from "../hooks/useCryptoMarkets";
import { getMarkets } from "../services/cryptoApi";
import type { CoinMarket, SortOption } from "../types/crypto";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("market_cap_desc");
  const { coins, loading, error } = useCryptoMarkets(sort);
  const { favorites, toggleFavorite } = useFavorites();
  const [favoriteLookupCoins, setFavoriteLookupCoins] = useState<CoinMarket[]>([]);

  const uniqueFavorites = useMemo(
    () => Array.from(new Set(favorites)),
    [favorites]
  );

  const filteredCoins = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return coins;

    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term)
    );
  }, [coins, search]);

  const favoriteCoins = useMemo(() => {
    const marketById = new Map(coins.map((coin) => [coin.id, coin]));
    const fallbackById = new Map(
      favoriteLookupCoins.map((coin) => [coin.id, coin])
    );

    return uniqueFavorites
      .map((id) => marketById.get(id) || fallbackById.get(id))
      .filter((coin): coin is CoinMarket => Boolean(coin));
  }, [coins, favoriteLookupCoins, uniqueFavorites]);

  useEffect(() => {
    let active = true;

    async function loadMissingFavorites() {
      const marketIds = new Set(coins.map((coin) => coin.id));
      const missingIds = uniqueFavorites.filter((id) => !marketIds.has(id));

      if (missingIds.length === 0) {
        if (active) {
          setFavoriteLookupCoins([]);
        }
        return;
      }

      try {
        const data = await getMarkets({
          coinIds: missingIds,
          perPage: Math.min(250, Math.max(missingIds.length, 1)),
        });

        if (!active) return;
        setFavoriteLookupCoins(data);
      } catch (error) {
        if (active) {
          console.error("Failed to load missing favorite coins:", error);
          setFavoriteLookupCoins([]);
        }
      }
    }

    loadMissingFavorites();

    return () => {
      active = false;
    };
  }, [coins, uniqueFavorites]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-3 shadow-[0_0_40px_rgba(16,185,129,0.08)] backdrop-blur-sm sm:rounded-[2rem] sm:p-8 sm:shadow-[0_0_60px_rgba(16,185,129,0.08)]">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400 sm:text-sm sm:tracking-[0.25em]">
            Real-time crypto market dashboard
          </p>

          <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-5xl sm:leading-tight">
            Track crypto markets with clarity and style.
          </h1>

          <p className="text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
            CryptoPulse helps users explore top-performing coins, monitor
            24-hour movement, and search market data in a clean, responsive
            interface built with React and TypeScript.
          </p>
        </div>
      </section>

      {loading ? (
        <div role="status" aria-live="polite">
          <LoadingState />
        </div>
      ) : null}
      {error ? (
        <div role="alert" aria-live="assertive">
          <ErrorState message={error} />
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <div className="space-y-4 sm:space-y-6">
            <MarketStats coins={coins} />
            <FavoritesPanel favoriteCoins={favoriteCoins} />
            <TopMovers coins={coins} />
          </div>

          <section className="sticky top-16 z-40 -mx-1 mb-3 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/75 p-2 shadow-[0_0_26px_rgba(2,6,23,0.45)] backdrop-blur-sm sm:top-20 sm:static sm:mb-0 sm:-mx-0 sm:rounded-3xl sm:bg-white/5 sm:p-4">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <SortSelect value={sort} onChange={setSort} />
          </section>

          {filteredCoins.length > 0 ? (
            <div className="mt-2 sm:mt-4">
              <CoinTable
                coins={filteredCoins}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ) : (
            <EmptyState
              title="No matching coins found"
              description="Try searching for a different coin name or symbol. For example: bitcoin, ethereum, or sol."
            />
          )}
        </>
      ) : null}
    </div>
  );
}
