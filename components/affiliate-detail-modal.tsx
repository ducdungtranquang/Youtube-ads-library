"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Video, Eye, TrendingUp, Heart, ExternalLink } from "lucide-react"

interface AffiliateDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  affiliate: {
    name: string
    channelUrl: string
    totalVideos: number
    totalViews: string
    successRate: string
    topOffers: string[]
    avatar: string
    avgEarnings?: string
    topNiche?: string
  }
}

export function AffiliateDetailModal({ open, onOpenChange, affiliate }: AffiliateDetailModalProps) {
  const topOffers = affiliate.topOffers || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[85vw] desktop:max-w-6xl max-h-[95vh] overflow-y-auto mobile:max-w-[calc(100vw-1rem)] mobile:max-h-[95vh] mobile:m-2">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-muted">
              <img
                src={affiliate.avatar || "/placeholder.svg"}
                alt={affiliate.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <DialogTitle className="text-2xl">{affiliate.name}</DialogTitle>
              <DialogDescription className="mt-1">Successful Affiliate Marketer</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 tablet:grid-cols-4 mobile:grid-cols-2">
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="h-4 w-4" />
                Videos
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{affiliate.totalVideos}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                Total Views
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{affiliate.totalViews}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Success Rate
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{affiliate.successRate}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Est. Earnings
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{affiliate.avgEarnings || "$8K/mo"}</p>
            </div>
          </div>

          <Separator />

          {topOffers.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Top Offers Promoted</h3>
              <div className="flex flex-wrap gap-2">
                {topOffers.map((offer) => (
                  <Badge key={offer} variant="secondary" className="text-sm">
                    {offer}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {affiliate.topNiche && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Primary Niche</h3>
              <Badge variant="outline" className="text-base px-4 py-2">
                {affiliate.topNiche}
              </Badge>
            </div>
          )}

          <div className="flex-col md:flex-row">
            <Button className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Follow Affiliate
            </Button>
            <Button variant="secondary" asChild className="mobile:w-full">
              <a href={affiliate.channelUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Channel
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
