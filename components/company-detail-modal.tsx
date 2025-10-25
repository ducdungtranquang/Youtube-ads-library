"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Video, Globe, TrendingUp, Heart, Calendar, DollarSign } from "lucide-react"
import { useCompanyDetails } from "@/hooks/use-company-details"
import { useCountries } from "@/hooks/use-countries"
import { useCategory } from "@/hooks/use-category"
import { FavoriteButton } from "@/components/favorite-button"
import { YouTubeImage } from "@/components/youtube-image"
import { CompanyFavoriteData } from "@/lib/favorites"

interface CompanyDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Accept either a minimal company object (legacy) or a companyId to fetch details
  company?: any
  companyId?: string | null
  onClose?: (companyId: string) => void // Callback when modal closes to refresh favorite status
}

export function CompanyDetailModal({ open, onOpenChange, company, companyId, onClose }: CompanyDetailModalProps) {
  const { loading, error, companyDetails, fetchCompanyDetails } = useCompanyDetails()
  const { countries, fetchCountries, getCountryName } = useCountries()
  const { category, fetchCategory } = useCategory()
  const [categoryName, setCategoryName] = useState<string | null>(null)

  // Determine effective companyId (prefer explicit prop, then legacy object)
  const effectiveCompanyId = companyId || (company?.companyId ? String(company.companyId) : null)

  useEffect(() => {
    if (open && effectiveCompanyId) {
      fetchCompanyDetails(effectiveCompanyId)
    }
  }, [open, effectiveCompanyId, fetchCompanyDetails])

  // Handle modal close with callback
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    // If modal is closing and we have a close callback, trigger it
    if (!newOpen && onClose && effectiveCompanyId) {
      onClose(effectiveCompanyId)
    }
  }

  // When data contains top5Countries, fetch their names
  useEffect(() => {
    const top = companyDetails?.top5Countries || company?.top5Countries
    if (top && top.length > 0) {
      const ids = top.map((c: any) => c.countryId)
      fetchCountries(ids)
    }
  }, [companyDetails, company, fetchCountries])

  // Fetch category if present
  useEffect(() => {
    const catId = companyDetails?.company?.categoryId || company?.categoryId || company?.summary_data?.category_id
    if (catId) fetchCategory(catId)
  }, [companyDetails, company, fetchCategory])

  useEffect(() => {
    if (category) setCategoryName(category.name)
  }, [category])

  if (!open) return null

  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      <div className="grid gap-4 tablet:grid-cols-4 mobile:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  )

  const data = companyDetails?.company || company

  const favoriteData: CompanyFavoriteData = {
    name: data?.legalName || data?.name || "Unknown",
    description: (data?.description || data?.summary || `Công ty ${data?.legalName || ''} có trụ sở tại ${data?.headquarters || ''}`).toString(),
    legalName: data?.legalName,
    companyId: effectiveCompanyId || data?.companyId?.toString() || 'unknown',
    isAffiliate: data?.isAffiliate || false,
    totalVideos: companyDetails?.creativeCount || data?.creativeCount || 0,
    totalSpend: data?.spend?.last365Days || data?.summary_data?.total_spend || 0,
    thumbnail: data?.thumbnail || data?.logo || "/placeholder.svg",
  }

  // Helper functions to format numbers and currency
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B"
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const formatCurrency = (num: number): string => {
    return "$" + formatNumber(num)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[85vw] desktop:max-w-6xl max-h-[95vh] overflow-y-auto mobile:max-w-[calc(100vw-1rem)] mobile:max-h-[95vh] mobile:m-2">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              <YouTubeImage src={favoriteData.thumbnail || "/placeholder.svg"} alt={favoriteData.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{data?.legalName || data?.name || 'Chi tiết công ty'}</DialogTitle>
              <DialogDescription className="mt-1">{(data?.description || data?.summary || '').toString().replace(/<[^>]*>/g, '') || (data ? `Công ty thuộc danh mục ${categoryName || 'đang tải...'}` : 'Đang tải thông tin công ty...')}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? renderSkeleton() : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Lỗi: {error}</p>
              <Button onClick={() => effectiveCompanyId && fetchCompanyDetails(effectiveCompanyId)}>Thử lại</Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 tablet:grid-cols-4 mobile:grid-cols-2">
                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Building2 className="h-4 w-4" />
                    Quảng cáo
                  </div>
                  <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {formatNumber(companyDetails?.creativeCount || data?.creativeCount || 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <DollarSign className="h-4 w-4" />
                    Chi tiêu hôm nay
                  </div>
                  <p className="mt-2 text-2xl font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(data?.spend?.today || 0)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    30 ngày: {formatCurrency(data?.spend?.last30Days || 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                    <TrendingUp className="h-4 w-4" />
                    Xếp hạng toàn cầu
                  </div>
                  <p className="mt-2 text-2xl font-bold text-purple-700 dark:text-purple-300">
                    #{companyDetails?.ranks?.global?.rank || '-'}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Quốc gia: #{companyDetails?.ranks?.country?.rank || '-'}
                  </p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <TrendingUp className="h-4 w-4" />
                    Danh mục
                  </div>
                  <p className="mt-2 text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {categoryName || 'Đang tải...'}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    Xếp hạng: #{companyDetails?.ranks?.category?.rank || '-'}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Spend / Metrics */}
              <div className="grid gap-6 laptop:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Building2 className="h-5 w-5" />
                    Thông tin doanh nghiệp
                  </h3>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm font-medium">Tên pháp lý:</span>
                        <span className="font-bold text-foreground">{data?.legalName || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm">Trụ sở:</span>
                        <span className="font-semibold">{data?.headquarters || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm">Năm thành lập:</span>
                        <span className="font-semibold">{data?.yearFounded || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm">Số nhân viên:</span>
                        <span className="font-semibold">{data?.numberOfEmployees || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Doanh thu:</span>
                        <span className="font-semibold">{formatCurrency(parseInt(data?.revenue || '0'))}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <DollarSign className="h-5 w-5" />
                    Chi tiêu theo thời gian
                  </h3>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm font-medium">Hôm nay:</span>
                        <span className="font-bold text-purple-600">
                          {formatCurrency(data?.spend?.today || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm">7 ngày:</span>
                        <span className="font-semibold">
                          {formatCurrency(data?.spend?.last7Days || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm">30 ngày:</span>
                        <span className="font-semibold">
                          {formatCurrency(data?.spend?.last30Days || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm">90 ngày:</span>
                        <span className="font-semibold">
                          {formatCurrency(data?.spend?.last90Days || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm">365 ngày:</span>
                        <span className="font-semibold">
                          {formatCurrency(data?.spend?.last365Days || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">720 ngày:</span>
                        <span className="font-semibold">
                          {formatCurrency(data?.spend?.last720Days || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Data Collection Info */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Calendar className="h-5 w-5" />
                  Thông tin thu thập dữ liệu
                </h3>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="grid gap-4 laptop:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatNumber(companyDetails?.creativeCount || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tổng số quảng cáo
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(data?.spend?.today || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Chi tiêu hôm nay
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(data?.spend?.last365Days || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Chi tiêu 365 ngày
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Dữ liệu thu thập lúc:{" "}
                      {data?.spend?.collected_on 
                        ? new Date(data.spend.collected_on).toLocaleString("vi-VN")
                        : "Chưa có thông tin"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Top Countries */}
              { (companyDetails?.top5Countries || data?.top5Countries) && (companyDetails?.top5Countries || data?.top5Countries).length > 0 && (
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground"><Globe className="h-5 w-5" /> Top quốc gia</h3>
                  <div className="grid gap-4 laptop:grid-cols-3 tablet:grid-cols-2">
                    {(companyDetails?.top5Countries || data?.top5Countries).map((country: any, index: number) => (
                      <div key={country.countryId} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">#{index + 1}</div>
                            <span className="font-medium">{getCountryName(country.countryId)}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Số quảng cáo:</span>
                            <span className="font-semibold text-foreground">{country.count}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Tỷ lệ:</span>
                            <Badge variant="secondary" className="font-medium">{country.percentage}%</Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${country.percentage}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 flex-col md:flex-row">
                <FavoriteButton itemType="company" itemId={effectiveCompanyId || 'unknown'} itemData={favoriteData} showText className="flex-1" />
                <Button variant="secondary" className="max-sm:w-full">Xem tất cả quảng cáo</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
