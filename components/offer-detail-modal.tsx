"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Video,
  Globe,
  Tag,
  Layers,
  X,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface OfferDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: {
    name: string;
    network: string;
    vertical: string;
    payout: string;
    epc: string;
    countries: string[];
    totalVideos: number;
    conversionRate?: string;
    cookieDuration?: string;
    description?: string;
  } | null;
}

export function OfferDetailModal({
  open,
  onOpenChange,
  offer,
}: OfferDetailModalProps) {
  if (!open || !offer) return null;

  const countries = offer.countries || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-4xl h-[85vh] max-h-[800px] p-0 overflow-hidden flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
      >
        {/* Pinned Sticky Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 text-emerald-600 flex-shrink-0 shadow-2xs">
              <Tag className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 truncate flex items-center gap-2">
                <span>{offer.name}</span>
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {offer.network}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <Sparkles className="h-2.5 w-2.5" />
                  {offer.vertical}
                </span>
              </DialogDescription>
            </div>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Đóng chi tiết chiến dịch"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Hero Profile Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 dark:from-slate-800/50 dark:via-slate-900 dark:to-emerald-950/20 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {offer.name}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs px-2.5 py-0.5 rounded-lg"
                  >
                    {offer.vertical}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    Network: {offer.network}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {offer.description ||
                    "Chiến dịch tiếp thị liên kết hiệu quả cao với mức chi trả hấp dẫn và tỷ lệ chuyển đổi ổn định trên lưu lượng truy cập YouTube Video."}
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0">
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 rounded-xl shadow-xs cursor-pointer"
                >
                  <Video className="mr-1.5 h-3.5 w-3.5" />
                  Xem tất cả video
                </Button>
              </div>
            </div>
          </div>

          {/* Bento Grid - 4 Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Mức chi trả (Payout) */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Mức chi trả (Payout)
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 text-emerald-600">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {offer.payout}
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Trên mỗi chuyển đổi hợp lệ
                </p>
              </div>
            </div>

            {/* 2. EPC */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  EPC Ước tính
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {offer.epc}
                </div>
                <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                  Earnings Per Click
                </p>
              </div>
            </div>

            {/* 3. Tổng video quảng bá */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Quảng cáo
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900 text-red-600">
                  <Video className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {offer.totalVideos.toLocaleString()}
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Video đang phát tán
                </p>
              </div>
            </div>

            {/* 4. Tỷ lệ chuyển đổi */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tỷ lệ chuyển đổi
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900 text-purple-600">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {offer.conversionRate || "4.2%"}
                </div>
                <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400 mt-0.5">
                  Thời hạn Cookie: {offer.cookieDuration || "30 ngày"}
                </p>
              </div>
            </div>
          </div>

          {/* Countries Coverage */}
          {countries.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-600" />
                Khu vực & Quốc gia chấp nhận ({countries.length})
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {countries.map((country) => (
                  <Badge
                    key={country}
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1.5 rounded-xl font-semibold"
                  >
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
