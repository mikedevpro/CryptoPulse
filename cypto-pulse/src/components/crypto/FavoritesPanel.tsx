import type { CoinMarket } from "../../types/crypto";
import { formatCurrency, formatPercent } from "../../utils/formatters";
import { navigateToCoin } from "../../utils/navigation";

type FavoritesPanelProps = {
  favoriteCoins: CoinMarket[];
};

export default function FavoritesPanel({
  favoriteCoins,
}: FavoritesPanelProps) {
  if (favoriteCoins.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-white">Your Watchlist</h2>
        <p className="mt-3 text-slate-300">
          Favorite a few coins to build your watchlist.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Your Watchlist</h2>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
          {favoriteCoins.length} saved
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {favoriteCoins.map((coin) => {
          const change = coin.price_change_percentage_24h ?? 0;
          const changeClass =
            change >= 0 ? "text-emerald-400" : "text-red-400";

          return (
            <button
              key={coin.id}
              className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 transition hover:border-white/20 hover:bg-white/5"
              type="button"
              onClick={() => navigateToCoin(coin.id)}
              aria-label={`Open details for ${coin.name}`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-10 w-10 rounded-full ring-1 ring-white/10"
                />
                <div>
                  <p className="font-medium text-white">{coin.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {coin.symbol}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-400">Price</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(coin.current_price)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-400">24h</p>
                  <p className={`font-semibold ${changeClass}`}>
                    {formatPercent(coin.price_change_percentage_24h)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
