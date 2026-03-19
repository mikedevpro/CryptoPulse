import { useRef, useState } from "react";
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

export default function CoinTable({ coins, favorites, onToggleFavorite }: CoinTableProps) {
  const SWIPE_ACTION_WIDTH = 92;
  const SWIPE_TRIGGER = 44;
  const [activeSwipeId, setActiveSwipeId] = useState<string | null>(null);
  const [dragState, setDragState] = useState({ id: null as string | null, offset: 0 });
  const startXRef = useRef(0);
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 640;

  const beginSwipe = (coinId: string, pageX: number) => {
    if (!isSmallScreen) {
      return;
    }

    if (activeSwipeId && activeSwipeId !== coinId) {
      setActiveSwipeId(null);
    }

    startXRef.current = pageX;
    setDragState({ id: coinId, offset: 0 });
  };

  const moveSwipe = (coinId: string, pageX: number) => {
    if (dragState.id !== coinId) {
      return;
    }

    const deltaX = pageX - startXRef.current;
    const offset = Math.max(-SWIPE_ACTION_WIDTH, Math.min(0, deltaX));
    setDragState({ id: coinId, offset });
  };

  const endSwipe = (coinId: string) => {
    if (dragState.id !== coinId) {
      return;
    }

    const shouldOpen = dragState.offset <= -SWIPE_TRIGGER;
    setDragState({ id: null, offset: 0 });
    setActiveSwipeId(shouldOpen ? coinId : null);
  };

  const cardOffset = (coinId: string) => {
    if (dragState.id === coinId) {
      return dragState.offset;
    }

    return activeSwipeId === coinId ? -SWIPE_ACTION_WIDTH : 0;
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="max-h-[68vh] overflow-x-auto overflow-y-auto max-[360px]:max-h-[72vh] sm:max-h-[62vh]">
          <table className="hidden min-w-full text-left text-sm sm:table">
          <thead className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur">
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

                  <td className="px-4 py-4 font-medium text-white">{formatCurrency(coin.current_price)}</td>

                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${changeClass}`}>
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
                    {coin.market_cap > 0 ? `$${formatCompactNumber(coin.market_cap)}` : "—"}
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

        <div className="space-y-2 bg-slate-950/20 p-2 sm:space-y-0 sm:p-0 sm:hidden">
          {coins.map((coin) => {
            const change = coin.price_change_percentage_24h ?? 0;
            const isFavorite = favorites.includes(coin.id);
            const isPositive = change >= 0;
            const offset = cardOffset(coin.id);

            return (
              <div
                key={`mobile-${coin.id}`}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div
                  className={`absolute inset-y-0 right-0 flex w-[92px] items-center justify-center gap-2 bg-slate-900 px-2 ${
                    isFavorite ? "bg-emerald-400/10" : "bg-slate-900/90"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(coin.id)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-lg text-emerald-300 transition hover:bg-white/10"
                    aria-label={isFavorite ? "Unsave coin" : "Save coin"}
                  >
                    {isFavorite ? "★" : "☆"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateToCoin(coin.id)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs text-slate-200 transition hover:bg-white/10"
                    aria-label={`Open ${coin.name} details`}
                  >
                    →
                  </button>
                </div>

                <article
                  onTouchStart={(event) => beginSwipe(coin.id, event.touches[0].clientX)}
                  onTouchMove={(event) => moveSwipe(coin.id, event.touches[0].clientX)}
                  onTouchEnd={() => endSwipe(coin.id)}
                  onTouchCancel={() => endSwipe(coin.id)}
                  onMouseDown={(event) => beginSwipe(coin.id, event.clientX)}
                  onMouseMove={(event) => {
                    if (dragState.id === coin.id) {
                      moveSwipe(coin.id, event.clientX);
                    }
                  }}
                  onMouseUp={() => endSwipe(coin.id)}
                  onMouseLeave={() => {
                    if (dragState.id === coin.id) {
                      endSwipe(coin.id);
                    }
                  }}
                    className="block rounded-2xl bg-white/5 p-2.5 transition-transform max-[360px]:p-2 sm:p-3 sm:transition-none"
                  style={{
                    transform: `translateX(${offset}px)`,
                    touchAction: "pan-y",
                    transitionProperty: dragState.id === coin.id ? "none" : undefined,
                  }}
                >
                    <div className="flex items-start justify-between gap-2 sm:gap-2.5 max-[360px]:gap-1.5 sm:gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigateToCoin(coin.id)}
                        className="min-w-0 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="h-8 w-8 shrink-0 rounded-full ring-1 ring-white/10 max-[360px]:h-7 max-[360px]:w-7"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-white max-[360px]:text-[12px] sm:text-base">
                              {coin.name}
                            </p>
                            <p className="truncate text-[11px] uppercase tracking-wide text-slate-400 max-[360px]:text-[10px]">
                              {coin.symbol}
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-white max-[360px]:text-[13px] sm:text-base">
                        {formatCurrency(coin.current_price)}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${
                          isPositive
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-red-400/10 text-red-300"
                        }`}
                      >
                        {formatPercent(coin.price_change_percentage_24h)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300 max-[360px]:text-[10px] max-[360px]:gap-1 sm:mt-3 sm:gap-2 sm:text-xs">
                    <span className="rounded-full border border-white/10 px-2 py-1">#{coin.market_cap_rank}</span>
                    {coin.market_cap > 0 ? (
                      <span className="rounded-full border border-white/10 px-2 py-1">
                        MCap ${formatCompactNumber(coin.market_cap)}
                      </span>
                    ) : null}
                    {coin.total_volume > 0 ? (
                      <span className="rounded-full border border-white/10 px-2 py-1">
                        Vol ${formatCompactNumber(coin.total_volume)}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2.5 sm:mt-3">
                    {coin.sparkline_in_7d?.price?.length ? (
                      <Sparkline prices={coin.sparkline_in_7d.price} positive={isPositive} />
                    ) : (
                      <span className="text-[11px] text-slate-500">No trend data</span>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
