"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Video, TrendingUp, Play, ExternalLink, Star, Eye, Clock } from "lucide-react"
import Image from "next/image"

export default function QuickSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"marketing" | "affiliate">("marketing")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery, "Type:", searchType)
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
              <Button type="submit" disabled={!searchQuery.trim()} className="mobile:w-full tablet:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Search
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

        {/* Promotional Banners */}
        <div className="mb-8 grid gap-6 mobile:grid-cols-1 tablet:grid-cols-2">
          {banners.map((banner, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative mobile:h-40 tablet:h-48">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <div className="p-4 tablet:p-6 text-white">
                    <h3 className="mobile:text-lg tablet:text-xl font-bold mb-2">{banner.title}</h3>
                    <p className="text-white/90 mb-4 mobile:text-sm tablet:text-base">{banner.description}</p>
                    <Button variant="secondary" size="sm" className="mobile:text-xs tablet:text-sm">
                      {banner.cta}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

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