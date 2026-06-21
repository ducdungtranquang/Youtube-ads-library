"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FavoriteButton } from "@/components/favorite-button";
import { Button } from "@/components/ui/button";

interface FacebookAdDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: any;
}

export function FacebookAdDetailModal({ open, onOpenChange, ad }: FacebookAdDetailModalProps) {
  const snapshot = ad.snapshot ?? {};
  const attachment = ad.attachments?.[0] ?? snapshot.cards?.[0];
  const snapshotVideo = snapshot.videos?.[0];
  const mediaUrl = attachment?.media_url || snapshotVideo?.video_hd_url || snapshotVideo?.video_sd_url;
  const mediaPoster = attachment?.media_poster_url || snapshotVideo?.video_preview_image_url;
  const isVideo = attachment?.media_url_type === "video" || Boolean(snapshotVideo);
  const pageImage = ad.page_profile_image_url || snapshot.page_profile_picture_url;
  const pageName = ad.page_name || snapshot.page_name;
  const title = attachment?.title || ad.headline || ad.cta_text || snapshot.title || pageName;
  const link = ad.link_url || ad.link || snapshot.link_url;
  let linkDomain = ad.link_url_domain;
  if (!linkDomain && link) {
    try {
      linkDomain = new URL(link).hostname;
    } catch (e) {
      linkDomain = link;
    }
  }

  const itemId = ad.ad_archive_id || ad._id || ad.id;

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
              <DialogDescription className="text-xs line-clamp-1">{linkDomain}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-4" />
        {mediaUrl && (
          isVideo ? (
            <video
              src={mediaUrl}
              poster={mediaPoster || undefined}
              controls
              className="w-full max-h-[50vh] rounded-lg mb-2"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={title || pageName}
              className="w-full max-h-[50vh] rounded-lg mb-2"
            />
          )
        )}
        <div className="flex gap-3 flex-col md:flex-row my-2">
          <FavoriteButton
            itemType="facebook_ad"
            itemId={itemId}
            itemData={ad}
            showText
            className="flex-1"
          />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="font-semibold text-base line-clamp-2">{title}</div>
          {(attachment?.description || ad.description || ad.text || snapshot.body?.text) && (
            <div className="text-sm text-muted-foreground line-clamp-4">
              {attachment?.description || ad.description || ad.text || snapshot.body?.text}
            </div>
          )}
          <div className="flex gap-2 mt-2 flex-wrap">
            {ad.format && <Badge variant="secondary">{ad.format}</Badge>}
            {snapshot.display_format && <Badge variant="secondary">{snapshot.display_format}</Badge>}
            {(ad.cta_type || ad.cta || snapshot.cta_type) && (
              <Badge variant="secondary">{ad.cta_type || ad.cta || snapshot.cta_type}</Badge>
            )}
            {ad.level && <Badge variant="secondary">{ad.level}</Badge>}
            {ad.aggregated_archive_ads?.is_active && <Badge variant="secondary">Đang chạy</Badge>}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div><span className="font-semibold">ID quảng cáo:</span> {itemId}</div>
            <div><span className="font-semibold">Ad archive ID:</span> {ad.ad_archive_id}</div>
            <div><span className="font-semibold">Loại tài sản:</span> {ad.asset_type || snapshot.display_format}</div>
            <div><span className="font-semibold">CTA:</span> {ad.cta_text || ad.cta || snapshot.cta_text}</div>
            <div><span className="font-semibold">Loại CTA:</span> {ad.cta_type || snapshot.cta_type}</div>
            <div><span className="font-semibold">Ngôn ngữ:</span> {ad.lang_iso_code}</div>
            <div><span className="font-semibold">Ngày tạo:</span> {ad.creation_date}</div>
            <div><span className="font-semibold">Ngày bắt đầu:</span> {ad.first_seen || ad.first_seen_date}</div>
            <div><span className="font-semibold">Ngày cuối:</span> {ad.last_seen || ad.last_seen_date}</div>
            <div><span className="font-semibold">Ngày chạy:</span> {ad.days_running}</div>
            <div><span className="font-semibold">ID page:</span> {ad.page_id}</div>
            <div><span className="font-semibold">Tên page:</span> {pageName}</div>
            {ad.page_link_url && (
              <div><span className="font-semibold">Link page:</span> <a href={ad.page_link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{ad.page_link_url}</a></div>
            )}
            {link && (
              <div><span className="font-semibold">Link quảng cáo:</span> <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{link}</a></div>
            )}
            {linkDomain && <div><span className="font-semibold">Tên miền:</span> {linkDomain}</div>}
            {ad.platforms && Array.isArray(ad.platforms) && <div><span className="font-semibold">Platforms:</span> {ad.platforms.join(", ")}</div>}
            {ad.level && <div><span className="font-semibold">Level:</span> {ad.level}</div>}
            {ad.scaling_level && <div><span className="font-semibold">Scaling:</span> {ad.scaling_level}</div>}
            {ad.score != null && <div><span className="font-semibold">Score:</span> {ad.score}</div>}
            {ad.scaling_score != null && <div><span className="font-semibold">Scaling score:</span> {ad.scaling_score}</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
