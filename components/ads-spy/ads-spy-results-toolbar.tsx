"use client";

import { X, Sparkles, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ActiveFilterChip {
  id: string;
  label: string;
  onRemove: () => void;
}

interface AdsSpyResultsToolbarProps {
  title: string;
  subtitle?: string;
  count?: number;
  activeChips?: ActiveFilterChip[];
  onClearAll?: () => void;
  children?: React.ReactNode;
}

export function AdsSpyResultsToolbar({
  title,
  subtitle,
  count,
  activeChips = [],
  onClearAll,
  children,
}: AdsSpyResultsToolbarProps) {
  return (
    <div className="space-y-3 mb-5">
      {/* Top Title & Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
            {typeof count === "number" && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-mono text-xs px-2.5 py-0.5 border border-slate-200">
                {count.toLocaleString("vi-VN")} kết quả
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right side controls (e.g. sorting dropdowns) */}
        {children && (
          <div className="flex items-center gap-2.5">{children}</div>
        )}
      </div>

      {/* Active Filter Chips Bar */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-indigo-600" />
            Đang lọc:
          </span>

          {activeChips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                className="hover:bg-slate-100 p-0.5 rounded-full text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                aria-label={`Xóa bộ lọc ${chip.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {onClearAll && activeChips.length > 1 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium ml-1.5 hover:underline cursor-pointer"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      )}
    </div>
  );
}
