"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/favorite-button"
import { YouTubeImage } from "@/components/youtube-image"
import { Eye, Calendar, TrendingUp, ExternalLink, Building2, Play } from "lucide-react"
import { VideoFavoriteData } from "@/lib/favorites"

interface VideoCardProps {
  title: string
  channel: string
  views: string
  ctr: string
  date: string
  thumbnail: string
  url?: string
  ytVideoId?: string
  description?: string
  duration?: string
  companyName?: string
  onCompanyClick?: () => void
  onClick?: () => void
}

export function VideoCard({
  title,
  channel,
  views,
  ctr,
  date,
  thumbnail,
  url,
  ytVideoId,
  description,
  duration,
  companyName,
  onCompanyClick,
  onClick,
}: VideoCardProps) {
  const favoriteData: VideoFavoriteData = {
    title,
    channel,
    views,
    ctr,
    date,
    thumbnail,
    url,
    ytVideoId,
    description,
    duration,
    companyName
  }
  return (
    <Card className="group h-full overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 cursor-pointer" onClick={onClick}>
      <CardContent className="flex h-full flex-col p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
              <YouTubeImage 
                src={thumbnail || "/placeholder.svg"} 
                alt={title} 
                // width={128}
                // height={96}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-2 py-1 text-[11px] font-medium text-white backdrop-blur"><Play className="size-3 fill-current" />YouTube ad</span>
              {duration && <span className="absolute bottom-3 right-3 rounded bg-slate-950/80 px-1.5 py-0.5 text-xs font-medium text-white">{duration}</span>}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div>
              <h3 className="line-clamp-2 font-semibold leading-5 text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground truncate">{channel}</p>
            </div>

            {companyName && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCompanyClick?.()
                }}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Building2 className="h-3 w-3" />
                {companyName}
              </button>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2 border-y border-border/70 py-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Eye className="size-3.5 text-primary" />{views || "—"}</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><TrendingUp className="size-3.5 text-primary" />CTR {ctr || "—"}</span>
              <span className="col-span-2 flex items-center gap-1.5 text-muted-foreground"><Calendar className="size-3.5" />{date || "Chưa rõ ngày chạy"}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <div onClick={(e) => e.stopPropagation()}>
                <FavoriteButton
                  itemType="video"
                  itemId={ytVideoId || title}
                  itemData={favoriteData}
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent text-xs"
                  showText
                />
              </div>
              {url && (
                <Button size="sm" variant="outline" className="bg-transparent px-2" asChild onClick={(e) => e.stopPropagation()}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-2 w-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>
      </CardContent>
    </Card>
  )
}
