import type { MouseEvent } from "react";

type FavoriteButtonProps = {
  isActive: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function FavoriteButton({
  isActive,
  onClick,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
      title={isActive ? "Remove from favorites" : "Add to favorites"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
        isActive
          ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
      }`}
    >
      <span className="text-lg leading-none">{isActive ? "★" : "☆"}</span>
    </button>
  );
}
