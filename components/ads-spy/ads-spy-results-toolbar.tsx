import { SlidersHorizontal } from "lucide-react";

export function AdsSpyResultsToolbar({ title, count, children }: { title: string; count?: number; children?: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3">
    <div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary"><SlidersHorizontal className="size-3.5" />Ads library</p><h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">{title}</h2></div>
    <div className="flex items-center gap-3 text-sm text-muted-foreground">{typeof count === "number" && <span>{count.toLocaleString("vi-VN")} kết quả</span>}{children}</div>
  </div>;
}
