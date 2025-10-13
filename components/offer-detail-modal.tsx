"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DollarSign, TrendingUp, Video, Globe, Heart } from "lucide-react"

interface OfferDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  offer: {
    name: string
    network: string
    vertical: string
    payout: string
    epc: string
    countries: string[]
    totalVideos: number
    conversionRate?: string
    cookieDuration?: string
    description?: string
  }
}

export function OfferDetailModal({ open, onOpenChange, offer }: OfferDetailModalProps) {
  const countries = offer.countries || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[85vw] desktop:max-w-6xl max-h-[95vh] overflow-y-auto mobile:max-w-[calc(100vw-1rem)] mobile:max-h-[95vh] mobile:m-2">
        <DialogHeader>
          <DialogTitle className="text-2xl">{offer.name}</DialogTitle>
          <DialogDescription>
            {offer.network} • {offer.vertical}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 tablet:grid-cols-4 mobile:grid-cols-2">
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Payout
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{offer.payout}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                EPC
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{offer.epc}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="h-4 w-4" />
                Videos
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{offer.totalVideos}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Conv. Rate
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{offer.conversionRate || "4.2%"}</p>
            </div>
          </div>

          <Separator />

          {countries.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Globe className="h-4 w-4" />
                Available Countries
              </h3>
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <Badge key={country} variant="secondary" className="text-sm">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 tablet:grid-cols-2 mobile:grid-cols-1">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Network</p>
              <p className="mt-1 font-semibold text-foreground">{offer.network}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Cookie Duration</p>
              <p className="mt-1 font-semibold text-foreground">{offer.cookieDuration || "30 days"}</p>
            </div>
          </div>

          {offer.description && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Description</h3>
              <p className="text-sm text-foreground leading-relaxed">{offer.description}</p>
            </div>
          )}

          <div className="flex gap-3 mobile:flex-col">
            <Button className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Add to Favorites
            </Button>
            <Button variant="secondary" className="mobile:w-full">View All Videos</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
