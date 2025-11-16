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
  const attachment = ad.attachments?.[0];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img
              src={ad.page_profile_image_url}
              alt={ad.page_name}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div className="flex-1">
              <DialogTitle className="text-lg font-bold line-clamp-1">{ad.page_name}</DialogTitle>
              <DialogDescription className="text-xs line-clamp-1">{ad.link_url_domain}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-4" />
        {attachment?.media_url && (
          attachment.media_url_type === "video" ? (
            <video
              src={attachment.media_url}
              poster={attachment.media_poster_url || undefined}
              controls
              className="w-full rounded-lg mb-2"
            />
          ) : (
            <img
              src={attachment.media_url}
              alt={attachment.title || ad.page_name}
              className="w-full rounded-lg mb-2"
            />
          )
        )}
        {/* Favorite button giống brands modal */}
        <div className="flex gap-3 flex-col md:flex-row my-2">
          <FavoriteButton
            itemType="facebook_ad"
            itemId={ad.id}
            itemData={ad}
            showText
            className="flex-1"
          />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {/* Title & Description */}
          <div className="font-semibold text-base line-clamp-2">{attachment?.title || ad.cta_text}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">{attachment?.description}</div>
          {/* Badges */}
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="secondary">{ad.format}</Badge>
            <Badge variant="secondary">{ad.cta_type}</Badge>
            {ad.aggregated_archive_ads?.is_active && <Badge variant="secondary">Đang chạy</Badge>}
            {ad.aggregated_archive_ads?.total_ads && (
              <Badge variant="outline">Tổng số quảng cáo: {ad.aggregated_archive_ads.total_ads}</Badge>
            )}
            {ad.aggregated_archive_ads?.total_reach && (
              <Badge variant="outline">Tiếp cận: {ad.aggregated_archive_ads.total_reach}</Badge>
            )}
          </div>
          {/* All fields with Vietnamese labels */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div><span className="font-semibold">ID quảng cáo:</span> {ad.id}</div>
            <div><span className="font-semibold">Loại tài sản:</span> {ad.asset_type}</div>
            <div><span className="font-semibold">Định dạng:</span> {ad.format}</div>
            <div><span className="font-semibold">CTA (nút kêu gọi):</span> {ad.cta_text}</div>
            <div><span className="font-semibold">Loại CTA:</span> {ad.cta_type}</div>
            <div><span className="font-semibold">Ngôn ngữ:</span> {ad.lang_iso_code}</div>
            <div><span className="font-semibold">Ngày tạo:</span> {ad.creation_date}</div>
            <div><span className="font-semibold">Ngày xuất hiện đầu:</span> {ad.first_seen_date}</div>
            <div><span className="font-semibold">Ngày xuất hiện cuối:</span> {ad.last_seen_date}</div>
            <div><span className="font-semibold">Số ngày chạy:</span> {ad.days_running}</div>
            <div><span className="font-semibold">ID page:</span> {ad.page_id}</div>
            <div><span className="font-semibold">Tên page:</span> {ad.page_name}</div>
            <div><span className="font-semibold">Link page:</span> <a href={ad.page_link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{ad.page_link_url}</a></div>
            <div><span className="font-semibold">Link quảng cáo:</span> <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{ad.link_url}</a></div>
            <div><span className="font-semibold">Tên miền:</span> {ad.link_url_domain}</div>
            {ad.views && <div><span className="font-semibold">Lượt xem:</span> {ad.views}</div>}
            {ad.countries && ad.countries.length > 0 && (
              <div><span className="font-semibold">Quốc gia:</span> {Array.isArray(ad.countries) ? ad.countries.join(", ") : ad.countries}</div>
            )}
            {ad.product_name && <div><span className="font-semibold">Sản phẩm:</span> {ad.product_name}</div>}
            {ad.product_category && <div><span className="font-semibold">Danh mục sản phẩm:</span> {ad.product_category}</div>}
            {/* Attachment fields */}
            {attachment?.header && <div><span className="font-semibold">Tiêu đề attachment:</span> {attachment.header}</div>}
            {attachment?.link_url && <div><span className="font-semibold">Link attachment:</span> <a href={attachment.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{attachment.link_url}</a></div>}
            {attachment?.link_url_domain && <div><span className="font-semibold">Tên miền attachment:</span> {attachment.link_url_domain}</div>}
            {attachment?.typ && <div><span className="font-semibold">Loại attachment:</span> {attachment.typ}</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
