"use client";

import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FacebookAdDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: any;
  loading?: boolean;
}

export function FacebookAdDetailModal({
  open,
  onOpenChange,
  ad,
  loading = false,
}: FacebookAdDetailModalProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [activeTab, setActiveTab] = useState("estimates");

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
    attachment?.media_url ||
    snapshotVideo?.video_hd_url ||
    snapshotVideo?.video_sd_url;
  const mediaPoster =
    attachment?.media_poster_url ||
    snapshotVideo?.video_preview_image_url ||
    ad?.thumbnail_local;

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

  const title =
    ad?.headline ||
    snapshot?.title ||
    ad?.text?.split(/\n/)[0]?.trim() ||
    snapshot?.body?.text?.split(/\n/)[0]?.trim() ||
    pageName;

  const description =
    ad?.description ||
    ad?.text ||
    snapshot?.body?.text ||
    snapshot?.caption ||
    ad?.normalized_text ||
    "";

  const link = ad?.link || ad?.link_url || snapshot?.link_url || null;
  const adImages = Array.isArray(ad?.images) ? ad.images : [];
  const snapshotImages = Array.isArray(snapshot?.images) ? snapshot.images : [];
  const imageList = adImages.length > 0 ? adImages : snapshotImages.length > 0 ? snapshotImages : [];
  const primaryImage =
    imageList[0]?.resized_image_url || imageList[0]?.original_image_url || mediaUrl || pageImage;

  const itemId = ad?.ad_archive_id || ad?._id || ad?.id || ad?.ad_id || ad?.archive_id;
  const adLibraryUrl = ad?.ad_library_url || (itemId ? `https://www.facebook.com/ads/library/?id=${itemId}` : null);
  const pageProfileUri = snapshot?.page_profile_uri || ad?.page_profile_uri;

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
  const growthHistory: Array<{ t: number; c: number }> = Array.isArray(ad?.growth_history)
    ? ad.growth_history
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[96vw] max-w-6xl h-[92vh] p-0 overflow-hidden flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl"
      >
        {/* Pinned Sticky Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
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

                {ad?.level && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                    {ad.level}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {loading ? (
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
                          <img
                            src={primaryImage}
                            alt={title || pageName}
                            className="max-h-[380px] w-auto max-w-full object-contain rounded-lg"
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
                        <p className="text-[10px] text-slate-500"> & FB Analyzer Algorithm</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      AI Estimate
                    </Badge>
                  </div>

                  {/* Bento Card 1: Estimated Spend USD */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <DollarSign className="size-4 text-emerald-600" />
                        Chi tiêu ước tính (Estimated Spend)
                      </span>
                      {ad?.estimated_spend && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          {ad.estimated_spend}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900">
                        {formatCurrency(ad?.estimated_spend_usd)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">USD (trung bình)</span>
                    </div>

                    {/* Spend Range Bar */}
                    {(ad?.estimated_spend_min_usd != null || ad?.estimated_spend_max_usd != null) && (
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

                    {ad?.cpm_used != null && (
                      <p className="text-[11px] text-slate-500 pt-1">
                        CPM cơ sở tính toán: <strong className="text-slate-700">${ad.cpm_used} / 1k views</strong>
                      </p>
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
                        {formatNumber(ad?.estimated_reach)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">người xem</span>
                    </div>

                    {/* Reach Range */}
                    {(ad?.estimated_reach_min != null || ad?.estimated_reach_max != null) && (
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
                        {ad?.duplicates_count ?? ad?.clones_count ?? "1"}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Ad Sets nhân bản</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-indigo-800 uppercase flex items-center gap-1">
                        <Calendar className="size-3 text-indigo-600" /> Tuổi thọ chiến dịch
                      </span>
                      <p className="text-xl font-black text-slate-900 mt-1">
                        {ad?.duration_days ?? "—"} <span className="text-xs font-normal text-slate-500">ngày</span>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Vòng đời: {ad?.ad_lifecycle_days ? `${Math.round(ad.ad_lifecycle_days)}d` : "Mới"}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                        <Zap className="size-3 text-purple-600" /> Tốc độ bùng nổ
                      </span>
                      <p className="text-xl font-black text-slate-900 mt-1">
                        {ad?.burst ?? "—"}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Burst Index</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-rose-800 uppercase flex items-center gap-1">
                        <Flame className="size-3 text-rose-600" /> Điểm Vít (Scaling)
                      </span>
                      <p className="text-xl font-black text-slate-900 mt-1">
                        {ad?.scaling_score ?? ad?.score ?? "—"}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Scaling Score</p>
                    </div>
                  </div>

                  {/* Growth History Timeline (Lịch sử tăng trưởng bản sao) */}
                  {growthHistory.length > 0 && (
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

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Bắt đầu chạy</span>
                      <span className="font-semibold text-slate-800">{formatTimestamp(ad?.start_date)}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Kết thúc</span>
                      <span className="font-semibold text-slate-800">{formatTimestamp(ad?.end_date)}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Lần đầu phát hiện</span>
                      <span className="font-semibold text-indigo-600">{formatTimestamp(ad?.first_seen)}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Lần quét gần nhất</span>
                      <span className="font-semibold text-slate-800">{formatTimestamp(ad?.last_seen)}</span>
                    </div>

                    {ad?.domain_ads_count != null && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-500">Số ads cùng Domain</span>
                        <span className="font-bold text-slate-900">{ad.domain_ads_count} ads</span>
                      </div>
                    )}

                    {ad?.page_ads_count != null && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-500">Số ads cùng Fanpage</span>
                        <span className="font-bold text-slate-900">{ad.page_ads_count} ads</span>
                      </div>
                    )}

                    {pageDeleted && (
                      <div className="flex items-center justify-between py-2 text-rose-600">
                        <span>Trạng thái Fanpage</span>
                        <span className="font-bold">Đã bị vô hiệu hóa/xóa</span>
                      </div>
                    )}
                  </div>
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
