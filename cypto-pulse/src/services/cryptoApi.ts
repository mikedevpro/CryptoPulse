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
  details?: string;

  constructor(
    message: string,
    status: number,
    retryAfter: number | null = null,
    details?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
    this.details = details;
  }
}

type GetMarketsParams = {
  page?: number;
  perPage?: number;
  order?: SortOption;
  coinIds?: string[];
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  const retryHeader = response.headers.get("retry-after");
  const retryAfter = retryHeader ? Number.parseInt(retryHeader, 10) : null;

  let details = "";
  try {
    details = await response.text();
  } catch {
    details = "";
  }

  console.error("Crypto API request failed:", {
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    details,
  });

  if (response.status === 429) {
    throw new ApiError(
      "CoinGecko rate limit reached. Please wait before refreshing again.",
      response.status,
      Number.isNaN(retryAfter) ? null : retryAfter,
      details
    );
  }

  if (response.status === 403) {
    throw new ApiError(
      "Access to CoinGecko was denied. Please try again later.",
      response.status,
      Number.isNaN(retryAfter) ? null : retryAfter,
      details
    );
  }

  throw new ApiError(
    `Request failed with status ${response.status}.`,
    response.status,
    Number.isNaN(retryAfter) ? null : retryAfter,
    details
  );
}

export async function getMarkets({
  page = 1,
  perPage = 25,
  order = "market_cap_desc",
  coinIds,
}: GetMarketsParams = {}): Promise<CoinMarket[]> {
  const idsParam = coinIds?.filter(Boolean).join(",");
  const params = new URLSearchParams({
    vs_currency: "usd",
    order,
    page: String(page),
    sparkline: "true",
    price_change_percentage: "24h",
    per_page: String(perPage),
  });

  if (idsParam) {
    params.set("ids", idsParam);
  }

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