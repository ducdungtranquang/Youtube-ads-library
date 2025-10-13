"use client"
import { Header } from "@/components/header"
import { VideoCard } from "@/components/video-card"
import { OfferCard } from "@/components/offer-card"
import { AffiliateCard } from "@/components/affiliate-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Download, Trash2, Video, DollarSign, Users } from "lucide-react"

export default function FavoritesPage() {
  // Mock data for demonstration
  const mockFavoriteAds = [
    {
      title: "How to Boost Your Sales with This Simple Marketing Trick",
      channel: "Marketing Pro",
      views: "1.2M",
      ctr: "8.5%",
      date: "2 weeks ago",
      thumbnail: "/marketing-video-thumbnail.png",
      url: "https://youtube.com",
    },
    {
      title: "The Ultimate Guide to Facebook Ads in 2025",
      channel: "Digital Marketing Hub",
      views: "850K",
      ctr: "7.2%",
      date: "1 month ago",
      thumbnail: "/facebook-ads-tutorial.jpg",
      url: "https://youtube.com",
    },
  ]

  const mockFavoriteOffers = [
    {
      name: "ClickFunnels - Sales Funnel Builder",
      network: "ClickBank",
      vertical: "Software/SaaS",
      payout: "$120",
      epc: "$2.45",
      countries: ["US", "CA", "UK"],
      totalVideos: 1250,
    },
    {
      name: "Chase Sapphire Preferred Card",
      network: "CJ Affiliate",
      vertical: "Finance",
      payout: "$250",
      epc: "$3.20",
      countries: ["US"],
      totalVideos: 890,
    },
    {
      name: "Shopify - E-commerce Platform",
      network: "Impact",
      vertical: "E-commerce",
      payout: "$150",
      epc: "$2.90",
      countries: ["Global"],
      totalVideos: 3400,
    },
  ]

  const mockFavoriteAffiliates = [
    {
      name: "John Marketing",
      channelUrl: "https://youtube.com/@johnmarketing",
      totalVideos: 156,
      totalViews: "12M",
      successRate: "78%",
      topOffers: ["ClickFunnels", "GetResponse", "Shopify"],
      avatar: "/affiliate-avatar-1.png",
    },
    {
      name: "Sarah Finance",
      channelUrl: "https://youtube.com/@sarahfinance",
      totalVideos: 203,
      totalViews: "18M",
      successRate: "82%",
      topOffers: ["Credit Cards", "Robinhood", "Acorns"],
      avatar: "/affiliate-avatar-2.png",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">My Favorites</h1>
            <p className="text-muted-foreground">Track and manage your saved ads, offers, and affiliates</p>
          </div>
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Favorite Ads</p>
                <p className="text-2xl font-bold text-foreground">{mockFavoriteAds.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <DollarSign className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Favorite Offers</p>
                <p className="text-2xl font-bold text-foreground">{mockFavoriteOffers.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <Users className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Favorite Affiliates</p>
                <p className="text-2xl font-bold text-foreground">{mockFavoriteAffiliates.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ads" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="ads">
              <Video className="mr-2 h-4 w-4" />
              Favorite Ads
            </TabsTrigger>
            <TabsTrigger value="offers">
              <DollarSign className="mr-2 h-4 w-4" />
              Favorite Offers
            </TabsTrigger>
            <TabsTrigger value="affiliates">
              <Users className="mr-2 h-4 w-4" />
              Favorite Affiliates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ads" className="space-y-4">
            {mockFavoriteAds.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {mockFavoriteAds.length} saved {mockFavoriteAds.length === 1 ? "ad" : "ads"}
                  </p>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mockFavoriteAds.map((video, index) => (
                    <VideoCard key={index} {...video} />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">No favorite ads yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Start saving ads from the Marketing Search to track them here
                  </p>
                  <Button asChild>
                    <a href="/mkt">Browse Ads</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            {mockFavoriteOffers.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {mockFavoriteOffers.length} saved {mockFavoriteOffers.length === 1 ? "offer" : "offers"}
                  </p>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mockFavoriteOffers.map((offer, index) => (
                    <OfferCard key={index} {...offer} />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <DollarSign className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">No favorite offers yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Start saving offers from the Affiliate Search to track them here
                  </p>
                  <Button variant="secondary" asChild>
                    <a href="/aff">Browse Offers</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-4">
            {mockFavoriteAffiliates.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {mockFavoriteAffiliates.length} saved{" "}
                    {mockFavoriteAffiliates.length === 1 ? "affiliate" : "affiliates"}
                  </p>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mockFavoriteAffiliates.map((affiliate, index) => (
                    <AffiliateCard key={index} {...affiliate} />
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">No favorite affiliates yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Start following affiliates from the Affiliate Search to track them here
                  </p>
                  <Button variant="secondary" asChild>
                    <a href="/aff">Browse Affiliates</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
