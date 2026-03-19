import { useMemo, useState } from "react";
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
import type { SortOption } from "../types/crypto";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("market_cap_desc");
  const { coins, loading, error } = useCryptoMarkets(sort);
  const { favorites, toggleFavorite } = useFavorites();

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
    return coins.filter((coin) => favorites.includes(coin.id));
  }, [coins, favorites]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(16,185,129,0.08)] backdrop-blur-sm">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Real-time crypto market dashboard
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Track crypto markets with clarity and style.
          </h1>

          <p className="text-lg leading-8 text-slate-300">
            CryptoPulse helps users explore top-performing coins, monitor
            24-hour movement, and search market data in a clean, responsive
            interface built with React and TypeScript.
          </p>
        </div>
      </section>

      {loading ? <LoadingState /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error ? (
        <>
          <MarketStats coins={coins} />
          <FavoritesPanel favoriteCoins={favoriteCoins} />
          <TopMovers coins={coins} />

          <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <SortSelect value={sort} onChange={setSort} />
          </section>

          {filteredCoins.length > 0 ? (
            <CoinTable
              coins={filteredCoins}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
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