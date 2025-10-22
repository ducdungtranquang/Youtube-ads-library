"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/favorite-button"
import { DollarSign, Video, Globe, TrendingUp } from "lucide-react"
import { OfferFavoriteData } from "@/lib/favorites"

interface OfferCardProps {
  name: string
  network: string
  vertical: string
  payout: string
  epc: string
  countries: string[]
  totalVideos: number
  description?: string
  landingPageUrl?: string
  onClick?: () => void
}

export function OfferCard({ name, network, vertical, payout, epc, countries, totalVideos, description, landingPageUrl, onClick }: OfferCardProps) {
  const favoriteData: OfferFavoriteData = {
    name,
    network,
    vertical,
    payout,
    epc,
    countries,
    totalVideos,
    description,
    landingPageUrl
  }
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/10">
            <DollarSign className="h-6 w-6 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 font-semibold text-foreground line-clamp-2">{name}</h3>
            <p className="text-sm text-muted-foreground">{network}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {vertical}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Video className="mr-1 h-3 w-3" />
            {totalVideos} videos
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-accent p-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              Payout
            </div>
            <p className="mt-1 font-semibold text-foreground">{payout}</p>
          </div>
          <div className="rounded-lg bg-accent p-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              EPC
            </div>
            <p className="mt-1 font-semibold text-foreground">{epc}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {countries.map((country) => (
                <Badge key={country} variant="outline" className="text-xs">
                  {country}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <FavoriteButton
            itemType="offer"
            itemId={name}
            itemData={favoriteData}
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            showText
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
          >
            Xem video
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
