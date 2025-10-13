import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { TrendingUp, Search, Heart, LayoutDashboard, Video, Target, DollarSign, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="container py-20 tablet:py-32 mobile:py-16">
          <div className="mx-auto text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Video className="h-4 w-4" />
              YouTube Ads Intelligence Platform
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground tablet:text-5xl desktop:text-6xl mobile:text-3xl text-balance">
              Discover Winning Video Ads & Affiliate Campaigns
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-pretty tablet:text-xl mobile:text-base">
              Analyze competitor ads, find profitable offers, and research successful campaigns. The ultimate tool for
              marketers and affiliate marketers.
            </p>
            <div className="flex flex-col gap-4 tablet:flex-row tablet:justify-center mobile:flex-col">
              <Link href="/mkt">
                <Button size="lg" className="w-full tablet:w-auto">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Start Marketing Search
                </Button>
              </Link>
              <Link href="/aff">
                <Button size="lg" variant="outline" className="w-full tablet:w-auto bg-transparent">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Affiliate Offers
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Two Powerful Modes</h2>
            <p className="text-lg text-muted-foreground">
              Built for marketers and affiliate marketers with specialized tools for each
            </p>
          </div>

          <div className="grid gap-8 tablet:grid-cols-2 mobile:grid-cols-1">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Marketing Mode</CardTitle>
                <CardDescription className="text-base">
                  Research competitor ads, analyze brands, and track company campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Ads Search</p>
                    <p className="text-sm text-muted-foreground">Find ads by keyword, URL, or landing page domain</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Video className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Brand Analysis</p>
                    <p className="text-sm text-muted-foreground">Track top performing ads from any brand or channel</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Company Insights</p>
                    <p className="text-sm text-muted-foreground">
                      Analyze advertising strategies across multiple brands
                    </p>
                  </div>
                </div>
                <Link href="/mkt" className="block pt-4">
                  <Button className="w-full">Explore Marketing Tools</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Affiliate Mode</CardTitle>
                <CardDescription className="text-base">
                  Discover profitable offers, successful affiliates, and winning campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Search className="mt-1 h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Affiliate Videos</p>
                    <p className="text-sm text-muted-foreground">
                      Find videos with affiliate links and analyze performance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-1 h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Top Affiliates</p>
                    <p className="text-sm text-muted-foreground">
                      Study successful affiliate marketers and their strategies
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-1 h-5 w-5 text-secondary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Offer Database</p>
                    <p className="text-sm text-muted-foreground">
                      Browse offers by network, vertical, and performance metrics
                    </p>
                  </div>
                </div>
                <Link href="/aff" className="block pt-4">
                  <Button className="w-full" variant="secondary">
                    Explore Affiliate Tools
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Features */}
        <section className="container py-20">
          <div className="grid gap-6 tablet:grid-cols-3 mobile:grid-cols-1">
            <Card>
              <CardHeader>
                <Heart className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Favorites & Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Save ads, offers, and affiliates to track performance over time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <LayoutDashboard className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">View trending ads, top countries, and performance insights</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Export & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Export data to CSV and generate detailed reports (Pro plan)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-20">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground text-balance">
                Ready to Find Your Next Winning Campaign?
              </h2>
              <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
                Join thousands of marketers and affiliates who use YouTube ADS Libraries to research, analyze, and
                discover profitable opportunities.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/pricing">
                  <Button size="lg">View Pricing Plans</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 YouTube ADS Libraries. Built for marketers and affiliate marketers.</p>
        </div>
      </footer>
    </div>
  )
}
