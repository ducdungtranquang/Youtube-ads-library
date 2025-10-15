"use client"

import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoCard } from "@/components/video-card"
import { FrontendPagination } from "@/components/frontend-pagination"
import { SearchLoadingState } from "@/components/search-loading-state"
import { useQuickSearchAds } from "@/hooks/use-quicksearch-ads"
import { useFrontendPagination } from "@/hooks/use-frontend-pagination"
import { Search, TrendingUp, Eye, Loader2, AlertTriangle, Globe } from "lucide-react"
import { toast } from "sonner"

function QuickSearchPage() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasInputValue, setHasInputValue] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  
  // Frontend pagination for search results
  const pagination = useFrontendPagination(searchResults || [], { itemsPerPage: 20 })
  
  const { searchAds, loading, error, data, status } = useQuickSearchAds()

  // Memoize quick tags to prevent re-creation (marketing only)
  const marketingTags = useMemo(() => 
    ["Weight Loss", "Make Money", "Crypto", "Health", "Finance", "Software", "Beauty", "Fitness"], []
  )

  const handleSearch = useCallback(async (e: React.FormEvent | null, page: number = 1) => {
    if (e) e.preventDefault()
    
    const currentQuery = searchInputRef.current?.value?.trim() || ""
    
    if (!currentQuery) {
      toast.error("Please enter a search keyword")
      return
    }

    // Update state with current query for display purposes
    setSearchQuery(currentQuery)
    
    setIsSearching(true)
    if (page === 1) {
      setSearchResults(null)
      // setCurrentPage(1)
    }

    try {
      const result = await searchAds({
        query: currentQuery,
        page: 1, // Always use page 1 since API returns 1000 results
        limit: 1000
      })

      if (result?.pending) {
        console.log('Search is pending, polling will start automatically...')
        // Don't show any toast for pending - polling will handle it
        setSearchResults(null) // Clear previous results
      } else if (result?.success && result?.data) {
        console.log('Search API result:', result)
        
        // Handle cached result
        const videos = result.data?.data || result.data?.ads || result.data?.videos || []
        setSearchResults(videos)
        
        // Only show success toast for completed results
        const resultCount = Array.isArray(videos) ? videos.length : 0
        if (resultCount > 0) {
          toast.success(`Found ${resultCount} results`)
        } else {
          toast.info('No results found')
        }
      } else {
        console.log('No result returned from search API')
        toast.info('No results found')
        setSearchResults(null)
      }
    } catch (error) {
      console.error("Search error:", error)
      toast.error("Search failed. Please try again.")
      setSearchResults(null)
    } finally {
      setIsSearching(false)
    }
  }, [searchAds])

  // Handle page changes for frontend pagination
  const handlePageChange = useCallback((newPage: number) => {
    pagination.goToPage(newPage)
    
    // Scroll to top of results
    const resultsElement = document.querySelector('[data-search-results]')
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' })
    }
  }, [pagination])

  // Removed loadFeaturedContent - using static content for better performance

  useEffect(() => {
    if (searchInputRef.current && searchQuery) {
      searchInputRef.current.value = searchQuery
      setHasInputValue(searchQuery.trim().length > 0)
    }
  }, [searchQuery])

  // Handle polling results
  useEffect(() => {
    if (status === 'completed' && data) {
      console.log('Polling completed, updating results:', data)
      
      // Handle the completed polling result
      const videos = data?.data || data?.ads || data?.videos || []
      setSearchResults(videos)
      setIsSearching(false)
      
      // Show success toast for completed polling
      const resultCount = Array.isArray(videos) ? videos.length : 0
      if (resultCount > 0) {
        toast.success(`Found ${resultCount} results`)
      } else {
        toast.info('No results found')
      }
    } else if (status === 'error') {
      console.log('Polling failed with error:', error)
      setSearchResults(null)
      setIsSearching(false)
      toast.error(error || 'Search failed')
    }
  }, [status, data, error])


  
  const renderedSearchResults = useMemo(() => {
    if (!searchResults || pagination.totalItems === 0) return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No results found</p>
      </div>
    )

    return (
      <div className="space-y-6">
        <div className="grid gap-6 mobile:grid-cols-1 tablet:grid-cols-1 desktop:grid-cols-2">
          {pagination.currentItems.map((video: any, index: number) => (
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
                // Handle video click if needed
                console.log('Video clicked:', video)
              }}
              onCompanyClick={() => {
                // Handle company click if needed
                console.log('Company clicked:', video.companyName)
              }}
            />
          ))}
        </div>
        
        {/* Frontend Pagination */}
        <FrontendPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={20}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onNextPage={pagination.nextPage}
          onPrevPage={pagination.prevPage}
          onGoToPage={handlePageChange}
          className="mt-8"
        />
      </div>
    )
  }, [searchResults, pagination, handlePageChange])

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
              Quick Ad Search
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Fast & Efficient
              </span>
            </h1>
            <p className="mb-10 text-xl opacity-90 md:text-xl lg:text-2xl">
              Discover millions of effective marketing ads from leading brands
            </p>
            
            {/* Search Form */}
            <form onSubmit={(e) => handleSearch(e, 1)} className="mx-auto max-w-3xl">
              <div className="relative flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Enter keyword, URL or brand name..."
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
                    "Search"
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

        {/* Loading State */}
        <SearchLoadingState 
          isSearching={isSearching}
          isPending={status === 'pending'}
          searchType="ads"
          className="mb-8"
        />

        {/* Search Results */}
        {searchResults && (
          <Card className="mb-8" data-search-results>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Search Results</span>
                <Badge variant="secondary">
                  {pagination.totalItems} results found
                </Badge>
              </CardTitle>
              <CardDescription>
                Results for "{searchQuery}" in Marketing Ads
                {pagination.totalPages > 1 && (
                  <span> - Page {pagination.currentPage} of {pagination.totalPages}</span>
                )}
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
                Quick Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                QuickSearch helps you find and analyze the most effective marketing ads on YouTube quickly and accurately.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                    ✓
                  </Badge>
                  <span>Search by keyword, brand, product</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                    ✓
                  </Badge>
                  <span>Filter by country, language, time</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                    ✓
                  </Badge>
                  <span>View detailed ad budget information</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Smart Search</h4>
                    <p className="text-xs text-muted-foreground">Use AI to find the most relevant ads</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Global Coverage</h4>
                    <p className="text-xs text-muted-foreground">Data from multiple countries and languages</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Detailed Analysis</h4>
                    <p className="text-xs text-muted-foreground">View budget, runtime, and ad performance</p>
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