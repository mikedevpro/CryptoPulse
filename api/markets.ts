import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const page = req.query.page ?? "1";
    const perPage = req.query.per_page ?? "20";

    const url =
      `https://api.coingecko.com/api/v3/coins/markets` +
      `?vs_currency=usd` +
      `&order=market_cap_desc` +
      `&per_page=${perPage}` +
      `&page=${page}` +
      `&sparkline=false` +
      `&price_change_percentage=24h`;

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        // Add this only if you have a key:
        // "x-cg-pro-api-key": process.env.COINGECKO_API_KEY ?? "",
      },
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("CoinGecko error:", response.status, text);
      return res.status(response.status).json({
        error: "CoinGecko request failed",
        status: response.status,
        details: text,
      });
    }

    return res.status(200).send(text);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
