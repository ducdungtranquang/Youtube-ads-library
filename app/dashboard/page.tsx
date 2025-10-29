"use client"

import React from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CacheStatusCard } from "@/components/cache-status-card"
import { Heart, User, Mail, BadgeCheck, Loader2 } from "lucide-react"
// Removed chart imports
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { useFavorites } from '@/hooks/use-favorites'

function DashboardPage() {
  const { user } = useAuth()
  const { getFavoritesCounts, loading: countsLoading } = useFavorites()
  const [counts, setCounts] = useState({ video: 0, offer: 0, affiliate: 0, brand: 0, company: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCounts() {
      if (!user) return setLoading(false)
      setLoading(true)
      const data = await getFavoritesCounts()
      if (data) setCounts(data)
      setLoading(false)
    }
    loadCounts()
  }, [user, getFavoritesCounts])

  const subscriptionType = user?.user_metadata?.subscription_type || "Miễn phí"
  const totalFavorites = counts.video + counts.offer + counts.affiliate + counts.brand + counts.company

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Bảng điều khiển</h1>
          <p className="text-muted-foreground">Tổng quan tài khoản và hướng dẫn sử dụng</p>
        </div>

        {/* Thông tin tài khoản */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-medium">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-5 w-5 text-primary" />
              <span className="font-medium">Loại tài khoản:</span>
              <span>{subscriptionType}</span>
            </div>
            {subscriptionType === "Miễn phí" && (
              <div className="pt-2">
                <Button asChild className="max-w-xs" variant="default">
                  <a href="/pricing">Nâng cấp ngay</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tổng số lượng yêu thích và phân loại */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Yêu thích của tôi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Heart className="h-8 w-8 text-pink-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? <Loader2 className="inline h-5 w-5 animate-spin" /> : totalFavorites}
                </p>
                <p className="text-muted-foreground text-sm">Tổng số mục đã lưu</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Video:</span>
                <span>{counts.video}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Offer:</span>
                <span>{counts.offer}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Affiliate:</span>
                <span>{counts.affiliate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Thương hiệu:</span>
                <span>{counts.brand}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Doanh nghiệp:</span>
                <span>{counts.company}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hướng dẫn sử dụng và lợi ích */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn sử dụng & Lợi ích</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <b>Tìm kiếm:</b> Sử dụng chức năng <span className="text-primary font-medium">Tìm kiếm </span> để tra cứu quảng cáo, offers, thương hiệu hoặc công ty bạn quan tâm.
              </li>
              <li>
                <b>Lọc kết quả:</b> Áp dụng các bộ lọc theo danh mục, quốc gia, thời gian, v.v. để thu hẹp kết quả phù hợp nhu cầu.
              </li>
              <li>
                <b>Yêu thích:</b> Lưu lại các quảng cáo, offers hoặc thương hiệu bạn quan tâm để dễ dàng truy cập lại.
              </li>
              <li>
                <b>Lợi ích:</b> Theo dõi xu hướng quảng cáo, phân tích đối thủ, tối ưu chiến dịch marketing và affiliate hiệu quả hơn.
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default DashboardPage

