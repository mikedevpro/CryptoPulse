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
  const {
    coins,
    loading,
    error,
    cooldownMessage,
    refresh,
    lastUpdatedAt,
    autoRefreshEnabled,
    toggleAutoRefresh,
  } = useCryptoMarkets(sort);
  const { favorites, toggleFavorite } = useFavorites();
  const [favoriteLookupCoins, setFavoriteLookupCoins] = useState<CoinMarket[]>([]);
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const lastUpdatedLabel = lastUpdatedAt
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(lastUpdatedAt))
    : "—";

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

  const hasCoins = coins.length > 0;
  const showInitialLoading = loading && !hasCoins;
  const showFullError = !!error && !hasCoins;
  const showMarketContent = hasCoins;

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <section className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_32px_rgba(16,185,129,0.08)] backdrop-blur-sm sm:rounded-[1.5rem] sm:p-6 lg:rounded-[2rem] lg:p-8 lg:shadow-[0_0_60px_rgba(16,185,129,0.08)]">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400 sm:text-xs lg:text-sm lg:tracking-[0.25em]">
            Real-time crypto market dashboard
          </p>

          <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-5xl lg:leading-tight">
            Track crypto markets with clarity and style.
          </h1>

          <p className="text-sm leading-6 text-slate-300 sm:text-[15px] sm:leading-7 lg:text-base">
            CryptoPulse helps users explore top-performing coins, monitor
            24-hour movement, and search market data in a clean, responsive
            interface built with React and TypeScript.
          </p>
          <div className="grid gap-1 text-sm sm:grid-cols-2 sm:gap-3">
            <p className="font-medium text-emerald-200">Date: {todayLabel}</p>
            <p className="text-slate-300">
              Last updated: {lastUpdatedLabel} (auto-refresh every 60s)
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={toggleAutoRefresh}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Auto-refresh: {autoRefreshEnabled ? "ON" : "OFF"}
            </button>
            <p className="inline-flex min-h-11 items-center gap-2 text-sm text-slate-300">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  loading ? "animate-pulse bg-emerald-400" : "bg-slate-500"
                }`}
                aria-hidden="true"
              />
              {loading ? "Updating..." : "Idle"}
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </section>

      {showInitialLoading ? (
        <div role="status" aria-live="polite">
          <LoadingState />
        </div>
      ) : null}

      {showFullError ? (
        <div role="alert" aria-live="assertive">
          <ErrorState message={error} />
        </div>
      ) : null}

      {cooldownMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
        >
          API health: rate-limited. {cooldownMessage}
        </div>
      ) : null}

      {showMarketContent ? (
        <>
          {error ? (
            <div role="alert" aria-live="assertive">
              <ErrorState message={error} />
            </div>
          ) : null}

          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <MarketStats coins={coins} />
            <FavoritesPanel favoriteCoins={favoriteCoins} />
            <TopMovers coins={coins} />
          </div>

          <section className="sticky top-14 z-40 -mx-1 mb-3 flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-slate-950/80 p-2 shadow-[0_0_26px_rgba(2,6,23,0.45)] backdrop-blur-sm md:top-20 md:static md:mb-0 md:-mx-0 md:gap-3 md:rounded-3xl md:bg-white/5 md:p-4">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SortSelect value={sort} onChange={setSort} />
              </div>
            </div>
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
