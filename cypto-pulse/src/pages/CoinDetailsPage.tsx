interface CoinDetailsPageProps {
  coinId: string;
}

export default function CoinDetailsPage({ coinId }: CoinDetailsPageProps) {
  const id = coinId || "coin";

  return (
    <section className="space-y-4">
      <a href="/" className="text-emerald-400 hover:underline">
        ← Back to dashboard
      </a>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-bold text-white">{id}</h1>
        <p className="mt-2 text-slate-300">
          Coin details page coming next. We’ll add profile data, price stats, and
          a 7-day chart here.
        </p>
      </div>
    </section>
  );
}
