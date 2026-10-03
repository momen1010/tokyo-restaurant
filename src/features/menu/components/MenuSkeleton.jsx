export default function MenuSkeleton() {
    return (
      <div className="container-page space-y-8 py-10" role="status" aria-label="جاري تحميل المنيو">
        <div className="h-8 w-40 animate-pulse rounded bg-coal-soft" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-coal-line bg-coal">
              <div className="aspect-[4/3] animate-pulse bg-coal-soft" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-coal-soft" />
                <div className="h-4 w-full animate-pulse rounded bg-coal-soft" />
                <div className="h-12 w-full animate-pulse rounded bg-coal-soft" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }