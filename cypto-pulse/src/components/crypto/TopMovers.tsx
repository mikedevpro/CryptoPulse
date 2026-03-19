import type { CoinMarket } from "../../types/crypto";
import { formatCurrency, formatPercent } from "../../utils/formatters";

type TopMoversProps = {
  coins: CoinMarket[];
};

export default function TopMovers({ coins }: TopMoversProps) {
  const validCoins = coins.filter(
    (coin) => coin.price_change_percentage_24h !== null
  );

  const topGainers = [...validCoins]
    .sort(
      (a, b) =>
        (b.price_change_percentage_24h ?? 0) -
        (a.price_change_percentage_24h ?? 0)
    )
    .slice(0, 3);

  const topLosers = [...validCoins]
    .sort(
      (a, b) =>
        (a.price_change_percentage_24h ?? 0) -
        (b.price_change_percentage_24h ?? 0)
    )
    .slice(0, 3);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <h2 className="text-lg font-semibold text-white">Top Gainers</h2>
        <div className="mt-4 space-y-3">
          {topGainers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-9 w-9 rounded-full"
                />
                <div>
                  <p className="font-medium text-white">{coin.name}</p>
                  <p className="text-sm uppercase text-slate-400">
                    {coin.symbol}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-300">
                  {formatCurrency(coin.current_price)}
                </p>
                <p className="font-semibold text-emerald-400">
                  {formatPercent(coin.price_change_percentage_24h)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-5">
        <h2 className="text-lg font-semibold text-white">Top Losers</h2>
        <div className="mt-4 space-y-3">
          {topLosers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="h-9 w-9 rounded-full"
                />
                <div>
                  <p className="font-medium text-white">{coin.name}</p>
                  <p className="text-sm uppercase text-slate-400">
                    {coin.symbol}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-300">
                  {formatCurrency(coin.current_price)}
                </p>
                <p className="font-semibold text-red-400">
                  {formatPercent(coin.price_change_percentage_24h)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}