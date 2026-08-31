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
import { supabase } from "@/lib/supabase"

function DashboardPage() {
  const SUBSCRIPTION_MAP: Record<string, { label: string; color: string }> = {
    free: { label: "Miễn phí", color: "text-slate-400" },
    personal: { label: "Cá nhân", color: "text-blue-400" },
    company: { label: "Doanh nghiệp", color: "text-purple-400" },
  };
  const { user } = useAuth()
  const { getFavoritesCounts, loading: countsLoading } = useFavorites()
  const [counts, setCounts] = useState({ video: 0, offer: 0, affiliate: 0, brand: 0, company: 0 })
  const [loading, setLoading] = useState(true)
  const [dbProfile, setDbProfile] = useState<any>(null)

  useEffect(() => {
    async function loadCounts() {
      if (!user) return setLoading(false)
      setLoading(true)
      const data = await getFavoritesCounts()
      if (data) setCounts(data);
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single()

      if (profile) {
        setDbProfile(profile)
      }
      setLoading(false)
    }
    loadCounts()
  }, [user, getFavoritesCounts])

  const rawPlan = dbProfile?.subscription_plan || user?.user_metadata?.subscription_plan || "free"
  const planInfo = SUBSCRIPTION_MAP[rawPlan] || SUBSCRIPTION_MAP.free;
  const totalFavorites = counts.video + counts.offer + counts.affiliate + counts.brand + counts.company

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-slate-950 py-12 md:py-20 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-4 py-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              Bảng điều khiển
            </div>
            <h1 className="mb-4 text-3xl font-black tracking-tight text-white md:text-5xl lg:text-5xl leading-tight">
              Chào mừng trở lại!
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Quản lý tài khoản và theo dõi các mục yêu thích của bạn một cách dễ dàng và trực quan.
            </p>
          </div>
        </div>
      </section>

      <main className="container py-12 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* Quick Stats */}
          <div className="grid gap-5 md:grid-cols-3 mb-8">
            {/* Account Info Card */}
            <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-md hover:bg-slate-900/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/20 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email</p>
                  <p className="font-bold text-white truncate text-base mt-0.5">{user?.email || 'Chưa đăng nhập'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-md hover:bg-slate-900/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/20 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <BadgeCheck className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Gói tài khoản</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className={`font-bold text-base ${planInfo.color}`}>
                      {planInfo.label}
                    </p>
                    {rawPlan !== "free" && (
                      <BadgeCheck className={`h-4 w-4 ${planInfo.color}`} />
                    )}
                  </div>
                </div>
                {rawPlan === "free" && (
                  <Link href="/pricing">
                    <Button size="sm" className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg">
                      Nâng cấp
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Favorites Card */}
            <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-md hover:bg-slate-900/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-black/20 rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20">
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tổng yêu thích</p>
                  <p className="font-black text-white text-2xl mt-0.5">
                    {loading ? <Loader2 className="inline h-5 w-5 animate-spin" /> : totalFavorites}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Favorites Detail */}
            <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-600/20">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">Yêu thích của tôi</CardTitle>
                    <CardDescription className="text-slate-400">Chi tiết các mục đã lưu</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="bg-red-500/10 p-2 rounded-lg">
                      <Video className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Video</p>
                      <p className="font-bold text-white text-lg">{counts.video}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                      <Target className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Offer</p>
                      <p className="font-bold text-white text-lg">{counts.offer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Affiliate</p>
                      <p className="font-bold text-white text-lg">{counts.affiliate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="bg-yellow-500/10 p-2 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Thương hiệu</p>
                      <p className="font-bold text-white text-lg">{counts.brand}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-600/20">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">Truy cập nhanh</CardTitle>
                    <CardDescription className="text-slate-400">Các công cụ chính</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/quicksearch" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                      <Search className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">Tìm kiếm nhanh</p>
                      <p className="text-xs text-slate-400">Tìm ads theo từ khóa</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                <Link href="/mkt" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white group-hover:text-purple-400 transition-colors">YouTube Ads</p>
                      <p className="text-xs text-slate-400">Spy ads YouTube</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                <Link href="/facebook-ads-search" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors">Facebook Ads</p>
                      <p className="text-xs text-slate-400">Spy ads Facebook</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Guide Section */}
          <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl rounded-2xl mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-600/20">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">Hướng dẫn sử dụng</CardTitle>
                  <CardDescription className="text-slate-400">Cách khai thác nền tảng hiệu quả</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 mt-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">Tìm kiếm</p>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">Sử dụng thanh tìm kiếm để tra cứu quảng cáo, chiến dịch theo từ khóa, URL hoặc ID thương hiệu.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">Lọc kết quả</p>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">Áp dụng các bộ lọc chuyên sâu theo danh mục, quốc gia, và mốc thời gian để tìm ra ads tiềm năng.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">Lưu yêu thích</p>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">Đánh dấu (bookmark) lại các mẫu quảng cáo hoặc offers chất lượng cao để dễ dàng truy cập lại sau này.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">Phân tích</p>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">Theo dõi biểu đồ xu hướng, bóc tách chỉ số ngân sách của đối thủ để tối ưu tỷ lệ chuyển đổi cho riêng bạn.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 py-8 mt-12 bg-slate-950">
        <div className="container text-center text-sm text-slate-500">
          <p>© 2026 Ads Spy Tool. Được xây dựng chuyên nghiệp dành cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage