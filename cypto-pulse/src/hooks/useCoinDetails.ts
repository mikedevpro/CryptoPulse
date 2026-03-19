import { useEffect, useState } from "react";
import { ApiError, getCoinDetails, getCoinMarketChart } from "../services/cryptoApi";
import type { CoinChartPoint, CoinDetails } from "../types/crypto";

type CoinDetailsState = {
  coin: CoinDetails | null;
  chart: CoinChartPoint[];
  loading: boolean;
  error: string;
  refresh: () => void;
};

export function useCoinDetails(coinId: string | null): CoinDetailsState {
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [chart, setChart] = useState<CoinChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!coinId) {
        setError("Coin ID is missing.");
        setLoading(false);
        setCoin(null);
        setChart([]);
        return;
      }

      setLoading(true);
      setError("");
      setCoin(null);
      setChart([]);

      try {
        const [coinResult, chartResult] = await Promise.allSettled([
          getCoinDetails(coinId),
          getCoinMarketChart(coinId),
        ]);

        if (ignore) return;

        if (coinResult.status === "fulfilled") {
          setCoin(coinResult.value);
        } else {
          console.error(coinResult.reason);
          if (coinResult.reason instanceof ApiError && coinResult.reason.status === 429) {
            setError("Rate limit reached. Please wait a bit before retrying.");
          } else {
            setError("Unable to load coin details.");
          }
          setCoin(null);
        }

        if (chartResult.status === "fulfilled") {
          setChart(chartResult.value);
        } else {
          console.error(chartResult.reason);
          setChart([]);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          if (err instanceof ApiError && err.status === 429) {
            setError("Rate limit reached. Please wait a bit before retrying.");
          } else {
            setError("Unable to load coin details.");
          }
          setCoin(null);
          setChart([]);
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
  }, [coinId, refreshNonce]);

  const refresh = () => setRefreshNonce((value) => value + 1);

  return { coin, chart, loading, error, refresh };
}
