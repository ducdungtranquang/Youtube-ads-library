"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
import { FacebookMediaFallback } from "@/components/facebook-media-fallback";
import {
  ExternalLink,
  Heart,
  MessageCircle,
  Play,
  Share2,
  DollarSign,
  Users,
  Copy,
  Calendar,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { getIndustryLabel } from "@/lib/constants/industries";

interface FacebookAdCardProps {
  ad: any;
  onClick?: () => void;
  onFilterByPage?: (pageName: string) => void;
}

export function FacebookAdCard({ ad, onClick, onFilterByPage }: FacebookAdCardProps) {
  const images = Array.isArray(ad?.images) ? ad.images : [];
  const videos = Array.isArray(ad?.videos) ? ad.videos : [];
  const snapshot = ad?.snapshot || {};

  const imageItem = images.length > 0 ? images[0] : (snapshot?.images?.[0] || undefined);
  const videoItem = videos.length > 0 ? videos[0] : (snapshot?.videos?.[0] || undefined);

  const mediaUrl =
    imageItem?.resized_image_url ||
    imageItem?.original_image_url ||
    imageItem?.watermarked_resized_image_url ||
    videoItem?.video_hd_url ||
    videoItem?.video_sd_url ||
    videoItem?.thumbnail_url ||
    snapshot?.page_profile_picture_url ||
    ad?.thumbnail_local;

  const mediaPoster =
    imageItem?.resized_image_url ||
    imageItem?.original_image_url ||
    videoItem?.thumbnail_url;

  const isVideoFormat =
    ad?.snapshot?.display_format === "VIDEO" ||
    ad?.display_format === "VIDEO" ||
    Boolean(videoItem?.video_hd_url || videoItem?.video_sd_url);

  const hasDirectVideoUrl = Boolean(videoItem?.video_hd_url || videoItem?.video_sd_url);

  const title =
    ad?.headline ||
    ad?.snapshot?.title ||
    ad?.text?.split(/\n/)[0]?.trim() ||
    ad?.page_name ||
    ad?.ad_archive_id ||
    "Facebook Ad";

  const description = ad?.text || ad?.description || snapshot?.body?.text || "";
  const link = ad?.link || ad?.link_url || snapshot?.link_url || "";
  const pageName = ad?.page_name || snapshot?.page_name || "Facebook Ad";
  const pageProfile = ad?.page_profile_image_url || snapshot?.page_profile_picture_url;
  const pageId = ad?.page_id || snapshot?.page_id;
  const fbPageUrl =
    snapshot?.page_profile_uri ||
    ad?.page_profile_uri ||
    (pageId ? `https://www.facebook.com/${pageId}` : null) ||
    (pageName && pageName !== "Facebook Ad" ? `https://www.facebook.com/search/top?q=${encodeURIComponent(pageName)}` : null);
  const itemId = ad?.ad_archive_id || ad?._id || ad?.id || ad?.ad_id || ad?.archive_id;

  // Format Helper for USD
  const formatUSD = (val: any) => {
    const num = Number(val);
    if (!Number.isFinite(num) || num === 0) return null;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}k`;
    return `$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  // Format Helper for numbers
  const formatCompact = (val: any) => {
    const num = Number(val);
    if (!Number.isFinite(num) || num === 0) return null;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString("vi-VN");
  };

  const spendUSD = formatUSD(ad?.estimated_spend_usd);
  const reachFormatted = formatCompact(ad?.estimated_reach);
  const duplicates = ad?.duplicates_count ?? ad?.clones_count ?? ad?.filter_signals?.duplicates_count;
  const durationDays = ad?.duration_days ?? ad?.filter_signals?.age_days;

  const favoriteData = {
    id: itemId,
    ad_archive_id: ad?.ad_archive_id || itemId,
    page_name: pageName,
    title: description ? description.slice(0, 80) : title,
    description,
    thumbnail: mediaUrl || pageProfile,
    text: description,
    link,
    page_profile_image_url: pageProfile,
    images: images.slice(0, 3),
    videos: videos.slice(0, 3),
    ...ad,
  };

  return (
    <Card
      className="group h-full overflow-hidden rounded-2xl border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <CardContent className="flex flex-1 flex-col p-0">
        {/* Media Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          <FacebookMediaFallback
            src={mediaUrl}
            alt={title || pageName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            fallbackClassName="h-full w-full bg-slate-900 flex flex-col items-center justify-center p-3 text-center text-xs text-slate-400 gap-1.5"
            fallbackText={isVideoFormat ? "Video cần mở Ad Library" : "Ảnh đang được cập nhật"}
            isVideo={hasDirectVideoUrl}
            poster={mediaPoster}
            videoClassName="h-full w-full object-cover"
          />

          {/* Badges on Thumbnail */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10 pointer-events-none">
            {isVideoFormat ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                <Play className="size-3 fill-current text-indigo-400" />
                Video Ad
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                Ảnh Ad
              </span>
            )}

            {ad?.is_active != null && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur-md shadow-sm ${ad.is_active
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-900/80 text-slate-400 border border-slate-700/30"
                  }`}
              >
                <span
                  className={`size-1.5 rounded-full ${ad.is_active ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
                    }`}
                />
                {ad.is_active ? "Active" : "Paused"}
              </span>
            )}
          </div>


          {/* Video technical note overlay if it is video format without streamable URL */}
          {isVideoFormat && !hasDirectVideoUrl && (
            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-xs text-amber-300 text-[10px] px-2 py-1 rounded-lg flex items-center justify-between border border-amber-500/20">
              <span className="flex items-center gap-1 truncate font-medium">
                <AlertTriangle className="size-3 shrink-0 text-amber-400" />
                Xem video trên FB Ads Library
              </span>
              <span className="text-[9px] underline text-indigo-300 ml-1 shrink-0 font-bold">
                Chi tiết →
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-4">
          {/* Page Info & Title */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              {pageProfile ? (
                <img
                  src={pageProfile}
                  alt={pageName}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                  FB
                </div>
              )}
              {onFilterByPage ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterByPage(pageName);
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-indigo-600 truncate hover:underline text-left cursor-pointer transition-colors"
                  title={`Lọc ads của Fanpage "${pageName}" (tối đa 20 ads/trang)`}
                >
                  {pageName}
                </button>
              ) : (
                <p className="text-xs font-semibold text-slate-600 truncate">{pageName}</p>
              )}
            </div>

            {/* Direct Link to Facebook Fanpage */}
            {fbPageUrl && (
              <a
                href={fbPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-blue-200/60 shrink-0 cursor-pointer shadow-2xs"
                title={`Mở Fanpage "${pageName}" trên Facebook`}
              >
                <span>Fanpage</span>
                <ExternalLink className="size-2.5" />
              </a>
            )}
          </div>

          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>

          {description && (
            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* 📊  ESTIMATED STATS GRID (Ước tính & Dự đoán) */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            {/* Chi tiêu ước tính */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <DollarSign className="size-3 text-emerald-600" />
                Ước tính Spend
              </span>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                {spendUSD || "—"}
              </p>
            </div>

            {/* Lượt tiếp cận ước tính */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <Users className="size-3 text-blue-600" />
                Ước tính Reach
              </span>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                {reachFormatted || "—"}
              </p>
            </div>
          </div>

          {/* Secondary Stats Row (Duplicates, Days running, Level) */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Layers className="size-3 text-amber-500" />
              {duplicates != null ? `${duplicates} bản sao` : "1 bản sao"}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="size-3 text-slate-400" />
              {durationDays != null ? `${durationDays} ngày chạy` : "Mới chạy"}
            </span>
          </div>

          {/* Tags / Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ad?.scaling_level && (
              <Badge
                variant="secondary"
                className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border-indigo-200"
              >
                {ad.scaling_level}
              </Badge>
            )}
            {ad?.industry && (
              <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 text-slate-600 bg-slate-50 border-slate-200">
                {getIndustryLabel(ad.industry)}
              </Badge>
            )}
            {ad?.cta && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 text-slate-600 border-slate-200">
                {ad.cta}
              </Badge>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div onClick={(e) => e.stopPropagation()}>
              <FavoriteButton
                itemType="facebook_ad"
                itemId={itemId}
                itemData={favoriteData}
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-xl bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                showText={false}
              />
            </div>

            <div className="flex items-center gap-1.5">
              {ad?.ad_library_url && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] font-semibold px-2.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={ad.ad_library_url} target="_blank" rel="noopener noreferrer">
                    Ad Library <ExternalLink className="ml-1 size-3 text-slate-400" />
                  </a>
                </Button>
              )}

              {link && (
                <Button
                  size="sm"
                  className="h-8 text-[11px] font-bold px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    Landing Page <ExternalLink className="ml-1 size-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
