import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import HomePage from "../pages/HomePage";
import CoinDetailsPage from "../pages/CoinDetailsPage";
import WatchlistPage from "../pages/WatchlistPage";
import AuthPage from "../pages/AuthPage";
import { useAuth } from "../auth/AuthProvider";

type RouteState =
  | { view: "home" }
  | { view: "watchlist" }
  | { view: "coin"; coinId: string | null }
  | { view: "auth" };

function resolveRoute(pathname: string): RouteState {
  const segments = pathname.split("?")[0].split("/").filter(Boolean);

  if (segments[0] === "watchlist") {
    return { view: "watchlist" };
  }

  if (segments[0] === "coin") {
    return { view: "coin", coinId: segments[1] ?? null };
  }

  if (segments[0] === "auth") {
    return { view: "auth" };
  }

  return { view: "home" };
}

export default function AppRouter() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const { configured } = useAuth();

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
  } else if (route.view === "auth") {
    page = configured ? <AuthPage /> : <HomePage />;
  } else {
    page = <HomePage />;
  }

  return <AppShell>{page}</AppShell>;
}
