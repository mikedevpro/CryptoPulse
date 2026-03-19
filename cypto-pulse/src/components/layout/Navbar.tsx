import { navigateTo } from "../../utils/navigation";

export default function Navbar() {
  const isWatchlist = window.location.pathname === "/watchlist";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigateTo("/")}
          className="text-xl font-bold tracking-tight text-white"
        >
          Crypto<span className="text-emerald-400">Pulse</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo("/")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              !isWatchlist
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
            }`}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/watchlist")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              isWatchlist
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
            }`}
          >
            Watchlist
          </button>
        </div>
      </div>
    </header>
  );
}
