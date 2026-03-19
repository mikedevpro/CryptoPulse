import type { CoinMarket } from "../../types/crypto";
import { formatCompactNumber } from "../../utils/formatters";

type MarketStatsProps = {
  coins: CoinMarket[];
};

export default function MarketStats({ coins }: MarketStatsProps) {
  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0);
  const gainers = coins.filter(
    (coin) => (coin.price_change_percentage_24h ?? 0) > 0
  ).length;
  const losers = coins.filter(
    (coin) => (coin.price_change_percentage_24h ?? 0) < 0
  ).length;

  const cards = [
    { label: "Tracked Coins", value: String(coins.length) },
    { label: "Combined Market Cap", value: `$${formatCompactNumber(totalMarketCap)}` },
    { label: "24h Volume", value: `$${formatCompactNumber(totalVolume)}` },
    { label: "Up / Down", value: `${gainers} / ${losers}` },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm"
        >
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}