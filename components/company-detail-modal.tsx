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
  DollarSign,
  Globe,
  X,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  TrendingUp,
  Briefcase,
  Users,
  ChevronDown,
  ChevronUp,
  Compass,
  Zap,
} from "lucide-react";
import { useCompanyDetails } from "@/hooks/use-company-details";
import { useCountries } from "@/hooks/use-countries";
import { useCategory } from "@/hooks/use-category";
import { FavoriteButton } from "@/components/favorite-button";
import { YouTubeImage } from "@/components/youtube-image";
import { CompanyFavoriteData } from "@/lib/favorites";
import { toast } from "sonner";

interface CompanyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: string | number | null;
  company?: any;
  companyData?: any;
  onClose?: (companyId: string) => void;
}

// Helper formatting utilities
const formatNumber = (num?: number | null): string => {
  if (num == null || isNaN(num)) return "0";
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
  if (num == null || isNaN(num)) return "$0";
  return "$" + formatNumber(num);
};

export function CompanyDetailModal({
  open,
  onOpenChange,
  companyId,
  company: companyProp,
  companyData,
  onClose,
}: CompanyDetailModalProps) {
  const { loading, error, companyDetails, fetchCompanyDetails } = useCompanyDetails();
  const { fetchCountries, getCountryName } = useCountries();
  const { category, fetchCategory } = useCategory();
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "countries">("overview");
  const [descExpanded, setDescExpanded] = useState(false);
  const [isCopiedName, setIsCopiedName] = useState(false);

  // Extract the company entity safely from companyDetails (which has { company: {...} } from API)
  // or fall back to company / companyData props
  const company = useMemo(() => {
    if (companyDetails?.company) return companyDetails.company;
    if (companyDetails && (companyDetails.legalName || companyDetails.companyId)) return companyDetails;
    if (companyProp?.company) return companyProp.company;
    if (companyProp) return companyProp;
    if (companyData?.company) return companyData.company;
    if (companyData) return companyData;
    return null;
  }, [companyDetails, companyProp, companyData]);

  // Determine effective ID
  const effectiveCompanyId = useMemo(() => {
    if (companyId) return String(companyId);
    if (company?.companyId) return String(company.companyId);
    if (companyProp?.companyId) return String(companyProp.companyId);
    if (companyData?.companyId) return String(companyData.companyId);
    return null;
  }, [companyId, company, companyProp, companyData]);

  // Fetch company details if modal opens and ID is available
  useEffect(() => {
    if (open && effectiveCompanyId) {
      fetchCompanyDetails(effectiveCompanyId);
    }
    if (!open) {
      setDescExpanded(false);
      setIsCopiedName(false);
      setActiveTab("overview");
      setCategoryName(null);
    }
  }, [open, effectiveCompanyId, fetchCompanyDetails]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen && onClose && effectiveCompanyId) {
      onClose(effectiveCompanyId);
    }
  };

  // Top Countries list from API or fallback
  const topCountriesList = useMemo(() => {
    return companyDetails?.top5Countries || company?.top5Countries || [];
  }, [companyDetails, company]);

  // Fetch countries
  useEffect(() => {
    if (topCountriesList && topCountriesList.length > 0) {
      const countryIds = topCountriesList.map((c: any) => c.countryId);
      fetchCountries(countryIds);
    }
  }, [topCountriesList, fetchCountries]);

  // Category ID resolution
  const categoryId = company?.categoryId;

  // Fetch category name
  useEffect(() => {
    if (categoryId) {
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory]);

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  // Metrics extraction
  const companyName = company?.legalName || company?.name || company?.summary_data?.legal_name || "Doanh nghiệp";
  const creativeCount = companyDetails?.creativeCount ?? company?.creativeCount ?? company?.summary_data?.creative_count ?? 0;
  const ranks = companyDetails?.ranks || company?.ranks;
  const globalRank = ranks?.global?.rank;
  const countryRank = ranks?.country?.rank;

  const spend = company?.spend;
  const todaySpend = spend?.today || 0;
  const last30DaysSpend = spend?.last30Days || 0;
  const last365DaysSpend = spend?.last365Days || 0;

  const favoriteData: CompanyFavoriteData = useMemo(() => {
    return {
      name: companyName,
      description: company?.description || company?.summary || "",
      legalName: company?.legalName || undefined,
      companyId: effectiveCompanyId || "unknown",
      isAffiliate: Boolean(company?.isAffiliate),
      totalVideos: creativeCount,
      totalSpend: last365DaysSpend,
      thumbnail: company?.thumbnail || company?.logo || "/placeholder.svg",
    };
  }, [companyName, company, effectiveCompanyId, creativeCount, last365DaysSpend]);

  const handleCopyCompanyName = () => {
    if (companyName) {
      navigator.clipboard.writeText(companyName);
      setIsCopiedName(true);
      toast.success("Đã sao chép tên doanh nghiệp!");
      setTimeout(() => setIsCopiedName(false), 2000);
    }
  };

  const handleOpenAllVideos = () => {
    if (effectiveCompanyId) {
      window.open(`/companies/${effectiveCompanyId}/videos`, "_blank", "noopener,noreferrer");
    }
  };

  // Timeline spend metrics
  const timelineSpend = useMemo(() => {
    if (!spend) return [];

    return [
      { label: "Hôm nay", key: "today", spend: spend.today || 0 },
      { label: "7 ngày qua", key: "7d", spend: spend.last7Days || 0 },
      { label: "14 ngày qua", key: "14d", spend: spend.last14Days || 0 },
      { label: "21 ngày qua", key: "21d", spend: spend.last21Days || 0 },
      { label: "30 ngày qua", key: "30d", spend: spend.last30Days || 0 },
      { label: "60 ngày qua", key: "60d", spend: spend.last60Days || 0 },
      { label: "90 ngày qua", key: "90d", spend: spend.last90Days || 0 },
      { label: "180 ngày qua", key: "180d", spend: spend.last180Days || 0 },
      { label: "365 ngày qua", key: "365d", spend: spend.last365Days || 0 },
      { label: "720 ngày qua", key: "720d", spend: spend.last720Days || 0 },
    ];
  }, [spend]);

  const maxPeriodSpend = useMemo(() => {
    if (timelineSpend.length === 0) return 1;
    return Math.max(...timelineSpend.map((p) => p.spend), 1);
  }, [timelineSpend]);

  if (!open) return null;

  const hasData = Boolean(company);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
      >
        {/* Pinned Modal Header (Fixed, stays on top when scrolling) */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex-shrink-0 shadow-2xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 truncate flex items-center gap-2">
                <span>{companyName}</span>
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {categoryName || "Doanh nghiệp quảng cáo"}
                </span>
                {creativeCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <Video className="h-2.5 w-2.5" />
                    {creativeCount.toLocaleString()} quảng cáo
                  </span>
                )}
                {company?.headquarters ? (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    • <MapPin className="h-3 w-3" /> {company.headquarters}
                  </span>
                ) : null}
              </DialogDescription>
            </div>
          </div>

          {/* Top Right Controls & PINNED CLOSE BUTTON */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <FavoriteButton
              itemType="company"
              itemId={effectiveCompanyId || "unknown"}
              itemData={favoriteData}
              variant="outline"
              showText={false}
              className="h-9 w-9 rounded-full border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs"
            />

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleOpenAllVideos}
              className="hidden sm:inline-flex h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              <Video className="mr-1.5 h-3.5 w-3.5" />
              Xem video công ty
            </Button>

            {/* Permanent Sticky Close Button */}
            <DialogClose asChild>
              <button
                type="button"
                className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Đóng chi tiết công ty"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {loading && !hasData ? (
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
          ) : error && !hasData ? (
            <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-8 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400">
                <X className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-red-900 dark:text-red-200">Không thể tải thông tin công ty</h3>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => effectiveCompanyId && fetchCompanyDetails(effectiveCompanyId)}
                className="rounded-xl border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 text-red-700 dark:text-red-300"
              >
                Thử tải lại
              </Button>
            </div>
          ) : !hasData ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-12 text-center space-y-3">
              <Building2 className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Không tìm thấy thông tin doanh nghiệp này</p>
            </div>
          ) : (
            <>
              {/* Hero Company Profile Card */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-blue-50/25 dark:from-slate-800/40 dark:via-slate-900 dark:to-blue-950/20 p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-md">
                    <YouTubeImage
                      src={favoriteData.thumbnail || "/placeholder.svg"}
                      alt={companyName}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        {companyName}
                      </h2>
                      {categoryName && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 font-semibold text-xs px-2.5 py-0.5 rounded-lg"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {categoryName}
                        </Badge>
                      )}
                      {effectiveCompanyId && (
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                          ID: {effectiveCompanyId}
                        </span>
                      )}
                    </div>

                    {/* Company description / summary */}
                    {company?.description || company?.summary ? (
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <p className={descExpanded ? "" : "line-clamp-2"}>
                          {(company.description || company.summary).toString().replace(/<[^>]*>/g, "")}
                        </p>
                        {(company.description || company.summary).length > 120 && (
                          <button
                            type="button"
                            onClick={() => setDescExpanded(!descExpanded)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline mt-1 cursor-pointer"
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
                        Doanh nghiệp đang chạy các chiến dịch video quảng cáo trên hệ sinh thái YouTube.
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
                      onClick={handleCopyCompanyName}
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-blue-600">
                      <Video className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {formatNumber(creativeCount)}
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      Đã ghi nhận bởi VidTao
                    </p>
                  </div>
                </div>

                {/* 2. Chi tiêu hôm nay */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Chi tiêu (Hôm nay)
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 text-emerald-600">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {formatCurrency(todaySpend)}
                    </div>
                    <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 truncate">
                      <Zap className="h-3 w-3 inline flex-shrink-0" />
                      30 ngày: {formatCurrency(last30DaysSpend)}
                    </p>
                  </div>
                </div>

                {/* 3. Xếp hạng toàn cầu */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Thứ hạng toàn cầu
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900 text-purple-600">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {globalRank ? `#${globalRank}` : "—"}
                    </div>
                    <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400 mt-0.5 flex items-center gap-1 truncate">
                      Quốc gia: {countryRank ? `#${countryRank}` : "—"}
                    </p>
                  </div>
                </div>

                {/* 4. Doanh thu hoặc Quy mô */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 p-4 sm:p-5 transition-all hover:shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Quy mô nhân sự
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-100 dark:border-orange-900 text-orange-600">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
                      {company?.numberOfEmployees ? `${company.numberOfEmployees} nhân sự` : "Chưa cập nhật"}
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {company?.yearFounded ? `Thành lập: ${company.yearFounded}` : `Thị trường: ${topCountriesList.length} nước`}
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
                  <Briefcase className="h-3.5 w-3.5" />
                  Hồ sơ doanh nghiệp & Chi tiêu
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
                  Top quốc gia ({topCountriesList.length})
                </button>
              </div>

              {/* TAB 1: Doanh nghiệp & Chi tiêu */}
              {activeTab === "overview" && (
                <div className="grid gap-6 lg:grid-cols-12">
                  {/* Left Column: Business Profile Card */}
                  <div className="lg:col-span-6 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Thông tin hồ sơ pháp lý & tổ chức
                    </h3>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2.5 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="flex justify-between items-center pt-1 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Tên pháp lý:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{company?.legalName || companyName}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Trụ sở chính:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{company?.headquarters || "Chưa cập nhật"}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Năm thành lập:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{company?.yearFounded || "Chưa cập nhật"}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Quy mô nhân sự:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {company?.numberOfEmployees ? `${company.numberOfEmployees} nhân sự` : "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Doanh thu ước tính:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {company?.revenue != null ? (typeof company.revenue === 'number' ? formatCurrency(company.revenue) : formatCurrency(parseInt(company.revenue, 10))) : "Đang cập nhật"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Spend Periods */}
                  <div className="lg:col-span-6 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Chi tiêu quảng cáo theo mốc thời gian
                    </h3>

                    {timelineSpend.length > 0 ? (
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {timelineSpend.map((period) => {
                            const spendPct = Math.min(Math.round((period.spend / maxPeriodSpend) * 100), 100);

                            return (
                              <div
                                key={period.key}
                                className="flex items-center justify-between px-4 py-2.5 text-xs hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors"
                              >
                                <span className="font-semibold text-slate-700 dark:text-slate-300 w-28">{period.label}</span>
                                <div className="flex-1 mx-3 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.max(spendPct, 2)}%` }}
                                  />
                                </div>
                                <span className="font-bold text-emerald-700 dark:text-emerald-400 min-w-20 text-right">
                                  {formatCurrency(period.spend)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-8 text-center text-xs text-slate-500">
                        Chưa có dữ liệu phân bổ chi tiêu cho doanh nghiệp này.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: Top quốc gia */}
              {activeTab === "countries" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Phân bổ thị trường quảng cáo theo quốc gia
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Thị trường mục tiêu mà doanh nghiệp đang đẩy mạnh tiếp cận
                    </p>
                  </div>

                  {topCountriesList.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {topCountriesList.map((country: any, index: number) => (
                        <div
                          key={country.countryId}
                          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4.5 hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="flex h-6 w-6 items-center justify-center rounded-lg border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 text-xs font-black flex-shrink-0">
                                #{index + 1}
                              </span>
                              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                                {getCountryName(country.countryId)}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-bold text-xs"
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
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(country.percentage, 4)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      Chưa có dữ liệu phân bổ địa lý chi tiết cho doanh nghiệp này.
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
                      {spend?.collected_on
                        ? new Date(spend.collected_on).toLocaleString("vi-VN")
                        : "Gần đây"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <Compass className="h-3.5 w-3.5" />
                  Company ID: {effectiveCompanyId || "N/A"}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
