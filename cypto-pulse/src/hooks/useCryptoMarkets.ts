import { useEffect, useState } from "react";
import { ApiError, getMarkets } from "../services/cryptoApi";
import type { CoinMarket, SortOption } from "../types/crypto";

const MARKETS_CACHE_TTL_MS = 15_000;
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
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const now = Date.now();
      const cached = marketCache.get(sort);
      const canUseCache =
        !!cached && now - cached.fetchedAt < MARKETS_CACHE_TTL_MS;

      if (cached) {
        setCoins(cached.data);
        setLastUpdatedAt(cached.fetchedAt);
        setLoading(false);
      } else {
        setLoading(true);
      }

      if (canUseCache) {
        setError("");
        return;
      }

      if (nextAllowedRefreshAt > now) {
        const message = formatCooldownMessage(nextAllowedRefreshAt - now);
        setCooldownMessage(message);
        setError(message);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setCooldownMessage("");
        const data = await getMarkets({ order: sort, perPage: 25 });

        if (ignore) return;

        setCoins(data);
        const fetchedAt = Date.now();
        marketCache.set(sort, { data, fetchedAt });
        setLastUpdatedAt(fetchedAt);
        setNextAllowedRefreshAt(0);
        setCooldownMessage("");
        setError("");
      } catch (err) {
        console.error(err);

        if (ignore) return;

        const apiError = err instanceof ApiError ? err : null;

        if (apiError?.status === 429) {
          const retryDelayMs = Math.max((apiError.retryAfter ?? 30) * 1000, 3000);
          const message = formatCooldownMessage(retryDelayMs);
          const retryAt = new Date(Date.now() + retryDelayMs).toISOString();

          console.warn("Rate limited by CoinGecko. Backing off before next request.", {
            sort,
            retryDelayMs,
            retryAt,
          });

          setNextAllowedRefreshAt(Date.now() + retryDelayMs);
          setCooldownMessage(message);
          setError(message);
        } else if (apiError) {
          setError(apiError.message);
        } else {
          setError("Something went wrong.");
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
    if (!autoRefreshEnabled) {
      return;
    }

    const interval = window.setInterval(() => {
      setRefreshNonce((value) => value + 1);
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [autoRefreshEnabled]);

  useEffect(() => {
    if (!nextAllowedRefreshAt) return;

    const interval = window.setInterval(() => {
      const remainingMs = Math.max(0, nextAllowedRefreshAt - Date.now());

      if (remainingMs === 0) {
        setNextAllowedRefreshAt(0);
        setCooldownMessage("");
        setError((current) =>
          current.startsWith("Rate limit reached.") ? "" : current
        );
        return;
      }

      const nextMessage = formatCooldownMessage(remainingMs);
      setCooldownMessage(nextMessage);
      setError(nextMessage);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [nextAllowedRefreshAt]);

  const refresh = () => {
    const now = Date.now();

    if (now < nextAllowedRefreshAt) {
      console.info("Manual refresh blocked due to active cooldown.", {
        sort,
        remainingMs: nextAllowedRefreshAt - now,
      });
      setError(cooldownMessage || formatCooldownMessage(nextAllowedRefreshAt - now));
      return;
    }

    setError("");
    setCooldownMessage("");
    setRefreshNonce((value) => value + 1);
  };

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled((value) => !value);
  };

  return {
    coins,
    loading,
    error,
    cooldownMessage,
    lastUpdatedAt,
    autoRefreshEnabled,
    toggleAutoRefresh,
    refresh,
  };
}
