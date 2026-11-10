"use client";

import { useState, useEffect } from "react";
import { Search, X, RotateCcw, SlidersHorizontal, Flame, Trophy, Layers, ArrowUpDown, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { ProductSearchParams } from "@/types/winning-product";

interface ProductFiltersProps {
  filters: ProductSearchParams;
  onFilterChange: (newFilters: Partial<ProductSearchParams>) => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  isLoading = false,
}: ProductFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const [domainInput, setDomainInput] = useState(filters.domain || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync internal state when filters change externally
  useEffect(() => {
    setSearchInput(filters.q || "");
  }, [filters.q]);

  useEffect(() => {
    setDomainInput(filters.domain || "");
  }, [filters.domain]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange({
      q: searchInput.trim(),
      domain: domainInput.trim(),
      page: 1,
    });
  };

  const activeFiltersCount = [
    Boolean(filters.q),
    Boolean(filters.domain),
    Boolean(filters.min_product_score && filters.min_product_score !== "0"),
    Boolean(filters.min_winning_ads && filters.min_winning_ads !== "0"),
    Boolean(filters.min_total_ads && filters.min_total_ads !== "0"),
    filters.sort_by && filters.sort_by !== "product_score",
    filters.sort_order && filters.sort_order !== "-1",
  ].filter(Boolean).length;

  return (
    <div className="w-full space-y-4 rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-xs">
      {/* Top Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm theo tên sản phẩm hoặc domain (vd: kitchen, shopify, balenciaga)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            maxLength={100}
            className="pl-10 pr-9 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onFilterChange({ q: "", page: 1 });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              title="Xóa từ khóa"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-xs transition-colors shrink-0"
          >
            {isLoading ? "Đang tìm..." : "Tìm kiếm"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`h-11 px-3.5 rounded-xl border-slate-200 cursor-pointer font-medium text-slate-700 hover:bg-slate-50 shrink-0 ${showAdvanced ? "bg-indigo-50/80 border-indigo-200 text-indigo-700" : ""
              }`}
          >
            <SlidersHorizontal className="h-4 w-4 mr-1.5" />
            <span>Bộ lọc nâng cao</span>
            {activeFiltersCount > 0 && (
              <Badge className="ml-1.5 h-5 px-1.5 rounded-full bg-indigo-600 text-white text-[10px]">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </form>

      {/* Advanced Filter Row */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in-50 duration-200">
          {/* Domain Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>Domain chính xác</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="vd: kingsport.vn"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onFilterChange({ domain: domainInput.trim(), page: 1 });
                  }
                }}
                maxLength={100}
                className="h-9 text-xs rounded-xl border-slate-200 pr-8"
              />
              {domainInput && (
                <button
                  type="button"
                  onClick={() => {
                    setDomainInput("");
                    onFilterChange({ domain: "", page: 1 });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Min Product Score */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-rose-500" />
              <span>Điểm sản phẩm tối thiểu</span>
            </label>
            <Select
              value={String(filters.min_product_score || "0")}
              onValueChange={(val) =>
                onFilterChange({
                  min_product_score: val === "0" ? undefined : val,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-9 text-xs rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Tất cả điểm số" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tất cả điểm số</SelectItem>
                <SelectItem value="20">Từ 20+ (Bắt đầu tiềm năng)</SelectItem>
                <SelectItem value="50">Từ 50+ (Sản phẩm hot)</SelectItem>
                <SelectItem value="80">Từ 80+ (Siêu Winner)</SelectItem>
                <SelectItem value="100">Từ 100+ (Đỉnh cao)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Winning Ads */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Số Winning Ads tối thiểu</span>
            </label>
            <Select
              value={String(filters.min_winning_ads || "0")}
              onValueChange={(val) =>
                onFilterChange({
                  min_winning_ads: val === "0" ? undefined : val,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-9 text-xs rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Tất cả ads win" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tất cả</SelectItem>
                <SelectItem value="1">Ít nhất 1 winning ad</SelectItem>
                <SelectItem value="2">Từ 2 winning ads</SelectItem>
                <SelectItem value="5">Từ 5 winning ads</SelectItem>
                <SelectItem value="10">Từ 10 winning ads (Vít mạnh)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Total Ads */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
              <span>Tổng số ads tối thiểu</span>
            </label>
            <Select
              value={String(filters.min_total_ads || "0")}
              onValueChange={(val) =>
                onFilterChange({
                  min_total_ads: val === "0" ? undefined : val,
                  page: 1,
                })
              }
            >
              <SelectTrigger className="h-9 text-xs rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Tất cả số lượng ads" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Tất cả</SelectItem>
                <SelectItem value="5">Từ 5+ ads</SelectItem>
                <SelectItem value="10">Từ 10+ ads</SelectItem>
                <SelectItem value="20">Từ 20+ ads</SelectItem>
                <SelectItem value="50">Từ 50+ ads</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <span>Sắp xếp theo</span>
            </label>
            <Select
              value={filters.sort_by || "product_score"}
              onValueChange={(val: "product_score" | "winning_ads" | "total_ads") =>
                onFilterChange({ sort_by: val, page: 1 })
              }
            >
              <SelectTrigger className="h-9 text-xs rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product_score">🔥 Điểm sản phẩm (Product Score)</SelectItem>
                <SelectItem value="winning_ads">🏆 Số Winning Ads</SelectItem>
                <SelectItem value="total_ads">📊 Tổng số Ads</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Thứ tự sắp xếp</label>
            <Select
              value={String(filters.sort_order ?? "-1")}
              onValueChange={(val) =>
                onFilterChange({ sort_order: val as "1" | "-1", page: 1 })
              }
            >
              <SelectTrigger className="h-9 text-xs rounded-xl border-slate-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">Cao nhất trước (Giảm dần)</SelectItem>
                <SelectItem value="1">Thấp nhất trước (Tăng dần)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-400">Đang lọc:</span>

          {filters.q && (
            <Badge
              variant="secondary"
              className="rounded-lg bg-slate-100 text-slate-700 text-xs py-1 px-2.5 flex items-center gap-1.5"
            >
              <span>Từ khóa: "{filters.q}"</span>
              <button
                type="button"
                onClick={() => onFilterChange({ q: "", page: 1 })}
                className="hover:text-rose-500 cursor-pointer"
                title="Gỡ bộ lọc này"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.domain && (
            <Badge
              variant="secondary"
              className="rounded-lg bg-slate-100 text-slate-700 text-xs py-1 px-2.5 flex items-center gap-1.5"
            >
              <span>Domain: {filters.domain}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ domain: "", page: 1 })}
                className="hover:text-rose-500 cursor-pointer"
                title="Gỡ bộ lọc này"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.min_product_score && filters.min_product_score !== "0" && (
            <Badge
              variant="secondary"
              className="rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs py-1 px-2.5 flex items-center gap-1.5"
            >
              <span>Score ≥ {filters.min_product_score}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ min_product_score: undefined, page: 1 })}
                className="hover:text-rose-900 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.min_winning_ads && filters.min_winning_ads !== "0" && (
            <Badge
              variant="secondary"
              className="rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs py-1 px-2.5 flex items-center gap-1.5"
            >
              <span>Winning Ads ≥ {filters.min_winning_ads}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ min_winning_ads: undefined, page: 1 })}
                className="hover:text-amber-900 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.min_total_ads && filters.min_total_ads !== "0" && (
            <Badge
              variant="secondary"
              className="rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs py-1 px-2.5 flex items-center gap-1.5"
            >
              <span>Total Ads ≥ {filters.min_total_ads}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ min_total_ads: undefined, page: 1 })}
                className="hover:text-indigo-900 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer ml-auto"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            <span>Đặt lại tất cả</span>
          </Button>
        </div>
      )}
    </div>
  );
}

