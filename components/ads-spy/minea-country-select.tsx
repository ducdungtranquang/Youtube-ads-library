"use client";

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Globe, Search, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export interface CountryItem {
  code: string;
  name: string;
  enName: string;
  flag: string;
}

export const COUNTRIES: CountryItem[] = [
  // ⭐ Ưu tiên hàng đầu (Việt Nam)
  { code: "VN", name: "Việt Nam", enName: "Vietnam", flag: "🇻🇳" },
  // Các thị trường chính phổ biến
  { code: "US", name: "Hoa Kỳ", enName: "United States", flag: "🇺🇸" },
  { code: "TH", name: "Thái Lan", enName: "Thailand", flag: "🇹🇭" },
  { code: "PH", name: "Philippines", enName: "Philippines", flag: "🇵🇭" },
  { code: "MY", name: "Malaysia", enName: "Malaysia", flag: "🇲🇾" },
  { code: "ID", name: "Indonesia", enName: "Indonesia", flag: "🇮🇩" },
  { code: "SG", name: "Singapore", enName: "Singapore", flag: "🇸🇬" },
  { code: "GB", name: "Vương quốc Anh", enName: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Úc", enName: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", enName: "Canada", flag: "🇨🇦" },
  { code: "DE", name: "Đức", enName: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "Pháp", enName: "France", flag: "🇫🇷" },
  { code: "JP", name: "Nhật Bản", enName: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "Hàn Quốc", enName: "South Korea", flag: "🇰🇷" },
  { code: "TW", name: "Đài Loan", enName: "Taiwan", flag: "🇹🇼" },
  { code: "IN", name: "Ấn Độ", enName: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", enName: "Brazil", flag: "🇧🇷" },
  { code: "IT", name: "Ý", enName: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Tây Ban Nha", enName: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Hà Lan", enName: "Netherlands", flag: "🇳🇱" },
  { code: "PL", name: "Ba Lan", enName: "Poland", flag: "🇵🇱" },
  { code: "SE", name: "Thụy Điển", enName: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Na Uy", enName: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Đan Mạch", enName: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Phần Lan", enName: "Finland", flag: "🇫🇮" },
  { code: "MX", name: "Mexico", enName: "Mexico", flag: "🇲🇽" },
  { code: "AE", name: "Các TVQ Ả Rập (UAE)", enName: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Ả Rập Xê Út", enName: "Saudi Arabia", flag: "🇸🇦" },
  { code: "ZA", name: "Nam Phi", enName: "South Africa", flag: "🇿🇦" },
  { code: "NZ", name: "New Zealand", enName: "New Zealand", flag: "🇳🇿" },
];

export const POPULAR_PRESET_COUNTRIES = [
  { code: "VN", label: "Việt Nam", flag: "🇻🇳", isPriority: true },
  { code: "US", label: "Hoa Kỳ", flag: "🇺🇸" },
  { code: "TH", label: "Thái Lan", flag: "🇹🇭" },
  { code: "PH", label: "Philippines", flag: "🇵🇭" },
  { code: "MY", label: "Malaysia", flag: "🇲🇾" },
];

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CountrySelect({ value, onChange, className }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedCountry = useMemo(() => {
    if (!value) return null;
    return COUNTRIES.find((c) => c.code.toUpperCase() === value.toUpperCase()) || {
      code: value.toUpperCase(),
      name: value.toUpperCase(),
      enName: value.toUpperCase(),
      flag: "🌐",
    };
  }, [value]);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return COUNTRIES;
    const q = search.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.enName.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* 🇻🇳 Hàng nút chọn nhanh ưu tiên (Quick Pills) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange("")}
          className={cn(
            "h-7 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer border",
            !value
              ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Globe className="h-3 w-3" />
          <span>Tất cả</span>
        </button>

        {POPULAR_PRESET_COUNTRIES.map((item) => {
          const isActive = value.toUpperCase() === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => onChange(isActive ? "" : item.code)}
              className={cn(
                "h-7 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border",
                item.isPriority
                  ? isActive
                    ? "bg-rose-600 text-white border-rose-600 shadow-2xs ring-2 ring-rose-200"
                    : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-bold"
                  : isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span>{item.flag}</span>
              <span>{item.label}</span>
              {item.isPriority && !isActive && (
                <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-rose-200/60 text-rose-800 font-black">
                  Top
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Popover Combobox tìm kiếm quốc gia chi tiết */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9 px-3 text-xs bg-white border-slate-200 hover:bg-slate-50 text-slate-800 rounded-lg shadow-2xs font-normal"
          >
            <div className="flex items-center gap-2 truncate">
              {selectedCountry ? (
                <>
                  <span className="text-base leading-none">{selectedCountry.flag}</span>
                  <span className="font-semibold text-slate-900">{selectedCountry.name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">({selectedCountry.code})</span>
                </>
              ) : (
                <>
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-slate-500">Tất cả quốc gia (Toàn cầu)...</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              {value && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="hover:text-slate-700 p-0.5 rounded cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] sm:w-[320px] p-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Tìm quốc gia (VN, Việt Nam, US...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="max-h-[260px] overflow-y-auto p-1 text-xs">
            {/* Lựa chọn toàn cầu */}
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer",
                !value ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:bg-slate-50 text-slate-700"
              )}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-600" />
                <span>Tất cả quốc gia (Toàn cầu)</span>
              </div>
              {!value && <Check className="h-4 w-4 text-indigo-600" />}
            </button>

            {/* Mục Việt Nam luôn được ghim ở đầu (Ưu tiên) */}
            <div className="my-1 border-t border-slate-100" />
            <div className="px-2.5 py-1 text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
              <Star className="h-3 w-3 fill-rose-500 text-rose-500" />
              Ưu tiên hàng đầu (Việt Nam)
            </div>
            {COUNTRIES.filter((c) => c.code === "VN").map((country) => {
              const isSelected = value.toUpperCase() === country.code;
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onChange(country.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer",
                    isSelected
                      ? "bg-rose-50 text-rose-800 font-bold"
                      : "hover:bg-rose-50/50 text-slate-800 font-medium"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base leading-none">{country.flag}</span>
                    <span className="font-bold text-slate-900">{country.name}</span>
                    <span className="text-[11px] text-slate-500">({country.enName})</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-mono font-bold">
                      {country.code}
                    </span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-rose-600" />}
                </button>
              );
            })}

            {/* Các quốc gia khác */}
            <div className="my-1 border-t border-slate-100" />
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Thị trường quốc tế ({filteredCountries.filter((c) => c.code !== "VN").length})
            </div>

            {filteredCountries
              .filter((c) => c.code !== "VN")
              .map((country) => {
                const isSelected = value.toUpperCase() === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer",
                      isSelected
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base leading-none">{country.flag}</span>
                      <span className="text-slate-900 font-medium">{country.name}</span>
                      <span className="text-[11px] text-slate-400 truncate">({country.enName})</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{country.code}]</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                  </button>
                );
              })}

            {filteredCountries.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                Không tìm thấy quốc gia &quot;{search}&quot;
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
export const MineaCountrySelect = CountrySelect;
export type MineaCountrySelectProps = CountrySelectProps;
