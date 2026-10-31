"use client";

import { Sparkles, Zap, Flame, Trophy, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PresetTabsProps {
  currentPreset: string;
  onSelectPreset: (preset: string) => void;
  stats?: {
    total?: number;
    presets?: {
      new_ads?: number;
      ready_to_scale?: number;
      weekly_winner?: number;
    };
  };
  className?: string;
}

export type MineaPresetTabsProps = PresetTabsProps;

export function PresetTabs({
  currentPreset,
  onSelectPreset,
  stats,
  className,
}: PresetTabsProps) {
  const tabs = [
    {
      id: "",
      label: "Tất cả Ads",
      sublabel: "Toàn bộ dữ liệu",
      icon: Layers,
      count: stats?.total,
      badgeColor: "bg-slate-100 text-slate-700",
      activeColor: "bg-slate-900 text-white border-slate-900 shadow-sm",
    },
    {
      id: "new_ads",
      label: "Ads mới lên",
      sublabel: "Chạy ≤ 3 ngày",
      icon: Zap,
      count: stats?.presets?.new_ads,
      badgeColor: "bg-indigo-100 text-indigo-700",
      activeColor: "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200",
    },
    {
      id: "ready_to_scale",
      label: "Sẵn sàng Scale",
      sublabel: "Đang nhân nhóm vít",
      icon: Flame,
      count: stats?.presets?.ready_to_scale,
      badgeColor: "bg-amber-100 text-amber-800",
      activeColor: "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-200",
    },
    {
      id: "weekly_winner",
      label: "Weekly Winner",
      sublabel: "Sản phẩm Thắng tuần",
      icon: Trophy,
      count: stats?.presets?.weekly_winner,
      badgeColor: "bg-rose-100 text-rose-800",
      activeColor: "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200",
    },
  ];

  return (
    <div className={cn("w-full overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden", className)}>
      <div className="flex items-center gap-2 min-w-max p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPreset === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectPreset(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
                isActive
                  ? tab.activeColor
                  : "bg-white text-slate-700 border-slate-200/70 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500")} />
              <div className="text-left">
                <span className="block leading-none font-bold">{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] block mt-0.5 leading-none",
                    isActive ? "text-white/80" : "text-slate-400"
                  )}
                >
                  {tab.sublabel}
                </span>
              </div>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                    isActive ? "bg-white/20 text-white" : tab.badgeColor
                  )}
                >
                  {tab.count.toLocaleString("vi-VN")}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export const MineaPresetTabs = PresetTabs;
