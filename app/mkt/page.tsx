"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SearchFilters } from "@/components/search-filters"
import { VideoCard } from "@/components/video-card"
import { BrandCard } from "@/components/brand-card"
import { CompanyCard } from "@/components/company-card"
import { VideoDetailModal } from "@/components/video-detail-modal"
import { BrandDetailModal } from "@/components/brand-detail-modal"
import { CompanyDetailModal } from "@/components/company-detail-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import type { DateRange } from "react-day-picker"

export default function MKTPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [selectedBrand, setSelectedBrand] = useState<any>(null)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  // Mock data for demonstration
  const mockVideos = [
    {
      title: "How to Boost Your Sales with This Simple Marketing Trick",
      channel: "Marketing Pro",
      views: "1.2M",
      ctr: "8.5%",
      date: "2 weeks ago",
      thumbnail: "/marketing-video-thumbnail.png",
      url: "https://youtube.com",
      companyName: "Unilever",
      description:
        "Learn the proven marketing strategies that top brands use to increase their sales by 300%. This comprehensive guide covers everything from audience targeting to conversion optimization.",
      duration: "12:45",
    },
    {
      title: "The Ultimate Guide to Facebook Ads in 2025",
      channel: "Digital Marketing Hub",
      views: "850K",
      ctr: "7.2%",
      date: "1 month ago",
      thumbnail: "/facebook-ads-tutorial.jpg",
      url: "https://youtube.com",
      companyName: "Procter & Gamble",
      description:
        "Master Facebook advertising with this complete tutorial covering campaign setup, audience targeting, creative best practices, and ROI optimization.",
      duration: "18:30",
    },
    {
      title: "Instagram Marketing Strategy That Actually Works",
      channel: "Social Media Experts",
      views: "620K",
      ctr: "6.8%",
      date: "3 weeks ago",
      thumbnail: "/instagram-marketing-concept.png",
      url: "https://youtube.com",
      companyName: "L'Oréal",
      description:
        "Discover the Instagram marketing tactics that drive real results. From content creation to influencer partnerships and paid advertising strategies.",
      duration: "15:20",
    },
    {
      title: "Email Marketing Secrets from Top Brands",
      channel: "Growth Marketing",
      views: "450K",
      ctr: "5.9%",
      date: "1 week ago",
      thumbnail: "/email-marketing-concept.png",
      url: "https://youtube.com",
      companyName: "Unilever",
      description:
        "Unlock the email marketing strategies used by Fortune 500 companies to achieve open rates above 40% and conversion rates that exceed industry standards.",
      duration: "10:15",
    },
  ]

  const mockBrands = [
    {
      name: "Nike",
      description: "Global sports apparel and equipment brand",
      logo: "/nike-swoosh.png",
      totalAds: 342,
      totalViews: "45M",
      activeMonths: 24,
      topCategories: ["Sports", "Lifestyle", "Fashion"],
    },
    {
      name: "Apple",
      description: "Technology company known for innovative products",
      logo: "/apple-logo-minimalist.png",
      totalAds: 289,
      totalViews: "38M",
      activeMonths: 36,
      topCategories: ["Technology", "Innovation", "Lifestyle"],
    },
    {
      name: "Coca-Cola",
      description: "Leading beverage company worldwide",
      logo: "/coca-cola-logo.png",
      totalAds: 256,
      totalViews: "32M",
      activeMonths: 18,
      topCategories: ["Beverages", "Lifestyle", "Entertainment"],
    },
    {
      name: "Amazon",
      description: "E-commerce and cloud computing giant",
      logo: "/amazon-logo.png",
      totalAds: 412,
      totalViews: "52M",
      activeMonths: 30,
      topCategories: ["E-commerce", "Technology", "Services"],
    },
  ]

  const mockCompanies = [
    {
      name: "Unilever",
      description: "Multinational consumer goods company with diverse brand portfolio",
      totalBrands: 12,
      totalAds: 1850,
      markets: ["US", "UK", "EU", "APAC"],
      estimatedSpend: "$12.5M",
      topBrands: ["Dove", "Axe", "Lipton", "Ben & Jerry's"],
    },
    {
      name: "Procter & Gamble",
      description: "American multinational consumer goods corporation",
      totalBrands: 15,
      totalAds: 2100,
      markets: ["US", "CA", "EU", "LATAM"],
      estimatedSpend: "$15.8M",
      topBrands: ["Tide", "Gillette", "Pampers", "Oral-B"],
    },
    {
      name: "L'Oréal",
      description: "World's largest cosmetics and beauty company",
      totalBrands: 8,
      totalAds: 1420,
      markets: ["US", "EU", "APAC"],
      estimatedSpend: "$9.2M",
      topBrands: ["Maybelline", "Garnier", "Lancôme"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Marketing Search</h1>
          <p className="text-muted-foreground">Research competitor ads, analyze brands, and track company campaigns</p>
        </div>

        <div className="mb-6 flex gap-2 mobile:flex-col">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by keyword, URL, or landing page domain..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="mobile:w-full">Search</Button>
        </div>

        <div className="grid gap-6 tablet:grid-cols-[280px_1fr] mobile:grid-cols-1">
          <aside className="space-y-4 mobile:order-2">
            <SearchFilters dateRange={dateRange} onDateRangeChange={setDateRange} />
          </aside>

          <div className="mobile:order-1">
            <Tabs defaultValue="ads" className="w-full">
              <TabsList className="mb-6 w-full justify-start mobile:grid mobile:grid-cols-3">
                <TabsTrigger value="ads" className="mobile:text-xs">Ads Search</TabsTrigger>
                <TabsTrigger value="brands" className="mobile:text-xs">Brands</TabsTrigger>
                <TabsTrigger value="companies" className="mobile:text-xs">Companies</TabsTrigger>
              </TabsList>

              <TabsContent value="ads" className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Found 1,234 ads</p>
                </div>
                <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1 md:grid-cols-2">
                  {mockVideos.map((video, index) => (
                    <VideoCard
                      key={index}
                      {...video}
                      onClick={() => setSelectedVideo(video)}
                      onCompanyClick={() => {
                        const company = mockCompanies.find((c) => c.name === video.companyName)
                        if (company) setSelectedCompany(company)
                      }}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="brands" className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Found 456 brands</p>
                </div>
                <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1 md:grid-cols-2">
                  {mockBrands.map((brand, index) => (
                    <BrandCard key={index} {...brand} onClick={() => setSelectedBrand(brand)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="companies" className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Found 89 companies</p>
                </div>
                <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1 md:grid-cols-2">
                  {mockCompanies.map((company, index) => (
                    <CompanyCard key={index} {...company} onClick={() => setSelectedCompany(company)} />
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
        onCompanyClick={() => {
          if (selectedVideo?.companyName) {
            const company = mockCompanies.find((c) => c.name === selectedVideo.companyName)
            if (company) {
              setSelectedVideo(null)
              setSelectedCompany(company)
            }
          }
        }}
      />

      <BrandDetailModal
        open={!!selectedBrand}
        onOpenChange={(open) => !open && setSelectedBrand(null)}
        brand={selectedBrand || {}}
      />

      <CompanyDetailModal
        open={!!selectedCompany}
        onOpenChange={(open) => !open && setSelectedCompany(null)}
        company={selectedCompany || {}}
      />
    </div>
  )
}
