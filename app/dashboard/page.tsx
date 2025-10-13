"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, DollarSign, Eye, Heart, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function DashboardPage() {
  // Mock data for charts
  const trendingAdsData = [
    { month: "Jan", ads: 1200 },
    { month: "Feb", ads: 1800 },
    { month: "Mar", ads: 2400 },
    { month: "Apr", ads: 2100 },
    { month: "May", ads: 2800 },
    { month: "Jun", ads: 3200 },
  ]

  const categoryData = [
    { category: "Health", count: 3400 },
    { category: "Finance", count: 2800 },
    { category: "E-commerce", count: 2200 },
    { category: "Software", count: 1900 },
    { category: "Education", count: 1500 },
  ]

  const topCountries = [
    { country: "United States", ads: 12500, change: "+12%" },
    { country: "United Kingdom", ads: 8200, change: "+8%" },
    { country: "Canada", ads: 6800, change: "+15%" },
    { country: "Australia", ads: 5400, change: "+5%" },
    { country: "Germany", ads: 4200, change: "-3%" },
  ]

  const topPerformingAds = [
    {
      title: "Revolutionary Weight Loss Method",
      views: "5.2M",
      ctr: "12.5%",
      category: "Health",
    },
    {
      title: "Make Money Online in 2025",
      views: "4.8M",
      ctr: "11.2%",
      category: "Finance",
    },
    {
      title: "Best Credit Card Rewards",
      views: "3.9M",
      ctr: "10.8%",
      category: "Finance",
    },
  ]

  const topOffers = [
    {
      name: "ClickFunnels Pro",
      payout: "$120",
      videos: 1250,
      trend: "up",
    },
    {
      name: "Chase Sapphire",
      payout: "$250",
      videos: 890,
      trend: "up",
    },
    {
      name: "Shopify Plus",
      payout: "$150",
      videos: 3400,
      trend: "down",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Analytics and insights for marketing and affiliate campaigns</p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Ads Tracked</p>
                  <p className="text-2xl font-bold text-foreground">24,567</p>
                  <p className="mt-1 flex items-center text-xs text-secondary">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Video className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Offers</p>
                  <p className="text-2xl font-bold text-foreground">1,234</p>
                  <p className="mt-1 flex items-center text-xs text-secondary">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +8.2% from last month
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-foreground">1.2B</p>
                  <p className="mt-1 flex items-center text-xs text-secondary">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +15.3% from last month
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <Eye className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Favorites</p>
                  <p className="text-2xl font-bold text-foreground">47</p>
                  <p className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Heart className="mr-1 h-3 w-3" />
                    Saved items
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="marketing" className="space-y-6">
          <TabsList>
            <TabsTrigger value="marketing">Marketing Analytics</TabsTrigger>
            <TabsTrigger value="affiliate">Affiliate Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="marketing" className="space-y-6">
            {/* Trending Ads Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Ads Over Time</CardTitle>
                <CardDescription>Number of new ads discovered per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    ads: {
                      label: "Ads",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendingAdsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="ads"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                  <CardDescription>Most active advertising categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Ads",
                        color: "hsl(var(--secondary))",
                      },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" className="text-xs" />
                        <YAxis dataKey="category" type="category" className="text-xs" width={80} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Top Countries */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>Markets with most ad activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCountries.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                            <Globe className="h-4 w-4 text-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.country}</p>
                            <p className="text-sm text-muted-foreground">{item.ads.toLocaleString()} ads</p>
                          </div>
                        </div>
                        <Badge
                          variant={item.change.startsWith("+") ? "secondary" : "outline"}
                          className={item.change.startsWith("+") ? "" : "text-destructive"}
                        >
                          {item.change.startsWith("+") ? (
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="mr-1 h-3 w-3" />
                          )}
                          {item.change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Ads */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Performing Ads</CardTitle>
                    <CardDescription>Highest CTR ads this month</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingAds.map((ad, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{ad.title}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {ad.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{ad.views} views</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{ad.ctr}</p>
                        <p className="text-xs text-muted-foreground">CTR</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliate" className="space-y-6">
            {/* Top Offers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Performing Offers</CardTitle>
                    <CardDescription>Most promoted affiliate offers</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topOffers.map((offer, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                          <DollarSign className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{offer.name}</p>
                          <p className="text-sm text-muted-foreground">{offer.videos} videos promoting</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">{offer.payout}</p>
                          <p className="text-xs text-muted-foreground">Payout</p>
                        </div>
                        {offer.trend === "up" ? (
                          <ArrowUpRight className="h-5 w-5 text-secondary" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Network Distribution */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Network Distribution</CardTitle>
                  <CardDescription>Offers by affiliate network</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { network: "ClickBank", count: 450, percentage: 35 },
                      { network: "CJ Affiliate", count: 380, percentage: 30 },
                      { network: "MaxBounty", count: 320, percentage: 25 },
                      { network: "Impact", count: 130, percentage: 10 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{item.network}</span>
                          <span className="text-muted-foreground">
                            {item.count} offers ({item.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
                          <div className="h-full bg-secondary" style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vertical Performance</CardTitle>
                  <CardDescription>Top performing verticals by EPC</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { vertical: "Finance", epc: "$3.20", color: "bg-chart-1" },
                      { vertical: "Software/SaaS", epc: "$2.90", color: "bg-chart-2" },
                      { vertical: "E-commerce", epc: "$2.45", color: "bg-chart-3" },
                      { vertical: "Health", epc: "$1.85", color: "bg-chart-4" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${item.color}`} />
                          <span className="font-medium text-foreground">{item.vertical}</span>
                        </div>
                        <span className="text-lg font-bold text-secondary">{item.epc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
