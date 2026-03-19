import type { CoinMarket } from "../../types/crypto";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "../../utils/formatters";

type CoinTableProps = {
  coins: CoinMarket[];
  onCoinClick?: (id: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

const PULL_THRESHOLD = 56;
const MAX_PULL = 96;

export default function CoinTable({
  coins,
  onCoinClick,
  onRefresh,
  isRefreshing,
}: CoinTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pullStartY = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [didPullRefresh, setDidPullRefresh] = useState(false);

  const clampPullDistance = (value: number) =>
    Math.max(0, Math.min(value, MAX_PULL));

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (onRefresh === undefined || isRefreshing) return;

    if ((scrollContainerRef.current?.scrollTop ?? 0) !== 0) return;

    pullStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (pullStartY.current === null) return;

    const currentY = event.touches[0].clientY;
    const delta = currentY - pullStartY.current;

    if (delta <= 0) {
      pullStartY.current = null;
      setPullDistance(0);
      setIsDragging(false);
      return;
    }

    setIsDragging(true);
    setPullDistance(clampPullDistance(delta));
    event.preventDefault();
  };

  const handleTouchEnd = () => {
    if (pullStartY.current === null) return;

    if (pullDistance >= PULL_THRESHOLD) {
      if ("vibrate" in navigator) {
        navigator.vibrate(8);
      }
      setDidPullRefresh(true);
      onRefresh?.();
    }

    pullStartY.current = null;
    setPullDistance(0);
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isRefreshing && didPullRefresh) {
      const timer = window.setTimeout(() => setDidPullRefresh(false), 220);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [isRefreshing, didPullRefresh]);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div
        ref={scrollContainerRef}
        className="max-h-[70vh] touch-pan-y overflow-y-auto [-webkit-overflow-scrolling:touch]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          transform: `translateY(${pullDistance * 0.32}px) scale(${didPullRefresh ? 1.01 : 1})`,
          transition: isDragging ? "none" : "transform 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {onRefresh && (pullDistance > 0 || isRefreshing) ? (
          <div className="flex h-10 items-center justify-center gap-2 text-center text-xs text-slate-300">
            <span
              aria-hidden="true"
              className={`inline-flex h-3 w-3 items-center justify-center rounded-full border border-slate-300/80 ${
                isRefreshing || didPullRefresh ? "animate-spin border-t-emerald-300" : ""
              }`}
              style={{
                transform:
                  isRefreshing || didPullRefresh
                    ? "none"
                  : `rotate(${Math.min(180, (pullDistance / PULL_THRESHOLD) * 180)}deg)`,
              }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-2.5 w-2.5 text-slate-300"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="3"
                />
                <path
                  d="M18 10c0-4.4-3.6-8-8-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span>
              {isRefreshing
                ? didPullRefresh
                  ? "Refreshing…"
                  : "Refreshing..."
                : pullDistance >= PULL_THRESHOLD
                  ? "Release to refresh"
                  : "Pull to refresh"}
            </span>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-950/80 backdrop-blur">
              <tr>
                <th className="sticky left-0 z-30 bg-slate-950/80 px-4 py-4 font-medium">
                  #
                </th>
                <th className="px-4 py-4 font-medium">Coin</th>
                <th className="px-4 py-4 font-medium">Price</th>
                <th className="px-4 py-4 font-medium">24h</th>
                <th className="px-4 py-4 font-medium">Market Cap</th>
                <th className="px-4 py-4 font-medium">Volume</th>
              </tr>
            </thead>

            <tbody>
              {coins.map((coin) => {
                const change = coin.price_change_percentage_24h ?? 0;
                const changeClass =
                  change >= 0
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-red-400/10 text-red-300";

                return (
                  <tr
                    key={coin.id}
                    className="group cursor-pointer touch-manipulation border-t border-white/10 text-slate-200 transition duration-150 hover:bg-white/5 active:bg-white/10 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset] hover:-translate-y-px active:scale-[0.997]"
                    onClick={() => onCoinClick?.(coin.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onCoinClick?.(coin.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <td className="sticky left-0 z-10 bg-slate-900/70 px-4 py-4">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 transition group-hover:bg-emerald-400/15 group-hover:text-emerald-200 group-hover:border-emerald-300/40">
                        <span>{coin.market_cap_rank}</span>
                      </span>
                    </td>

                    <td className="px-4 py-4">
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
    </div>
  );
}
