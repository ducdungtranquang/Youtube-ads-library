"use client"

import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useVidTaoSearch } from "@/hooks/use-vidtao-search"
import { Search, Video, TrendingUp, Play, ExternalLink, Eye, Clock, Loader2, AlertTriangle, Filter, RefreshCw, Calendar, Globe } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
// Import countries as JSON for better performance
import countriesList from '@/data/countries.json';

function QuickSearchPage() {
  // Use useRef for search input to prevent lag on typing
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [hasInputValue, setHasInputValue] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Removed all filter states for better performance
  
  const { searchAds, loading, error } = useVidTaoSearch()

  // Memoize countries list to prevent re-rendering - using JSON for better performance
  const countries = useMemo(() => countriesList, [])
  
  // Memoize quick tags to prevent re-creation (marketing only)
  const marketingTags = useMemo(() => 
    ["Weight Loss", "Make Money", "Crypto", "Health", "Finance", "Software", "Beauty", "Fitness"], []
  )

  const handleSearch = useCallback(async (e: React.FormEvent | null, page: number = 1) => {
    if (e) e.preventDefault()
    
    // Get current value from input ref
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
      setCurrentPage(1)
    }

    try {
      // Simple search without filters
      const result = await searchAds({
        query: currentQuery,
        page: page,
        limit: 20
      })

      if (result) {
        console.log('Search API result:', result)
        
        if (page === 1) {
          setSearchResults(result.data?.ads || (result as any)?.data?.videos)
        } else {
          // Handle different data structures for pagination
          setSearchResults((prev: any) => {
            const prevData = prev?.data?.ads || (prev as any)?.data?.videos || []
            const newData = result.data?.ads || (result as any)?.data?.videos || []
            
            return {
              ...result.data?.ads,
              data: [...prevData, ...newData]
            }
          })
        }
        setCurrentPage(page)
        
        // Get count from different possible structures
        const resultCount = result.data?.ads?.length || (result as any)?.data?.videos?.length || (result as any)?.total || 0
        toast.success(`Found ${resultCount} results`)
      } else {
        console.log('No result returned from search API')
        toast.info('No results found')
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


  
  const renderedSearchResults = useMemo(() => {
    if (!searchResults) return null

    // Handle different API response structures
    const videos = searchResults.data || searchResults.ads || searchResults.videos || searchResults || []
    
    console.log('Search results structure:', searchResults)
    console.log('Videos array:', videos)
    
    if (!Array.isArray(videos) || videos.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No results found</p>
        </div>
      )
    }
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
        {/* Hero Banner - Increased height */}
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

        {/* Search Results */}
        {searchResults && (
          <Card className="mb-8" data-search-results>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Search Results</span>
                <Badge variant="secondary">
                  {searchResults.pagination?.total || searchResults.total || (Array.isArray(searchResults.data) ? searchResults.data.length : 0) || 0} results found
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