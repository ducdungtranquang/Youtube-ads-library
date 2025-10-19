"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Video, Eye, TrendingUp, Heart, Calendar } from "lucide-react"

interface BrandDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brand: {
    name: string
    description: string
    logo: string
    totalAds: number
    totalViews: string
    activeMonths: number
    avgCTR?: string
    topCategories?: string[]
    recentActivity?: string
  }
}

export function BrandDetailModal({ open, onOpenChange, brand }: BrandDetailModalProps) {
  const topCategories = brand.topCategories || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[85vw] desktop:max-w-6xl max-h-[95vh] overflow-y-auto mobile:max-w-[calc(100vw-1rem)] mobile:max-h-[95vh] mobile:m-2">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              <img src={brand.logo || "/placeholder.svg"} alt={brand.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{brand.name}</DialogTitle>
              <DialogDescription className="mt-1">{brand.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 tablet:grid-cols-4 mobile:grid-cols-2">
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="h-4 w-4" />
                Tổng quảng cáo
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{brand.totalAds}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                Tổng lượt xem
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{brand.totalViews}</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Hoạt động
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{brand.activeMonths} tháng</p>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                CTR trung bình
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{brand.avgCTR || "7.2%"}</p>
            </div>
          </div>

          <Separator />

          {topCategories.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Danh mục hàng đầu</h3>
              <div className="flex flex-wrap gap-2">
                {topCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-sm">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Hoạt động gần đây
            </h3>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-foreground">{brand.recentActivity || "Quảng cáo cuối được đăng 3 ngày trước"}</p>
            </div>
          </div>

          <div className="flex gap-3 mobile:flex-col">
            <Button className="flex-1">
              <Heart className="mr-2 h-4 w-4" />
              Theo dõi thương hiệu
            </Button>
            <Button variant="secondary" className="mobile:w-full">Xem tất cả quảng cáo</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
