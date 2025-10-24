"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Video, Globe, TrendingUp, Heart } from "lucide-react"

interface CompanyDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: {
    name: string
    description: string
    totalBrands: number
    totalAds: number
    markets: string[]
    estimatedSpend: string
    topBrands?: string[]
    recentCampaigns?: number
    avgCTR?: string
  }
}

export function CompanyDetailModal({ open, onOpenChange, company }: CompanyDetailModalProps) {
  const markets = company.markets || []
  const topBrands = company.topBrands || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[85vw] desktop:max-w-6xl max-h-[95vh] overflow-y-auto mobile:max-w-[calc(100vw-1rem)] mobile:max-h-[95vh] mobile:m-2">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{company.name}</DialogTitle>
              <DialogDescription className="mt-1">{company.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 tablet:grid-cols-4 mobile:grid-cols-2">
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Thương hiệu
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{company.totalBrands}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="h-4 w-4" />
                Tổng quảng cáo
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{company.totalAds}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Chiến dịch
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{company.recentCampaigns || 45}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                CTR trung bình
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{company.avgCTR || "6.8%"}</p>
            </div>
          </div>

          <Separator />

          {markets.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Globe className="h-4 w-4" />
                Thị trường đang hoạt động
              </h3>
              <div className="flex flex-wrap gap-2">
                {markets.map((market) => (
                  <Badge key={market} variant="secondary" className="text-sm">
                    {market}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Chi phí quảng cáo ước tính</h3>
            <div className="rounded-lg bg-primary/10 p-4">
              <p className="text-3xl font-bold text-primary">{company.estimatedSpend}</p>
              <p className="mt-1 text-sm text-muted-foreground">12 tháng gần đây</p>
            </div>
          </div>

          {topBrands.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Thương hiệu hàng đầu</h3>
              <div className="flex flex-wrap gap-2">
                {topBrands.map((brand) => (
                  <Badge key={brand} variant="outline" className="text-sm">
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex-col md:flex-row">
            <Button className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Theo dõi công ty
            </Button>
            <Button variant="secondary" className="mobile:w-full">Xem tất cả quảng cáo</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
