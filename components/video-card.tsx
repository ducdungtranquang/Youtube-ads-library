"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/favorite-button"
import { YouTubeImage } from "@/components/youtube-image"
import { Eye, Calendar, TrendingUp, ExternalLink, Building2 } from "lucide-react"
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* YouTube Thumbnail - Fixed size container */}
          <div className="relative flex-shrink-0">
            <div className="relative w-32 h-24 bg-muted rounded-lg overflow-hidden">
              <YouTubeImage 
                src={thumbnail || "/placeholder.svg"} 
                alt={title} 
                width={128}
                height={96}
                className="h-full w-full object-contain rounded-lg"
              />
              {/* <Badge className="absolute right-1 top-1 bg-background/90 text-foreground text-[10px] px-1 py-0.5">
                <Eye className="mr-0.5 h-2 w-2" />
                {views}
              </Badge> */}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h3 className="line-clamp-2 font-semibold text-foreground text-sm leading-tight mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground truncate">{channel}</p>
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

            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                <TrendingUp className="mr-0.5 h-2 w-2" />
                CTR: {ctr}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                <Calendar className="mr-0.5 h-2 w-2" />
                {date}
              </Badge>
            </div>

            <div className="flex gap-2">
              <div onClick={(e) => e.stopPropagation()}>
                <FavoriteButton
                  itemType="video"
                  itemId={ytVideoId || title}
                  itemData={favoriteData}
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent h-7 text-xs"
                  showText
                />
              </div>
              {url && (
                <Button size="sm" variant="outline" className="bg-transparent h-7 px-2" asChild onClick={(e) => e.stopPropagation()}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-2 w-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
