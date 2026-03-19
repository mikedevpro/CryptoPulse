import AppShell from "../components/layout/AppShell";
import HomePage from "../pages/HomePage";
import CoinDetailsPage from "../pages/CoinDetailsPage";
import { useEffect, useState } from "react";

function getCoinIdFromPath(pathname: string) {
  const [pathWithoutQuery] = pathname.split(/[?#]/);
  const normalizedPath = pathWithoutQuery.replace(/\/+$/, "");
  const segments = normalizedPath.split("/").filter(Boolean);
  const coinIndex = segments.lastIndexOf("coin");

  if (coinIndex === -1 || !segments[coinIndex + 1]) return null;

  return decodeURIComponent(segments[coinIndex + 1]);
}

export default function AppRouter() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const coinId = getCoinIdFromPath(path);

  return (
    <AppShell>
      {coinId ? (
        <CoinDetailsPage coinId={coinId} />
      ) : (
        <HomePage
          onSelectCoin={(id) => {
            window.history.pushState({}, "", `/coin/${id}`);
            setPath(`/coin/${id}`);
          }}
        />
      )}
    </AppShell>
  );
}
