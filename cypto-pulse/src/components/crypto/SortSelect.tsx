import type { SortOption } from "../../types/crypto";

type SortSelectProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
    >
      <option value="market_cap_desc">Market Cap ↓</option>
      <option value="market_cap_asc">Market Cap ↑</option>
      <option value="volume_desc">Volume ↓</option>
      <option value="volume_asc">Volume ↑</option>
    </select>
  );
}