"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorite-button";
import { Button } from "@/components/ui/button";
import { FacebookMediaFallback } from "@/components/facebook-media-fallback";
import {
  Loader2, X, ExternalLink, Copy, Check, Eye, Flame, Zap,
  TrendingUp, Calendar, Globe, Sparkles, Layers, Clock, Share2, Shield
} from "lucide-react";
import { toast } from "sonner";

interface FacebookAdDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: any;
  loading?: boolean;
}

export function FacebookAdDetailModal({ open, onOpenChange, ad, loading = false }: FacebookAdDetailModalProps) {
  const [expanded, setExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const snapshot = ad?.snapshot ?? {};

  const attachments = Array.isArray(ad?.attachments) ? ad.attachments : [];
  const snapshotCards = Array.isArray(snapshot?.cards) ? snapshot.cards : [];
  const attachment = attachments.length > 0 ? attachments[0] : snapshotCards.length > 0 ? snapshotCards[0] : undefined;

  // Đảm bảo videos là mảng hợp lệ
  const snapshotVideos = Array.isArray(snapshot?.videos) ? snapshot.videos : [];
  const snapshotVideo = snapshotVideos.length > 0 ? snapshotVideos[0] : undefined;
  const mediaUrl = attachment?.media_url || snapshotVideo?.video_hd_url || snapshotVideo?.video_sd_url;
  const mediaPoster = attachment?.media_poster_url || snapshotVideo?.video_preview_image_url;
  const isVideo = attachment?.media_url_type === "video" || Boolean(snapshotVideo);

  const pageImage = ad?.page_profile_image_url || snapshot?.page_profile_picture_url || ad?.snapshot?.page_profile_picture_url;
  const pageName = ad?.page_name || snapshot?.page_name || "Facebook Ad";
  const pageDeleted = snapshot?.page_is_deleted ?? ad?.page_is_deleted ?? false;
  const categories = Array.isArray(snapshot?.page_categories) && snapshot.page_categories.length > 0
    ? snapshot.page_categories
    : Array.isArray(ad?.categories) && ad.categories.length > 0
      ? ad.categories
      : [];
  const ctaText = ad?.cta || ad?.cta_text || snapshot?.cta_text || "Tìm hiểu thêm";
  const ctaType = ad?.cta_type || snapshot?.cta_type || "—";
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
  const primaryImage = imageList[0]?.resized_image_url || imageList[0]?.original_image_url || mediaUrl;
  const itemId = ad?.ad_archive_id || ad?._id || ad?.id || ad?.ad_id || ad?.archive_id;

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

  let linkDomain = ad?.domain || snapshot?.domain || ad?.link_url_domain;
  if (!linkDomain && link) {
    try {
      linkDomain = new URL(link).hostname;
    } catch {
      linkDomain = link;
    }
  }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl"
      >
        {/* Pinned Header (Fixed top bar, never scrolls) */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3.5 min-w-0 pr-4">
            {pageImage ? (
              <img
                src={pageImage}
                alt={pageName}
                className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs flex-shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                FB
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base sm:text-lg font-black text-slate-900 truncate">
                  {pageName}
                </DialogTitle>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${ad?.is_active
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${ad?.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {ad?.is_active ? "Đang chạy" : "Tạm dừng"}
                </span>
              </div>
              <DialogDescription className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 truncate">
                <span>{linkDomain || "Facebook Ads Spy"}</span>
                {categories.length > 0 && (
                  <span className="hidden sm:inline-flex text-[11px] text-slate-400">
                    • {categories[0]}
                  </span>
                )}
                {ad?.scaling_level && (
                  <span className="hidden sm:inline-flex text-[11px] font-bold text-amber-600">
                    • {ad.scaling_level}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>

          {/* Top Right Controls & PINNED CLOSE BUTTON */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <FavoriteButton
              itemType="facebook_ad"
              itemId={itemId}
              itemData={favoriteData}
              showText={false}
              className="h-9 w-9 rounded-full border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
            />

            {link && (
              <Button
                asChild
                variant="outline"
                className="hidden sm:inline-flex h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer"
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                  Mở link đích
                </a>
              </Button>
            )}

            {/* Permanent Sticky Close Button */}
            <DialogClose asChild>
              <button
                type="button"
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Đóng chi tiết quảng cáo"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {loading ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <div className="flex flex-col items-center gap-3 text-center text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <div>
                  <p className="font-bold text-slate-900">Đang tải chi tiết quảng cáo...</p>
                  <p className="text-xs text-slate-400 mt-1">Đang Nghiên cứu dữ liệu creative & chỉ số vít nhóm</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-12 items-start">
              {/* Left Column: Realistic Facebook Feed Ad Creative (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      {pageImage ? (
                        <img
                          src={pageImage}
                          alt={pageName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          FB
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm">{pageName}</span>
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
                      className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                    >
                      {copiedText ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                          <span>Sao chép text</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Post Caption / Body */}
                  {description && (
                    <div className="p-4 pt-3 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
                      <div className={`whitespace-pre-wrap ${!expanded ? "line-clamp-4" : ""}`}>
                        {description}
                      </div>
                      {description.length > 200 && (
                        <button
                          type="button"
                          onClick={() => setExpanded(!expanded)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Media Showcase */}
                  {(primaryImage || mediaUrl) && (
                    <div className="relative w-full bg-slate-950 flex items-center justify-center overflow-hidden border-t border-b border-slate-100">
                      <FacebookMediaFallback
                        src={primaryImage || mediaUrl}
                        alt={title || pageName}
                        className="w-full max-h-[460px] object-contain"
                        fallbackClassName="w-full h-[320px] bg-slate-900 flex items-center justify-center px-4 text-center text-xs text-slate-400"
                        fallbackText={isVideo ? "Video quảng cáo không còn khả dụng trên Facebook" : "Hình ảnh quảng cáo đã hết hạn lưu trữ"}
                        isVideo={isVideo}
                        poster={mediaPoster}
                        videoClassName="w-full max-h-[460px] object-contain"
                      />
                    </div>
                  )}

                  {/* Thumbnail Carousel if multiple images */}
                  {imageList.length > 1 && (
                    <div className="p-3 bg-slate-50 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500 mb-2">Bộ sưu tập ảnh ({imageList.length})</p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {imageList.slice(0, 6).map((img: any, idx: number) => (
                          <div key={idx} className="h-16 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-2xs">
                            <FacebookMediaFallback
                              src={img?.resized_image_url || img?.original_image_url}
                              alt={`${pageName}-${idx + 1}`}
                              className="h-full w-full object-cover"
                              fallbackClassName="h-full w-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-400"
                              fallbackText="Ảnh"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Footer Bar */}
                  <div className="p-4 bg-slate-50/80 flex items-center justify-between gap-3">
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
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-sm cursor-pointer flex-shrink-0"
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
                        className="font-bold text-xs h-9 px-4 rounded-xl flex-shrink-0"
                      >
                        {ctaText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Growth & Spy Intelligence Bento (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* 4 Bento Metric Cards */}
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Card 1: Scaling Score */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-amber-50/20 border border-amber-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Điểm vít nhóm</p>
                      <Flame className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2 truncate">
                      {ad?.scaling_score ?? ad?.score ?? "N/A"}
                    </p>
                    <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                      {ad?.scaling_level || "Scaling Score"}
                    </p>
                  </div>

                  {/* Card 2: Seen Count */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-blue-50/20 border border-blue-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Lượt quét thấy</p>
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2 truncate">
                      {ad?.seen_count ?? "1"}
                    </p>
                    <p className="text-[10px] text-blue-700 font-medium mt-0.5">Số lần phát hiện ads</p>
                  </div>

                  {/* Card 3: Burst */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 to-purple-50/20 border border-purple-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Tốc độ bùng nổ</p>
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2 truncate">
                      {ad?.burst ?? "—"}
                    </p>
                    <p className="text-[10px] text-purple-700 font-medium mt-0.5">Burst Index</p>
                  </div>

                  {/* Card 4: Delta */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-emerald-50/20 border border-emerald-200/80 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Độ tăng trưởng</p>
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-xl font-black text-slate-900 mt-2 truncate">
                      {ad?.smooth_delta ?? ad?.delta ?? "—"}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Smooth Delta</p>
                  </div>
                </div>

                {/* Campaign Strategy & Funnel */}
                {(ad?.funnel || ad?.level) && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-indigo-600" />
                      Chiến lược phễu & Phân loại
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ad?.funnel && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
                          Phễu: {ad.funnel}
                        </span>
                      )}
                      {ad?.level && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
                          Level: {ad.level}
                        </span>
                      )}
                      {ctaType && ctaType !== "—" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                          CTA: {ctaType}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Technical Specs & Schedule Card */}
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
                        className="text-xs font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors"
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
                      <span className="text-slate-500">Mã Ad ID</span>
                      <span className="font-mono font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                        {itemId}
                      </span>
                    </div>

                    {ad?.ad_archive_id && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-500">Archive ID</span>
                        <span className="font-mono font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                          {ad.ad_archive_id}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Nền tảng hiển thị</span>
                      <div className="flex items-center gap-1 flex-wrap justify-end">
                        {Array.isArray(ad?.platforms) && ad.platforms.length > 0 ? (
                          ad.platforms.map((p: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="font-medium text-slate-700">Facebook, Instagram</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Ngày bắt đầu chạy</span>
                      <span className="font-semibold text-slate-800">{formatTimestamp(ad?.start_date)}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Ngày kết thúc</span>
                      <span className="font-semibold text-slate-800">{formatTimestamp(ad?.end_date)}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Lần đầu phát hiện</span>
                      <span className="font-semibold text-blue-600">{formatTimestamp(ad?.first_seen)}</span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-500">Lần quét gần nhất</span>
                      <span className="font-semibold text-slate-800">{formatTimestamp(ad?.last_seen)}</span>
                    </div>

                    {pageDeleted && (
                      <div className="flex items-center justify-between py-2 text-rose-600">
                        <span>Trạng thái Fanpage</span>
                        <span className="font-bold">Đã bị vô hiệu hóa/xóa</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Link Landing Page banner if available */}
                {link && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-blue-600" />
                        Đích đến quảng cáo (Landing Page)
                      </p>
                      <p className="text-xs text-blue-700 truncate mt-0.5">{link}</p>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-3 rounded-lg flex-shrink-0 cursor-pointer"
                    >
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        Mở link
                        <ExternalLink className="ml-1 h-3 w-3" />
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
