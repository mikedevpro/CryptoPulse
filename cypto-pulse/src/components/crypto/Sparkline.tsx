type Point = {
  x: number;
  y: number;
};

type SparklineProps = {
  prices: number[];
  positive: boolean;
};

export default function Sparkline({ prices, positive }: SparklineProps) {
  const data = prices.map((price, index) => ({
    index,
    price,
  }));

  if (data.length === 0) {
    return <span className="text-slate-500">—</span>;
  }

  const width = 112;
  const height = 48;
  const padding = 4;

  const values = data.map((item) => item.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const points: Point[] = data.map((item) => ({
    x:
      data.length === 1
        ? width / 2
        : (item.index / Math.max(data.length - 1, 1)) * (width - padding * 2) + padding,
    y:
      height -
      padding -
      ((item.price - min) / range) * (height - padding * 2),
  }));

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="h-12 w-28">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          d={path}
          fill="none"
          stroke={positive ? "#34d399" : "#f87171"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
