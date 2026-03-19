import AppShell from "../components/layout/AppShell";
import HomePage from "../pages/HomePage";
import CoinDetailsPage from "../pages/CoinDetailsPage";
import { useEffect, useState } from "react";

function getCoinIdFromPath(pathname: string) {
  const [pathWithoutQuery] = pathname.split(/[?#]/);
  const normalizedPath = pathWithoutQuery.replace(/\/+$/, "");
  const segments = normalizedPath.split("/").filter(Boolean);

  if (segments[0] !== "coin" || !segments[1]) return null;

  try {
    return decodeURIComponent(segments[1]);
  } catch {
    return null;
  }
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
        <HomePage />
      )}
    </AppShell>
  );
}
