"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/favorite-button"
import { Video, Eye, TrendingUp, ExternalLink } from "lucide-react"
import { AffiliateFavoriteData } from "@/lib/favorites"

interface AffiliateCardProps {
  name: string
  channelUrl: string
  totalVideos: number
  totalViews: string
  successRate: string
  topOffers: string[]
  avatar: string
  description?: string
  onClick?: () => void
}

export function AffiliateCard({
  name,
  channelUrl,
  totalVideos,
  totalViews,
  successRate,
  topOffers,
  avatar,
  description,
  onClick,
}: AffiliateCardProps) {
  const favoriteData: AffiliateFavoriteData = {
    name,
    channelUrl,
    totalVideos,
    totalViews,
    successRate,
    topOffers,
    avatar,
    description
  }
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-secondary bg-muted">
            <img src={avatar || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 font-semibold text-foreground">{name}</h3>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-secondary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              View Channel
            </a>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Video className="h-3 w-3" />
              Videos
            </div>
            <p className="mt-1 font-semibold text-foreground">{totalVideos}</p>
          </div>
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              Views
            </div>
            <p className="mt-1 font-semibold text-foreground">{totalViews}</p>
          </div>
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Success
            </div>
            <p className="mt-1 font-semibold text-foreground">{successRate}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Top Offers:</p>
          <div className="flex flex-wrap gap-1">
            {topOffers.map((offer) => (
              <Badge key={offer} variant="secondary" className="text-xs">
                {offer}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <FavoriteButton
            itemType="affiliate"
            itemId={name}
            itemData={favoriteData}
            size="sm"
            variant="outline"
            className="flex-1"
            showText
          />
          <Button
            className="flex-1"
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
          >
            Xem hồ sơ
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
