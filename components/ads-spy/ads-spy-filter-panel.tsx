"use client";

import { ReactNode, useState } from "react";
import { SlidersHorizontal, RotateCcw, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface AdsSpyFilterPanelProps {
  title?: string;
  activeCount?: number;
  children: ReactNode;
  onClear?: () => void;
  className?: string;
}

export function AdsSpyFilterPanel({
  title = "Bộ lọc tìm kiếm",
  activeCount = 0,
  children,
  onClear,
  className = "",
}: AdsSpyFilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sticky Sidebar (Pure White Theme) */}
      <aside className={`hidden lg:block w-full ${className}`}>
        <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-5 text-slate-900 transition-all">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/80">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </div>
              <h3 className="font-bold text-sm tracking-tight text-slate-900">{title}</h3>
              {activeCount > 0 && (
                <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px] font-semibold px-2 py-0 h-5">
                  {activeCount}
                </Badge>
              )}
            </div>

            {onClear && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-7 px-2 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Đặt lại
              </Button>
            )}
          </div>

          {/* Filter Body Controls */}
          <div className="space-y-4">{children}</div>
        </div>
      </aside>

      {/* Mobile / Tablet Filter Button & Sheet */}
      <div className="lg:hidden w-full mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setMobileOpen(true)}
          className="w-full h-11 justify-between bg-white border-slate-200 text-slate-800 shadow-sm hover:bg-slate-50 hover:text-slate-900 rounded-xl px-4 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
            <span className="font-medium text-sm">{title}</span>
          </div>
          {activeCount > 0 ? (
            <Badge className="bg-indigo-600 text-white text-xs px-2 py-0.5 font-bold">
              {activeCount} đang áp dụng
            </Badge>
          ) : (
            <span className="text-xs text-slate-400">Tùy chỉnh</span>
          )}
        </Button>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[88vw] max-w-md p-0 flex flex-col bg-white text-slate-900 border-r border-slate-200">
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 pr-14 min-h-[56px]">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/80 shrink-0">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </div>
                <SheetTitle className="text-sm font-bold text-slate-900 truncate">{title}</SheetTitle>
                {activeCount > 0 && (
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px] font-semibold px-1.5 py-0 shrink-0">
                    {activeCount}
                  </Badge>
                )}
              </div>
              {onClear && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClear}
                  className="h-7 px-2 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Đặt lại
                </Button>
              )}
            </div>

            {/* Sheet Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {children}
            </div>

            {/* Sheet Sticky Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center gap-2">
              {onClear && activeCount > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClear}
                  className="h-10 px-3.5 bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer shrink-0 text-xs font-semibold"
                  title="Đặt lại tất cả bộ lọc"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Đặt lại
                </Button>
              )}
              <Button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-10 shadow-sm cursor-pointer"
              >
                <Check className="h-4 w-4 mr-1.5" />
                Xem kết quả {activeCount > 0 ? `(${activeCount} bộ lọc)` : ""}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
