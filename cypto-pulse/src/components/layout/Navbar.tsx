import type { MouseEvent } from "react";
import { navigateTo } from "../../utils/navigation";

export default function Navbar() {
  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateTo("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" onClick={goHome} className="text-xl font-bold tracking-tight text-white">
          Crypto<span className="text-emerald-400">Pulse</span>
        </a>

        <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 sm:block">
          Live market dashboard
        </div>
      </div>
    </header>
  );
}
