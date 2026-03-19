import AppShell from "../components/layout/AppShell";
import HomePage from "../pages/HomePage";
import CoinDetailsPage from "../pages/CoinDetailsPage";

export function AppRouter() {
  const pathname = window.location.pathname;
  const coinId = pathname.startsWith("/coin/")
    ? pathname.replace("/coin/", "").replace("/", "")
    : "";

  return (
    <AppShell>
      {coinId ? <CoinDetailsPage coinId={coinId} /> : <HomePage />}
    </AppShell>
  );
}
