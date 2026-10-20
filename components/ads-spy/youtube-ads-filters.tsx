"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  SimpleAsyncCategorySelect,
  SimpleAsyncCountrySelect,
  SimpleStaticLanguageSelect,
} from "@/components/simple-async-select";
import { Globe, Languages, Grid3X3, Eye, Calendar, Sparkles } from "lucide-react";

export interface YoutubeAdsFiltersProps {
  country: string;
  setCountry: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  showVideos: string;
  setShowVideos: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
}

export function YoutubeAdsFilters({
  country,
  setCountry,
  language,
  setLanguage,
  category,
  setCategory,
  showVideos,
  setShowVideos,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: YoutubeAdsFiltersProps) {
  // Preset date ranges helper
  const handleDatePreset = (days: number | "all") => {
    if (days === "all") {
      setDateFrom("");
      setDateTo("");
      return;
    }
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - days);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    setDateFrom(formatDate(past));
    setDateTo(formatDate(today));
  };

  // Check if current date matches any preset
  const activePreset = useMemo(() => {
    if (!dateFrom && !dateTo) return "all";
    const todayStr = new Date().toISOString().split("T")[0];
    if (dateTo === todayStr) {
      const today = new Date();
      const from = new Date(dateFrom);
      const diffDays = Math.round((today.getTime() - from.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 7) return 7;
      if (diffDays === 30) return 30;
      if (diffDays === 90) return 90;
    }
    return "custom";
  }, [dateFrom, dateTo]);

  return (
    <div className="space-y-5 text-slate-800">
      {/* Group 1: Nhắm mục tiêu */}
      <div className="space-y-3.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Nhắm mục tiêu (Targeting)
        </div>

        <FilterField label="Quốc gia" icon={<Globe className="w-3.5 h-3.5 text-slate-400" />}>
          <SimpleAsyncCountrySelect
            value={country}
            onValueChange={setCountry}
            className="w-full h-9 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 focus:border-indigo-500 rounded-lg text-xs"
          />
        </FilterField>

        <FilterField label="Ngôn ngữ" icon={<Languages className="w-3.5 h-3.5 text-slate-400" />}>
          <SimpleStaticLanguageSelect
            value={language}
            onValueChange={setLanguage}
            className="w-full h-9 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 focus:border-indigo-500 rounded-lg text-xs"
          />
        </FilterField>

        <FilterField label="Danh mục ngành" icon={<Grid3X3 className="w-3.5 h-3.5 text-slate-400" />}>
          <SimpleAsyncCategorySelect
            value={category}
            onValueChange={setCategory}
            className="w-full h-9 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 focus:border-indigo-500 rounded-lg text-xs"
          />
        </FilterField>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Group 2: Định dạng Video */}
      <div className="space-y-3.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Định dạng Video
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Trạng thái video</span>
            {showVideos === "unlisted" && (
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                Khuyên dùng
              </span>
            )}
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              type="button"
              onClick={() => setShowVideos("unlisted")}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center cursor-pointer ${
                showVideos === "unlisted"
                  ? "bg-white text-indigo-700 font-semibold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Video ẩn
            </button>
            <button
              type="button"
              onClick={() => setShowVideos("all")}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center cursor-pointer ${
                showVideos === "all"
                  ? "bg-white text-indigo-700 font-semibold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setShowVideos("public")}
              className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center cursor-pointer ${
                showVideos === "public"
                  ? "bg-white text-indigo-700 font-semibold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Công khai
            </button>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Group 3: Thời gian chạy quảng cáo */}
      <div className="space-y-3.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Thời gian chạy ads
        </div>

        {/* Quick Date Presets */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleDatePreset(7)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
              activePreset === 7
                ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-2xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            7 ngày
          </button>
          <button
            type="button"
            onClick={() => handleDatePreset(30)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
              activePreset === 30
                ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-2xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            30 ngày
          </button>
          <button
            type="button"
            onClick={() => handleDatePreset(90)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
              activePreset === 90
                ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-2xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            90 ngày
          </button>
          <button
            type="button"
            onClick={() => handleDatePreset("all")}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
              activePreset === "all"
                ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-2xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Tất cả
          </button>
        </div>

        {/* Custom Date Inputs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Từ ngày</span>
            <div className="relative">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-8 px-2 text-xs bg-white border-slate-200 text-slate-800 shadow-2xs focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500 font-medium">Đến ngày</span>
            <div className="relative">
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-8 px-2 text-xs bg-white border-slate-200 text-slate-800 shadow-2xs focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterField({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
        {icon}
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}
