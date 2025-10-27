"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AffSearchFilters } from "@/components/aff-search-filters"
import { AffiliateVideoCard } from "@/components/affiliate-video-card"
import { AffiliateCard } from "@/components/affiliate-card"
import { OfferCard } from "@/components/offer-card"
import { VideoDetailModal } from "@/components/video-detail-modal"
import { AffiliateDetailModal } from "@/components/affiliate-detail-modal"
import { OfferDetailModal } from "@/components/offer-detail-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

export default function AFFPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null)
  const [selectedOffer, setSelectedOffer] = useState<any>(null)

  // Mock data for demonstration
  const mockAffiliateVideos = [
    {
      title: "How I Made $10,000 in One Month with This Simple Method",
      channel: "Affiliate Success",
      views: "2.5M",
      date: "1 week ago",
      thumbnail: "/affiliate-success-thumbnail.jpg",
      offerName: "Wealthy Affiliate",
      network: "ClickBank",
      landingPage: "wealthyaffiliate.com",
      url: "https://youtube.com",
      description:
        "In this video, I break down exactly how I earned $10,000 in affiliate commissions using proven strategies and the right offers.",
      duration: "16:42",
    },
    {
      title: "Best Credit Card for Cash Back - Full Review",
      channel: "Finance Guru",
      views: "1.8M",
      date: "2 weeks ago",
      thumbnail: "/credit-card-review.png",
      offerName: "Chase Sapphire Preferred",
      network: "CJ Affiliate",
      landingPage: "chase.com/sapphire",
      url: "https://youtube.com",
      description:
        "Comprehensive review of the Chase Sapphire Preferred card, covering rewards, benefits, and whether it's worth the annual fee.",
      duration: "14:20",
    },
    {
      title: "Weight Loss Supplement That Actually Works",
      channel: "Health & Fitness Pro",
      views: "950K",
      date: "3 days ago",
      thumbnail: "/weight-loss-supplement.jpg",
      offerName: "Keto Advanced",
      network: "MaxBounty",
      landingPage: "ketoadvanced.com",
      url: "https://youtube.com",
      description:
        "My honest review of Keto Advanced weight loss supplement after using it for 60 days. Real results and side effects discussed.",
      duration: "11:35",
    },
    {
      title: "Learn to Code in 30 Days - My Honest Experience",
      channel: "Tech Career",
      views: "720K",
      date: "1 month ago",
      thumbnail: "/coding-bootcamp.png",
      offerName: "Codecademy Pro",
      network: "Impact",
      landingPage: "codecademy.com",
      url: "https://youtube.com",
      description:
        "I tried Codecademy Pro for 30 days to see if you can really learn to code. Here's what happened and whether it's worth it.",
      duration: "13:50",
    },
  ]

  const mockAffiliates = [
    {
      name: "John Marketing",
      channelUrl: "https://youtube.com/@johnmarketing",
      totalVideos: 156,
      totalViews: "12M",
      successRate: "78%",
      topOffers: ["ClickFunnels", "GetResponse", "Shopify"],
      avatar: "/affiliate-avatar-1.png",
      topNiche: "Marketing & Business",
    },
    {
      name: "Sarah Finance",
      channelUrl: "https://youtube.com/@sarahfinance",
      totalVideos: 203,
      totalViews: "18M",
      successRate: "82%",
      topOffers: ["Credit Cards", "Robinhood", "Acorns"],
      avatar: "/affiliate-avatar-2.png",
      topNiche: "Personal Finance",
    },
    {
      name: "Mike Health",
      channelUrl: "https://youtube.com/@mikehealth",
      totalVideos: 128,
      totalViews: "9M",
      successRate: "71%",
      topOffers: ["Keto Diet", "Supplements", "Fitness Apps"],
      avatar: "/affiliate-avatar-3.png",
      topNiche: "Health & Wellness",
    },
    {
      name: "Tech Reviewer Pro",
      channelUrl: "https://youtube.com/@techreviewerpro",
      totalVideos: 342,
      totalViews: "25M",
      successRate: "85%",
      topOffers: ["Amazon", "Best Buy", "Newegg"],
      avatar: "/affiliate-avatar-4.png",
      topNiche: "Technology",
    },
  ]

  const mockOffers = [
    {
      name: "ClickFunnels - Sales Funnel Builder",
      network: "ClickBank",
      vertical: "Software/SaaS",
      payout: "$120",
      epc: "$2.45",
      countries: ["US", "CA", "UK"],
      totalVideos: 1250,
      description:
        "ClickFunnels is the leading sales funnel builder that helps entrepreneurs and businesses create high-converting landing pages and sales funnels without any technical skills.",
    },
    {
      name: "Chase Sapphire Preferred Card",
      network: "CJ Affiliate",
      vertical: "Finance",
      payout: "$250",
      epc: "$3.20",
      countries: ["US"],
      totalVideos: 890,
      description:
        "Premium travel rewards credit card offering 2X points on travel and dining, with a generous sign-up bonus and comprehensive travel benefits.",
    },
    {
      name: "Keto Advanced Weight Loss",
      network: "MaxBounty",
      vertical: "Health & Fitness",
      payout: "$85",
      epc: "$1.85",
      countries: ["US", "CA", "AU"],
      totalVideos: 2100,
      description:
        "Advanced ketogenic weight loss supplement designed to help your body enter ketosis faster and burn fat more efficiently.",
    },
    {
      name: "Shopify - E-commerce Platform",
      network: "Impact",
      vertical: "E-commerce",
      payout: "$150",
      epc: "$2.90",
      countries: ["Global"],
      totalVideos: 3400,
      description:
        "Complete e-commerce platform that lets anyone start, grow, and manage a business online. Trusted by over 1 million businesses worldwide.",
    },
    {
      name: "Wealthy Affiliate Training",
      network: "ClickBank",
      vertical: "Education",
      payout: "$95",
      epc: "$1.65",
      countries: ["US", "UK", "AU"],
      totalVideos: 1680,
      description:
        "Comprehensive affiliate marketing training platform with step-by-step courses, tools, and community support for building successful online businesses.",
    },
    {
      name: "GetResponse Email Marketing",
      network: "ShareASale",
      vertical: "Software/SaaS",
      payout: "$100",
      epc: "$2.10",
      countries: ["Global"],
      totalVideos: 950,
      description:
        "All-in-one email marketing platform with automation, landing pages, and webinar hosting to help businesses grow their audience and increase sales.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* <main className="container px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Affiliate Search</h1>
          <p className="text-muted-foreground">
            Discover profitable offers, successful affiliates, and winning campaigns
          </p>
        </div>

        <div className="mb-6 flex gap-2 mobile:flex-col">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by offer name, network, or affiliate..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="secondary" className="mobile:w-full">Search</Button>
        </div>

        <div className="grid gap-6 tablet:grid-cols-[280px_1fr] mobile:grid-cols-1">
          <aside className="space-y-4 mobile:order-2">
            <AffSearchFilters />
          </aside>

          <div className="mobile:order-1">
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="mb-6 w-full justify-start mobile:grid mobile:grid-cols-3">
                <TabsTrigger value="videos" className="mobile:text-xs">Affiliate Videos</TabsTrigger>
                <TabsTrigger value="affiliates" className="mobile:text-xs">Affiliates</TabsTrigger>
                <TabsTrigger value="offers" className="mobile:text-xs">Offers</TabsTrigger>
              </TabsList>

              <TabsContent value="videos" className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Found 2,847 affiliate videos</p>
                </div>
                <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1 md:grid-cols-2">
                  {mockAffiliateVideos.map((video, index) => (
                    <AffiliateVideoCard key={index} {...video} onClick={() => setSelectedVideo(video)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="affiliates" className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Found 567 affiliates</p>
                </div>
                <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1 md:grid-cols-2">
                  {mockAffiliates.map((affiliate, index) => (
                    <AffiliateCard key={index} {...affiliate} onClick={() => setSelectedAffiliate(affiliate)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="offers" className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Found 1,234 offers</p>
                </div>
                <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1 md:grid-cols-2">
                  {mockOffers.map((offer, index) => (
                    <OfferCard key={index} {...offer} onClick={() => setSelectedOffer(offer)} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <VideoDetailModal
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
        video={selectedVideo || {}}
      />

      <AffiliateDetailModal
        open={!!selectedAffiliate}
        onOpenChange={(open) => !open && setSelectedAffiliate(null)}
        affiliate={selectedAffiliate || {}}
      />

      <OfferDetailModal
        open={!!selectedOffer}
        onOpenChange={(open) => !open && setSelectedOffer(null)}
        offer={selectedOffer || {}}
      /> */}
    </div>
  )
}
