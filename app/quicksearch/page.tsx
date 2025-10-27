"use client"

import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoCard } from "@/components/video-card"
import { SearchLoadingState } from "@/components/search-loading-state"
import { useQuickSearchAds } from "@/hooks/use-quicksearch-ads"
import { Search, TrendingUp, Eye, Loader2, AlertTriangle, Globe } from "lucide-react"
import { toast } from "sonner"

function QuickSearchPage() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasInputValue, setHasInputValue] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const { searchAds, loading, error, data, status } = useQuickSearchAds()

  // Memoize quick tags to prevent re-creation (marketing only)
  const marketingTags = useMemo(() => 
    ["Weight Loss", "Make Money", "Crypto", "Health", "Finance", "Software", "Beauty", "Fitness"], []
  )

  const handleSearch = useCallback(async (e: React.FormEvent | null, page: number = 1) => {
    if (e) e.preventDefault()
    const currentQuery = searchInputRef.current?.value?.trim() || ""
    if (!currentQuery) {
      toast.error("Vui lòng nhập từ khóa tìm kiếm")
      return
    }
    setSearchQuery(currentQuery)
    setIsSearching(true)
    if (page === 1) {
      setSearchResults(null)
    }
    try {
      const result = await searchAds({
        affiliateCountryId: 0,
        affiliateNetworkIds: [],
        categoryIds: [],
        countryId: 0,
        dateFrom: "",
        dateTo: "",
        isAffiliate: false,
        language: "",
        limit: 20,
        offerIds: [],
        orderAsc: false,
        page: 1,
        searchTerm: currentQuery,
        query: currentQuery,
        showVideos: "unlisted",
        softwareIds: [],
        sortProp: ""
      })
      if (result?.pending) {
        setSearchResults(null)
      } else if (result?.success && result?.data) {
        // Handle deeply nested VidTao response
        const videos = result.data?.data?.data?.results || result.data?.data?.results || result.data?.results || [];
        setSearchResults(videos);
        const resultCount = Array.isArray(videos) ? videos.length : 0;
        if (resultCount === 0) {
          toast.info('Không tìm thấy kết quả');
        }
      } else {
        toast.info('Không tìm thấy kết quả');
        setSearchResults(null);
      }
    } catch (error) {
      toast.error("Tìm kiếm thất bại. Vui lòng thử lại.")
      setSearchResults(null)
    } finally {
      setIsSearching(false)
    }
  }, [searchAds])

  useEffect(() => {
    if (searchInputRef.current && searchQuery) {
      searchInputRef.current.value = searchQuery
      setHasInputValue(searchQuery.trim().length > 0)
    }
  }, [searchQuery])

  useEffect(() => {
    if (status === 'completed' && data) {
      const videos = data?.data || data?.ads || data?.videos || []
      setSearchResults(videos)
      setIsSearching(false)
      const resultCount = Array.isArray(videos) ? videos.length : 0
      if (resultCount > 0) {
        toast.success(`Tìm thấy ${resultCount} kết quả`)
      } else {
        toast.info('Không tìm thấy kết quả')
      }
    } else if (status === 'error') {
      setSearchResults(null)
      setIsSearching(false)
      toast.error(error || 'Tìm kiếm thất bại')
    }
  }, [status, data, error])

  const renderedSearchResults = useMemo(() => {
    if (!searchResults || !Array.isArray(searchResults) || searchResults.length === 0) return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không tìm thấy kết quả</p>
      </div>
    )
    return (
      <div className="space-y-6">
        <div className="grid gap-6 mobile:grid-cols-1 tablet:grid-cols-1 desktop:grid-cols-2">
          {searchResults.map((video: any, index: number) => (
            <VideoCard
              key={video.ytVideoId || index}
              title={video.title || 'Untitled Video'}
              channel={video.channel || 'Unknown Channel'}
              views={video.views || '0'}
              ctr={video.ctr || 'N/A'}
              date={video.firstSeen ? new Date(video.firstSeen).toLocaleDateString() : 'Unknown'}
              thumbnail={video.thumbnail || '/placeholder.svg'}
              url={video.ytVideoId ? `https://youtube.com/watch?v=${video.ytVideoId}` : undefined}
              companyName={video.companyName}
              onClick={() => {
                console.log('Video clicked:', video)
              }}
              onCompanyClick={() => {
                console.log('Company clicked:', video.companyName)
              }}
            />
          ))}
        </div>
      </div>
    )
  }, [searchResults])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-12 md:p-16 lg:p-20">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
          <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-white/20 p-6 backdrop-blur-sm">
                <Search className="h-16 w-16" />
              </div>
            </div>
            <h1 className="mb-8 text-3xl font-bold leading-tight md:text-3xl lg:text-5xl">
              Tìm kiếm quảng cáo nhanh
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Nhanh & Hiệu quả
              </span>
            </h1>
            <p className="mb-10 text-xl opacity-90 md:text-xl lg:text-2xl">
              Khám phá hàng triệu quảng cáo marketing hiệu quả từ các thương hiệu hàng đầu
            </p>
            {/* Search Form */}
            <form onSubmit={(e) => handleSearch(e, 1)} className="mx-auto max-w-3xl">
              <div className="relative flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Nhập từ khóa, URL hoặc tên thương hiệu..."
                    defaultValue={searchQuery}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(null, 1)
                      }
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement
                      setHasInputValue(target.value.trim().length > 0)
                    }}
                    className="h-16 pl-5 pr-4 text-xl bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-white/50 text-black"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!hasInputValue || isSearching}
                  className="h-16 px-10 bg-white text-blue-600 hover:bg-white/90 font-semibold text-lg"
                >
                  {isSearching ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    "Tìm kiếm"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <Card className="mb-8">
          <CardContent>
            {/* Quick Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mobile:w-full tablet:w-auto mb-2 tablet:mb-0">Tìm kiếm nhanh:</span>
              {marketingTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 mobile:text-xs tablet:text-sm"
                  onClick={() => {
                    if (searchInputRef.current) {
                      searchInputRef.current.value = tag
                      setHasInputValue(true)
                      setSearchQuery(tag)
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Loading State */}
        <SearchLoadingState 
          isSearching={isSearching}
          isPending={status === 'pending'}
          searchType="ads"
          className="mb-8"
        />
        {/* Search Results */}
        {searchResults && Array.isArray(searchResults) && searchResults.length > 0 && (
          <Card className="mb-8" data-search-results>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Kết quả tìm kiếm</span>
                <Badge variant="secondary">
                  Tìm thấy {searchResults.length} kết quả
                </Badge>
              </CardTitle>
              <CardDescription>
                Kết quả cho "{searchQuery}" trong Quảng cáo Marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderedSearchResults}
            </CardContent>
          </Card>
        )}
        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Lỗi tìm kiếm</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}
        {/* App Introduction */}
        <div className="grid gap-6 mobile:grid-cols-1 desktop:grid-cols-2">
          {/* About QuickSearch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Tìm kiếm nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Tìm kiếm nhanh giúp bạn tìm và phân tích những quảng cáo marketing hiệu quả nhất trên YouTube một cách nhanh chóng và chính xác.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                    ✓
                  </Badge>
                  <span>Tìm kiếm theo từ khóa, thương hiệu, sản phẩm</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                    ✓
                  </Badge>
                  <span>Lọc theo quốc gia, ngôn ngữ, thời gian</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                    ✓
                  </Badge>
                  <span>Xem thông tin ngân sách quảng cáo chi tiết</span>
                </div>
              </div>
            </CardContent>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Tìm kiếm thông minh</h4>
                    <p className="text-xs text-muted-foreground">Sử dụng AI để tìm những quảng cáo liên quan nhất</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Phủ sóng toàn cầu</h4>
                    <p className="text-xs text-muted-foreground">Dữ liệu từ nhiều quốc gia và ngôn ngữ</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Phân tích chi tiết</h4>
                    <p className="text-xs text-muted-foreground">Xem ngân sách, thời gian chạy và hiệu suất quảng cáo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default memo(QuickSearchPage)