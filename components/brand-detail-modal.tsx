"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Video,
  Eye,
  TrendingUp,
  Calendar,
  DollarSign,
  Globe,
  X,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Sparkles,
  BarChart3,
  Layers,
  ChevronDown,
  ChevronUp,
  Compass,
  Zap,
} from "lucide-react";
import { useBrandDetails } from "@/hooks/use-brand-details";
import { useCountries } from "@/hooks/use-countries";
import { useCategory } from "@/hooks/use-category";
import { FavoriteButton } from "@/components/favorite-button";
import { YouTubeImage } from "@/components/youtube-image";
import { BrandFavoriteData } from "@/lib/favorites";
import { toast } from "sonner";

interface BrandDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string | null;
  onClose?: (brandId: string) => void;
}

// Helper formatting utilities
const formatNumber = (num?: number | null): string => {
  if (num == null) return "0";
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toLocaleString("vi-VN");
};

const formatCurrency = (num?: number | null): string => {
  if (num == null) return "$0";
  return "$" + formatNumber(num);
};

export function BrandDetailModal({
  open,
  onOpenChange,
  brandId,
  onClose,
}: BrandDetailModalProps) {
  const { loading, error, brandDetails, fetchBrandDetails } = useBrandDetails();
  const { fetchCountries, getCountryName: getCountryNameFromHook } = useCountries();
  const { category, fetchCategory } = useCategory();
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "countries">("overview");
  const [descExpanded, setDescExpanded] = useState(false);
  const [isCopiedName, setIsCopiedName] = useState(false);

  // Fetch brand details when modal opens
  useEffect(() => {
    if (open && brandId) {
      fetchBrandDetails(brandId);
    }
    if (!open) {
      setDescExpanded(false);
      setIsCopiedName(false);
      setActiveTab("overview");
    }
  }, [open, brandId, fetchBrandDetails]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen && onClose && brandId) {
      onClose(brandId);
    }
  };

  // Fetch countries when brand details are available
  useEffect(() => {
    if (brandDetails?.top5Countries && brandDetails.top5Countries.length > 0) {
      const countryIds = brandDetails.top5Countries.map((c) => c.countryId);
      fetchCountries(countryIds);
    }
  }, [brandDetails, fetchCountries]);

  // Fetch category name
  useEffect(() => {
    if (brandDetails?.brand?.categoryId) {
      fetchCategory(brandDetails.brand.categoryId);
    }
  }, [brandDetails, fetchCategory]);

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  const brand = brandDetails?.brand;

  const favoriteData: BrandFavoriteData | null = useMemo(() => {
    if (!brand) return null;
    return {
      name: brand.name,
      thumbnail: brand.thumbnail || "/placeholder.svg",
      description: brand.description || "",
      categoryId: brand.categoryId,
      totalCreatives: brandDetails?.creativeCount,
      totalViews: brand.views?.last30Days,
      totalSpend: brand.spend?.last365Days,
    };
  }, [brand, brandDetails]);

  const handleCopyBrandName = () => {
    if (brand?.name) {
      navigator.clipboard.writeText(brand.name);
      setIsCopiedName(true);
      toast.success("Đã sao chép tên thương hiệu!");
      setTimeout(() => setIsCopiedName(false), 2000);
    }
  };

  const handleOpenAllVideos = () => {
    if (brandId) {
      window.open(`/brands/${brandId}/videos`, "_blank", "noopener,noreferrer");
    }
  };

  // Timeline periods calculation for interactive growth chart
  const timelinePeriods = useMemo(() => {
    if (!brand) return [];
    const v = brand.views || ({} as any);
    const s = brand.spend || ({} as any);

    return [
      { label: "Hôm nay", key: "today", views: v.today || 0, spend: s.today || 0 },
      { label: "7 ngày qua", key: "7d", views: v.last7Days || 0, spend: s.last7Days || 0 },
      { label: "14 ngày qua", key: "14d", views: v.last14Days || 0, spend: s.last14Days || 0 },
      { label: "30 ngày qua", key: "30d", views: v.last30Days || 0, spend: s.last30Days || 0 },
      { label: "60 ngày qua", key: "60d", views: v.last60Days || 0, spend: s.last60Days || 0 },
      { label: "90 ngày qua", key: "90d", views: v.last90Days || 0, spend: s.last90Days || 0 },
      { label: "180 ngày qua", key: "180d", views: v.last180Days || 0, spend: s.last180Days || 0 },
      { label: "365 ngày qua", key: "365d", views: v.last365Days || 0, spend: s.last365Days || 0 },
      { label: "720 ngày qua", key: "720d", views: v.last720Days || 0, spend: s.last720Days || 0 },
    ];
  }, [brand]);

  const maxPeriodViews = useMemo(() => {
    if (timelinePeriods.length === 0) return 1;
    return Math.max(...timelinePeriods.map((p) => p.views), 1);
  }, [timelinePeriods]);

  const maxPeriodSpend = useMemo(() => {
    if (timelinePeriods.length === 0) return 1;
    return Math.max(...timelinePeriods.map((p) => p.spend), 1);
  }, [timelinePeriods]);

  if (!open || !brandId) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
      >
        {/* Pinned Modal Header (Fixed, stays on top when scrolling) */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex-shrink-0 shadow-2xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 truncate flex items-center gap-2">
                <span>{brand?.name || "Chi tiết thương hiệu / kênh"}</span>
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {categoryName || "Thương hiệu & Kênh đối thủ"}
                </span>
                {brandDetails?.creativeCount != null && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <Video className="h-2.5 w-2.5" />
                    {brandDetails.creativeCount} quảng cáo
                  </span>
                )}
                {brand?.averageVideoDuration ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    • <Clock className="h-3 w-3" /> Thời lượng TB: {Math.round(brand.averageVideoDuration)}s
                  </span>
                ) : null}
              </DialogDescription>
            </div>
          </div>

          {/* Top Right Controls & PINNED CLOSE BUTTON */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {favoriteData && (
              <FavoriteButton
                itemType="brand"
                itemId={brandId}
                itemData={favoriteData}
                variant="outline"
                showText={false}
                className="h-9 w-9 rounded-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs"
              />
            )}

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleOpenAllVideos}
              className="hidden sm:inline-flex h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              <Video className="mr-1.5 h-3.5 w-3.5" />
              Xem tất cả video
            </Button>

            {/* Permanent Sticky Close Button */}
            <DialogClose asChild>
              <button
                type="button"
                className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Đóng chi tiết thương hiệu"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {loading ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-20 w-20 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-7 w-48 rounded-lg" />
                  <Skeleton className="h-4 w-72 rounded-lg" />
                  <Skeleton className="h-4 w-96 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
              </div>
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-8 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400">
                <X className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-red-900 dark:text-red-200">Không thể tải thông tin thương hiệu</h3>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => brandId && fetchBrandDetails(brandId)}
                className="rounded-xl border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 text-red-700 dark:text-red-300"
              >
                Thử tải lại
              </Button>
            </div>
          ) : !brandDetails || !brand ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-12 text-center space-y-3">
              <Building2 className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Không tìm thấy thông tin thương hiệu này</p>
            </div>
          ) : (
            <>
              {/* Hero Brand Profile Card */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-slate-800/40 dark:via-slate-900 dark:to-indigo-950/20 p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-md">
                    <YouTubeImage
                      src={brand.thumbnail || "/placeholder.svg"}
                      alt={brand.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        {brand.name}
                      </h2>
                      {categoryName && (
                        <Badge
                          variant="secondary"
                          className="bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 font-semibold text-xs px-2.5 py-0.5 rounded-lg"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {categoryName}
                        </Badge>
                      )}
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                        ID: {brand.brandId}
                      </span>
                    </div>

                    {/* Brand description / bio */}
                    {brand.description ? (
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p className={descExpanded ? "" : "line-clamp-2"}>
                          {brand.description.replace(/<[^>]*>/g, "")}
                        </p>
                        {brand.description.length > 120 && (
                          <button
                            type="button"
                            onClick={() => setDescExpanded(!descExpanded)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline mt-1 cursor-pointer"
                          >
                            {descExpanded ? (
                              <>
                                Thu gọn <ChevronUp className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                Xem thêm mô tả <ChevronDown className="h-3 w-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Thương hiệu đối thủ đang hoạt động quảng cáo trên nền tảng YouTube Video Ads.
                      </p>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap sm:flex-col items-center gap-2 w-full sm:w-auto flex-shrink-0 pt-2 sm:pt-0">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleOpenAllVideos}
                      className="flex-1 sm:flex-initial w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-9 rounded-xl shadow-xs cursor-pointer"
                    >
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Kho quảng cáo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyBrandName}
                      className="flex-1 sm:flex-initial w-full h-9 rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                    >
                      {isCopiedName ? (
                        <>
                          <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                          Đã sao chép
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                          Sao chép tên
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bento Grid - 4 Key Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Tổng quảng cáo */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Tổng quảng cáo
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-100 dark:border-red-900 text-red-600">
                      <Video className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {brandDetails.creativeCount.toLocaleString()}
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      Đã phát hiện trên YouTube
                    </p>
                  </div>
                </div>

                {/* 2. Lượt xem 30 ngày */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Lượt xem (30d)
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-600">
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {formatNumber(brand.views.last30Days)}
                    </div>
                    <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 truncate">
                      <TrendingUp className="h-3 w-3 inline flex-shrink-0" />
                      Hôm nay: +{formatNumber(brand.views.today)}
                    </p>
                  </div>
                </div>

                {/* 3. Chi tiêu 30 ngày */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Chi tiêu (30d)
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 text-emerald-600">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {formatCurrency(brand.spend.last30Days)}
                    </div>
                    <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 truncate">
                      <Zap className="h-3 w-3 inline flex-shrink-0" />
                      Hôm nay: +{formatCurrency(brand.spend.today)}
                    </p>
                  </div>
                </div>

                {/* 4. Quy mô thị trường */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Thị trường chính
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900 text-purple-600">
                      <Globe className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
                      {brandDetails.top5Countries?.length || 0} nước
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {brandDetails.top5Countries?.[0]
                        ? `Top 1: ${getCountryNameFromHook(brandDetails.top5Countries[0].countryId)}`
                        : "Đang phân tích"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation View Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  Chu kỳ tăng trưởng (Views & Spend)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("countries")}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "countries"
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Top quốc gia ({brandDetails.top5Countries?.length || 0})
                </button>
              </div>

              {/* TAB 1: Chu kỳ tăng trưởng (Timeline Analysis) */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Đối chiếu Lượt xem & Ngân sách chi tiêu theo mốc thời gian
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Dữ liệu tổng hợp từ hệ thống giám sát quảng cáo VidTao Analytics
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                    <div className="grid grid-cols-12 bg-slate-50/80 dark:bg-slate-800/80 px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <div className="col-span-3 sm:col-span-3">Giai đoạn</div>
                      <div className="col-span-5 sm:col-span-5">Lượt xem (Views)</div>
                      <div className="col-span-4 sm:col-span-4 text-right">Chi tiêu ước tính (USD)</div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {timelinePeriods.map((period, idx) => {
                        const viewsPct = Math.min(Math.round((period.views / maxPeriodViews) * 100), 100);
                        const spendPct = Math.min(Math.round((period.spend / maxPeriodSpend) * 100), 100);

                        return (
                          <div
                            key={period.key}
                            className={`grid grid-cols-12 items-center px-4 py-3 text-xs transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                              idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/30 dark:bg-slate-850/50"
                            }`}
                          >
                            {/* Period Name */}
                            <div className="col-span-3 sm:col-span-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              {period.key === "today" ? (
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                              )}
                              <span>{period.label}</span>
                            </div>

                            {/* Views with Visual Progress */}
                            <div className="col-span-5 sm:col-span-5 pr-4 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-900 dark:text-slate-100">{formatNumber(period.views)}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{viewsPct}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.max(viewsPct, 2)}%` }}
                                />
                              </div>
                            </div>

                            {/* Spend with Visual Progress */}
                            <div className="col-span-4 sm:col-span-4 text-right space-y-1 pl-2">
                              <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                <span>{formatCurrency(period.spend)}</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-300 ml-auto"
                                  style={{ width: `${Math.max(spendPct, 2)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Top quốc gia (Geographic Distribution) */}
              {activeTab === "countries" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Phân bổ thị trường quảng cáo theo quốc gia
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tỷ lệ phần trăm và số lượng quảng cáo nhắm mục tiêu vào các thị trường
                    </p>
                  </div>

                  {brandDetails.top5Countries && brandDetails.top5Countries.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {brandDetails.top5Countries.map((country, index) => {
                        const rankColors = [
                          "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700",
                          "bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600",
                          "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-700",
                          "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
                          "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
                        ];

                        return (
                          <div
                            key={country.countryId}
                            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={`flex h-6 w-6 items-center justify-center rounded-lg border text-xs font-black flex-shrink-0 ${
                                    rankColors[index] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  }`}
                                >
                                  #{index + 1}
                                </span>
                                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                                  {getCountryNameFromHook(country.countryId)}
                                </span>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-bold text-xs"
                              >
                                {country.percentage}%
                              </Badge>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>Số quảng cáo:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                  {country.count.toLocaleString()} ads
                                </span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.max(country.percentage, 4)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      Chưa có dữ liệu phân bổ địa lý chi tiết cho thương hiệu này.
                    </div>
                  )}
                </div>
              )}

              {/* Data Collection & System Info Card */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>
                    Dữ liệu được cập nhật từ VidTao Intelligence • Cập nhật lúc:{" "}
                    <strong className="text-slate-700 dark:text-slate-300">
                      {brand.views?.collected_on
                        ? new Date(brand.views.collected_on).toLocaleString("vi-VN")
                        : "Gần đây"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <Compass className="h-3.5 w-3.5" />
                  Brand ID: {brand.brandId}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
