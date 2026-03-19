import type { CoinChartPoint } from "../../types/crypto";
import { formatCurrency } from "../../utils/formatters";

type PriceChartProps = {
  data: CoinChartPoint[];
};

function normalizeToWidth(values: number[], width: number) {
  if (values.length <= 1) {
    return values.map((_, index) => (index / Math.max(values.length - 1, 1)) * width);
  }

  return values.map((_, index) => (index / (values.length - 1)) * width);
}

export default function PriceChart({ data }: PriceChartProps) {
  if (!data.length) {
    return null;
  }

  const points = data
    .map(([, price]) => Number(price))
    .filter((value) => Number.isFinite(value));

  if (!points.length) {
    return null;
  }

  const width = 1000;
  const height = 280;
  const padding = 20;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);

  const xScale = normalizeToWidth(points, width - padding * 2);
  const yScale = points.map((value) => {
    return height - padding - ((value - min) / range) * (height - padding * 2);
  });

  const path = points
    .map((_, index) => `${index === 0 ? "M" : "L"}${xScale[index]} ${yScale[index]}`)
    .join(" ");

  const latest = points[points.length - 1];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">7-Day Price Trend</h2>
        <p className="text-sm text-slate-400">Daily closing price movement in USD</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-80 w-full"
          role="img"
          aria-label="7 day coin price chart"
        >
          <defs>
            <linearGradient id="chartLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#334155"
          />

          <path
            d={`${path}`}
            fill="none"
            stroke="#34d399"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text
            x={padding}
            y={24}
            fill="#cbd5e1"
            fontSize="26"
            className="font-semibold"
          >
            {formatCurrency(latest)}
          </text>
        </svg>
      </div>
    </div>
  );
}
