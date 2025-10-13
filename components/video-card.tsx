"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, TrendingUp, Heart, ExternalLink, Building2 } from "lucide-react"

interface VideoCardProps {
  title: string
  channel: string
  views: string
  ctr: string
  date: string
  thumbnail: string
  url?: string
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
  companyName,
  onCompanyClick,
  onClick,
}: VideoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img src={thumbnail || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
        <Badge className="absolute right-2 top-2 bg-background/90 text-foreground">
          <Eye className="mr-1 h-3 w-3" />
          {views}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold text-foreground">{title}</h3>
        <p className="mb-2 text-sm text-muted-foreground">{channel}</p>

        {companyName && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCompanyClick?.()
            }}
            className="mb-3 flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <Building2 className="h-3.5 w-3.5" />
            {companyName}
          </button>
        )}

        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="mr-1 h-3 w-3" />
            CTR: {ctr}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Calendar className="mr-1 h-3 w-3" />
            {date}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={(e) => e.stopPropagation()}>
            <Heart className="mr-1 h-3 w-3" />
            Save
          </Button>
          {url && (
            <Button size="sm" variant="outline" className="bg-transparent" asChild onClick={(e) => e.stopPropagation()}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
