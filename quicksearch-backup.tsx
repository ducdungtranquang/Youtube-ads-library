"use client"

import { useState, useRef, useCallback } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useVidTaoSearch } from "@/hooks/use-vidtao-search"
import { Search, Video, TrendingUp, Play, ExternalLink, Eye, Clock, Loader2, AlertTriangle, Sparkles, Users, Zap } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

function QuickSearchPage() {
  // Use useRef for search input to prevent lag on typing
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasInputValue, setHasInputValue] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const { searchAds, loading, error } = useVidTaoSearch()

  // Quick search tags for marketing (no memoization needed for simple array)
  const marketingTags = ["Weight Loss", "Make Money", "Crypto", "Health", "Finance", "Software", "Beauty", "Fitness"]

  const handleSearch = useCallback(async (e: React.FormEvent | null, page: number = 1) => {
    if (e) e.preventDefault()
    
    // Get current value from input ref
    const currentQuery = searchInputRef.current?.value?.trim() || ""
    
    if (!currentQuery) {
      toast.error("Please enter a search query")
      return
    }

    // Update state with current query for display purposes
    setSearchQuery(currentQuery)
    
    setIsSearching(true)
    if (page === 1) {
      setSearchResults(null)
      setCurrentPage(1)
    }

    try {
      // Simple search without filters
      const results = await searchAds({
        query: currentQuery,
        page: page,
        limit: 20
      })

      if (results) {
        if (page === 1) {
          setSearchResults(results)
        } else {
          setSearchResults((prev: any) => ({
            ...results,
            data: [...(prev?.data || []), ...(results.data || [])]
          }))
        }
        setCurrentPage(page)
      }
    } catch (error) {
      console.error("Search error:", error)
      toast.error("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }, [searchAds])

  const handlePageChange = useCallback(async (newPage: number) => {
    if (newPage < 1 || (searchResults?.pagination?.totalPages && newPage > searchResults.pagination.totalPages)) {
      return
    }
    
    setIsSearching(true)
    await handleSearch(null as any, newPage)
    setIsSearching(false)
    
    // Scroll to top of results
    const resultsElement = document.querySelector('[data-search-results]')
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' })
    }
  }, [handleSearch])

  // Removed loadFeaturedContent - using static content for better performance

  useEffect(() => {
    if (searchInputRef.current && searchQuery) {
      searchInputRef.current.value = searchQuery
      setHasInputValue(searchQuery.trim().length > 0)
    }
  }, [searchQuery])

  // Memoize filter change handlers
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
    setSearchResults(null)
  }, [])

  const handleCountryChange = useCallback((value: string) => {
    setSelectedCountry(value)
    setCurrentPage(1)
    setSearchResults(null)
  }, [])

  const handleLanguageChange = useCallback((value: string) => {
    setSelectedLanguage(value)
    setCurrentPage(1)
    setSearchResults(null)
  }, [])

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value)
    setCurrentPage(1)
    setSearchResults(null)
  }, [])


  const handleClearFilters = useCallback(() => {
    setSelectedCategory("all")
    setSelectedCountry("all")
    setSelectedLanguage("all")
    setDateFrom("")
    setDateTo("")
    setSortBy("totalSpend") // Always marketing default
    setCurrentPage(1)
    setSearchResults(null)
  }, [])

  // Removed handleSearchTypeChange - QuickSearch is now marketing-only

  // Memoize pagination component
  const paginationComponent = useMemo(() => {
    if (!searchResults?.pagination || searchResults.pagination.totalPages <= 1) return null

    const { totalPages } = searchResults.pagination

    return (
      <div className="mt-8 space-y-4">
        {/* Main Navigation */}
        <div className="flex justify-center items-center gap-4">
          <Button 
            variant="outline" 
            size="default"
            disabled={currentPage <= 1 || isSearching}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-6"
          >
            {isSearching && currentPage > 1 ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            ← Previous
          </Button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/30 rounded-lg">
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="default"
            disabled={currentPage >= totalPages || isSearching}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-6"
          >
            Next →
            {isSearching && currentPage < totalPages ? (
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
            ) : null}
          </Button>
        </div>

        {/* Jump to page */}
        <div className="flex justify-center items-center gap-2">
          <span className="text-sm text-muted-foreground">Jump to page:</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum
              
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (currentPage <= 4) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = currentPage - 3 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-10 h-10"
                  disabled={isSearching}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Page Summary */}
        <div className="text-center text-sm text-muted-foreground">
          Showing {((currentPage - 1) * 4) + 1} - {Math.min(currentPage * 4, searchResults.pagination.total)} of {searchResults.pagination.total} results
        </div>
      </div>
    )
  }, [searchResults?.pagination, currentPage, isSearching, handlePageChange])

  // Memoize search results rendering
  const renderedSearchResults = useMemo(() => {
    if (!searchResults) return null

    // Always marketing since we removed affiliate functionality
      const videos = searchResults.ads || searchResults.videos || []
      return (
        <div className="grid gap-6 mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-2">
          {videos.map((video: any, index: number) => (
            <Card key={video.ytVideoId || index} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative w-full h-48 bg-accent rounded-lg overflow-hidden">
                    {video.thumbnail ? (
                      <Image
                        src={video.thumbnail}
                        alt={video.title || 'Video thumbnail'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    {video.ytVideoId && (
                      <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        <ExternalLink className="h-3 w-3 inline mr-1" />
                        YouTube
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2 text-lg mb-3">
                      {video.title || 'Untitled Video'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {video.totalSpend && (
                          <Badge variant="default" className="bg-green-100 text-green-800 font-medium">
                            ${video.totalSpend.toLocaleString()} spent
                          </Badge>
                        )}
                        {video.ytVideoId && (
                          <Badge variant="secondary" className="font-mono">
                            {video.ytVideoId.substring(0, 11)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {video.firstSeen && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(video.firstSeen).toLocaleDateString()}
                            </span>
                          )}
                          {video.lastSeen && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(video.lastSeen).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {video.ytVideoId && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3"
                            onClick={() => window.open(`https://youtube.com/watch?v=${video.ytVideoId}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Watch Video
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
  }, [searchResults])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Quick Search</h1>
          <p className="text-muted-foreground">Tìm kiếm nhanh chóng các quảng cáo marketing hiệu quả trên YouTube</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Quick Search
            </CardTitle>
            <CardDescription>Search for marketing ads and video campaigns instantly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Form */}
            <form onSubmit={(e) => handleSearch(e, 1)} className="flex gap-2 mobile:flex-col tablet:flex-row">
              <Input
                ref={searchInputRef}
                placeholder="Search ads, brands, or keywords..."
                defaultValue={searchQuery}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(null, 1)
                  }
                }}
                onInput={(e) => {
                  // Only update button state, don't trigger re-renders
                  const target = e.target as HTMLInputElement
                  setHasInputValue(target.value.trim().length > 0)
                }}
                className="flex-1"
              />
              <Button type="submit" disabled={!hasInputValue || isSearching} className="mobile:w-full tablet:w-auto">
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </form>

            {/* Filters */}
            <div className="space-y-4">
              {/* First Row - Basic Filters */}
              <div className="flex flex-wrap gap-2 mobile:flex-col tablet:flex-row">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="mobile:w-full tablet:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="finance">Finance & Investment</SelectItem>
                    <SelectItem value="beauty">Beauty & Skincare</SelectItem>
                    <SelectItem value="tech">Technology & Software</SelectItem>
                    <SelectItem value="food">Food & Nutrition</SelectItem>
                    <SelectItem value="education">Education & Learning</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger className="mobile:w-full tablet:w-48">
                    <Globe className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country: any) => (
                      <SelectItem key={country.countryId} value={country.countryId.toString()}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="mobile:w-full tablet:w-48">
                    <Globe className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {countries.map((country: any) => (
                      <SelectItem key={country.alpha2Code} value={country.alpha2Code}>
                        {country.name} ({country.alpha2Code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Second Row - Advanced Filters */}
              <div className="flex flex-wrap gap-2 mobile:flex-col tablet:flex-row">
                <div className="flex items-center gap-2 mobile:w-full tablet:w-auto">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="From Date"
                    value={dateFrom}
                    onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                      setDateFrom(e.target.value)
                      setCurrentPage(1)
                      setSearchResults(null)
                    }, [])}
                    className="mobile:w-full tablet:w-40"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="date"
                    placeholder="To Date"
                    value={dateTo}
                    onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                      setDateTo(e.target.value)
                      setCurrentPage(1)
                      setSearchResults(null)
                    }, [])}
                    className="mobile:w-full tablet:w-40"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="mobile:w-full tablet:w-40">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="totalSpend">Total Spend</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearFilters}
                  className="mobile:w-full tablet:w-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                

              </div>
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mobile:w-full tablet:w-auto mb-2 tablet:mb-0">Quick searches:</span>
              {marketingTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 mobile:text-xs tablet:text-sm"
                  onClick={() => {
                    if (searchInputRef.current) {
                      searchInputRef.current.value = tag
                      setHasInputValue(true)
                      setSearchQuery(tag) // Update display state
                    }
                  }}
                >
                  {tag}
                  </Badge>
                ))
              }
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults && (
          <Card className="mb-8" data-search-results>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Search Results</span>
                <Badge variant="secondary">
                  {searchResults.pagination?.total || 0} results found
                </Badge>
              </CardTitle>
              <CardDescription>
                Results for "{searchQuery}" in Marketing Ads
                {searchResults.pagination?.totalPages > 1 && (
                  <span> - Page {currentPage} of {searchResults.pagination.totalPages}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderedSearchResults}
              {paginationComponent}

            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Search Error</span>
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
                Tìm Kiếm Nhanh Chóng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                QuickSearch giúp bạn tìm kiếm và phân tích các quảng cáo marketing hiệu quả nhất trên YouTube một cách nhanh chóng và chính xác.
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
                  <span>Xem chi tiết ngân sách quảng cáo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tính Năng Nổi Bật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Tìm Kiếm Thông Minh</h4>
                    <p className="text-xs text-muted-foreground">Sử dụng AI để tìm các quảng cáo liên quan nhất</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Phạm Vi Toàn Cầu</h4>
                    <p className="text-xs text-muted-foreground">Dữ liệu từ nhiều quốc gia và ngôn ngữ khác nhau</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Phân Tích Chi Tiết</h4>
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