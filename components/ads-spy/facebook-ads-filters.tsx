"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  DollarSign,
  Layers,
  Globe,
  Calendar,
  Sparkles,
  Activity,
  Store,
  FileText,
} from "lucide-react";
import { CountrySelect } from "./country-select";

const spends = [
  { value: "VERY_HIGH", label: "Rất cao (Very High)" },
  { value: "HIGH", label: "Cao (High)" },
  { value: "MEDIUM", label: "Trung bình (Medium)" },
  { value: "LOW", label: "Thấp (Low)" },
];

const scalingOptions = [
  { value: "ALL", label: "Tất cả mức độ" },
  { value: "🚀 SCALING HARD", label: "🚀 SCALING HARD (Vít siêu mạnh)" },
  { value: "HIGH", label: "Scaling cao (Vít mạnh)" },
  { value: "MEDIUM", label: "Scaling trung bình" },
  { value: "LOW", label: "Scaling thấp" },
];

export interface FacebookAdsFiltersProps {
  selectedPreset: string;
  setSelectedPreset: (value: string) => void;
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  publicDateFrom: string;
  setPublicDateFrom: (value: string) => void;
  publicDateTo: string;
  setPublicDateTo: (value: string) => void;
  minScore?: string;
  setMinScore?: (value: string) => void;
  maxScore?: string;
  setMaxScore?: (value: string) => void;
  selectedLevel?: string;
  setSelectedLevel?: (value: string) => void;
  selectedSpends: string[];
  setSelectedSpends: (value: string[]) => void;
  minTrendingScore?: string;
  setMinTrendingScore?: (value: string) => void;
  selectedFunnels?: string[];
  setSelectedFunnels?: (value: string[]) => void;
  scalingLevel: string;
  setScalingLevel: (value: string) => void;
  isActive: string;
  setIsActive: (value: string) => void;
  pageName: string;
  setPageName: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  filterStats?: {
    total?: number;
    presets?: Record<string, number>;
  };
}

