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
  { code: "VN", name: "Việt Nam", enName: "Vietnam", flag: "🇻🇳" },
  { code: "OTHER", name: "Các nước khác", enName: "Other countries", flag: "🌐" },
];

export const POPULAR_PRESET_COUNTRIES = [
  { code: "VN", label: "Việt Nam", flag: "🇻🇳", isPriority: true },
  { code: "OTHER", label: "Các nước khác", flag: "🌐" },
];

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CountrySelect({ value, onChange, className }: CountrySelectProps) {
  const [open, setOpen] = useState(false);

  const selectedCountry = useMemo(() => {
    if (!value) return null;
    const upper = value.toUpperCase();
    if (upper === "VN") {
      return { code: "VN", name: "Việt Nam", enName: "Vietnam", flag: "🇻🇳" };
    }
    if (upper === "OTHER") {
      return { code: "OTHER", name: "Các nước khác", enName: "Other countries", flag: "🌐" };
    }
    return {
      code: upper,
      name: upper,
      enName: upper,
      flag: "🌐",
    };
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* 🇻🇳 Hàng nút chọn nhanh: Tất cả / Việt Nam / Các nước khác */}
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
            </button>
          );
        })}
      </div>

      {/* Popover Dropdown lựa chọn quốc gia (Chỉ gồm Việt Nam & Các nước khác) */}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="hover:text-slate-700 p-0.5 rounded cursor-pointer"
                  title="Bỏ chọn quốc gia"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] p-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-xs">
          {/* Lựa chọn toàn cầu */}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer",
              !value ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:bg-slate-50 text-slate-700"
            )}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-600" />
              <span>Tất cả quốc gia (Toàn cầu)</span>
            </div>
            {!value && <Check className="h-4 w-4 text-indigo-600" />}
          </button>

          <div className="my-1 border-t border-slate-100" />

          {/* 1. Việt Nam */}
          <button
            type="button"
            onClick={() => {
              onChange("VN");
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer",
              value.toUpperCase() === "VN"
                ? "bg-rose-50 text-rose-800 font-bold"
                : "hover:bg-rose-50/50 text-slate-800 font-medium"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-base leading-none">🇻🇳</span>
              <span className="font-bold text-slate-900">Việt Nam</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-mono font-bold">
                VN
              </span>
            </div>
            {value.toUpperCase() === "VN" && <Check className="h-4 w-4 text-rose-600" />}
          </button>

          {/* 2. Các nước khác */}
          <button
            type="button"
            onClick={() => {
              onChange("OTHER");
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer",
              value.toUpperCase() === "OTHER"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "hover:bg-slate-50 text-slate-800 font-medium"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-base leading-none">🌐</span>
              <span className="font-semibold text-slate-900">Các nước khác</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-bold">
                OTHER
              </span>
            </div>
            {value.toUpperCase() === "OTHER" && <Check className="h-4 w-4 text-indigo-600" />}
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
export const MineaCountrySelect = CountrySelect;
export type MineaCountrySelectProps = CountrySelectProps;
