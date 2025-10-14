"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/header";
import { SearchFilters } from "@/components/search-filters";
import { VideoCard } from "@/components/video-card";
import { BrandCard } from "@/components/brand-card";
import { CompanyCard } from "@/components/company-card";
import { VideoDetailModal } from "@/components/video-detail-modal";
import { BrandDetailModal } from "@/components/brand-detail-modal";
import { CompanyDetailModal } from "@/components/company-detail-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, Globe, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useVidTaoSearch } from "@/hooks/use-vidtao-search";
import type { DateRange } from "react-day-picker";
// Import countries data
import countriesList from "@/data/countries.json";

export default function MKTPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Advanced filters
  const [selectedCountry, setSelectedCountry] = useState("0");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showVideos, setShowVideos] = useState("unlisted");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const { searchAds, loading, error } = useVidTaoSearch();

  // Categories data
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "1", name: "Health & Fitness" },
    { id: "2", name: "Finance & Investment" },
    { id: "3", name: "Beauty & Skincare" },
    { id: "4", name: "Technology & Software" },
    { id: "5", name: "Food & Nutrition" },
    { id: "6", name: "Education & Learning" },
    { id: "7", name: "Entertainment" },
    { id: "8", name: "Fashion & Lifestyle" },
    { id: "9", name: "Home & Garden" },
    { id: "10", name: "Travel & Tourism" },
  ];

  // Languages data from countries
  const languages = [
    { code: "all", name: "All Languages" },
    ...countriesList.map(country => ({
      code: country.alpha2Code.toLowerCase(),
      name: `${country.name} (${country.alpha2Code})`
    }))
  ];

  // Handle search with proper VidTao payload
  const handleSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      if (!searchQuery.trim()) {
        toast.error("Please enter a search keyword");
        return;
      }

      setIsSearching(true);
      if (page === 1) {
        setSearchResults(null);
        setCurrentPage(1);
      }

      try {
        const payload = {
          affiliateCountryId: 0,
          affiliateNetworkIds: [],
          categoryIds:
            selectedCategory && selectedCategory !== "all"
              ? [parseInt(selectedCategory)]
              : [],
          countryId: parseInt(selectedCountry),
          dateFrom: dateFrom || "",
          dateTo: dateTo || "",
          isAffiliate: false,
          language:
            selectedLanguage && selectedLanguage !== "all"
              ? selectedLanguage
              : "",
          limit: 20,
          offerIds: [],
          orderAsc: false,
          page: page,
          searchTerm: searchQuery.trim(),
          showVideos: showVideos as "unlisted" | "all" | "public",
          softwareIds: [],
          sortProp: sortBy,
        };

        console.log("MKT Search payload:", payload);

        const result = await searchAds({
          query: searchQuery.trim(),
          page: page,
          limit: 20,
          filters: {
            countryId: parseInt(selectedCountry),
            language:
              selectedLanguage && selectedLanguage !== "all"
                ? selectedLanguage
                : "",
            dateFrom: dateFrom,
            dateTo: dateTo,
            category:
              selectedCategory && selectedCategory !== "all"
                ? selectedCategory
                : "",
            sortBy: sortBy,
            isAffiliate: false,
          },
        });

        if (result) {
          if (page === 1) {
            setSearchResults(result);
          } else {
            setSearchResults((prev: any) => ({
              ...result,
              data: [...(prev?.data || []), ...(result.data || [])],
            }));
          }
          setCurrentPage(page);

          const resultCount = result.data?.length || 0;
          toast.success(`Found ${resultCount} results`);
        }
      } catch (error) {
        console.error("MKT Search error:", error);
        toast.error("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
      }
    },
    [
      searchQuery,
      selectedCountry,
      selectedLanguage,
      dateFrom,
      dateTo,
      selectedCategory,
      showVideos,
      sortBy,
      searchAds,
    ]
  );

  const loadMore = useCallback(() => {
    if (!isSearching && searchResults?.pagination?.hasNextPage) {
      handleSearch(null, currentPage + 1);
    }
  }, [isSearching, searchResults, currentPage, handleSearch]);

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
  ];

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
  ];

  const mockCompanies = [
    {
      name: "Unilever",
      description:
        "Multinational consumer goods company with diverse brand portfolio",
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
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Marketing Search
          </h1>
          <p className="text-muted-foreground">
            Research competitor ads, analyze brands, and track company campaigns
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-6 flex gap-2 mobile:flex-col"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by keyword, URL or brand name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={isSearching}
            className="mobile:w-full"
          >
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

        <div className="grid gap-6 tablet:grid-cols-[320px_1fr] mobile:grid-cols-1">
          <aside className="space-y-6 mobile:order-2">
            {/* Advanced Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Country Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Country
                  </label>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Countries</SelectItem>
                      {countriesList.map((country) => (
                        <SelectItem
                          key={country.countryId}
                          value={country.countryId.toString()}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="From date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                    <Input
                      type="date"
                      placeholder="To date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Show Videos Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Type</label>
                  <Select value={showVideos} onValueChange={setShowVideos}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date Created</SelectItem>
                      <SelectItem value="totalSpend">Ad Spend</SelectItem>
                      <SelectItem value="views">Views</SelectItem>
                      <SelectItem value="relevance">Relevance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="mobile:order-1">
            {/* Search Results */}
            {searchResults ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    Search Results
                    {searchQuery && (
                      <span className="ml-2 text-lg font-normal text-muted-foreground">
                        for "{searchQuery}"
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Found {searchResults.data?.length || 0} ads
                  </p>
                </div>

                {searchResults.data && searchResults.data.length > 0 ? (
                  <>
                    <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
                      {searchResults.data.map((video: any, index: number) => (
                        <VideoCard
                          key={video.ytVideoId || index}
                          {...video}
                          onClick={() => setSelectedVideo(video)}
                          onCompanyClick={() => {
                            const company = mockCompanies.find(
                              (c) => c.name === video.companyName
                            );
                            if (company) setSelectedCompany(company);
                          }}
                        />
                      ))}
                    </div>

                    {/* Load More Button */}
                    {searchResults.pagination?.hasNextPage && (
                      <div className="text-center">
                        <Button
                          onClick={loadMore}
                          disabled={isSearching}
                          variant="outline"
                          size="lg"
                        >
                          {isSearching ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Load More"
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-lg text-muted-foreground">
                      No results found
                    </p>
                  </Card>
                )}
              </div>
            ) : (
              // Default tabs when no search
              <Tabs defaultValue="ads" className="w-full">
                <TabsList className="mb-6 w-full justify-start mobile:grid mobile:grid-cols-3">
                  <TabsTrigger value="ads" className="mobile:text-xs">
                    Ads Search
                  </TabsTrigger>
                  <TabsTrigger value="brands" className="mobile:text-xs">
                    Brands
                  </TabsTrigger>
                  <TabsTrigger value="companies" className="mobile:text-xs">
                    Companies
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ads" className="space-y-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Enter keyword to search for ads
                    </p>
                  </div>
                  <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1 md:grid-cols-2">
                    {mockVideos.map((video, index) => (
                      <VideoCard
                        key={index}
                        {...video}
                        onClick={() => setSelectedVideo(video)}
                        onCompanyClick={() => {
                          const company = mockCompanies.find(
                            (c) => c.name === video.companyName
                          );
                          if (company) setSelectedCompany(company);
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="brands" className="space-y-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Found 456 brands
                    </p>
                  </div>
                  <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1 md:grid-cols-2">
                    {mockBrands.map((brand, index) => (
                      <BrandCard
                        key={index}
                        {...brand}
                        onClick={() => setSelectedBrand(brand)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="companies" className="space-y-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Found 89 companies
                    </p>
                  </div>
                  <div className="grid gap-4 tablet:grid-cols-3 mobile:grid-cols-1 md:grid-cols-2">
                    {mockCompanies.map((company, index) => (
                      <CompanyCard
                        key={index}
                        {...company}
                        onClick={() => setSelectedCompany(company)}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Loading State */}
            {isSearching && !searchResults && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-muted-foreground">
                  Searching for ads...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="p-8 text-center border-destructive">
                <h3 className="text-lg font-semibold mb-2 text-destructive">
                  Search Error
                </h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => handleSearch(null)} variant="outline">
                  Try Again
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      <VideoDetailModal
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
        video={selectedVideo || {}}
        onCompanyClick={() => {
          if (selectedVideo?.companyName) {
            const company = mockCompanies.find(
              (c) => c.name === selectedVideo.companyName
            );
            if (company) {
              setSelectedVideo(null);
              setSelectedCompany(company);
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
  );
}
