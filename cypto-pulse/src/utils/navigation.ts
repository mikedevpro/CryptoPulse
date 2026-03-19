export function navigateTo(pathname: string) {
  if (window.location.pathname === pathname) {
    return;
  }

  window.history.pushState({}, "", pathname);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function navigateToCoin(coinId: string) {
  navigateTo(`/coin/${coinId}`);
}
