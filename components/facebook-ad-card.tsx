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
  const snapshot = ad.snapshot ?? {};
  const attachment = ad.attachments?.[0] ?? snapshot.cards?.[0];
  const snapshotVideo = snapshot.videos?.[0];
  const mediaUrl = attachment?.media_url || snapshotVideo?.video_hd_url || snapshotVideo?.video_sd_url;
  const mediaPoster = attachment?.media_poster_url || snapshotVideo?.video_preview_image_url;
  const isVideo = attachment?.media_url_type === "video" || Boolean(snapshotVideo);
  const title = attachment?.title || ad.headline || ad.cta_text || snapshot.title || ad.page_name;
  const description = attachment?.description || ad.description || ad.text || snapshot.body?.text;
  const link = ad.link_url || ad.link || snapshot.link_url;
  const pageName = ad.page_name || snapshot.page_name;
  const pageProfile = ad.page_profile_image_url || snapshot.page_profile_picture_url;
  const itemId = ad.ad_archive_id || ad._id || ad.id;

  const favoriteData = {
    ...ad,
    title,
    description,
    thumbnail: mediaUrl || pageProfile,
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <div className="relative w-32 h-24 bg-muted rounded-lg overflow-hidden">
              {mediaUrl ? (
                isVideo ? (
                  <video
                    src={mediaUrl}
                    poster={mediaPoster || undefined}
                    controls
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={title || pageName}
                    className="h-full w-full object-cover rounded-lg"
                  />
                )
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">No Image</div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h3 className="line-clamp-2 font-semibold text-foreground text-sm leading-tight mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground truncate">{pageName}</p>
              {description && (
                <p className="text-xs text-muted-foreground truncate">{description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {ad.level && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{ad.level}</Badge>}
              {ad.scaling_level && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{ad.scaling_level}</Badge>}
              {ad.score != null && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Score: {ad.score}</Badge>}
              {ad.scaling_score != null && <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Scaling: {ad.scaling_score}</Badge>}
              {link && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Link</Badge>
              )}
            </div>

            <div className="flex gap-2">
              <div onClick={(e) => e.stopPropagation()}>
                <FavoriteButton
                  itemType="facebook_ad"
                  itemId={itemId}
                  itemData={favoriteData}
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent h-7 text-xs"
                  showText
                />
              </div>
              {link && (
                <Button size="sm" variant="outline" className="bg-transparent h-7 px-2" asChild onClick={(e) => e.stopPropagation()}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
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
