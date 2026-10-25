"use client"

import React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Mail, BadgeCheck, Loader2, Search, TrendingUp, DollarSign, ArrowRight, Sparkles, Video, Target, BookOpen, Star, Zap, Gift } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { useFavorites } from '@/hooks/use-favorites'
import { supabase } from "@/lib/supabase"

function DashboardPage() {
  const SUBSCRIPTION_MAP: Record<string, { label: string; color: string; limitText: string }> = {
    free: { label: "Miễn phí", color: "text-slate-700 font-bold", limitText: "5 lượt/ngày" },
    unlimited: { label: "Không giới hạn", color: "text-indigo-600 font-bold", limitText: "Không giới hạn (∞)" },
    personal: { label: "Không giới hạn", color: "text-indigo-600 font-bold", limitText: "Không giới hạn (∞)" },
    business: { label: "Không giới hạn", color: "text-indigo-600 font-bold", limitText: "Không giới hạn (∞)" },
    company: { label: "Không giới hạn", color: "text-indigo-600 font-bold", limitText: "Không giới hạn (∞)" },
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
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_plan, subscription_status, daily_search_count, last_search_date')
        .eq('id', user.id)
        .maybeSingle()

      if (profile) {
        setDbProfile(profile)
      }
      setLoading(false)
    }
    loadCounts()
  }, [user, getFavoritesCounts])

  const rawPlan = dbProfile?.subscription_plan || user?.user_metadata?.subscription_plan || "free"
  const planInfo = SUBSCRIPTION_MAP[rawPlan] || SUBSCRIPTION_MAP.free;
  const isUnlimited = rawPlan === 'unlimited' || rawPlan === 'business' || rawPlan === 'company' || rawPlan === 'personal';
  const planLimit = isUnlimited ? -1 : 5;
  const today = new Date().toISOString().split('T')[0];
  const lastSearchDate = dbProfile?.last_search_date ? new Date(dbProfile.last_search_date).toISOString().split('T')[0] : null;
  const searchesToday = lastSearchDate === today ? (dbProfile?.daily_search_count || 0) : 0;
  const searchesRemaining = isUnlimited ? -1 : Math.max(0, planLimit - searchesToday);
  const totalFavorites = counts.video + counts.offer + counts.affiliate + counts.brand + counts.company

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-white py-12 md:py-16 border-b border-slate-200">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider shadow-2xs">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Bảng điều khiển
            </div>
            <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-5xl leading-tight">
              Chào mừng trở lại!
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Quản lý tài khoản, theo dõi quota tìm kiếm và các chiến dịch quảng cáo đã lưu một cách trực quan, chính xác.
            </p>
          </div>
        </div>
      </section>

      <main className="container py-10 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* Quick Stats Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Account Info Card */}
            <Card className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm shadow-slate-200/50 rounded-2xl">
              <CardContent className="flex items-center gap-3.5 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">Email</p>
                  <p className="font-bold text-slate-900 truncate text-sm mt-0.5">{user?.email || 'Chưa đăng nhập'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm shadow-slate-200/50 rounded-2xl">
              <CardContent className="flex items-center gap-3.5 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 border border-purple-100 flex-shrink-0">
                  <BadgeCheck className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">Gói dịch vụ</p>
                  <div className="flex items-center justify-between gap-1.5 mt-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className={`font-bold text-sm truncate ${planInfo.color}`}>
                        {planInfo.label}
                      </span>
                      {rawPlan !== "free" && (
                        <BadgeCheck className={`h-3.5 w-3.5 ${planInfo.color} flex-shrink-0`} />
                      )}
                    </div>
                    {rawPlan === "free" && (
                      <Link href="/pricing" className="flex-shrink-0">
                        <span className="inline-flex items-center text-[11px] font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200/80 px-2 py-0.5 rounded-full transition-all duration-200 shadow-2xs whitespace-nowrap">
                          Nâng cấp Unlimited ↑
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Quota Card */}
            <Card className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm shadow-slate-200/50 rounded-2xl">
              <CardContent className="flex items-center gap-3.5 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 flex-shrink-0">
                  <Search className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">Tìm kiếm hôm nay</p>
                  <p className="font-black text-slate-900 text-sm mt-0.5 truncate">
                    {isUnlimited ? (
                      <span className="text-purple-600 font-bold">Không giới hạn ∞</span>
                    ) : (
                      <span>
                        <span className="text-indigo-600">{searchesRemaining}</span> / {planLimit} còn lại
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Favorites Card */}
            <Card className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm shadow-slate-200/50 rounded-2xl">
              <CardContent className="flex items-center gap-3.5 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 flex-shrink-0">
                  <Heart className="h-5 w-5 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">Tổng yêu thích</p>
                  <p className="font-black text-slate-900 text-base mt-0.5">
                    {loading ? <Loader2 className="inline h-4 w-4 animate-spin text-slate-400" /> : totalFavorites}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Favorites Detail */}
            <Card className="border border-slate-200 bg-white shadow-md shadow-slate-200/50 rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md shadow-rose-500/20">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Mục đã lưu</CardTitle>
                    <CardDescription className="text-slate-500 text-xs">Chi tiết các tài nguyên đã đánh dấu bookmark</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all">
                    <div className="bg-rose-50 border border-rose-100 p-2 rounded-lg">
                      <Video className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Video Ads</p>
                      <p className="font-extrabold text-slate-900 text-lg">{counts.video}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all">
                    <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg">
                      <Target className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Offers</p>
                      <p className="font-extrabold text-slate-900 text-lg">{counts.offer}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all">
                    <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Affiliates</p>
                      <p className="font-extrabold text-slate-900 text-lg">{counts.affiliate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all">
                    <div className="bg-amber-50 border border-amber-100 p-2 rounded-lg">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Thương hiệu</p>
                      <p className="font-extrabold text-slate-900 text-lg">{counts.brand}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-slate-200 bg-white shadow-md shadow-slate-200/50 rounded-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Truy cập nhanh</CardTitle>
                    <CardDescription className="text-slate-500 text-xs">Các công cụ Nghiên cứu chính</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/quicksearch" className="block">
                  <div className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-600 transition-colors">
                      <Search className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">Tìm kiếm nhanh (Quick Search)</p>
                      <p className="text-xs text-slate-500">Tra cứu nhanh video không cần đăng nhập</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <Link href="/mkt" className="block">
                  <div className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 group-hover:bg-purple-600 transition-colors">
                      <TrendingUp className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors text-sm">YouTube Ads Chuyên Sâu</p>
                      <p className="text-xs text-slate-500">Nghiên cứu Spend, kịch bản video, hook 3s</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>

                <Link href="/facebook-ads-search" className="block">
                  <div className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 group-hover:bg-blue-600 transition-colors">
                      <DollarSign className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm">Facebook Ads Spy</p>
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">1/11</span>
                      </div>
                      <p className="text-xs text-slate-500">Xem Spend, Reach, nhân bản và vít nhóm</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Affiliate Banner Card */}
          <Card className="border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 text-white shadow-xl shadow-emerald-950/20 rounded-2xl mt-6 overflow-hidden">
            <CardContent className="p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
                  <Gift className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Chương Trình Đối Tác Tiếp Thị (Affiliate)</h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                      Hoa hồng 20%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Nhận 20% hoa hồng trọn đời trên mọi đơn hàng nâng cấp trả phí từ người dùng bạn giới thiệu. Cookie lưu 30 ngày, rút tiền tự động về ngân hàng.
                  </p>
                </div>
              </div>
              <Button asChild className="shrink-0 h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950 cursor-pointer">
                <Link href="/affiliate">
                  Lấy Link Tiếp Thị Ngay
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Guide Section */}
          <Card className="border border-slate-200 bg-white shadow-md shadow-slate-200/50 rounded-2xl mt-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Hướng dẫn sử dụng</CardTitle>
                  <CardDescription className="text-slate-500 text-xs">Quy trình 4 bước khai thác nền tảng hiệu quả</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 mt-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base">Tìm kiếm mục tiêu</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">Sử dụng thanh tìm kiếm để tra cứu quảng cáo, chiến dịch theo từ khóa, URL hoặc ID thương hiệu đối thủ.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-extrabold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base">Lọc & Nghiên cứu kết quả</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">Áp dụng các bộ lọc chuyên sâu theo danh mục, quốc gia, và mốc thời gian để tìm ra mẫu ads đang vít tiền mạnh.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 border border-pink-200 text-pink-700 font-extrabold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base">Lưu yêu thích</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">Đánh dấu (bookmark) lại các mẫu creative hoặc offers chất lượng cao để tiện tra cứu và phân tích nhóm sau này.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base">Nhân bản & Scale</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">Học hỏi cấu trúc kịch bản Hook 3s, phễu landing page của đối thủ để tối ưu hóa ROI cho chiến dịch của bạn.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 mt-12 bg-white">
        <div className="container text-center text-sm text-slate-500">
          <p>© 2026 Ads Spy Tool. Nền tảng phân tích và Nghiên cứu quảng cáo hàng đầu cho Performance Marketers.</p>
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage