"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/favorite-button";
import { FacebookMediaFallback } from "@/components/facebook-media-fallback";
import { ExternalLink, Heart, MessageCircle, Play, Share2 } from "lucide-react";

interface FacebookAdCardProps {
  ad: any;
  onClick?: () => void;
}

export function FacebookAdCard({ ad, onClick }: FacebookAdCardProps) {
  const images = Array.isArray(ad?.images) ? ad.images : [];
  const videos = Array.isArray(ad?.videos) ? ad.videos : [];
  const imageItem = images.length > 0 ? images[0] : undefined;
  const videoItem = videos.length > 0 ? videos[0] : undefined;
  
  const mediaUrl =
    imageItem?.resized_image_url ||
    imageItem?.original_image_url ||
    imageItem?.watermarked_resized_image_url ||
    videoItem?.video_hd_url ||
    videoItem?.video_sd_url ||
    videoItem?.thumbnail_url;

  const mediaPoster = imageItem?.resized_image_url || imageItem?.original_image_url || videoItem?.thumbnail_url;
  const isVideo = Boolean(videoItem?.video_hd_url || videoItem?.video_sd_url);
  const title = ad?.text?.split(/\n/)[0]?.trim() || ad?.page_name || ad?.ad_archive_id || "Facebook Ad";
  const description = ad?.text || ad?.description || "";
  const link = ad?.link || ad?.link_url || "";
  const pageName = ad?.page_name || "Facebook Ad";
  const pageProfile = ad?.page_profile_image_url;
  const itemId = ad?.ad_archive_id || ad?._id || ad?.id || ad?.ad_id || ad?.archive_id;

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
    <Card className="group h-full overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 cursor-pointer" onClick={onClick}>
      <CardContent className="flex h-full flex-col p-0">
          <div className="relative aspect-video overflow-hidden bg-muted">
              <FacebookMediaFallback
                src={mediaUrl}
                alt={title || pageName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                fallbackClassName="h-full w-full bg-muted flex items-center justify-center px-2 text-center text-[11px] text-muted-foreground"
                fallbackText={isVideo ? "Video hết hạn" : "Ảnh hết hạn"}
                isVideo={isVideo}
                poster={mediaPoster}
                videoClassName="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-slate-950/75 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">{isVideo && <Play className="mr-1 inline size-3 fill-current" />}Facebook ad</span>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div>
              <h3 className="line-clamp-2 font-semibold leading-5 text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground truncate">{pageName}</p>
              {description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {ad?.level && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{ad.level}</Badge>}
              {ad?.scaling_level && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{ad.scaling_level}</Badge>}
              {ad?.score != null && <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Score: {ad.score}</Badge>}
              {ad?.seen_count != null && <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Seen: {ad.seen_count}</Badge>}
              {link && <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Link</Badge>}
            </div>

            <div className="mt-4 flex items-center justify-between border-y border-border/70 py-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Heart className="size-3.5 text-primary" />{ad?.likes ?? "—"}</span><span className="flex items-center gap-1"><MessageCircle className="size-3.5 text-primary" />{ad?.comments ?? "—"}</span><span className="flex items-center gap-1"><Share2 className="size-3.5 text-primary" />{ad?.shares ?? "—"}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <div onClick={(e) => e.stopPropagation()}>
                <FavoriteButton
                  itemType="facebook_ad"
                  itemId={itemId}
                  itemData={favoriteData}
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent text-xs"
                  showText
                />
              </div>
              {link && (
                <Button size="sm" variant="outline" className="bg-transparent px-2" asChild onClick={(e) => e.stopPropagation()}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    Visit <ExternalLink className="ml-1 size-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
      </CardContent>
    </Card>
  );
}
