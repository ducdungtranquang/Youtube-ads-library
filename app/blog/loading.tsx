export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-10">
      <div className="mb-8 h-36 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
