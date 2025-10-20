"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Eye, TrendingUp, DollarSign, Calendar } from "lucide-react"

interface BrandCardProps {
  name: string
  description: string
  logo: string
  totalAds: number
  totalViews: string
  activeMonths: number
  totalSpend?: number
  summaryDate?: string
  onClick?: () => void
}

export function BrandCard({ name, description, logo, totalAds, totalViews, activeMonths, totalSpend, summaryDate, onClick }: BrandCardProps) {
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
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
            <img src={logo || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 font-semibold text-foreground truncate">{name}</h3>
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
              Quảng cáo
            </div>
            <p className="mt-1 font-semibold text-foreground">{totalAds}</p>
          </div>
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              Lượt xem
            </div>
            <p className="mt-1 font-semibold text-foreground">{totalViews}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              Chi tiêu
            </div>
            <p className="mt-1 font-semibold text-foreground">${totalSpend || 0}</p>
          </div>
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Hoạt động
            </div>
            <p className="mt-1 font-semibold text-foreground">{activeMonths} tháng</p>
          </div>
        </div>

        <Button
          className="w-full"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        >
          Xem tất cả quảng cáo
        </Button>
      </CardContent>
    </Card>
  )
}
