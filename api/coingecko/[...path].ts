import type { VercelRequest, VercelResponse } from "@vercel/node";

function getPathSegments(pathValue: string | string[] | undefined): string[] {
  if (!pathValue) return [];
  return Array.isArray(pathValue) ? pathValue : [pathValue];
}

function buildQuery(req: VercelRequest): string {
  const params = new URLSearchParams();

  Object.entries(req.query).forEach(([key, value]) => {
    if (key === "path") return;

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
      return;
    }

    if (typeof value === "string") {
      params.append(key, value);
    }
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const pathSegments = getPathSegments(req.query.path as string | string[] | undefined);
  if (pathSegments.length === 0) {
    return res.status(400).json({ error: "Missing CoinGecko path" });
  }

  const upstreamUrl =
    `https://api.coingecko.com/api/v3/${pathSegments.join("/")}` +
    buildQuery(req);

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        accept: "application/json",
        ...(process.env.COINGECKO_API_KEY
          ? { "x-cg-pro-api-key": process.env.COINGECKO_API_KEY }
          : {}),
        ...(process.env.COINGECKO_DEMO_API_KEY
          ? { "x-cg-demo-api-key": process.env.COINGECKO_DEMO_API_KEY }
          : {}),
      },
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error) {
    console.error("CoinGecko proxy error:", error);
    res.status(500).json({ error: "Failed to fetch CoinGecko data" });
  }
}
