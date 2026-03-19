import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import HomePage from "../pages/HomePage";
import CoinDetailsPage from "../pages/CoinDetailsPage";
import WatchlistPage from "../pages/WatchlistPage";

type RouteState =
  | { view: "home" }
  | { view: "watchlist" }
  | { view: "coin"; coinId: string | null };

function resolveRoute(pathname: string): RouteState {
  const segments = pathname.split("?")[0].split("/").filter(Boolean);

  if (segments[0] === "watchlist") {
    return { view: "watchlist" };
  }

  if (segments[0] === "coin") {
    return { view: "coin", coinId: segments[1] ?? null };
  }

  return { view: "home" };
}

export default function AppRouter() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const syncLocation = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, []);

  const route = useMemo(() => resolveRoute(pathname), [pathname]);

  let page: ReactElement;

  if (route.view === "watchlist") {
    page = <WatchlistPage />;
  } else if (route.view === "coin") {
    page = <CoinDetailsPage coinId={route.coinId} />;
  } else {
    page = <HomePage />;
  }

  return <AppShell>{page}</AppShell>;
}
