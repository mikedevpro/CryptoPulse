import { useEffect, useState } from "react";
import { getCoinDetails, getCoinMarketChart } from "../services/cryptoApi";
import type { CoinChartPoint, CoinDetails } from "../types/crypto";

type CoinDetailsState = {
  coin: CoinDetails | null;
  chart: CoinChartPoint[];
  loading: boolean;
  error: string;
};

export function useCoinDetails(coinId: string | null): CoinDetailsState {
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [chart, setChart] = useState<CoinChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      try {
        setLoading(true);
        setError("");

        const [coinResult, chartResult] = await Promise.allSettled([
          getCoinDetails(coinId),
          getCoinMarketChart(coinId),
        ]);

        if (ignore) return;

        if (coinResult.status === "fulfilled") {
          setCoin(coinResult.value);
        } else {
          console.error(coinResult.reason);
          setError("Unable to load coin details.");
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
          setError("Unable to load coin details.");
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
  }, [coinId]);

  return { coin, chart, loading, error };
}
