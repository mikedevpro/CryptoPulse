import type {
  CoinChartPoint,
  CoinDetails,
  CoinMarket,
  SortOption,
} from "../types/crypto";

const BASE_URL = "/api/coingecko";

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

export async function getCoinDetails(id: string): Promise<CoinDetails> {
  const response = await fetch(
    `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch coin details.");
  }

  return response.json();
}

export async function getCoinMarketChart(id: string): Promise<CoinChartPoint[]> {
  const response = await fetch(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch coin chart data.");
  }

  const data = await response.json();
  return data.prices;
}
