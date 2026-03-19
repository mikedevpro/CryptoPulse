import type { CoinMarket, SortOption } from "../types/crypto";

const BASE_URL = "https://api.coingecko.com/api/v3";

type GetMarketsParams = {
  page?: number;
  perPage?: number;
  order?: SortOption;
};

export async function getMarkets({
  page = 1,
  perPage = 25,
  order = "market_cap_desc",
}: GetMarketsParams = {}): Promise<CoinMarket[]> {
  const params = new URLSearchParams({
    vs_currency: "usd",
    order,
    per_page: String(perPage),
    page: String(page),
    sparkline: "false",
    price_change_percentage: "24h",
  });

  const response = await fetch(`${BASE_URL}/coins/markets?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch crypto market data.");
  }

  return response.json();
}