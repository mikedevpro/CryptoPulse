import { navigateTo } from "../../utils/navigation";
import { useLocalProfile } from "../../hooks/useLocalProfile";
import { useAuth } from "../../auth/AuthProvider";
import { useState } from "react";

export default function Navbar() {
  const isWatchlist = window.location.pathname === "/watchlist";
  const isAuthPage = window.location.pathname === "/auth";
  const { profiles, currentProfileId, switchProfile, createProfile } = useLocalProfile();
  const { user, signOut, loading: authLoading, configured } = useAuth();
  const [signOutBusy, setSignOutBusy] = useState(false);

  const handleCreateProfile = () => {
    const name = window.prompt("Enter a profile name");
    if (!name) {
      return;
    }
    createProfile(name);
  };

  const handleSignOut = async () => {
    setSignOutBusy(true);
    const result = await signOut();
    if (result.error) {
      window.alert(result.error);
    } else {
      navigateTo("/");
    }
    setSignOutBusy(false);
  };

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
          {!user ? (
            <>
              <label className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 md:flex">
                Profile
                <select
                  className="rounded-md border border-white/15 bg-slate-900 px-2 py-1 text-xs text-white"
                  value={currentProfileId}
                  onChange={(event) => switchProfile(event.target.value)}
                  aria-label="Select profile"
                >
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={handleCreateProfile}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:border-white/20 hover:text-white"
              >
                New Profile
              </button>
            </>
          ) : (
            <p className="hidden rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 md:block">
              {user.email ?? "Logged in"}
            </p>
          )}

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

          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signOutBusy || authLoading}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signOutBusy ? "Signing out..." : "Sign out"}
            </button>
          ) : configured ? (
            <button
              type="button"
              onClick={() => navigateTo("/auth")}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isAuthPage
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              Sign in
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
