import { useEffect, useState } from "react";
import { ApiError, getMarkets } from "../services/cryptoApi";
import type { CoinMarket, SortOption } from "../types/crypto";

const MARKETS_CACHE_TTL_MS = 15_000;
const DEFAULT_RETRY_COOLDOWN_MS = 30_000;
const marketCache = new Map<string, { data: CoinMarket[]; fetchedAt: number }>();

function formatCooldownMessage(remainingMs: number) {
  const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
  return `Rate limit reached. Retry in ${seconds}s.`;
}

export function useCryptoMarkets(sort: SortOption) {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [nextAllowedRefreshAt, setNextAllowedRefreshAt] = useState(0);
  const [cooldownMessage, setCooldownMessage] = useState("");

  useEffect(() => {
    if (!nextAllowedRefreshAt) {
      setCooldownMessage("");
    }

    let ignore = false;

    async function load() {
      const now = Date.now();
      const cached = marketCache.get(sort);
      const canUseCache =
        !!cached && now - cached.fetchedAt < MARKETS_CACHE_TTL_MS;

      if (cached) {
        setCoins(cached.data);
        setLoading(false);
      } else {
        setLoading(true);
      }

      if (canUseCache && cached) {
        return;
      }

      const remainingWaitMs = nextAllowedRefreshAt - now;
      if (remainingWaitMs > 0) {
        setError(formatCooldownMessage(remainingWaitMs));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setCooldownMessage("");
        const data = await getMarkets({ order: sort, perPage: 25 });

        if (!ignore) {
          setCoins(data);
          marketCache.set(sort, { data, fetchedAt: Date.now() });
          setNextAllowedRefreshAt(0);
          setCooldownMessage("");
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          const apiError = err instanceof ApiError ? err : null;

          if (apiError?.status === 429) {
            const retryDelayMs = (apiError.retryAfter ?? 30) * 1000;
            setNextAllowedRefreshAt(Date.now() + Math.max(retryDelayMs, 3000));
            setError(formatCooldownMessage(Math.max(retryDelayMs, 3000)));
            setCooldownMessage(formatCooldownMessage(Math.max(retryDelayMs, 3000)));
          } else {
            setError("Unable to load market data right now.");
          }
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

      load();

    return () => {
      ignore = true;
    };
  }, [sort, refreshNonce, nextAllowedRefreshAt]);

  useEffect(() => {
    if (!nextAllowedRefreshAt) return;

    const interval = window.setInterval(() => {
      const remainingMs = Math.max(0, nextAllowedRefreshAt - Date.now());
      if (remainingMs === 0) {
        setNextAllowedRefreshAt(0);
        setError((current) => {
          if (current.startsWith("Rate limit reached.")) return "";
          return current;
        });
        setCooldownMessage("");
      } else {
        const nextMessage = formatCooldownMessage(remainingMs);
        setError(nextMessage);
        setCooldownMessage(nextMessage);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [nextAllowedRefreshAt]);

  const refresh = () => {
    if (Date.now() < nextAllowedRefreshAt) {
      setError(cooldownMessage || formatCooldownMessage(nextAllowedRefreshAt - Date.now()));
      return;
    }
    setRefreshNonce((value) => value + 1);
  };

  return { coins, loading, error, refresh };
}