export function FacebookAdsFilters(props: FacebookAdsFiltersProps) {
  const toggleSpend = (value: string) => {
    if (props.selectedSpends.includes(value)) {
      props.setSelectedSpends(props.selectedSpends.filter((item) => item !== value));
    } else {
      props.setSelectedSpends([...props.selectedSpends, value]);
    }
  };

  const handleDatePreset = (days: number | "all") => {
    if (days === "all") {
      props.setPublicDateFrom("");
      props.setPublicDateTo("");
      return;
    }
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - days);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    props.setPublicDateFrom(formatDate(past));
    props.setPublicDateTo(formatDate(today));
  };

  return (
    <div className="space-y-5 text-slate-800">
      {/* 🚀  PRESETS (Winning Ads Presets) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Chiến lược </span>
          </label>
          {props.selectedPreset && (
            <button
              type="button"
              onClick={() => props.setSelectedPreset("")}
              className="text-[10px] text-indigo-600 hover:underline cursor-pointer"
            >
              Bỏ chọn
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {/* Preset 1: New Ads */}
          <button
            type="button"
            onClick={() => props.setSelectedPreset(props.selectedPreset === "new_ads" ? "" : "new_ads")}
            className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${props.selectedPreset === "new_ads"
              ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-bold shadow-2xs ring-1 ring-indigo-300"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">⚡</span>
              <div>
                <p className="text-xs font-bold leading-tight">Ads mới lên</p>
                <p className="text-[10px] text-slate-500">Chạy 3 - 5 ngày</p>
              </div>
            </div>
          </button>

          {/* Preset 2: Ready to Scale */}
          <button
            type="button"
            onClick={() => props.setSelectedPreset(props.selectedPreset === "ready_to_scale" ? "" : "ready_to_scale")}
            className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${props.selectedPreset === "ready_to_scale"
              ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-2xs ring-1 ring-amber-300"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🚀</span>
              <div>
                <p className="text-xs font-bold leading-tight">Sẵn sàng Scale</p>
                <p className="text-[10px] text-slate-500">Tiềm năng tăng tốc ngân sách</p>
              </div>
            </div>
          </button>

          {/* Preset 3: Weekly Winner */}
          <button
            type="button"
            onClick={() => props.setSelectedPreset(props.selectedPreset === "weekly_winner" ? "" : "weekly_winner")}
            className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${props.selectedPreset === "weekly_winner"
              ? "bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-2xs ring-1 ring-rose-300"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🏆</span>
              <div>
                <p className="text-xs font-bold leading-tight">Weekly Winner</p>
                <p className="text-[10px] text-slate-500">Chạy 7 - 9 ngày</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* 🇻🇳 GROUP 1: QUỐC GIA (ƯU TIÊN VIỆT NAM) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-rose-600" />
            <span>Quốc gia (Ưu tiên Việt Nam)</span>
          </span>
          {props.selectedCountry && (
            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
              {props.selectedCountry}
            </span>
          )}
        </label>
        <CountrySelect
          value={props.selectedCountry}
          onChange={props.setSelectedCountry}
        />
      </div>

      <div className="h-px bg-slate-100" />

      {/* GROUP 2: CẤP ĐỘ CHIẾN DỊCH (LEVEL & SCALING) */}
      <div className="space-y-3.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Cấp độ & Hiệu năng
        </div>

        {/* Trạng thái quảng cáo (Active / Inactive) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Trạng thái quảng cáo</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { val: "", label: "Tất cả" },
              { val: "true", label: "🟢 Đang chạy" },
              { val: "false", label: "⚪ Đã tắt" },
            ].map((st) => (
              <button
                key={st.val}
                type="button"
                onClick={() => props.setIsActive(st.val)}
                className={`py-1.5 px-1 text-xs rounded-lg border transition-all text-center cursor-pointer ${props.isActive === st.val
                  ? "bg-slate-900 border-slate-900 text-white font-bold shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mức độ Scaling */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-500" />
            <span>Mức độ Scaling</span>
          </label>
          <Select
            value={props.scalingLevel || "ALL"}
            onValueChange={(val) => props.setScalingLevel(val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="w-full h-8.5 text-xs bg-white border-slate-200 text-slate-800 shadow-2xs hover:bg-slate-50 rounded-lg">
              <SelectValue placeholder="Tất cả mức độ" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 text-slate-800 shadow-lg text-xs">
              {scalingOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="focus:bg-slate-100 cursor-pointer text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mức chi tiêu ước tính (Spend USD) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mức chi tiêu ước tính</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {spends.map((s) => {
              const active = props.selectedSpends.includes(s.value);
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleSpend(s.value)}
                  className={`py-1 px-2 text-xs rounded-lg border transition-all text-center cursor-pointer ${active
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* GROUP 3: TÌM THEO PAGE / TÊN MIỀN */}
      <div className="space-y-3.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Nguồn Fanpage & Domain
        </div>

        {/* Lọc theo Tên Fanpage */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Tên Fanpage</span>
          </label>
          <Input
            type="text"
            placeholder="Nhập tên Fanpage..."
            value={props.pageName}
            onChange={(e) => props.setPageName(e.target.value)}
            className="h-8 px-2 text-xs bg-white border-slate-200 text-slate-800 shadow-2xs focus-visible:ring-indigo-500 rounded-lg"
          />
        </div>

        {/* Lọc theo Tên miền Domain */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-slate-400" />
            <span>Tên miền (Domain / Web)</span>
          </label>
          <Input
            type="text"
            placeholder="vd: shopee.vn, myshopify.com..."
            value={props.domain}
            onChange={(e) => props.setDomain(e.target.value)}
            className="h-8 px-2 text-xs bg-white border-slate-200 text-slate-800 shadow-2xs focus-visible:ring-indigo-500 rounded-lg"
          />
        </div>

        {/* Quick Date Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Thời gian xuất bản</span>
          </label>
          <div className="flex flex-wrap gap-1">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => handleDatePreset(days)}
                className="px-2 py-0.5 text-xs rounded border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {days}d
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleDatePreset("all")}
              className="px-2 py-0.5 text-xs rounded border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Tất cả
            </button>
          </div>

          {/* Date range inputs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Input
              type="date"
              value={props.publicDateFrom}
              onChange={(e) => props.setPublicDateFrom(e.target.value)}
              className="h-8 px-2 text-xs bg-white border-slate-200 text-slate-800 shadow-2xs focus-visible:ring-indigo-500 rounded-lg"
            />
            <Input
              type="date"
              value={props.publicDateTo}
              onChange={(e) => props.setPublicDateTo(e.target.value)}
              className="h-8 px-2 text-xs bg-white border-slate-200 text-slate-800 shadow-2xs focus-visible:ring-indigo-500 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
