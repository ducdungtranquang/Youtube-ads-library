"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
import { useState } from "react";

interface FacebookAdCardProps {
  ad: any;
  onClick?: () => void;
}

export function FacebookAdCard({ ad, onClick }: FacebookAdCardProps) {
  const attachment = ad.attachments?.[0];
  // Compose favorite data for button
  const favoriteData = {
    ...ad,
    title: attachment?.title || ad.cta_text,
    description: attachment?.description,
    thumbnail: attachment?.media_url,
  };
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Thumbnail left */}
          <div className="relative flex-shrink-0">
            <div className="relative w-32 h-24 bg-muted rounded-lg overflow-hidden">
              {attachment?.media_url ? (
                attachment.media_url_type === "video" ? (
                  <video
                    src={attachment.media_url}
                    poster={attachment.media_poster_url || undefined}
                    controls
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src={attachment.media_url}
                    alt={attachment.title || ad.page_name}
                    className="h-full w-full object-cover rounded-lg"
                  />
                )
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No Image</div>
              )}
            </div>
          </div>

          {/* Info right */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h3 className="line-clamp-2 font-semibold text-foreground text-sm leading-tight mb-1">{attachment?.title || ad.cta_text}</h3>
              <p className="text-xs text-muted-foreground truncate">{ad.page_name}</p>
              {ad.product_name && (
                <p className="text-xs text-muted-foreground truncate">Sản phẩm: {ad.product_name}</p>
              )}
              {ad.product_category && (
                <p className="text-xs text-muted-foreground truncate">Danh mục: {ad.product_category}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{ad.format}</Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{ad.cta_type}</Badge>
              {ad.aggregated_archive_ads?.is_active && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Active</Badge>}
              {ad.aggregated_archive_ads?.total_ads && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Total Ads: {ad.aggregated_archive_ads.total_ads}</Badge>
              )}
              {ad.aggregated_archive_ads?.total_reach && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Reach: {ad.aggregated_archive_ads.total_reach}</Badge>
              )}
              {ad.views && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Views: {ad.views}</Badge>
              )}
              {ad.countries && ad.countries.length > 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Country: {Array.isArray(ad.countries) ? ad.countries.join(", ") : ad.countries}</Badge>
              )}
            </div>

            <div className="flex gap-2">
              <div onClick={(e) => e.stopPropagation()}>
                <FavoriteButton
                  itemType="facebook_ad"
                  itemId={ad.id}
                  itemData={favoriteData}
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent h-7 text-xs"
                  showText
                />
              </div>
              {ad.link_url && (
                <Button size="sm" variant="outline" className="bg-transparent h-7 px-2" asChild onClick={(e) => e.stopPropagation()}>
                  <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                    Chi tiết
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
