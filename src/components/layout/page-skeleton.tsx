/** Placeholder shown for an instant moment while a detail page's data resolves. */
export function PageSkeleton() {
  return (
    <main id="main" aria-busy="true" aria-label="Loading page">
      <div className="border-b bg-soft/60">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="h-4 w-48 animate-pulse rounded-full bg-muted" />
          <div className="mt-6 h-12 w-2/3 max-w-xl animate-pulse rounded-2xl bg-muted" />
          <div className="mt-4 h-5 w-1/2 max-w-md animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-card border bg-card" />
          ))}
        </div>
      </div>
    </main>
  );
}
