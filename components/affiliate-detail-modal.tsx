"use client";

import { useState } from "react";
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
  Video,
  Eye,
  TrendingUp,
  DollarSign,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  Award,
  Layers,
  Youtube,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface AffiliateDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affiliate: {
    name: string;
    channelUrl: string;
    totalVideos: number;
    totalViews: string;
    successRate: string;
    topOffers?: string[];
    avatar: string;
    avgEarnings?: string;
    topNiche?: string;
    description?: string;
  } | null;
}

export function AffiliateDetailModal({
  open,
  onOpenChange,
  affiliate,
}: AffiliateDetailModalProps) {
  const [isCopiedUrl, setIsCopiedUrl] = useState(false);
  const [isCopiedName, setIsCopiedName] = useState(false);

  if (!open || !affiliate) return null;

  const topOffers = affiliate.topOffers || [];

  const handleCopyChannelUrl = () => {
    if (affiliate.channelUrl) {
      navigator.clipboard.writeText(affiliate.channelUrl);
      setIsCopiedUrl(true);
      toast.success("Đã sao chép liên kết kênh YouTube!");
      setTimeout(() => setIsCopiedUrl(false), 2000);
    }
  };

  const handleCopyName = () => {
    if (affiliate.name) {
      navigator.clipboard.writeText(affiliate.name);
      setIsCopiedName(true);
      toast.success("Đã sao chép tên kênh đối tác!");
      setTimeout(() => setIsCopiedName(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-4xl h-[85vh] max-h-[800px] p-0 overflow-hidden flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
      >
        {/* Pinned Sticky Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900 text-red-600 flex-shrink-0 shadow-2xs">
              <Youtube className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 truncate flex items-center gap-2">
                <span>{affiliate.name}</span>
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  Kênh YouTube Affiliate
                </span>
                {affiliate.topNiche && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    <Sparkles className="h-2.5 w-2.5" />
                    {affiliate.topNiche}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>

          {/* Header Actions & Pinned Close */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Button
              type="button"
              variant="default"
              size="sm"
              asChild
              className="hidden sm:inline-flex h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              <a href={affiliate.channelUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Truy cập kênh
              </a>
            </Button>

            <DialogClose asChild>
              <button
                type="button"
                className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Đóng chi tiết kênh"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Hero Profile Card */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-red-50/20 dark:from-slate-800/50 dark:via-slate-900 dark:to-red-950/20 p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-red-500/30 bg-white dark:bg-slate-800 p-0.5 shadow-md">
                <img
                  src={affiliate.avatar || "/placeholder.svg"}
                  alt={affiliate.name}
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {affiliate.name}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs px-2.5 py-0.5 rounded-lg"
                  >
                    <Award className="h-3 w-3 mr-1 text-emerald-600" />
                    Top Creator
                  </Badge>
                  {affiliate.topNiche && (
                    <Badge
                      variant="outline"
                      className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium text-xs px-2.5 py-0.5 rounded-lg"
                    >
                      {affiliate.topNiche}
                    </Badge>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {affiliate.description ||
                    "Kênh tiếp thị liên kết (Affiliate Creator) chuyên sản xuất video quảng bá các sản phẩm và offer chất lượng cao trên nền tảng YouTube."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-col items-center gap-2 w-full sm:w-auto flex-shrink-0 pt-2 sm:pt-0">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  asChild
                  className="flex-1 sm:flex-initial w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 rounded-xl shadow-xs cursor-pointer"
                >
                  <a href={affiliate.channelUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    Xem kênh YouTube
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyChannelUrl}
                  className="flex-1 sm:flex-initial w-full h-9 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                >
                  {isCopiedUrl ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                      Đã sao chép link
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                      Sao chép liên kết
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Bento Grid - 4 Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Tổng video */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tổng video
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900 text-red-600">
                  <Video className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {affiliate.totalVideos.toLocaleString()}
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Nội dung đã xuất bản
                </p>
              </div>
            </div>

            {/* 2. Lượt xem */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tổng lượt xem
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-blue-600">
                  <Eye className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {affiliate.totalViews}
                </div>
                <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                  Lượt xem tích lũy
                </p>
              </div>
            </div>

            {/* 3. Tỷ lệ thành công */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tỷ lệ thành công
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {affiliate.successRate}
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Đánh giá chuyển đổi cao
                </p>
              </div>
            </div>

            {/* 4. Thu nhập ước tính */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Thu nhập ước tính
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900 text-purple-600">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {affiliate.avgEarnings || "$8K/tháng"}
                </div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  Hoa hồng trung bình
                </p>
              </div>
            </div>
          </div>

          {/* Top Offers Section */}
          {topOffers.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  Top sản phẩm & Chiến dịch đã quảng bá ({topOffers.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {topOffers.map((offer) => (
                  <Badge
                    key={offer}
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-800 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors"
                  >
                    {offer}
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
