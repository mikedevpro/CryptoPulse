import PriceChart from "../components/crypto/PriceChart";
import ErrorState from "../ui/ErrorState";
import LoadingState from "../ui/LoadingState";
import { useCoinDetails } from "../hooks/useCoinDetails";
import { useEffect, useState } from "react";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  stripHtml,
} from "../utils/formatters";

type CoinDetailsPageProps = {
  coinId: string | null;
};

export default function CoinDetailsPage({ coinId }: CoinDetailsPageProps) {
  const { coin, chart, loading, error, refresh } = useCoinDetails(coinId);
  const [showTransientNotice, setShowTransientNotice] = useState(false);
  const isTransientError = /rate limit|too many requests|temporarily/i.test(error || "");

  useEffect(() => {
    if (!error || !isTransientError) {
      setShowTransientNotice(false);
      return;
    }

    setShowTransientNotice(true);
    return;
  }, [error, isTransientError]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!error) {
      setShowTransientNotice(false);
    }
  }, [loading, error]);

  const goHome = () => {
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  if (loading) {
    return (
      <section className="space-y-4">
        <button
          type="button"
          className="text-emerald-400 hover:underline"
          onClick={goHome}
        >
          ← Back to dashboard
        </button>
        <LoadingState />
      </section>
    );
  }

  if (error || !coin) {
    return (
      <section className="space-y-4">
        <button
          type="button"
          className="text-emerald-400 hover:underline"
          onClick={goHome}
        >
          ← Back to dashboard
        </button>
        <ErrorState message={error || "Coin not found."} />
        {showTransientNotice ? (
          <div className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-200">
            Temporary API issue detected. You can keep this page open and retry when
            ready.
            <button
              type="button"
              className="ml-3 underline"
              onClick={() => setShowTransientNotice(false)}
            >
              Dismiss
            </button>
          </div>
        ) : null}
        <button
          type="button"
          disabled={loading}
          className="inline-flex rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 hover:bg-white/15"
          onClick={refresh}
        >
          {loading ? "Retrying..." : "Retry"}
        </button>
      </section>
    );
  }

  const description = stripHtml(coin.description.en || "");
  const shortDescription =
    description.length > 320
      ? `${description.slice(0, 320)}...`
      : description || "No description available.";

  const currentPrice = coin.market_data?.current_price?.usd;
  const marketCap = coin.market_data?.market_cap?.usd;
  const volume = coin.market_data?.total_volume?.usd;
  const change = coin.market_data?.price_change_percentage_24h ?? null;
  const high24h = coin.market_data?.high_24h?.usd;
  const low24h = coin.market_data?.low_24h?.usd;
  const livePrice = coin.market_data?.current_price?.usd;

  const stats = [
    {
      label: "Current Price",
      value: typeof currentPrice === "number" ? formatCurrency(currentPrice) : "—",
    },
    {
      label: "Market Cap",
      value:
        typeof marketCap === "number" && marketCap > 0
          ? `$${formatCompactNumber(marketCap)}`
          : "—",
    },
    {
      label: "24h Volume",
      value:
        typeof volume === "number" && volume > 0
          ? `$${formatCompactNumber(volume)}`
          : "—",
    },
    {
      label: "24h Change",
      value: formatPercent(change),
    },
    {
      label: "24h High",
      value: typeof high24h === "number" ? formatCurrency(high24h) : "—",
    },
    {
      label: "24h Low",
      value: typeof low24h === "number" ? formatCurrency(low24h) : "—",
    },
  ];

  return (
    <div className="space-y-8">
      <button
        type="button"
        className="inline-block text-emerald-400 hover:underline"
        onClick={goHome}
      >
        ← Back to dashboard
      </button>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={coin.image.large}
              alt={coin.name}
              className="h-16 w-16 rounded-full ring-1 ring-white/10"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
                Rank #{coin.market_cap_rank}
              </p>
              <h1 className="text-4xl font-bold text-white">{coin.name}</h1>
              <p className="mt-1 uppercase text-slate-400">{coin.symbol}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4">
            <p className="text-sm text-slate-400">Live Price</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {typeof livePrice === "number" ? formatCurrency(livePrice) : "—"}
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-3xl leading-7 text-slate-300">
          {shortDescription}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {chart.length > 0 ? <PriceChart data={chart} /> : null}
    </div>
  );
}
