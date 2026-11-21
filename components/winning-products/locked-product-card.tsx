"use client";

import { Lock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LockedProductSkeletonCardProps {
  index: number;
  onUpgrade: () => void;
}

export function LockedProductSkeletonCard({
  index,
  onUpgrade,
}: LockedProductSkeletonCardProps) {
  return (
    <Card
      onClick={onUpgrade}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white/95 p-3.5 sm:p-4 shadow-xs hover:border-indigo-400 hover:shadow-lg transition-all duration-300 cursor-pointer select-none"
    >
      {/* 🔒 Center Locked Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[2.5px] p-4 text-center group-hover:bg-slate-900/20 transition-all">
        <div className="h-12 w-12 rounded-2xl bg-white shadow-lg border border-slate-200/90 flex items-center justify-center text-amber-500 mb-2.5 group-hover:scale-110 group-hover:text-indigo-600 group-hover:shadow-indigo-500/20 transition-all">
          <Lock className="h-6 w-6" />
        </div>

        <p className="text-xs font-bold text-slate-900 mb-0.5">
          Sản phẩm chiến thắng #{index + 1}
        </p>

        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white shadow-xs group-hover:bg-indigo-700 group-hover:scale-105 transition-all">
          <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300" />
          <span>Bấm mở khóa gói Unlimited</span>
        </span>
      </div>

      {/* 🌫 Simulated Blurred Skeleton Layers */}
      <div className="space-y-3 opacity-35 filter blur-[0.8px] pointer-events-none">
        {/* Media Skeleton */}
        <div className="relative aspect-[16/10] w-full rounded-xl bg-slate-200 animate-pulse flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-slate-300/80" />
        </div>

        {/* Page / Brand Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-14 bg-slate-200 rounded-full animate-pulse" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-1.5">
          <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Price Skeleton */}
        <div className="h-8 w-full bg-slate-100 rounded-xl" />

        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="h-10 bg-amber-50/70 rounded-xl" />
          <div className="h-10 bg-indigo-50/70 rounded-xl" />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 opacity-60">
        <span className="text-[11px] font-semibold text-slate-400">
          Chỉ dành cho Unlimited
        </span>
        <span className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
          <Lock className="h-3.5 w-3.5" />
        </span>
      </div>
    </Card>
  );
}
