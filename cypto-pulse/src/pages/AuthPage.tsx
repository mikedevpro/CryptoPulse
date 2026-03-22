import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { navigateTo } from "../utils/navigation";

export default function AuthPage() {
  const { user, configured, signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitDisabled = busy || loading || !email.trim() || !password.trim();

  const runAuthAction = async (mode: "signin" | "signup") => {
    setBusy(true);
    setMessage("");
    setError("");

    const action = mode === "signin" ? signIn : signUp;
    const result = await action(email.trim(), password);

    if (result.error) {
      setError(result.error);
    } else if (mode === "signup") {
      setMessage(
        "Account created. Check your email for a confirmation link if your Supabase project requires it."
      );
    } else {
      setMessage("Signed in successfully.");
      navigateTo("/");
    }

    setBusy(false);
  };

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Account</p>
        <h1 className="text-3xl font-bold text-white">Sign in or create an account</h1>
        <p className="text-slate-300">
          Guest mode still works. Login is optional but gives each person their own account
          session.
        </p>
      </div>

      {!configured ? (
        <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-amber-200">
          Supabase auth is not configured yet. Add `VITE_SUPABASE_URL` and
          `VITE_SUPABASE_ANON_KEY` to enable login.
        </div>
      ) : null}

      {user ? (
        <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200">
          Logged in as {user.email ?? user.id}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <label className="block text-sm text-slate-300">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-400/60"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-400/60"
            placeholder="At least 6 characters"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={submitDisabled || !configured}
          onClick={() => runAuthAction("signin")}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Working..." : "Sign in"}
        </button>
        <button
          type="button"
          disabled={submitDisabled || !configured}
          onClick={() => runAuthAction("signup")}
          className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Working..." : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => navigateTo("/")}
          className="rounded-xl border border-white/15 bg-transparent px-4 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:text-white"
        >
          Continue as guest
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {message}
        </p>
      ) : null}
    </section>
  );
}
