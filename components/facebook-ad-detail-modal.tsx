"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FavoriteButton } from "@/components/favorite-button";
import { Button } from "@/components/ui/button";
import { FacebookMediaFallback } from "@/components/facebook-media-fallback";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface FacebookAdDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: any;
  loading?: boolean;
}

export function FacebookAdDetailModal({ open, onOpenChange, ad, loading = false }: FacebookAdDetailModalProps) {
  const [expanded, setExpanded] = useState(false);
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
  const ctaText = ad?.cta || ad?.cta_text || snapshot?.cta_text || "—";
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
    } catch (e) {
      linkDomain = link;
    }
  }

  const formatTimestamp = (value: any) => {
    if (!value && value !== 0) return "—";

    const num = Number(value);
    if (!Number.isFinite(num)) return value;

    const ms = num > 1e12 ? num : num * 1000;
    return new Date(ms).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-[80vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {pageImage ? (
              <img
                src={pageImage}
                alt={pageName}
                className="w-12 h-12 rounded-full object-cover border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No</div>
            )}
            <div className="flex-1">
              <DialogTitle className="text-lg font-bold line-clamp-1">{pageName}</DialogTitle>
              <DialogDescription className="text-xs line-clamp-1">{linkDomain || "Facebook Ads Detail"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-4" />

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <p className="font-medium text-foreground">Đang tải chi tiết quảng cáo...</p>
                <p className="text-sm">Vui lòng đợi trong giây lát</p>
              </div>
            </div>
          </div>
        ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {(primaryImage || mediaUrl) && (
              <div className="mb-4">
                <FacebookMediaFallback
                  src={primaryImage || mediaUrl}
                  alt={title || pageName}
                  className="w-full max-h-[55vh] h-[300px] rounded-lg object-cover"
                  fallbackClassName="w-full max-h-[55vh] h-[300px] rounded-lg bg-muted flex items-center justify-center px-4 text-center text-sm text-muted-foreground"
                  fallbackText={isVideo ? "Video hết hạn" : "Ảnh hết hạn"}
                  isVideo={isVideo}
                  poster={mediaPoster}
                  videoClassName="w-full max-h-[55vh] h-[300px] rounded-lg object-cover"
                />
              </div>
            )}

            {imageList.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {imageList.slice(0, 8).map((img: any, idx: number) => (
                  <div key={`${img?.resized_image_url || img?.original_image_url || idx}`} className="h-20 w-full overflow-hidden rounded-md border">
                    <FacebookMediaFallback
                      src={img?.resized_image_url || img?.original_image_url}
                      alt={`${pageName}-${idx + 1}`}
                      className="h-20 w-full rounded-md object-cover"
                      fallbackClassName="h-20 w-full rounded-md bg-muted flex items-center justify-center text-[10px] text-muted-foreground"
                      fallbackText="Ảnh hết hạn"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-3 flex-col md:flex-row">
              <FavoriteButton
                itemType="facebook_ad"
                itemId={itemId}
                itemData={favoriteData}
                showText
                className="flex-1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-semibold text-lg">{title}</div>
              {description && (
                <div className="space-y-2">
                  <div className={`text-sm text-muted-foreground whitespace-pre-wrap leading-6 ${!expanded ? "line-clamp-5" : ""}`}>
                    {description}
                  </div>
                  {description.length > 250 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((prev) => !prev)}
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {expanded ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-1 flex-wrap">
                {ad?.level && <Badge variant="secondary">{ad.level}</Badge>}
                {ad?.scaling_level && <Badge variant="secondary">{ad.scaling_level}</Badge>}
                {ad?.score != null && <Badge variant="secondary">Score: {ad.score}</Badge>}
                {ad?.scaling_score != null && <Badge variant="outline">Scaling: {ad.scaling_score}</Badge>}
                {ad?.is_active && <Badge variant="outline">Đang chạy</Badge>}
                {ad?.funnel && <Badge variant="outline">Funnel: {ad.funnel}</Badge>}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
              <div><span className="font-semibold">ID quảng cáo:</span> {itemId}</div>
              <div><span className="font-semibold">ID lưu trữ:</span> {ad?.ad_archive_id || "—"}</div>
              <div><span className="font-semibold">Trang/Page:</span> {pageName}</div>
              <div><span className="font-semibold">Page đã bị xóa:</span> {pageDeleted ? "Có" : "Không"}</div>
              <div><span className="font-semibold">Danh mục:</span> {categories.length > 0 ? categories.join(", ") : "—"}</div>
              <div><span className="font-semibold">Trạng thái đang chạy:</span> {ad?.is_active ? "Đang chạy" : "Không chạy"}</div>
              <div><span className="font-semibold">CTA text:</span> {ctaText}</div>
              <div><span className="font-semibold">CTA type:</span> {ctaType}</div>
              <div><span className="font-semibold">Nền tảng:</span> {Array.isArray(ad?.platforms) ? ad.platforms.join(", ") : "—"}</div>
              <div><span className="font-semibold">Số lần nhìn thấy:</span> {ad?.seen_count ?? "—"}</div>
              <div><span className="font-semibold">Burst:</span> {ad?.burst ?? "—"}</div>
              <div><span className="font-semibold">Delta:</span> {ad?.delta ?? "—"}</div>
              <div><span className="font-semibold">Smooth delta:</span> {ad?.smooth_delta ?? "—"}</div>
              <div><span className="font-semibold">Ngày bắt đầu:</span> {formatTimestamp(ad?.start_date)}</div>
              <div><span className="font-semibold">Ngày kết thúc:</span> {formatTimestamp(ad?.end_date)}</div>
              <div><span className="font-semibold">Lần đầu thấy:</span> {formatTimestamp(ad?.first_seen)}</div>
              <div><span className="font-semibold">Lần cuối thấy:</span> {formatTimestamp(ad?.last_seen)}</div>
              {link && (
                <div><span className="font-semibold">Link:</span> <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{link}</a></div>
              )}
              {linkDomain && <div><span className="font-semibold">Domain:</span> {linkDomain}</div>}
            </div>
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
