"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, DollarSign, Heart, ExternalLink, LinkIcon } from "lucide-react"

interface AffiliateVideoCardProps {
  title: string
  channel: string
  views: string
  date: string
  thumbnail: string
  offerName: string
  network: string
  landingPage: string
  url?: string
  onClick?: () => void
}

export function AffiliateVideoCard({
  title,
  channel,
  views,
  date,
  thumbnail,
  offerName,
  network,
  landingPage,
  url,
  onClick,
}: AffiliateVideoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img src={thumbnail || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
        <Badge className="absolute right-2 top-2 bg-background/90 text-foreground">
          <Eye className="mr-1 h-3 w-3" />
          {views}
        </Badge>
        <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">
          <DollarSign className="mr-1 h-3 w-3" />
          Affiliate
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold text-foreground">{title}</h3>
        <p className="mb-3 text-sm text-muted-foreground">{channel}</p>

        <div className="mb-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-3 w-3 text-secondary" />
            <span className="font-medium text-foreground">{offerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground truncate">{network}</span>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
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
