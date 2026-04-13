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
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateTo("/")}
            className="text-lg font-bold tracking-tight text-white sm:text-xl"
          >
            Crypto<span className="text-emerald-400">Pulse</span>
          </button>

          {user ? (
            <p className="max-w-[11rem] truncate rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200 sm:max-w-[18rem] sm:text-xs">
              {user.email ?? "Logged in"}
            </p>
          ) : null}
        </div>

        <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          {!user ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
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
            </div>
          ) : (
            <div className="hidden sm:block" aria-hidden="true" />
          )}

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
            <button
              type="button"
              onClick={() => navigateTo("/")}
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
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
              className={`inline-flex min-h-10 items-center justify-center rounded-full border px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${
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
                className="col-span-2 inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1 sm:px-4 sm:text-sm"
              >
                {signOutBusy ? "Signing out..." : "Sign out"}
              </button>
            ) : configured ? (
              <button
                type="button"
                onClick={() => navigateTo("/auth")}
                className={`col-span-2 inline-flex min-h-10 items-center justify-center rounded-full border px-3 py-2 text-xs transition sm:col-span-1 sm:px-4 sm:text-sm ${
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
      </div>
    </header>
  );
}
