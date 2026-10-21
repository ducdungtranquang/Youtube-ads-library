"use client"

import { useState, useCallback, useMemo, memo, useRef } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoCard } from "@/components/video-card"
import { VideoDetailModal } from "@/components/video-detail-modal"
import { SearchLoadingState } from "@/components/search-loading-state"
import { useAuth } from "@/contexts/auth-context"
import {
  Search,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  LogIn,
  Flame,
  Layers,
  CheckCircle2,
  Play,
  X,
  Zap,
  BarChart3
} from "lucide-react"
import { toast } from "sonner"
import { useSearchQuota } from "@/hooks/use-search-quota"
import { SearchQuotaBadge } from "@/components/search-quota-badge"
import { UpgradeModal } from "@/components/upgrade-modal"

function QuickSearchPage() {
  const { user } = useAuth()
  const {
    quota,
    checkCanSearch,
    consumeSearch,
    isUpgradeModalOpen,
    openUpgradeModal,
    closeUpgradeModal,
  } = useSearchQuota('yt')

  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasInputValue, setHasInputValue] = useState(false)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)

  // Danh mục từ khóa gợi ý theo xu hướng quảng cáo YouTube
  const marketingTags = useMemo(
    () => [
      "Dropshipping",
      "E-Commerce",
      "Khóa học & Coaching",
      "Phần mềm SaaS",
      "Sức khỏe & Giảm cân",
      "Tài chính & Đầu tư",
      "Mỹ phẩm & Skincare",
      "Gia dụng thông minh",
      "Bất động sản",
    ],
    []
  )

  const handleSearch = useCallback(async (e: React.FormEvent | null, tagQuery?: string) => {
    if (e) e.preventDefault()
    const currentQuery = (tagQuery ?? searchInputRef.current?.value)?.trim() || ""

    if (!currentQuery) {
      toast.error("Vui lòng nhập từ khóa tìm kiếm")
      return
    }

    // Check search quota limit: Free (1/day), Personal (20/day), Business (Unlimited)
    if (!checkCanSearch()) {
      return
    }

    setSearchQuery(currentQuery)
    if (searchInputRef.current) {
      searchInputRef.current.value = currentQuery
      setHasInputValue(true)
    }

    setIsSearching(true)
    setError(null)
    setSearchResults(null)

    try {
      const response = await fetch('/api/search/quicksearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          affiliateCountryId: 0,
          affiliateNetworkIds: [],
          categoryIds: [],
          countryId: 0,
          dateFrom: "",
          dateTo: "",
          isAffiliate: false,
          language: "",
          limit: 30,
          offerIds: [],
          orderAsc: false,
          page: 1,
          searchTerm: currentQuery,
          query: currentQuery,
          showVideos: "unlisted",
          softwareIds: [],
          sortProp: ""
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.details || result.error)
      }

      // Trích xuất kết quả video từ cấu trúc dữ liệu
      const rawVideos = result?.data?.data?.results || result?.data?.results || result?.data || []
      const videos = Array.isArray(rawVideos) ? rawVideos : []
      setSearchResults(videos)
      setIsSearching(false)
      consumeSearch()

      if (videos.length === 0) {
        toast.info('Không tìm thấy kết quả nào phù hợp')
      } else {
        toast.success(`Tìm thấy ${videos.length} video quảng cáo YouTube`)
      }
    } catch (err) {
      console.error('Search error:', err)
      const message = err instanceof Error ? err.message : 'Tìm kiếm thất bại'
      setError(message)
      setSearchResults(null)
      setIsSearching(false)
      toast.error("Tìm kiếm thất bại. Vui lòng thử lại sau.")
    }
  }, [])

  const handleTagClick = (tag: string) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = tag
      setHasInputValue(true)
    }
    handleSearch(null, tag)
  }

  const handleClearInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
      searchInputRef.current.focus()
      setHasInputValue(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="container px-4 md:px-6 lg:px-8 py-8 md:py-12 relative z-20">
        {/* Glow ambient background accents */}
        <div className="absolute top-10 left-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 -z-10 h-80 w-80 rounded-full bg-purple-200/40 blur-[120px] pointer-events-none" />

        {/* Hero Banner Section - Modern Sleek Light */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 md:p-12 lg:p-14 shadow-xl shadow-slate-200/60">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {/* Top Pill Badge & Quota Indicator */}
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                <span>YouTube Quick Search • Bản Dùng Thử Nhanh</span>
              </div>
              <SearchQuotaBadge quota={quota} onUpgradeClick={openUpgradeModal} />
            </div>

            {/* Title & Slogan */}
            <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl leading-tight">
              YouTube Quick Search
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                Khám Phá Video Quảng Cáo Tức Thì
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed">
              Tìm kiếm trực tiếp kho video quảng cáo YouTube triệu view từ các thương hiệu hàng đầu.
              Miễn phí <span className="text-emerald-700 font-bold">5 lượt/ngày</span>. Nâng cấp gói <Link href="/pricing" className="text-indigo-600 font-bold hover:underline">Cá nhân (25 lượt/ngày)</Link> hoặc <Link href="/pricing" className="text-purple-600 font-bold hover:underline">Doanh nghiệp (Không giới hạn)</Link> để bóc tách toàn diện.
            </p>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => handleSearch(e)}
              className="mx-auto max-w-2xl"
            >
              <div className="relative flex flex-col sm:flex-row items-center gap-2 rounded-2xl bg-slate-50 border-2 border-slate-200 p-2 shadow-lg shadow-slate-200/50 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                <div className="relative flex-1 w-full flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Nhập từ khóa ngành hàng, sản phẩm, kịch bản hoặc tên kênh..."
                    defaultValue={searchQuery}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(null)
                      }
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement
                      setHasInputValue(target.value.trim().length > 0)
                    }}
                    className="h-12 w-full pl-11 pr-10 text-base bg-transparent border-0 text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {hasInputValue && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                      aria-label="Xóa từ khóa"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSearching}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 cursor-pointer transition-all shrink-0"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tìm...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Tìm Kiếm
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Quick Tags Suggestions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                Gợi ý nhanh:
              </span>
              {marketingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="rounded-full bg-slate-100 border border-slate-200/90 px-3.5 py-1 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 🌟 PROMINENT BANNER: Gợi ý Đăng nhập & Vào YouTube Ads để Search Chuyên Sâu */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/60 p-6 md:p-8 shadow-xl shadow-indigo-100/50">
            {/* Ambient inner soft glow */}
            <div className="absolute top-0 right-0 h-64 w-64 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
                  <Flame className="h-3.5 w-3.5 text-amber-600" />
                  Bạn Cần Bóc Tách Sâu Hơn Về Ngân Sách & Chiến Lược Đối Thủ?
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Nâng Cấp Trải Nghiệm Với <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">YouTube Ads Chuyên Sâu</span>
                </h2>

                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  Bản <strong>Quick Search</strong> giúp bạn xem nhanh mẫu quảng cáo. Để lọc chính xác theo{" "}
                  <strong className="text-emerald-700 font-bold">Ước tính Ngân sách (Spend)</strong>,{" "}
                  <strong className="text-indigo-700 font-bold">Lượt tiếp cận (Reach)</strong>,{" "}
                  <strong className="text-purple-700 font-bold">Số ngày vít ads</strong>,{" "}
                  <strong className="text-pink-700 font-bold">Bóc tách kịch bản Hook 3s</strong> và{" "}
                  <strong className="text-rose-700 font-bold">Phễu bán hàng đối thủ</strong>, hãy truy cập công cụ <strong>YouTube Ads Chuyên Sâu</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Bóc tách chi phí thật
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" /> Bóc tách kịch bản video
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" /> Phát hiện sản phẩm Win
                  </span>
                </div>
              </div>

              {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Link href="/mkt">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Vào YouTube Ads Chuyên Sâu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                {!user && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 px-6 rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
                  >
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Đăng Nhập / Đăng Ký
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        <SearchLoadingState
          isSearching={isSearching}
          isPending={false}
          searchType="ads"
          className="mb-8"
        />

        {/* Search Results Display */}
        {searchResults && Array.isArray(searchResults) && (
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Play className="h-5 w-5 text-indigo-600 fill-indigo-600" />
                  Kết quả YouTube Ads
                  <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 ml-2 font-semibold">
                    {searchResults.length} video
                  </Badge>
                </h3>
                {searchQuery && (
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Hiển thị các mẫu quảng cáo phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </div>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="self-start sm:self-auto border-indigo-200 bg-indigo-50/70 text-indigo-700 hover:text-indigo-800 hover:bg-indigo-100 text-xs font-semibold rounded-xl shadow-2xs"
              >
                <Link href={`/mkt${searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : ''}`}>
                  <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                  Bóc tách chuyên sâu trong YouTube Ads
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {searchResults.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-white rounded-3xl shadow-sm">
                <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Search className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900">Chưa tìm thấy video quảng cáo phù hợp</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Hãy thử tìm với từ khóa tiếng Anh hoặc từ khóa ngắn gọn hơn (VD: <em>Dropshipping, Cleaner, Skincare, Fitness</em>) hoặc chuyển qua trang chuyên sâu.
                    </p>
                  </div>
                  <Button asChild size="sm" className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm">
                    <Link href="/mkt">
                      Mở YouTube Ads Chuyên Sâu
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((video: any, index: number) => {
                  const dateString = video.firstSeen
                    ? new Date(video.firstSeen).toLocaleDateString("vi-VN")
                    : video.date || "Chưa rõ ngày";

                  return (
                    <VideoCard
                      key={video.ytVideoId || index}
                      title={video.title || "Video Quảng Cáo YouTube"}
                      channel={video.channel || video.channelTitle || "Kênh đối thủ"}
                      views={video.views || "0"}
                      ctr={video.ctr || "N/A"}
                      date={dateString}
                      thumbnail={video.thumbnail || video.imageUrl || "/placeholder.svg"}
                      url={video.ytVideoId ? `https://youtube.com/watch?v=${video.ytVideoId}` : undefined}
                      companyName={video.companyName}
                      ytVideoId={video.ytVideoId}
                      description={video.description}
                      duration={video.duration}
                      onClick={() => {
                        setSelectedVideo({
                          ...video,
                          date: dateString,
                          url: video.ytVideoId ? `https://youtube.com/watch?v=${video.ytVideoId}` : undefined,
                        })
                      }}
                      onCompanyClick={() => {
                        if (video.companyName) {
                          handleSearch(null, video.companyName)
                        }
                      }}
                    />
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-10 border border-rose-200 bg-rose-50 rounded-2xl shadow-sm">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-rose-700">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <h4 className="font-bold text-sm">Lỗi tìm kiếm</h4>
                  <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSearch(null)}
                className="border-rose-300 text-rose-700 hover:bg-rose-100 text-xs shrink-0 font-semibold"
              >
                Thử lại
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comparison / Feature Highlights Section */}
        <section className="grid gap-6 md:grid-cols-3 mt-12 pt-8 border-t border-slate-200">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Tìm Nhanh Siêu Tốc</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Truy cập tức thì kho dữ liệu quảng cáo YouTube mà không cần đăng nhập hay cấu hình phức tạp. Thích hợp để lướt tìm ý tưởng sơ bộ.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Chuyên Sâu (YouTube Ads)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dành cho Media Buyer & Dropshipper: Lọc theo ngân sách, ngày chạy, lượt tiếp cận và phát hiện quảng cáo vít nhóm mạnh mẽ.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-200/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Layers className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-base text-slate-900">Bóc Tách Kịch Bản & Phễu</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Phân tích cấu trúc Hook 3s, nội dung giải quyết vấn đề, landing page và công nghệ tracking pixel của đối thủ.
            </p>
          </div>
        </section>
      </main>

      {/* Video Detail Modal */}
      {selectedVideo && (
        <VideoDetailModal
          open={!!selectedVideo}
          onOpenChange={(open) => !open && setSelectedVideo(null)}
          video={{
            title: selectedVideo?.title || "Video Quảng Cáo",
            channel: selectedVideo?.channel || "Unknown Channel",
            views: selectedVideo?.views || "0",
            ctr: selectedVideo?.ctr || "0%",
            date: selectedVideo?.date || "",
            thumbnail: selectedVideo?.thumbnail || "",
            url: selectedVideo?.url || "",
            companyName: selectedVideo?.companyName || "",
            description: selectedVideo?.description || "",
            duration: selectedVideo?.duration || "",
            ytVideoId: selectedVideo?.ytVideoId,
          }}
        />
      )}

      {/* Upgrade Modal on Quota Exceeded */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        quota={quota}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 mt-16 bg-white">
        <div className="container text-center text-xs text-slate-500">
          <p>© 2026 Ads Spy Tool. Nền tảng phân tích dữ liệu quảng cáo YouTube & Facebook chuyên sâu.</p>
        </div>
      </footer>
    </div>
  )
}

export default memo(QuickSearchPage)