import type {
  CoinChartPoint,
  CoinDetails,
  CoinMarket,
  SortOption,
} from "../types/crypto";

const BASE_URL = "/api/coingecko";

export class ApiError extends Error {
  status: number;
  retryAfter: number | null;

  constructor(message: string, status: number, retryAfter: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

type GetMarketsParams = {
  page?: number;
  perPage?: number;
  order?: SortOption;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const retryHeader = response.headers.get("retry-after");
  const retryAfter = retryHeader
    ? Number.parseInt(retryHeader, 10)
    : null;

  if (response.status === 429) {
    throw new ApiError(
      "CoinGecko rate limit reached. Please wait before refreshing again.",
      response.status,
      Number.isNaN(retryAfter) ? null : retryAfter
    );
  }

  throw new ApiError("Request failed.", response.status, retryAfter);
}

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
    sparkline: "true",
    price_change_percentage: "24h",
  });

  const response = await fetch(`${BASE_URL}/coins/markets?${params.toString()}`);
  return handleResponse<CoinMarket[]>(response);
}

export async function getCoinDetails(id: string): Promise<CoinDetails> {
  const response = await fetch(
    `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
  return handleResponse<CoinDetails>(response);
}

export async function getCoinMarketChart(id: string): Promise<CoinChartPoint[]> {
  const response = await fetch(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`
  );
  const data = await handleResponse<{ prices: CoinChartPoint[] }>(response);
  return data.prices;
}
