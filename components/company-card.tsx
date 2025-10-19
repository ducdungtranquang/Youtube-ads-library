"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Video, Globe, TrendingUp } from "lucide-react"

interface CompanyCardProps {
  name: string
  description: string
  totalBrands: number
  totalAds: number
  markets: string[]
  estimatedSpend: string
  onClick?: () => void
}

export function CompanyCard({
  name,
  description,
  totalBrands,
  totalAds,
  markets,
  estimatedSpend,
  onClick,
}: CompanyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-accent p-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              Thương hiệu
            </div>
            <p className="mt-1 font-semibold text-foreground">{totalBrands}</p>
          </div>
          <div className="rounded-lg bg-accent p-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Video className="h-3 w-3" />
              Tổng quảng cáo
            </div>
            <p className="mt-1 font-semibold text-foreground">{totalAds}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {markets.map((market) => (
                <Badge key={market} variant="outline" className="text-xs">
                  {market}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Chi tiêu ước tính:</span>
            <span className="font-semibold text-foreground">{estimatedSpend}</span>
          </div>
        </div>

        <Button
          className="w-full"
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        >
          Xem chi tiết doanh nghiệp
        </Button>
      </CardContent>
    </Card>
  )
}
