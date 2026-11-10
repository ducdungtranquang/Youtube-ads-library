"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorite-button";
import { Button } from "@/components/ui/button";
import { FacebookMediaFallback } from "@/components/facebook-media-fallback";
import {
  Loader2,
  X,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Flame,
  Zap,
  TrendingUp,
  Calendar,
  Globe,
  Sparkles,
  Layers,
  Clock,
  Share2,
  Shield,
  DollarSign,
  Users,
  AlertTriangle,
  Play,
  BarChart3,
  ThumbsUp,
  Store,
  Info,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIndustryLabel } from "@/lib/constants/industries";

// Helper map scaling level sang tiếng Việt chuẩn
const formatScalingLevel = (level: string | null | undefined): string => {
  if (!level) return "";
  const norm = level.trim().toUpperCase();
  if (norm === "SCALING HARD" || norm === "🚀 SCALING HARD") return "🚀 Vít siêu mạnh (Scaling Hard)";
  if (norm === "SCALING") return "Vít mạnh (Scaling)";
  if (norm === "NORMAL") return "Bình thường (Normal)";
  return level;
};

// Helper map estimated spend sang tiếng Việt chuẩn
const formatEstimatedSpend = (spend: string | null | undefined): string => {
  if (!spend) return "";
  const norm = spend.trim().toUpperCase().replace("_", " ");
  if (norm === "VERY HIGH") return "Rất cao (≥ $1.000)";
  if (norm === "HIGH") return "Cao ($300 – $999)";
  if (norm === "MEDIUM") return "Trung bình ($50 – $299)";
  if (norm === "LOW") return "Thấp (< $50)";
  return spend;
};

// Helper làm sạch text quảng cáo, loại bỏ template chưa render (ví dụ: {{product.brand}}, {{product.title}})
const cleanAdText = (text: string | null | undefined, fallbackBrand?: string): string => {
  if (!text) return "";
  let cleaned = text;
  if (fallbackBrand && fallbackBrand !== "Facebook Ad") {
    cleaned = cleaned.replace(/\{\{\s*product\.brand\s*\}\}/gi, fallbackBrand);
    cleaned = cleaned.replace(/\{\{\s*product\.title\s*\}\}/gi, fallbackBrand);
  } else {
    cleaned = cleaned.replace(/\{\{\s*product\.brand\s*\}\}/gi, "");
    cleaned = cleaned.replace(/\{\{\s*product\.title\s*\}\}/gi, "");
  }
  cleaned = cleaned.replace(/\{\{\s*[\w\.]+\s*\}\}/g, "");
  return cleaned.trim();
};

interface GrowthStep {
  t: number;
  c: number;
}

interface FacebookAdDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: any;
  loading?: boolean;
  onFilterByPage?: (pageName: string) => void;
  onSelectAd?: (ad: any) => void;
}

