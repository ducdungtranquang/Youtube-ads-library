"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useVidTaoSearch } from "@/hooks/use-vidtao-search"
import { Search, Video, TrendingUp, Play, ExternalLink, Star, Eye, Clock, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function QuickSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"marketing" | "affiliate">("marketing")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  
  const { searchAds, searchOffers, loading, error } = useVidTaoSearch()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query")
      return
    }

    setIsSearching(true)
    setSearchResults(null)

    try {
      const searchParams = {
        query: searchQuery.trim(),
        page: 1,
        limit: 20
      }

      let result
      if (searchType === "marketing") {
        result = await searchAds(searchParams)
      } else {
        result = await searchOffers(searchParams)
      }

      if (result.success) {
        setSearchResults(result.data)
        toast.success(`Found ${result.data?.total || 0} results`)
      } else {
        toast.error(result.error || "Search failed")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
      console.error("Search error:", err)
    } finally {
      setIsSearching(false)
    }
  }

  // Sample featured content
  const featuredAds = [
    {
      id: 1,
      title: "Best Weight Loss Method 2025",
      thumbnail: "/marketing-video-thumbnail.png",
      views: "2.1M",
      duration: "15:23",
      category: "Health & Fitness",
      ctr: "8.5%"
    },
    {
      id: 2,
      title: "Make Money Online Course",
      thumbnail: "/email-marketing-concept.png",
      views: "1.8M",
      duration: "12:45",
      category: "Finance",
      ctr: "7.2%"
    },
    {
      id: 3,
      title: "Instagram Marketing Strategy",
      thumbnail: "/instagram-marketing-concept.png",
      views: "950K",
      duration: "18:30",
      category: "Marketing",
      ctr: "6.8%"
    }
  ]

  const featuredOffers = [
    {
      id: 1,
      name: "ClickFunnels 2.0",
      payout: "$127",
      network: "ClickBank",
      category: "Software",
      conversion: "12.5%",
      thumbnail: "/placeholder.jpg"
    },
    {
      id: 2,
      name: "Chase Sapphire Card",
      payout: "$250",
      network: "CJ Affiliate",
      category: "Finance",
      conversion: "8.3%",
      thumbnail: "/placeholder.jpg"
    },
    {
      id: 3,
      name: "Shopify Plus",
      payout: "$150",
      network: "Impact",
      category: "E-commerce",
      conversion: "15.2%",
      thumbnail: "/placeholder.jpg"
    }
  ]

  const banners = [
    {
      title: "Discover Winning Ads",
      description: "Find the most successful video advertisements across all niches",
      image: "/facebook-ads-tutorial.jpg",
      cta: "Explore Marketing Mode"
    },
    {
      title: "Top Affiliate Offers",
      description: "Research profitable offers and successful affiliate campaigns",
      image: "/email-marketing-concept.png",
      cta: "Browse Affiliate Mode"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Quick Search</h1>
          <p className="text-muted-foreground">Fast search across marketing ads and affiliate offers</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Quick Search
            </CardTitle>
            <CardDescription>Search for ads, offers, or keywords instantly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Type Toggle */}
            <div className="flex gap-2 mobile:flex-col tablet:flex-row">
              <Button
                variant={searchType === "marketing" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("marketing")}
                className="flex items-center gap-2 mobile:w-full tablet:w-auto"
              >
                <TrendingUp className="h-4 w-4" />
                Marketing Ads
              </Button>
              <Button
                variant={searchType === "affiliate" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("affiliate")}
                className="flex items-center gap-2 mobile:w-full tablet:w-auto"
              >
                <Video className="h-4 w-4" />
                Affiliate Offers
              </Button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 mobile:flex-col tablet:flex-row">
              <Input
                placeholder={searchType === "marketing" ? "Search ads, brands, or keywords..." : "Search offers, affiliates, or networks..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!searchQuery.trim() || isSearching} className="mobile:w-full tablet:w-auto">
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

            {/* Quick Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mobile:w-full tablet:w-auto mb-2 tablet:mb-0">Popular searches:</span>
              {["Weight Loss", "Make Money", "Crypto", "Health", "Finance", "Software"].map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 mobile:text-xs tablet:text-sm"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Search Results</span>
                <Badge variant="secondary">
                  {searchResults.pagination?.total || 0} results found
                </Badge>
              </CardTitle>
              <CardDescription>
                Results for "{searchQuery}" in {searchType === "marketing" ? "Marketing Ads" : "Affiliate Offers"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchType === "marketing" ? (
                <div className="grid gap-4 mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3">
                  {searchResults.ads?.map((ad: any, index: number) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="relative w-full h-32 bg-accent rounded-lg overflow-hidden">
                            {ad.thumbnail ? (
                              <Image
                                src={ad.thumbnail}
                                alt={ad.title}
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
                            {ad.duration && (
                              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                                {ad.duration}
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground line-clamp-2">{ad.title}</h3>
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              {ad.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {ad.category}
                                </Badge>
                              )}
                              {ad.views && (
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {ad.views}
                                </span>
                              )}
                              {ad.ctr && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {ad.ctr} CTR
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.offers?.map((offer: any, index: number) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{offer.name}</h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              {offer.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {offer.category}
                                </Badge>
                              )}
                              {offer.network && <span>{offer.network}</span>}
                              {offer.conversion && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  {offer.conversion}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              {offer.payout || offer.commission || 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">Payout</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {searchResults.pagination && searchResults.pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {searchResults.pagination.page} of {searchResults.pagination.totalPages}
                    </span>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              )}
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

        {/* Featured Content */}
        <div className="grid gap-8 mobile:grid-cols-1 desktop:grid-cols-2">
          {/* Featured Ads */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Featured Ads</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {featuredAds.map((ad) => (
                <Card key={ad.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-16 bg-accent rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={ad.thumbnail}
                          alt={ad.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {ad.duration}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{ad.title}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {ad.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {ad.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {ad.ctr} CTR
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Offers */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Featured Offers</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {featuredOffers.map((offer) => (
                <Card key={offer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{offer.name}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {offer.category}
                          </Badge>
                          <span>{offer.network}</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {offer.conversion}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{offer.payout}</div>
                        <div className="text-xs text-muted-foreground">Payout</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Platform Stats</CardTitle>
            <CardDescription>Latest insights from our database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24,567</div>
                <div className="text-sm text-muted-foreground">Total Ads Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1,234</div>
                <div className="text-sm text-muted-foreground">Active Offers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1.2B</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-foreground">89</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}