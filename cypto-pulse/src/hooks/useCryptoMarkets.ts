import { useEffect, useState } from "react";
import { getMarkets } from "../services/cryptoApi";
import type { CoinMarket, SortOption } from "../types/crypto";

export function useCryptoMarkets(sort: SortOption) {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getMarkets({ order: sort, perPage: 25 });

        if (!ignore) {
          setCoins(data);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError("Unable to load market data right now.");
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
  }, [sort, refreshNonce]);

  const refresh = () => setRefreshNonce((value) => value + 1);

  return { coins, loading, error, refresh };
}
