import FavoritesButton from "./FavoritesButton";
import Sparkline from "./Sparkline";
import type { CoinMarket } from "../../types/crypto";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "../../utils/formatters";
import { navigateToCoin } from "../../utils/navigation";

type CoinTableProps = {
  coins: CoinMarket[];
  favorites: string[];
  onToggleFavorite: (coinId: string) => void;
};

export default function CoinTable({
  coins,
  favorites,
  onToggleFavorite,
}: CoinTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="max-h-[62vh] overflow-x-auto overflow-y-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="sticky top-0 z-20 bg-slate-950/80 px-4 py-4 font-medium text-slate-300 backdrop-blur">
                Fav
              </th>
              <th className="sticky top-0 z-20 bg-slate-950/80 px-4 py-4 font-medium text-slate-300 backdrop-blur">
                #
              </th>
              <th className="sticky top-0 z-20 bg-slate-950/80 px-4 py-4 font-medium text-slate-300 backdrop-blur">
                Coin
              </th>
              <th className="sticky top-0 z-20 bg-slate-950/80 px-4 py-4 font-medium text-slate-300 backdrop-blur">
                Price
              </th>
              <th className="sticky top-0 z-20 bg-slate-950/80 px-4 py-4 font-medium text-slate-300 backdrop-blur">
                24h
              </th>
              <th className="sticky top-0 z-20 bg-slate-950/80 px-4 py-4 font-medium text-slate-300 backdrop-blur">
                Trend
              </th>
              <th className="sticky top-0 z-20 bg-slate-950/80 px-4 py-4 font-medium text-slate-300 backdrop-blur">
                Market Cap
              </th>
              <th className="sticky top-0 z-20 bg-slate-950/80 px-4 py-4 font-medium text-slate-300 backdrop-blur">
                Volume
              </th>
            </tr>
          </thead>

          <tbody>
            {coins.map((coin) => {
              const change = coin.price_change_percentage_24h ?? 0;
              const isFavorite = favorites.includes(coin.id);
              const changeClass =
                change >= 0
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-red-400/10 text-red-300";

              return (
                <tr
                  key={coin.id}
                  className={`border-t border-white/10 text-slate-200 transition hover:bg-white/5 ${
                    isFavorite ? "bg-emerald-400/5" : ""
                  }`}
                >
                  <td className="px-4 py-4">
                    <FavoritesButton
                      isActive={isFavorite}
                      onClick={() => onToggleFavorite(coin.id)}
                    />
                  </td>

                  <td className="px-4 py-4">{coin.market_cap_rank}</td>

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => navigateToCoin(coin.id)}
                      className="flex items-center gap-3 text-left"
                    >
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
                    </button>
                  </td>

                  <td className="px-4 py-4 font-medium text-white">
                    {formatCurrency(coin.current_price)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${changeClass}`}
                    >
                      {formatPercent(coin.price_change_percentage_24h)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {coin.sparkline_in_7d?.price?.length ? (
                      <Sparkline
                        prices={coin.sparkline_in_7d.price}
                        positive={change >= 0}
                      />
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {coin.market_cap > 0
                      ? `$${formatCompactNumber(coin.market_cap)}`
                      : "—"}
                  </td>

                  <td className="px-4 py-4">
                    {coin.total_volume > 0
                      ? `$${formatCompactNumber(coin.total_volume)}`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