export function FacebookAdDetailModal({
  open,
  onOpenChange,
  ad,
  loading = false,
  onFilterByPage,
  onSelectAd,
}: FacebookAdDetailModalProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [activeTab, setActiveTab] = useState("estimates");

  // State quản lý danh sách Quảng cáo tương tự (Minea Style Scroll ngang)
  const [similarAds, setSimilarAds] = useState<any[]>([]);
  const [similarTotal, setSimilarTotal] = useState<number | null>(null);
  const [similarLoading, setSimilarLoading] = useState(false);
  const similarScrollRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const prevPageNameRef = useRef<string | null>(null);

  // State quản lý danh sách Ads cùng Page (tối đa 20 size/page theo yêu cầu)
  const [pageAds, setPageAds] = useState<any[]>([]);
  const [pageAdsLoading, setPageAdsLoading] = useState(false);
  const [pageAdsTotal, setPageAdsTotal] = useState<number>(0);
  const [pageAdsPage, setPageAdsPage] = useState(1);

  const snapshot = ad?.snapshot ?? {};

  const attachments = Array.isArray(ad?.attachments) ? ad.attachments : [];
  const snapshotCards = Array.isArray(snapshot?.cards) ? snapshot.cards : [];
  const attachment =
    attachments.length > 0 ? attachments[0] : snapshotCards.length > 0 ? snapshotCards[0] : undefined;

  const snapshotVideos = Array.isArray(snapshot?.videos) ? snapshot.videos : [];
  const adVideos = Array.isArray(ad?.videos) ? ad.videos : [];
  const videoList = adVideos.length > 0 ? adVideos : snapshotVideos;
  const snapshotVideo = videoList.length > 0 ? videoList[0] : undefined;

  const isVideoFormat =
    snapshot?.display_format === "VIDEO" ||
    ad?.display_format === "VIDEO" ||
    Boolean(snapshotVideo?.video_hd_url || snapshotVideo?.video_sd_url);

  const hasPlayableVideo = Boolean(snapshotVideo?.video_hd_url || snapshotVideo?.video_sd_url);
  const mediaUrl =
    ad?.thumbnail_r2 ||
    ad?.thumbnail_local ||
    attachment?.media_url ||
    snapshotVideo?.video_hd_url ||
    snapshotVideo?.video_sd_url;
  const mediaPoster =
    ad?.thumbnail_r2 ||
    ad?.thumbnail_local ||
    attachment?.media_poster_url ||
    snapshotVideo?.video_preview_image_url;

  const pageImage =
    ad?.page_profile_image_url ||
    snapshot?.page_profile_picture_url ||
    ad?.snapshot?.page_profile_picture_url;
  const pageName = ad?.page_name || snapshot?.page_name || "Facebook Ad";
  const pageDeleted = snapshot?.page_is_deleted ?? ad?.page_is_deleted ?? false;
  const pageLikes = snapshot?.page_like_count ?? ad?.page_like_count;

  const categories =
    Array.isArray(snapshot?.page_categories) && snapshot.page_categories.length > 0
      ? snapshot.page_categories
      : Array.isArray(ad?.categories) && ad.categories.length > 0
        ? ad.categories
        : [];

  const ctaText = ad?.cta || ad?.cta_text || snapshot?.cta_text || "Mua ngay";
  const ctaType = ad?.cta_type || snapshot?.cta_type || "SHOP_NOW";

  const rawTitle =
    ad?.headline ||
    snapshot?.title ||
    ad?.text?.split(/\n/)[0]?.trim() ||
    snapshot?.body?.text?.split(/\n/)[0]?.trim() ||
    pageName;
  const title = cleanAdText(rawTitle, pageName);

  const rawDescription =
    ad?.description ||
    ad?.text ||
    snapshot?.body?.text ||
    snapshot?.caption ||
    ad?.normalized_text ||
    "";
  const description = cleanAdText(rawDescription, pageName);

  const link = ad?.link || ad?.link_url || snapshot?.link_url || null;
  const adImages = Array.isArray(ad?.images) ? ad.images : [];
  const snapshotImages = Array.isArray(snapshot?.images) ? snapshot.images : [];
  const imageList = adImages.length > 0 ? adImages : snapshotImages.length > 0 ? snapshotImages : [];
  
  // Ưu tiên thumbnail_r2 để tránh ảnh CDN Facebook bị hết hạn token
  const primaryImage =
    ad?.thumbnail_r2 ||
    ad?.thumbnail_local ||
    imageList[0]?.resized_image_url ||
    imageList[0]?.original_image_url ||
    attachment?.media_url ||
    pageImage;

  const itemId = ad?.ad_archive_id || ad?._id || ad?.id || ad?.ad_id || ad?.archive_id;
  const adLibraryUrl = ad?.ad_library_url || (itemId ? `https://www.facebook.com/ads/library/?id=${itemId}` : null);
  let adLibPageId: string | null = null;
  if (typeof ad?.ad_library_url === "string") {
    const match = ad.ad_library_url.match(/view_all_page_id=(\d+)/);
    if (match && match[1]) {
      adLibPageId = match[1];
    }
  }

  const pageId =
    ad?.page_id ||
    snapshot?.page_id ||
    ad?.view_all_page_id ||
    snapshot?.view_all_page_id ||
    adLibPageId;
  const pageProfileUri = snapshot?.page_profile_uri || ad?.page_profile_uri;
  const fbPageUrl =
    pageProfileUri ||
    (pageId ? `https://www.facebook.com/${pageId}` : null) ||
    (pageName && pageName !== "Facebook Ad" ? `https://www.facebook.com/search/top?q=${encodeURIComponent(pageName)}` : null);

  // Tự động tải danh sách quảng cáo của cùng Fanpage (giới hạn tối đa 20 ads/trang)
  useEffect(() => {
    // Reset page về 1 nếu đổi pageName
    if (prevPageNameRef.current !== pageName) {
      prevPageNameRef.current = pageName;
      if (pageAdsPage !== 1) {
        setPageAdsPage(1);
        return;
      }
    }

    if (!open || !pageName || pageName === "Facebook Ad") {
      setPageAds([]);
      setPageAdsTotal(0);
      setPageAdsPage(1);
      return;
    }

    let isMounted = true;
    async function loadPageAds() {
      setPageAdsLoading(true);
      try {
        const excludeParam = itemId ? `&exclude=${encodeURIComponent(itemId)}` : "";
        const res = await fetch(`/api/pages/${encodeURIComponent(pageName)}/ads?page=${pageAdsPage}&limit=20${excludeParam}`);
        const json = await res.json();
        if (isMounted && json?.success && Array.isArray(json?.data)) {
          setPageAds(json.data);
          if (json?.pagination?.total != null) {
            setPageAdsTotal(json.pagination.total);
          }
        }
      } catch (err) {
        console.warn("Lỗi khi tải quảng cáo của page:", err);
      } finally {
        if (isMounted) setPageAdsLoading(false);
      }
    }

    loadPageAds();
    return () => {
      isMounted = false;
    };
  }, [open, pageName, pageAdsPage, itemId]);

  // Quản lý Similar Ads: tải riêng biệt từ route /api/ads/[id]/similar
  useEffect(() => {
    if (!open || !itemId) {
      setSimilarAds([]);
      setSimilarTotal(null);
      setSimilarLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchSimilar() {
      setSimilarLoading(true);
      try {
        const res = await fetch(`/api/ads/${encodeURIComponent(itemId)}/similar?page=1&limit=15`);
        const json = await res.json();
        if (isMounted && json?.success && Array.isArray(json?.data)) {
          setSimilarAds(json.data);
          if (json?.pagination?.total != null) {
            setSimilarTotal(json.pagination.total);
          }
        }
      } catch (err) {
        console.warn("Lỗi khi tải similar ads:", err);
      } finally {
        if (isMounted) setSimilarLoading(false);
      }
    }

    fetchSimilar();
    return () => {
      isMounted = false;
    };
  }, [open, itemId]);

  // Tự động cuộn lên đầu modal khi chuyển sang xem ad khác
  useEffect(() => {
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [itemId]);

  const handleSelectAd = (targetAd: any) => {
    if (!targetAd) return;
    setPageAdsPage(1);
    setSimilarAds([]);
    setSimilarTotal(null);
    // Cuộn ngay lên đầu modal để user thấy ad mới
    modalBodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    if (onSelectAd) {
      onSelectAd(targetAd);
    }
  };

  const scrollSimilar = (direction: "left" | "right") => {
    if (similarScrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      similarScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  let linkDomain = ad?.domain || snapshot?.domain || ad?.link_url_domain;
  if (!linkDomain && link) {
    try {
      linkDomain = new URL(link).hostname;
    } catch {
      linkDomain = link;
    }
  }

  // Format Helper for timestamps
  const formatTimestamp = (value: any) => {
    if (!value && value !== 0) return "—";
    const num = Number(value);
    if (!Number.isFinite(num)) return value;
    const ms = num > 1e12 ? num : num * 1000;
    return new Date(ms).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Tính số ngày kể từ ngày xuất bản (start_date)
  const calculateDaysSincePublished = (startDateValue: any) => {
    if (!startDateValue && startDateValue !== 0) return null;
    const num = Number(startDateValue);
    if (!Number.isFinite(num)) return null;
    const startMs = num > 1e12 ? num : num * 1000;
    const diffMs = Date.now() - startMs;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return days >= 0 ? days : 0;
  };

  // Format Helper for Currency
  const formatCurrency = (val: any) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return "—";
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  };

  const formatNumber = (val: any) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString("vi-VN");
  };

  const handleCopyId = () => {
    if (itemId) {
      navigator.clipboard.writeText(String(itemId));
      setCopiedId(true);
      toast.success("Đã sao chép Ad ID vào clipboard!");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyText = () => {
    if (description) {
      navigator.clipboard.writeText(description);
      setCopiedText(true);
      toast.success("Đã sao chép nội dung quảng cáo!");
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const favoriteData = {
    id: itemId,
    ad_archive_id: ad?.ad_archive_id || itemId,
    page_name: pageName,
    title,
    description,
    thumbnail: primaryImage || mediaUrl || pageImage,
    text: description,
    link,
    page_profile_image_url: pageImage,
    images: imageList.slice(0, 3),
    videos: snapshotVideos.slice(0, 3),
    ...ad,
  };

  // Growth history array
  const growthHistory: GrowthStep[] = Array.isArray(ad?.growth_history)
    ? ad.growth_history
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[96vw] max-w-6xl h-[88vh] max-h-[calc(100vh-5rem)] p-0 overflow-hidden flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl z-[100]"
      >
        {/* Pinned Sticky Header */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center gap-3.5 min-w-0 pr-4">
            {pageImage ? (
              <img
                src={pageImage}
                alt={pageName}
                className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0">
                FB
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {pageName}
                </DialogTitle>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${ad?.is_active
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${ad?.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                      }`}
                  />
                  {ad?.is_active ? "Đang chạy (Active)" : "Tạm dừng (Paused)"}
                </span>

                {ad?.industry && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    <ShoppingBag className="size-3 text-purple-600" />
                    {getIndustryLabel(ad.industry)}
                  </span>
                )}

                {ad?.scaling_level && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {ad.scaling_level}
                  </span>
                )}
              </div>

              <DialogDescription className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                <span>{linkDomain || "Facebook Ads Spy"}</span>
                {typeof pageLikes === "number" && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500">
                    • <ThumbsUp className="size-3 text-blue-500" /> {formatNumber(pageLikes)} likes
                  </span>
                )}
                {ad?.ad_archive_id && (
                  <span className="hidden sm:inline-flex text-[11px] font-mono text-slate-400">
                    • ID: {ad.ad_archive_id}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>

          {/* Top Right Controls & Sticky Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <FavoriteButton
              itemType="facebook_ad"
              itemId={itemId}
              itemData={favoriteData}
              showText={false}
              className="h-9 w-9 rounded-full border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
            />

            {fbPageUrl && (
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex h-9 rounded-xl border-blue-200 bg-blue-50/70 text-xs font-semibold text-blue-700 hover:bg-blue-100 hover:text-blue-800 shadow-2xs cursor-pointer"
              >
                <a href={fbPageUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                  Fanpage Facebook
                </a>
              </Button>
            )}

            {onFilterByPage && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onFilterByPage(pageName);
                  onOpenChange(false);
                }}
                className="hidden lg:inline-flex h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/80 cursor-pointer shadow-2xs"
                title={`Xem toàn bộ ads của ${pageName} trên trang tìm kiếm (tối đa 20 ads/trang)`}
              >
                <Layers className="mr-1.5 size-3.5 text-indigo-600" />
                Lọc ads của Page (20/trang)
              </Button>
            )}

            {adLibraryUrl && (
              <Button
                asChild
                variant="outline"
                className="hidden sm:inline-flex h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
              >
                <a href={adLibraryUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                  Mở FB Ad Library
                </a>
              </Button>
            )}

            {link && (
              <Button
                asChild
                className="hidden sm:inline-flex h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                  Landing Page
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            )}

            <DialogClose asChild>
              <button
                type="button"
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer border border-slate-200 shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Đóng chi tiết quảng cáo"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div ref={modalBodyRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {loading && !pageName && !mediaUrl && !description ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <div className="flex flex-col items-center gap-3 text-center text-slate-500">
                <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
                <div>
                  <p className="font-bold text-slate-900 text-base">Đang tải phân tích chi tiết quảng cáo...</p>
                  <p className="text-xs text-slate-400 mt-1">Đang đối soát dữ liệu ước tính chi tiêu & thuật toán nhân nhóm</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Subtle top indicator when updating detail in background */}
              {loading && (
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-indigo-50/90 border border-indigo-200/80 text-indigo-800 text-xs font-semibold shadow-xs backdrop-blur-sm animate-pulse">
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin text-indigo-600 shrink-0" />
                    <span>Đang cập nhật số liệu phân tích và ước tính chi tiêu chi tiết cho quảng cáo này...</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded-md font-bold shrink-0">
                    Đang nạp
                  </span>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-12 items-start">
                {/* CỘT TRÁI (7 CỘT): CREATIVE FACEBOOK FEED + THÔNG BÁO VIDEO */}
                <div className="lg:col-span-7 space-y-5">
                  {/* 📌 THÔNG BÁO KỸ THUẬT VỀ VIDEO (NẾU LÀ VIDEO AD) */}
                  {isVideoFormat && (
                    <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 sm:p-5 shadow-sm">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5 border border-amber-200">
                          <AlertTriangle className="size-5 text-amber-700" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-amber-950">
                              Ghi chú kỹ thuật: Video quảng cáo Facebook
                            </h4>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-bold">
                              Tạm thời chưa xem được trực tiếp
                            </span>
                          </div>
                          <p className="text-xs text-amber-900 leading-relaxed">
                            Do chính sách xác thực và thời hạn bảo mật token stream từ máy chủ Facebook CDN, video tạm thời chưa thể giải mã phát trực tiếp trên khung xem này. Đội ngũ kỹ thuật đang cập nhật bộ nạp stream mới.
                          </p>
                          <p className="text-xs text-amber-950 font-semibold">
                            👉 Quý khách có thể xem đầy đủ video gốc, đang phát trực tiếp của chiến dịch bằng cách bấm nút bên dưới:
                          </p>
                          {adLibraryUrl && (
                            <div className="pt-1">
                              <Button
                                asChild
                                size="sm"
                                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-9 px-4 shadow-sm shadow-amber-600/30 cursor-pointer"
                              >
                                <a href={adLibraryUrl} target="_blank" rel="noopener noreferrer">
                                  <Play className="mr-1.5 size-3.5 fill-current" />
                                  Mở xem Video trên Facebook Ads Library
                                  <ExternalLink className="ml-1.5 size-3" />
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Facebook Feed Ad Mockup Frame */}
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 flex items-center justify-between border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        {pageImage ? (
                          <img
                            src={pageImage}
                            alt={pageName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            FB
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            {pageProfileUri ? (
                              <a
                                href={pageProfileUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-slate-900 text-sm hover:underline hover:text-blue-600 flex items-center gap-1"
                              >
                                {pageName}
                                <ExternalLink className="size-3 text-slate-400" />
                              </a>
                            ) : (
                              <span className="font-bold text-slate-900 text-sm">{pageName}</span>
                            )}
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600" />
                          </div>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            Được tài trợ (Sponsored) • <Globe className="h-3 w-3 text-slate-400" />
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyText}
                        className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                      >
                        {copiedText ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Đã chép text</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-slate-400" />
                            <span>Sao chép text</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Post Caption / Body Content */}
                    {description && (
                      <div className="p-4 pt-3 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
                        <div className={`whitespace-pre-wrap ${!expanded ? "line-clamp-5" : ""}`}>
                          {description}
                        </div>
                        {description.length > 220 && (
                          <button
                            type="button"
                            onClick={() => setExpanded(!expanded)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                          >
                            {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Media Showcase */}
                    <div className="relative w-full bg-slate-950 flex items-center justify-center overflow-hidden border-t border-b border-slate-100 min-h-[260px]">
                      {hasPlayableVideo ? (
                        <FacebookMediaFallback
                          src={mediaUrl}
                          alt={title || pageName}
                          className="w-full max-h-[480px] object-contain"
                          fallbackClassName="w-full h-[320px] bg-slate-900 flex items-center justify-center px-4 text-center text-xs text-slate-400"
                          fallbackText="Video quảng cáo đang được cập nhật"
                          isVideo={true}
                          poster={mediaPoster}
                          videoClassName="w-full max-h-[480px] object-contain"
                        />
                      ) : (
                        <div className="relative w-full flex flex-col items-center justify-center bg-slate-900 py-10 px-4 text-center">
                          {primaryImage && primaryImage !== pageImage ? (
                            <FacebookMediaFallback
                              src={primaryImage}
                              alt={title || pageName}
                              className="max-h-[380px] w-auto max-w-full object-contain rounded-lg shadow-md"
                              fallbackClassName="w-full h-[320px] bg-slate-900 flex items-center justify-center px-4 text-center text-xs text-slate-400"
                              fallbackText="Ảnh quảng cáo đang được cập nhật"
                            />
                          ) : (
                            <div className="max-w-md p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-3">
                              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                                <Play className="size-6 fill-current" />
                              </div>
                              <h5 className="font-bold text-white text-sm">
                                {isVideoFormat ? "Định dạng: Video Quảng cáo (VIDEO)" : "Hình ảnh quảng cáo"}
                              </h5>
                              <p className="text-xs text-slate-400">
                                {isVideoFormat
                                  ? "Video trực tiếp được lưu trữ trên máy chủ Facebook Ads Library"
                                  : "Nội dung quảng cáo được bảo lưu thông số phân tích"}
                              </p>
                              {adLibraryUrl && (
                                <Button
                                  asChild
                                  size="sm"
                                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                                >
                                  <a href={adLibraryUrl} target="_blank" rel="noopener noreferrer">
                                    Xem trên Facebook Ad Library
                                    <ExternalLink className="ml-1.5 size-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CTA Footer Bar */}
                    <div className="p-4 bg-slate-50/90 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                          {linkDomain || "facebook.com"}
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                          {title || pageName}
                        </p>
                      </div>

                      {link ? (
                        <Button
                          asChild
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs cursor-pointer shrink-0"
                        >
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            {ctaText}
                            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                          </a>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled
                          className="font-bold text-xs h-9 px-4 rounded-xl shrink-0"
                        >
                          {ctaText}
                        </Button>
                      )}
                    </div>

                    {/* 📊 STATS HIGHLIGHT CARDS: Đặt ngay dưới Video/Feed Creative để đập vào mắt user */}
                    <div className="border-t border-slate-200/80 bg-slate-50/70 p-4 rounded-b-3xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Sparkles className="size-3.5 text-indigo-600" />
                          Mạng lưới quảng cáo liên quan
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Cập nhật theo thời gian thực</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* 1. Thẻ Ads Cùng Domain */}
                        <div className="relative overflow-hidden rounded-2xl border border-purple-200 bg-white p-3.5 shadow-xs transition-all hover:border-purple-300 hover:shadow-md">
                          <div className="flex items-center gap-1.5 text-purple-700">
                            <Globe className="size-3.5 text-purple-600 shrink-0" />
                            <span className="text-[11px] font-bold truncate">Ads cùng Domain</span>
                          </div>
                          <div className="mt-2 flex items-baseline gap-1.5">
                            <span className="text-2xl font-black tracking-tight text-purple-950 font-mono">
                              {loading ? "..." : (ad?.domain_ads_count != null ? Number(ad.domain_ads_count).toLocaleString("vi-VN") : "—")}
                            </span>
                            <span className="text-xs font-semibold text-purple-600">quảng cáo</span>
                          </div>
                          <p className="mt-1 text-[10px] text-slate-500 leading-tight line-clamp-1" title={linkDomain ? `Tên miền: ${linkDomain}` : "Toàn bộ ads trỏ về cùng trang web"}>
                            {linkDomain ? `Domain: ${linkDomain}` : "Đang chạy cùng tên miền"}
                          </p>
                        </div>

                        {/* 2. Thẻ Bản Sao (Duplicates Ads) */}
                        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-white p-3.5 shadow-xs transition-all hover:border-amber-300 hover:shadow-md">
                          <div className="flex items-center gap-1.5 text-amber-700">
                            <Layers className="size-3.5 text-amber-600 shrink-0" />
                            <span className="text-[11px] font-bold truncate">Ads duplicate</span>
                          </div>
                          <div className="mt-2 flex items-baseline gap-1.5">
                            <span className="text-2xl font-black tracking-tight text-amber-950 font-mono">
                              {loading ? "..." : (ad?.duplicates_count != null ? Number(ad.duplicates_count).toLocaleString("vi-VN") : (ad?.clones_count != null ? Number(ad.clones_count).toLocaleString("vi-VN") : "—"))}
                            </span>
                            <span className="text-xs font-semibold text-amber-600">bản sao</span>
                          </div>
                          <p className="mt-1 text-[10px] text-slate-500 leading-tight">
                            Chiến dịch sao chép vít ngân sách
                          </p>
                        </div>

                        {/* 3. Thẻ Ads Cùng Fanpage */}
                        <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-3.5 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
                          <div className="flex items-center gap-1.5 text-blue-700">
                            <Store className="size-3.5 text-blue-600 shrink-0" />
                            <span className="text-[11px] font-bold truncate">Ads cùng Fanpage</span>
                          </div>
                          <div className="mt-2 flex items-baseline gap-1.5">
                            <span className="text-2xl font-black tracking-tight text-blue-950 font-mono">
                              {loading ? "..." : (ad?.page_ads_count != null ? Number(ad.page_ads_count).toLocaleString("vi-VN") : "—")}
                            </span>
                            <span className="text-xs font-semibold text-blue-600">quảng cáo</span>
                          </div>
                          <p className="mt-1 text-[10px] text-slate-500 leading-tight line-clamp-1" title={pageName ? `Trang: ${pageName}` : "Toàn bộ ads phát sóng từ Fanpage này"}>
                            {pageName && pageName !== "Facebook Ad" ? pageName : "Đang chạy từ Fanpage"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CỘT PHẢI (5 CỘT): PHÂN KHU ƯỚC TÍNH - DỰ ĐOÁN & THỐNG KÊ CHI TIẾT */}
                <div className="lg:col-span-5 space-y-5">
                  {/* 🔮 PHÂN KHU ƯỚC TÍNH & DỰ ĐOÁN (ESTIMATION INTELLIGENCE) */}
                  <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50/40 via-white to-white p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                          <Sparkles className="size-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">
                            Ước tính & Dự đoán hiệu suất
                          </h4>
                          <p className="text-[10px] text-slate-500">Phân tích hiệu suất quảng cáo</p>
                        </div>
                      </div>
                    </div>

                    {/* Bento Card 1: Estimated Spend USD */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <DollarSign className="size-4 text-emerald-600" />
                          Chi tiêu ước tính (Estimated Spend)
                        </span>
                        {!loading && ad?.estimated_spend && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                            {ad.estimated_spend}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">
                          {loading ? "..." : formatCurrency(ad?.estimated_spend_usd)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">USD (trung bình)</span>
                      </div>

                      {/* Spend Range Bar */}
                      {!loading && (ad?.estimated_spend_min_usd != null || ad?.estimated_spend_max_usd != null) && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                            <span>Thấp nhất: <strong className="text-slate-900">{formatCurrency(ad?.estimated_spend_min_usd)}</strong></span>
                            <span>Cao nhất: <strong className="text-slate-900">{formatCurrency(ad?.estimated_spend_max_usd)}</strong></span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-600 w-3/5 rounded-full" />
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Bento Card 2: Estimated Reach */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Users className="size-4 text-blue-600" />
                          Lượt tiếp cận ước tính (Estimated Reach)
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900">
                          {loading ? "..." : formatNumber(ad?.estimated_reach)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">người xem</span>
                      </div>

                      {/* Reach Range */}
                      {!loading && (ad?.estimated_reach_min != null || ad?.estimated_reach_max != null) && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                            <span>Min: <strong className="text-slate-900">{formatNumber(ad?.estimated_reach_min)}</strong></span>
                            <span>Max: <strong className="text-slate-900">{formatNumber(ad?.estimated_reach_max)}</strong></span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 w-2/3 rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bento Card 3: Duplication & Scaling Index */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                          <Layers className="size-3 text-amber-600" /> Bản sao đang chạy
                        </span>
                        <p className="text-xl font-black text-slate-900 mt-1">
                          {loading ? "..." : (ad?.duplicates_count ?? ad?.clones_count ?? "—")}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Ad Sets nhân bản</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-indigo-800 uppercase flex items-center gap-1">
                          <Clock className="size-3 text-indigo-600" /> Thời gian chạy
                        </span>
                        <p className="text-xl font-black text-slate-900 mt-1">
                          {loading ? "..." : (ad?.duration_days ?? ad?.filter_signals?.run_days ?? 1)}{" "}
                          <span className="text-xs font-normal text-slate-500">ngày</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5" title="Tuổi ad tính từ ngày bắt đầu chạy đến nay">
                          {loading ? "..." : (() => {
                            const ageDays = ad?.filter_signals?.age_days ?? calculateDaysSincePublished(ad?.start_date);
                            return ageDays !== null && ageDays !== undefined
                              ? `Tuổi: ${ageDays} ngày (từ lúc tạo)`
                              : (ad?.ad_lifecycle_days ? `Tuổi: ${Math.round(ad.ad_lifecycle_days)}d` : "Mới");
                          })()}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                          <Zap className="size-3 text-purple-600" /> Tốc độ bùng nổ
                        </span>
                        <p className="text-xl font-black text-slate-900 mt-1">
                          {loading ? "..." : (ad?.burst ?? "—")}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Burst Index</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold text-rose-800 uppercase flex items-center gap-1">
                          <Flame className="size-3 text-rose-600" /> Điểm Vít (Scaling)
                        </span>
                        <p className="text-xl font-black text-slate-900 mt-1">
                          {loading ? "..." : (ad?.scaling_score ?? ad?.score ?? "—")}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Scaling Score</p>
                      </div>
                    </div>

                    {/* Growth History Timeline (Lịch sử tăng trưởng bản sao) */}
                    {!loading && growthHistory.length > 0 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <TrendingUp className="size-3.5 text-indigo-600" />
                            Lịch sử tăng trưởng bản sao ({growthHistory.length} mốc)
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Vít tăng dần
                          </span>
                        </div>

                        <div className="space-y-2 pt-1">
                          {growthHistory.map((step, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="flex size-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                                  {idx + 1}
                                </span>
                                <span className="text-slate-600 font-medium">{formatTimestamp(step.t)}</span>
                              </div>
                              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                {step.c} bản sao
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* THÔNG SỐ KỸ THUẬT & CHIẾN DỊCH */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-500" />
                        Thông số kỹ thuật & Lịch chạy
                      </h4>
                      {itemId && (
                        <button
                          type="button"
                          onClick={handleCopyId}
                          className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedId ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-700">Đã chép ID</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Chép ID</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-500">Mã Ad Archive ID</span>
                        <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          {ad?.ad_archive_id || itemId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-500">Nền tảng phát sóng</span>
                        <div className="flex items-center gap-1 flex-wrap justify-end">
                          {Array.isArray(ad?.platforms) && ad.platforms.length > 0 ? (
                            ad.platforms.map((p: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {p}
                              </span>
                            ))
                          ) : (
                            <span className="font-medium text-slate-700">Facebook, Instagram</span>
                          )}
                        </div>
                      </div>

                      {/* Quốc gia nhắm mục tiêu / suy luận */}
                      {(() => {
                        const countriesList: string[] = Array.isArray(ad?.countries_lower)
                          ? ad.countries_lower
                          : Array.isArray(ad?.countries)
                          ? ad.countries
                          : ad?.country
                          ? [ad.country]
                          : [];
                        const isInferred = Boolean(ad?.country_inferred);
                        if (countriesList.length === 0 && !ad?.country) return null;

                        return (
                          <div className="flex items-center justify-between py-2">
                            <span className="text-slate-500">Quốc gia</span>
                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                              <span className="font-semibold text-slate-800 uppercase">
                                {countriesList.map((c) => String(c).toUpperCase()).join(", ")}
                              </span>
                              {isInferred && (
                                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                                  suy luận
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-500">Bắt đầu chạy</span>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span className="font-semibold text-slate-800">{formatTimestamp(ad?.start_date)}</span>
                          {(() => {
                            const daysAgo = calculateDaysSincePublished(ad?.start_date);
                            if (daysAgo === null) return null;
                            return (
                              <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                                {daysAgo === 0 ? "Hôm nay" : `${daysAgo} ngày trước`}
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-500">Kết thúc</span>
                        <span className="font-semibold text-slate-800">
                          {ad?.is_active ? "—" : formatTimestamp(ad?.end_date)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-500">Lần đầu phát hiện</span>
                        {loading && !ad?.first_seen ? (
                          <span className="inline-block w-24 h-4 bg-slate-100 animate-pulse rounded" />
                        ) : (
                          <span className="font-semibold text-indigo-600">
                            {formatTimestamp(ad?.first_seen ?? (ad?.start_date ? Number(ad.start_date) * 1000 : null))}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-500">Lần quét gần nhất</span>
                        {loading && !ad?.last_seen ? (
                          <span className="inline-block w-24 h-4 bg-slate-100 animate-pulse rounded" />
                        ) : (
                          <span className="font-semibold text-slate-800">
                            {formatTimestamp(ad?.last_seen)}
                          </span>
                        )}
                      </div>
                    </div>

                    {pageDeleted && (
                      <div className="divide-y divide-slate-100 text-xs mt-2">
                        <div className="flex items-center justify-between py-2 text-rose-600">
                          <span>Trạng thái Fanpage</span>
                          <span className="font-bold">Đã bị vô hiệu hóa/xóa</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Direct Link to Facebook Ads Library */}
                  {adLibraryUrl && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                          <Globe className="size-3.5 text-blue-600" />
                          Thư viện quảng cáo Facebook chính thức
                        </p>
                        <p className="text-[11px] text-blue-700 truncate mt-0.5">
                          Xem video, thông tin minh bạch & báo cáo gốc
                        </p>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-3 rounded-xl shrink-0 cursor-pointer"
                      >
                        <a href={adLibraryUrl} target="_blank" rel="noopener noreferrer">
                          Mở thư viện
                          <ExternalLink className="ml-1 size-3" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* 🚀 PHÂN KHU QUẢNG CÁO TƯƠNG TỰ (SIMILAR ADS - MINEA STYLE HORIZONTAL SCROLL) */}
              <div className="rounded-3xl border-2 border-indigo-200/90 bg-gradient-to-b from-indigo-50/60 via-white to-white p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 flex-wrap">
                        Ads cùng Domain
                        {linkDomain ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                            {linkDomain}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                            Cùng Fanpage: {pageName}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                          {similarTotal != null ? `${similarTotal.toLocaleString("vi-VN")} ads` : `${similarAds.length} ads`}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Khám phá các mẫu creative đang chạy cùng Domain đối thủ • Cuộn ngang (Scroll) để xem tiếp
                      </p>
                    </div>
                  </div>

                  {/* Nút điều hướng cuộn ngang (Horizontal Scroll Controls) */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => scrollSimilar("left")}
                      className="h-8 w-8 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                      title="Cuộn sang trái"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => scrollSimilar("right")}
                      className="h-8 w-8 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                      title="Cuộn sang phải"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>

                {similarLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="size-7 animate-spin text-indigo-600" />
                    <p className="text-xs font-medium">Đang tìm kiếm các quảng cáo cùng Domain...</p>
                  </div>
                ) : similarAds.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
                    <Sparkles className="size-6 text-slate-300 mx-auto mb-2" />
                    Chưa tìm thấy thêm quảng cáo nào khác cùng Domain trong kho dữ liệu hiện tại.
                  </div>
                ) : (
                  /* Thanh cuộn ngang (Horizontal Scroll Track) */
                  <div
                    ref={similarScrollRef}
                    className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                  >
                    {similarAds.map((simAd, idx) => {
                      const simImages = Array.isArray(simAd?.images) ? simAd.images : [];
                      const simVideos = Array.isArray(simAd?.videos) ? simAd.videos : [];
                      const simSnapshot = simAd?.snapshot || {};

                      const simImageItem = simImages.length > 0 ? simImages[0] : (simSnapshot?.images?.[0] || undefined);
                      const simVideoItem = simVideos.length > 0 ? simVideos[0] : (simSnapshot?.videos?.[0] || undefined);

                      const simMediaUrl =
                        simAd?.thumbnail_r2 ||
                        simImageItem?.resized_image_url ||
                        simImageItem?.original_image_url ||
                        simImageItem?.watermarked_resized_image_url ||
                        simVideoItem?.video_hd_url ||
                        simVideoItem?.video_sd_url ||
                        simVideoItem?.thumbnail_url ||
                        simSnapshot?.page_profile_picture_url ||
                        simAd?.thumbnail_local;

                      const simMediaPoster =
                        simImageItem?.resized_image_url ||
                        simImageItem?.original_image_url ||
                        simVideoItem?.thumbnail_url;

                      const simIsVideoFormat =
                        simSnapshot?.display_format === "VIDEO" ||
                        simAd?.display_format === "VIDEO" ||
                        Boolean(simVideoItem?.video_hd_url || simVideoItem?.video_sd_url);

                      const simHasDirectVideoUrl = Boolean(simVideoItem?.video_hd_url || simVideoItem?.video_sd_url);

                      const simSpend = simAd?.estimated_spend_usd != null ? formatCurrency(simAd.estimated_spend_usd) : null;
                      const simId = simAd?.ad_archive_id;
                      const simFbLib = simAd?.ad_library_url || (simId ? `https://www.facebook.com/ads/library/?id=${simId}` : null);
                      const simIndustry = getIndustryLabel(simAd?.industry);
                      const simDuration = simAd?.duration_days;
                      const simDuplicates = simAd?.duplicates_count;

                      return (
                        <div
                          key={simId || idx}
                          onClick={() => handleSelectAd(simAd)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleSelectAd(simAd);
                            }
                          }}
                          className="snap-start shrink-0 w-[240px] sm:w-[260px] rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 flex flex-col justify-between overflow-hidden group/sim cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
                          title={`Xem chi tiết quảng cáo của ${simAd?.page_name || "Facebook Ad"}`}
                        >
                          {/* Media Thumbnail */}
                          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                            <FacebookMediaFallback
                              src={simMediaUrl}
                              alt={simAd?.page_name || "Ad thumbnail"}
                              className="h-full w-full object-cover"
                              fallbackClassName="h-full w-full bg-slate-900 flex flex-col items-center justify-center p-2 text-center text-[10px] text-slate-400 gap-1"
                              fallbackText={simIsVideoFormat ? "Video cần mở Ad Library" : "Ảnh đang được cập nhật"}
                              isVideo={simHasDirectVideoUrl}
                              poster={simMediaPoster}
                              videoClassName="h-full w-full object-cover"
                            />

                            {/* Badges on Thumbnail */}
                            <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
                              {simIsVideoFormat ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                                  <Play className="size-2.5 fill-current text-indigo-400" />
                                  Video
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                                  Ảnh
                                </span>
                              )}

                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold backdrop-blur-md ${simAd?.is_active
                                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                                  : "bg-slate-900/80 text-slate-400 border border-slate-700/30"
                                  }`}
                              >
                                <span className={`size-1 rounded-full ${simAd?.is_active ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
                                {simAd?.is_active ? "Active" : "Paused"}
                              </span>
                            </div>

                            {/* Top Right: Industry Tag */}
                            {simIndustry && (
                              <div className="absolute top-2 right-2 z-10 pointer-events-none">
                                <span className="rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 border border-white/20">
                                  {simIndustry}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Card Body */}
                          <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <p className="font-bold text-xs text-slate-900 truncate group-hover/sim:text-indigo-600 transition-colors">
                                {simAd?.page_name || "Facebook Ad"}
                              </p>
                              <p className="line-clamp-2 text-[11px] text-slate-600 leading-relaxed font-normal">
                                {simAd?.text || "Nội dung quảng cáo Facebook"}
                              </p>
                            </div>

                            {/* Stats Row */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                              <span className="flex items-center gap-1 font-medium">
                                <Calendar className="size-3 text-slate-400" />
                                {simDuration != null ? `${simDuration} ngày` : "Mới chạy"}
                              </span>
                              {simDuplicates != null && (
                                <span className="flex items-center gap-1 font-medium">
                                  <Layers className="size-3 text-amber-500" />
                                  {simDuplicates} bản sao
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="p-3 pt-0 flex items-center justify-between gap-1.5 border-t border-slate-50">
                            <Button
                              type="button"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAd(simAd);
                              }}
                              className="flex-1 h-8 text-[11px] font-bold bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl transition-all cursor-pointer shadow-2xs"
                            >
                              <Eye className="mr-1.5 size-3.5" />
                              Xem Ad này
                            </Button>

                            {simFbLib && (
                              <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                onClick={(e) => e.stopPropagation()}
                                className="h-8 px-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer"
                                title="Mở thư viện Facebook"
                              >
                                <a href={simFbLib} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="size-3.5" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* PHÂN KHU HIỂN THỊ CÁC QUẢNG CÁO CỦA CÙNG FANPAGE (Limit tối đa 20 ads/trang - Cache 10h) */}
              <div className="rounded-3xl border-2 border-indigo-100 bg-slate-50/70 p-5 sm:p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs">
                      <Layers className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 flex-wrap">
                        Quảng cáo từ cùng Fanpage: {pageName}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                          {pageAdsTotal > 0 ? `${pageAdsTotal} ads` : `${pageAds.length} ads`}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Giới hạn tối đa 20 ads / trang • Tự động Cache 10 giờ tại Next.js layer
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {fbPageUrl && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-blue-200 bg-white text-blue-700 hover:bg-blue-50 text-xs font-semibold h-8"
                      >
                        <a href={fbPageUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1.5 size-3 text-blue-600" />
                          Mở Fanpage trên Facebook
                        </a>
                      </Button>
                    )}

                    {onFilterByPage && (
                      <Button
                        size="sm"
                        onClick={() => {
                          onFilterByPage(pageName);
                          onOpenChange(false);
                        }}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-8 cursor-pointer"
                      >
                        Lọc trên trang chính
                      </Button>
                    )}
                  </div>
                </div>

                {pageAdsLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="size-7 animate-spin text-indigo-600" />
                    <p className="text-xs font-medium">Đang tải danh sách quảng cáo của Page (tối đa 20 ads)...</p>
                  </div>
                ) : pageAds.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 p-4">
                    Không tìm thấy thêm quảng cáo nào khác của Fanpage này trong kho dữ liệu hiện tại.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                      {pageAds.map((pAd, idx) => {
                        const pImages = Array.isArray(pAd?.images) ? pAd.images : [];
                        const pVideos = Array.isArray(pAd?.videos) ? pAd.videos : [];
                        const pSnapshot = pAd?.snapshot || {};

                        const pImageItem = pImages.length > 0 ? pImages[0] : (pSnapshot?.images?.[0] || undefined);
                        const pVideoItem = pVideos.length > 0 ? pVideos[0] : (pSnapshot?.videos?.[0] || undefined);

                        const pMediaUrl =
                          pAd?.thumbnail_r2 ||
                          pImageItem?.resized_image_url ||
                          pImageItem?.original_image_url ||
                          pImageItem?.watermarked_resized_image_url ||
                          pVideoItem?.video_hd_url ||
                          pVideoItem?.video_sd_url ||
                          pVideoItem?.thumbnail_url ||
                          pSnapshot?.page_profile_picture_url ||
                          pAd?.thumbnail_local;

                        const pMediaPoster =
                          pImageItem?.resized_image_url ||
                          pImageItem?.original_image_url ||
                          pVideoItem?.thumbnail_url;

                        const pIsVideoFormat =
                          pSnapshot?.display_format === "VIDEO" ||
                          pAd?.display_format === "VIDEO" ||
                          Boolean(pVideoItem?.video_hd_url || pVideoItem?.video_sd_url);

                        const pHasDirectVideoUrl = Boolean(pVideoItem?.video_hd_url || pVideoItem?.video_sd_url);

                        const pSpend = pAd?.estimated_spend_usd != null ? formatCurrency(pAd.estimated_spend_usd) : null;
                        const pScore = pAd?.score;
                        const pId = pAd?.ad_archive_id;
                        const pFbLib = pAd?.ad_library_url || (pId ? `https://www.facebook.com/ads/library/?id=${pId}` : null);

                        return (
                          <div
                            key={pId || idx}
                            onClick={() => handleSelectAd(pAd)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleSelectAd(pAd);
                              }
                            }}
                            className="group/item flex flex-col justify-between p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 text-xs cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
                            title="Click để xem chi tiết quảng cáo này"
                          >
                            <div className="space-y-2">
                              {/* Media Thumbnail */}
                              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                                <FacebookMediaFallback
                                  src={pMediaUrl}
                                  alt="Ad thumbnail"
                                  className="h-full w-full object-cover"
                                  fallbackClassName="h-full w-full bg-slate-900 flex flex-col items-center justify-center p-2 text-center text-[10px] text-slate-400 gap-1"
                                  fallbackText={pIsVideoFormat ? "Video cần mở Ad Library" : "Ảnh đang được cập nhật"}
                                  isVideo={pHasDirectVideoUrl}
                                  poster={pMediaPoster}
                                  videoClassName="h-full w-full object-cover"
                                />

                                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10 pointer-events-none">
                                  {pIsVideoFormat ? (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                                      <Play className="size-2.5 fill-current text-indigo-400" />
                                      Video
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                                      Ảnh
                                    </span>
                                  )}

                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${pAd?.is_active
                                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                                      : "bg-slate-900/80 text-slate-400"
                                      }`}
                                  >
                                    <span className={`size-1 rounded-full ${pAd?.is_active ? "bg-emerald-400" : "bg-slate-400"}`} />
                                    {pAd?.is_active ? "Active" : "Paused"}
                                  </span>
                                </div>

                                {pScore != null && (
                                  <div className="absolute top-1.5 right-1.5 pointer-events-none">
                                    <span className="rounded-full bg-indigo-600/90 text-white text-[9px] font-black px-1.5 py-0.5 shadow-xs">
                                      Score: {pScore}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Ad Text snippet */}
                              <p className="line-clamp-2 text-[11px] text-slate-700 font-medium leading-relaxed group-hover/item:text-indigo-600 transition-colors">
                                {pAd?.text || "Quảng cáo Facebook"}
                              </p>
                            </div>

                            {/* Footer stats & link */}
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px] text-slate-500">
                              <span className="font-bold text-slate-900">
                                {pSpend ? `Spend: ${pSpend}` : formatTimestamp(pAd?.start_date)}
                              </span>

                              {pFbLib && (
                                <a
                                  href={pFbLib}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-0.5 font-bold text-blue-600 hover:text-blue-700 hover:underline p-1"
                                  title="Mở Facebook Ads Library"
                                >
                                  Library <ExternalLink className="size-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination for Page Ads (tối đa 20 ads / page) */}
                    {pageAdsTotal > 20 && (
                      <div className="flex items-center justify-center gap-3 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pageAdsPage === 1}
                          onClick={() => setPageAdsPage((prev) => Math.max(prev - 1, 1))}
                          className="h-8 text-xs rounded-xl bg-white border-slate-200 cursor-pointer"
                        >
                          Trang trước
                        </Button>
                        <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                          Trang {pageAdsPage} / {Math.ceil(pageAdsTotal / 20)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pageAdsPage >= Math.ceil(pageAdsTotal / 20)}
                          onClick={() => setPageAdsPage((prev) => prev + 1)}
                          className="h-8 text-xs rounded-xl bg-white border-slate-200 cursor-pointer"
                        >
                          Trang sau
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
