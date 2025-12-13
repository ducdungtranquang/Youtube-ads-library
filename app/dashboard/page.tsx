"use client"

import React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Mail, BadgeCheck, Loader2, Search, TrendingUp, DollarSign, ArrowRight, Sparkles, Video, Target, BookOpen, Star, Zap } from "lucide-react"
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

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-12 md:py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4" />
              Bảng điều khiển
            </div>
            <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
              Chào mừng trở lại!
            </h1>
            <p className="text-base text-white/80 max-w-xl mx-auto">
              Quản lý tài khoản và theo dõi các mục yêu thích của bạn
            </p>
          </div>
        </div>
      </section>

      <main className="container py-8 -mt-6 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {/* Account Info Card */}
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground truncate">{user?.email || 'Chưa đăng nhập'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                  <BadgeCheck className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Gói tài khoản</p>
                  <p className="font-medium text-foreground">{subscriptionType}</p>
                </div>
                {subscriptionType === "Miễn phí" && (
                  <Link href="/pricing">
                    <Button size="sm" className="cursor-pointer">
                      Nâng cấp
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Favorites Card */}
            <Card className="border-2 hover:shadow-lg transition-all">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Tổng yêu thích</p>
                  <p className="font-medium text-foreground text-xl">
                    {loading ? <Loader2 className="inline h-5 w-5 animate-spin" /> : totalFavorites}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Favorites Detail */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Yêu thích của tôi</CardTitle>
                    <CardDescription>Chi tiết các mục đã lưu</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Video className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Video</p>
                      <p className="font-semibold text-foreground">{counts.video}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Target className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Offer</p>
                      <p className="font-semibold text-foreground">{counts.offer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Affiliate</p>
                      <p className="font-semibold text-foreground">{counts.affiliate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Thương hiệu</p>
                      <p className="font-semibold text-foreground">{counts.brand}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Truy cập nhanh</CardTitle>
                    <CardDescription>Các công cụ chính</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/quicksearch" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Tìm kiếm nhanh</p>
                      <p className="text-xs text-muted-foreground">Tìm ads theo từ khóa</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
                <Link href="/mkt" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">YouTube Ads</p>
                      <p className="text-xs text-muted-foreground">Spy ads YouTube</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
                <Link href="/facebook-ads-search" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                      <DollarSign className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Facebook Ads</p>
                      <p className="text-xs text-muted-foreground">Spy ads Facebook</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Guide Section */}
          <Card className="border-2 mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Hướng dẫn sử dụng</CardTitle>
                  <CardDescription>Cách sử dụng nền tảng hiệu quả</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tìm kiếm</p>
                    <p className="text-sm text-muted-foreground">Sử dụng Tìm kiếm nhanh để tra cứu quảng cáo, offers theo từ khóa</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Lọc kết quả</p>
                    <p className="text-sm text-muted-foreground">Áp dụng bộ lọc theo danh mục, quốc gia, thời gian</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Lưu yêu thích</p>
                    <p className="text-sm text-muted-foreground">Lưu lại quảng cáo, offers để dễ dàng truy cập lại</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phân tích</p>
                    <p className="text-sm text-muted-foreground">Theo dõi xu hướng, phân tích đối thủ để tối ưu chiến dịch</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 YouTube ADS Library. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage
