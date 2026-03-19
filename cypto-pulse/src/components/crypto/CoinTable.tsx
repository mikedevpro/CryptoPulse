import FavoriteButton from "./FavoritesButton";
import type { CoinMarket } from "../../types/crypto";
import { navigateToCoin } from "../../utils/navigation";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "../../utils/formatters";
import {
  FAVORITE_COLUMN_WIDTH,
  COIN_COLUMN_OFFSET,
} from "../../utils/tableLayout";

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
      <div className="relative max-h-[70vh] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur text-slate-300">
            <tr>
              <th className="sticky left-0 z-30 bg-slate-950/80 px-4 py-4 font-medium">
                Fav
              </th>
              <th
                className="sticky z-20 bg-slate-950/80 px-4 py-4 font-medium"
                style={{ left: FAVORITE_COLUMN_WIDTH }}
              >
                #
              </th>
              <th
                className="sticky z-20 bg-slate-950/80 px-4 py-4 font-medium"
                style={{ left: COIN_COLUMN_OFFSET }}
              >
                Coin
              </th>
              <th className="px-4 py-4 font-medium">Price</th>
              <th className="px-4 py-4 font-medium">24h</th>
              <th className="px-4 py-4 font-medium">Market Cap</th>
              <th className="px-4 py-4 font-medium">Volume</th>
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
                  className={`cursor-pointer border-t border-white/10 text-slate-200 transition hover:bg-white/5 ${
                    isFavorite ? "bg-emerald-400/5" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigateToCoin(coin.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigateToCoin(coin.id);
                    }
                  }}
                >
                  <td className="sticky left-0 z-10 bg-slate-900/70 px-4 py-4">
                    <FavoriteButton
                      isActive={isFavorite}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleFavorite(coin.id);
                      }}
                    />
                  </td>

                  <td
                    className="sticky z-10 bg-slate-900/70 px-4 py-4"
                    style={{ left: FAVORITE_COLUMN_WIDTH }}
                  >
                    {coin.market_cap_rank}
                  </td>

                  <td
                    className="sticky z-10 bg-slate-900/70 px-4 py-4"
                    style={{ left: COIN_COLUMN_OFFSET }}
                  >
                    <button
                      type="button"
                      className="flex items-center gap-3 text-left"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigateToCoin(coin.id);
                      }}
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
