export default function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="mt-4 h-8 w-32 rounded bg-white/10" />
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}