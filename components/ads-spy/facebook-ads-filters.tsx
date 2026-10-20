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
import { Flame, Zap, DollarSign, Layers, Globe, Calendar, Filter } from "lucide-react";

const levels = [
  { value: "ALL", label: "Tất cả cấp độ" },
  { value: "🔥 WINNER", label: "🔥 WINNER Ads" },
  { value: "⚡ GOOD", label: "⚡ GOOD Ads" },
  { value: "LOW", label: "LOW Ads" },
];

const spends = [
  { value: "LOW", label: "Thấp" },
  { value: "MEDIUM", label: "Trung bình" },
  { value: "HIGH", label: "Cao" },
  { value: "VERY_HIGH", label: "Rất cao" },
];

const funnels = [
  { value: "TOF", label: "TOF (Đầu phễu)" },
  { value: "MOF", label: "MOF (Giữa phễu)" },
  { value: "BOF", label: "BOF (Cuối phễu)" },
];

const scaling = [
  { value: "ALL", label: "Tất cả mức độ" },
  { value: "HIGH", label: "Scaling cao (Vít mạnh)" },
  { value: "MEDIUM", label: "Scaling trung bình" },
  { value: "LOW", label: "Scaling thấp" },
];

const popularCountries = ["VN", "US", "TH", "PH", "GLOBAL"];

export interface FacebookAdsFiltersProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  publicDateFrom: string;
  setPublicDateFrom: (value: string) => void;
  publicDateTo: string;
  setPublicDateTo: (value: string) => void;
  minScore: string;
  setMinScore: (value: string) => void;
  maxScore: string;
  setMaxScore: (value: string) => void;
  selectedLevel: string;
  setSelectedLevel: (value: string) => void;
  selectedSpends: string[];
  setSelectedSpends: (value: string[]) => void;
  minTrendingScore: string;
  setMinTrendingScore: (value: string) => void;
  selectedFunnels: string[];
  setSelectedFunnels: (value: string[]) => void;
  scalingLevel: string;
  setScalingLevel: (value: string) => void;
}

export function FacebookAdsFilters(props: FacebookAdsFiltersProps) {
  const toggleSpend = (value: string) => {
    if (props.selectedSpends.includes(value)) {
      props.setSelectedSpends(props.selectedSpends.filter((item) => item !== value));
    } else {
      props.setSelectedSpends([...props.selectedSpends, value]);
    }
  };

  const toggleFunnel = (value: string) => {
    if (props.selectedFunnels.includes(value)) {
      props.setSelectedFunnels(props.selectedFunnels.filter((item) => item !== value));
    } else {
      props.setSelectedFunnels([...props.selectedFunnels, value]);
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
      {/* Group 1: Nhắm mục tiêu & Cấp độ Ads */}
      <div className="space-y-3.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Cốt lõi & Cấp độ Ads
        </div>

        {/* Cấp độ Ads (Winner / Good) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Phân loại Winning Ads</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => props.setSelectedLevel(props.selectedLevel === "🔥 WINNER" ? "" : "🔥 WINNER")}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                props.selectedLevel === "🔥 WINNER"
                  ? "bg-rose-50 border-rose-300 text-rose-700 font-bold shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              🔥 WINNER Ads
            </button>
            <button
              type="button"
              onClick={() => props.setSelectedLevel(props.selectedLevel === "⚡ GOOD" ? "" : "⚡ GOOD")}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                props.selectedLevel === "⚡ GOOD"
                  ? "bg-amber-50 border-amber-300 text-amber-700 font-bold shadow-2xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              ⚡ GOOD Ads
            </button>
          </div>
        </div>

        {/* Quốc gia / Nền tảng */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Quốc gia / Nền tảng</span>
            </span>
            <div className="flex gap-1">
              {popularCountries.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => props.setSelectedCountry(c === "GLOBAL" ? "" : c)}
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                    props.selectedCountry === c || (!props.selectedCountry && c === "GLOBAL")
                      ? "bg-indigo-100 text-indigo-700 font-bold"
                      : "bg-slate-100 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </label>
          <Input
            type="text"
            placeholder="Nhập mã quốc gia (VN, US, TH...)"
            value={props.selectedCountry}
            onChange={(e) => props.setSelectedCountry(e.target.value)}
            className="h-8.5 text-xs bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 rounded-lg shadow-2xs"
          />
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Group 2: Hiệu suất & Scaling */}
      <div className="space-y-3.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Hiệu suất & Scaling
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
              {scaling.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="focus:bg-slate-100 cursor-pointer text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mức chi tiêu ước tính (Multi-select pills) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mức chi tiêu (Spend)</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {spends.map((s) => {
              const active = props.selectedSpends.includes(s.value);
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleSpend(s.value)}
                  className={`py-1 px-2 text-xs rounded-lg border transition-all text-center cursor-pointer ${
                    active
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

        {/* Điểm số (Score Min - Max) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Điểm đánh giá (Min - Max)</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Tối thiểu: 7"
              value={props.minScore}
              onChange={(e) => props.setMinScore(e.target.value)}
              className="h-8 px-2 text-xs bg-white border-slate-200 text-slate-800 shadow-2xs focus-visible:ring-indigo-500 rounded-lg"
            />
            <Input
              type="number"
              placeholder="Tối đa: 50"
              value={props.maxScore}
              onChange={(e) => props.setMaxScore(e.target.value)}
              className="h-8 px-2 text-xs bg-white border-slate-200 text-slate-800 shadow-2xs focus-visible:ring-indigo-500 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Group 3: Phễu Marketing & Ngày chạy */}
      <div className="space-y-3.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Phễu & Thời gian chạy
        </div>

        {/* Phễu Marketing */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Phễu Marketing (Funnel)</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {funnels.map((f) => {
              const active = props.selectedFunnels.includes(f.value);
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => toggleFunnel(f.value)}
                  className={`py-1 px-1.5 text-[11px] rounded-lg border transition-all text-center cursor-pointer ${
                    active
                      ? "bg-purple-50 border-purple-300 text-purple-700 font-semibold shadow-2xs"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {f.value}
                </button>
              );
            })}
          </div>
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
