import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col justify-between">
      <div className="space-y-3">
        <Skeleton className="aspect-[16/10] w-full rounded-xl" />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
        <Skeleton className="h-5 w-full rounded-md" />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

