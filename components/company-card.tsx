"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/favorite-button"
import { Building2, Video, Globe, TrendingUp, DollarSign, Calendar } from "lucide-react"
import { CompanyFavoriteData } from "@/lib/favorites"

interface CompanyCardProps {
  name: string
  description: string
  legalName?: string
  companyId: string
  isAffiliate: boolean
  totalVideos?: number
  totalSpend?: number
  totalBrands?: number
  totalAds?: number
  markets?: string[]
  estimatedSpend?: string
  summaryDate?: string
  onClick?: () => void
}

export function CompanyCard({
  name,
  description,
  legalName,
  companyId,
  isAffiliate,
  totalVideos,
  totalSpend,
  totalBrands,
  totalAds,
  markets,
  estimatedSpend,
  summaryDate,
  onClick,
}: CompanyCardProps) {
  const favoriteData: CompanyFavoriteData = {
    name,
    description,
    legalName,
    companyId,
    isAffiliate,
    totalVideos,
    totalSpend
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }
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
            {summaryDate && (
              <div className="flex items-center gap-1 mt-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Cập nhật: {formatDate(summaryDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Video className="h-3 w-3" />
              Tổng views
            </div>
            <p className="mt-1 font-semibold text-foreground">{totalVideos || totalAds || 0}</p>
          </div>
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              Chi tiêu
            </div>
            <p className="mt-1 font-semibold text-foreground">
              ${totalSpend || estimatedSpend || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <FavoriteButton
              itemType="company"
              itemId={companyId}
              itemData={favoriteData}
              size="sm"
              variant="outline"
              className="flex-1"
              showText
            />
          </div>
          <Button
            className="flex-1"
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
