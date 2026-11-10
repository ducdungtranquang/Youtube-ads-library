"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Flame,
  Layers,
  ArrowUpRight,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Medal,
  Crown,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MonthlyWinnerItem, DailyTopItem, WinningProduct } from "@/types/winning-product";

interface MonthlyWinnersViewProps {
  onSelectProduct: (product: WinningProduct) => void;
}

export function MonthlyWinnersView({ onSelectProduct }: MonthlyWinnersViewProps) {
  // Current month in YYYY-MM
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [data, setData] = useState<MonthlyWinnerItem[]>([]);
  const [dailyTop, setDailyTop] = useState<Record<string, DailyTopItem>>({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Month navigation helpers
  const shiftMonth = (offset: number) => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + offset, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(newMonth);
    setPage(1);
  };

  useEffect(() => {
    let isMounted = true;
    async function loadMonthlyWinners() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/monthly-winners?month=${selectedMonth}&page=${page}&limit=30`);
        const json = await res.json();
        if (isMounted && json?.success) {
          setData(Array.isArray(json?.data) ? json.data : []);
          setDailyTop(json?.daily_top || {});
          if (json?.pagination) {
            setTotal(json.pagination.total || 0);
            setTotalPages(json.pagination.pages || 1);
          }
        }
      } catch (err) {
        console.warn("Lỗi tải monthly winners:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMonthlyWinners();
    return () => {
      isMounted = false;
    };
  }, [selectedMonth, page]);

  const dailyDates = Object.keys(dailyTop).sort();

  return (
    <div className="space-y-6">
      {/* Month Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-200/60 shadow-xs">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Bảng vàng sản phẩm tháng ({selectedMonth})
            </h3>
            <p className="text-xs text-slate-500">
              Xếp hạng theo số ngày chiến thắng liên tiếp & tổng điểm Product Score
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => shiftMonth(-1)}
            className="h-9 w-9 rounded-xl border-slate-200 cursor-pointer hover:bg-slate-50"
            title="Tháng trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
            {selectedMonth}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => shiftMonth(1)}
            className="h-9 w-9 rounded-xl border-slate-200 cursor-pointer hover:bg-slate-50"
            title="Tháng sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Daily Winners Showcase (Top 1 mỗi ngày trong tháng) */}
      {dailyDates.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Sản phẩm đứng đầu mỗi ngày trong tháng</span>
            </h4>
            <span className="text-xs text-slate-400">Cuộn ngang để xem tất cả ngày</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {dailyDates.map((dateStr) => {
              const item = dailyTop[dateStr];
              const cleanDomain = item.domain?.replace(/^https?:\/\//i, "").replace(/\/+$/, "") || "";
              const favicon = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=32`;

              return (
                <div
                  key={dateStr}
                  onClick={() =>
                    onSelectProduct({
                      domain: item.domain,
                      title: item.title,
                      product_score: item.product_score,
                      winning_ads: 0,
                      total_ads: 0,
                    })
                  }
                  className="flex-shrink-0 w-56 snap-start rounded-xl border border-slate-200 bg-white p-3 shadow-2xs hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Calendar className="h-3 w-3 text-amber-500" />
                      {dateStr}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 border-amber-200">
                      Top 1
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative h-7 w-7 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={favicon}
                        alt={cleanDomain}
                        fill
                        className="object-contain p-0.5"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {cleanDomain}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        Score: {item.product_score?.toFixed(1) || 0}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly Winners Leaderboard Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Medal className="h-4 w-4 text-indigo-600" />
          <span>Bảng tổng sắp tháng {selectedMonth} ({total} sản phẩm)</span>
        </h4>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-xs font-medium">Đang tải bảng xếp hạng sản phẩm của tháng...</p>
          </div>
        ) : data.length === 0 ? (
          <Card className="p-10 text-center rounded-2xl border-dashed border-slate-200 bg-white">
            <Trophy className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h5 className="text-sm font-bold text-slate-800">Chưa có snapshot cho tháng này</h5>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Dữ liệu Monthly Winners được hệ thống phân tích tự động tổng hợp snapshot top 30 sản phẩm hàng ngày.
              Hãy kiểm tra lại tháng hiện tại hoặc các tháng trước.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item, idx) => {
              const rank = (page - 1) * 30 + idx + 1;
              const cleanDomain = item.domain?.replace(/^https?:\/\//i, "").replace(/\/+$/, "") || "";
              const favicon = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=48`;

              return (
                <Card
                  key={item.domain + idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank Badge */}
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-black text-sm shadow-xs ${
                            rank === 1
                              ? "bg-amber-400 text-amber-950"
                              : rank === 2
                              ? "bg-slate-300 text-slate-900"
                              : rank === 3
                              ? "bg-amber-600 text-white"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          #{rank}
                        </div>

                        <div className="min-w-0">
                          <h4
                            className="text-sm font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                            onClick={() =>
                              onSelectProduct({
                                domain: item.domain,
                                title: item.title,
                                product_score: item.latest_score,
                                winning_ads: item.total_winning_ads,
                                total_ads: 0,
                              })
                            }
                            title={cleanDomain}
                          >
                            {cleanDomain}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {item.title || "Sản phẩm E-commerce"}
                          </p>
                        </div>
                      </div>

                      {/* Days won badge */}
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                      >
                        {item.days_won} ngày thắng
                      </Badge>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-2">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Tổng Score</p>
                        <p className="text-sm font-black text-slate-800">{item.total_product_score}</p>
                      </div>

                      <div className="rounded-xl bg-amber-50/60 border border-amber-100/60 p-2">
                        <p className="text-[10px] text-amber-600 font-bold uppercase">Winning Ads</p>
                        <p className="text-sm font-black text-amber-900">{item.total_winning_ads}</p>
                      </div>

                      <div className="rounded-xl bg-indigo-50/60 border border-indigo-100/60 p-2">
                        <p className="text-[10px] text-indigo-600 font-bold uppercase">Best Rank</p>
                        <p className="text-sm font-black text-indigo-900">#{item.best_rank || 1}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/facebook-ads-search?text=${encodeURIComponent(cleanDomain)}`}
                      className="text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <Search className="h-3 w-3 text-indigo-500" />
                      <span>Xem Ads FB</span>
                    </Link>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        onSelectProduct({
                          domain: item.domain,
                          title: item.title,
                          product_score: item.latest_score,
                          winning_ads: item.total_winning_ads,
                          total_ads: 0,
                        })
                      }
                      className="h-8 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      <span>Xem Top Ads</span>
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination if multiple pages */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="rounded-xl border-slate-200"
            >
              Trang trước
            </Button>
            <span className="text-xs font-semibold text-slate-600">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="rounded-xl border-slate-200"
            >
              Trang sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

