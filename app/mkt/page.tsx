"use client";

import { useState, useCallback, useRef, useMemo, memo } from "react";
import type { MKTSearchFilters } from "@/types/mkt-search";
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
import { useMKTSearch } from "@/hooks/use-mkt-search";
import type { DateRange } from "react-day-picker";
// Import countries data
import countriesList from "@/data/countries.json";

// Memoized Select components for better performance
const CountrySelect = memo(
  ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue placeholder="All Countries" />
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
  )
);
CountrySelect.displayName = "CountrySelect";

const LanguageSelect = memo(
  ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (value: string) => void;
  }) => {
    const languages = useMemo(
      () => [
        { code: "all", name: "All Languages" },
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "it", name: "Italian" },
        { code: "pt", name: "Portuguese" },
        { code: "ru", name: "Russian" },
        { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" },
        { code: "zh", name: "Chinese" },
        { code: "ar", name: "Arabic" },
        { code: "hi", name: "Hindi" },
        { code: "th", name: "Thai" },
        { code: "vi", name: "Vietnamese" },
        { code: "id", name: "Indonesian" },
      ],
      []
    );

    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Languages" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);
LanguageSelect.displayName = "LanguageSelect";

const CategorySelect = memo(
  ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (value: string) => void;
  }) => {
    const categories = useMemo(
      () => [
        { id: "all", name: "All Categories" },
        { id: "1", name: "Automotive" },
        { id: "2", name: "Beauty & Personal Care" },
        { id: "3", name: "Electronics" },
        { id: "4", name: "Fashion & Apparel" },
        { id: "5", name: "Food & Beverage" },
        { id: "6", name: "Health & Fitness" },
        { id: "7", name: "Home & Garden" },
        { id: "8", name: "Sports & Recreation" },
        { id: "9", name: "Technology" },
        { id: "10", name: "Travel & Tourism" },
      ],
      []
    );

    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);
CategorySelect.displayName = "CategorySelect";

const SortSelect = memo(
  ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date">Date</SelectItem>
        <SelectItem value="totalSpend">Total Spend</SelectItem>
        <SelectItem value="views">Views</SelectItem>
        <SelectItem value="relevance">Relevance</SelectItem>
      </SelectContent>
    </Select>
  )
);
SortSelect.displayName = "SortSelect";

const ShowVideosSelect = memo(
  ({
    value,
    onValueChange,
  }: {
    value: string;
    onValueChange: (value: string) => void;
  }) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Show videos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unlisted">Unlisted Only</SelectItem>
        <SelectItem value="all">All Videos</SelectItem>
        <SelectItem value="public">Public Only</SelectItem>
      </SelectContent>
    </Select>
  )
);
ShowVideosSelect.displayName = "ShowVideosSelect";

export default function MKTPage() {
  // Use refs for form values to avoid unnecessary re-renders
  const searchQueryRef = useRef<HTMLInputElement>(null);
  const selectedCountryRef = useRef("0");
  const selectedLanguageRef = useRef("all");
  const dateFromRef = useRef("");
  const dateToRef = useRef("");
  const showVideosRef = useRef("unlisted");
  const selectedCategoryRef = useRef("all");
  const sortByRef = useRef<"date" | "totalSpend" | "views" | "relevance">(
    "date"
  );

  // Tab management state
  const [activeTab, setActiveTab] = useState<"ads" | "brands" | "companies">("ads");
  
  // Search results for each tab
  const [adsSearchResults, setAdsSearchResults] = useState<any>(null);
  const [brandsSearchResults, setBrandsSearchResults] = useState<any>(null);
  const [companiesSearchResults, setCompaniesSearchResults] = useState<any>(null);
  
  // Current page for each tab
  const [adsCurrentPage, setAdsCurrentPage] = useState(1);
  const [brandsCurrentPage, setBrandsCurrentPage] = useState(1);
  const [companiesCurrentPage, setCompaniesCurrentPage] = useState(1);
  
  // Modal states
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const { searchMKTAds, loading, error } = useMKTSearch();

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

  // Mock data for brands and companies
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

  // Tab change handler
  const handleTabChange = useCallback((value: string) => {
    const newTab = value as "ads" | "brands" | "companies";
    setActiveTab(newTab);
    // Reset search results when switching tabs
    if (newTab === "ads") {
      setAdsSearchResults(null);
      setAdsCurrentPage(1);
    } else if (newTab === "brands") {
      setBrandsSearchResults(null);
      setBrandsCurrentPage(1);
    } else if (newTab === "companies") {
      setCompaniesSearchResults(null);
      setCompaniesCurrentPage(1);
    }
  }, []);

  // Ads search function
  const handleAdsSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      const searchQuery = searchQueryRef.current?.value?.trim();
      if (!searchQuery) {
        toast.error("Please enter a search keyword");
        return;
      }

      if (page === 1) {
        setAdsSearchResults(null);
        setAdsCurrentPage(1);
      }

      try {
        const result = await searchMKTAds({
          searchTerm: searchQuery,
          page: page,
          limit: 20,
          filters: {
            countryId: parseInt(selectedCountryRef.current),
            language:
              selectedLanguageRef.current &&
              selectedLanguageRef.current !== "all"
                ? selectedLanguageRef.current
                : "",
            categoryIds:
              selectedCategoryRef.current &&
              selectedCategoryRef.current !== "all"
                ? [parseInt(selectedCategoryRef.current)]
                : [],
            dateFrom: dateFromRef.current || "",
            dateTo: dateToRef.current || "",
            showVideos: showVideosRef.current as "unlisted" | "all" | "public",
            sortProp: sortByRef.current,
            orderAsc: false,
          },
        });

        if (result && result.success) {
          if (page === 1) {
            setAdsSearchResults(result);
          } else {
            setAdsSearchResults((prev: any) => ({
              ...result,
              data: {
                ...result.data,
                results: [
                  ...(prev?.data?.results || []),
                  ...(result.data?.results || []),
                ],
              },
            }));
          }
          setAdsCurrentPage(page);

          const resultCount = result.data?.results?.length || 0;
          toast.success(
            `Found ${resultCount} ads from ${result.total_available} available`
          );
        } else {
          toast.error("No results found");
        }
      } catch (error) {
        console.error("Ads Search error:", error);
        toast.error("Search failed. Please try again.");
      }
    },
    [searchMKTAds]
  );

  // Brands search function (placeholder - implement with actual API)
  const handleBrandsSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      const searchQuery = searchQueryRef.current?.value?.trim();
      if (!searchQuery) {
        toast.error("Please enter a search keyword");
        return;
      }

      if (page === 1) {
        setBrandsSearchResults(null);
        setBrandsCurrentPage(1);
      }

      try {
        // TODO: Replace with actual brands search API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock brands search results
        const mockResults = mockBrands.filter(brand => 
          brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brand.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const result = {
          success: true,
          data: { results: mockResults },
          total_available: mockResults.length
        };

        if (result.success) {
          setBrandsSearchResults(result);
          setBrandsCurrentPage(1);
          toast.success(`Found ${mockResults.length} brands`);
        } else {
          toast.error("No brands found");
        }
      } catch (error) {
        console.error("Brands Search error:", error);
        toast.error("Brands search failed. Please try again.");
      }
    },
    [mockBrands]
  );

  // Companies search function (placeholder - implement with actual API)
  const handleCompaniesSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      const searchQuery = searchQueryRef.current?.value?.trim();
      if (!searchQuery) {
        toast.error("Please enter a search keyword");
        return;
      }

      if (page === 1) {
        setCompaniesSearchResults(null);
        setCompaniesCurrentPage(1);
      }

      try {
        // TODO: Replace with actual companies search API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock companies search results
        const mockResults = mockCompanies.filter(company => 
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const result = {
          success: true,
          data: { results: mockResults },
          total_available: mockResults.length
        };

        if (result.success) {
          setCompaniesSearchResults(result);
          setCompaniesCurrentPage(1);
          toast.success(`Found ${mockResults.length} companies`);
        } else {
          toast.error("No companies found");
        }
      } catch (error) {
        console.error("Companies Search error:", error);
        toast.error("Companies search failed. Please try again.");
      }
    },
    [mockCompanies]
  );

  // Generic search handler that delegates to the appropriate search function
  const handleSearch = useCallback((e: React.FormEvent | null, page: number = 1) => {
    if (activeTab === "ads") {
      return handleAdsSearch(e, page);
    } else if (activeTab === "brands") {
      return handleBrandsSearch(e, page);
    } else if (activeTab === "companies") {
      return handleCompaniesSearch(e, page);
    }
  }, [activeTab, handleAdsSearch, handleBrandsSearch, handleCompaniesSearch]);

  // Load more handler for each tab
  const loadMore = useCallback(() => {
    if (loading) return;
    
    if (activeTab === "ads" && adsSearchResults?.data?.pagination?.hasNextPage) {
      handleAdsSearch(null, adsCurrentPage + 1);
    } else if (activeTab === "brands" && brandsSearchResults?.data?.pagination?.hasNextPage) {
      handleBrandsSearch(null, brandsCurrentPage + 1);
    } else if (activeTab === "companies" && companiesSearchResults?.data?.pagination?.hasNextPage) {
      handleCompaniesSearch(null, companiesCurrentPage + 1);
    }
  }, [loading, activeTab, adsSearchResults, brandsSearchResults, companiesSearchResults, adsCurrentPage, brandsCurrentPage, companiesCurrentPage, handleAdsSearch, handleBrandsSearch, handleCompaniesSearch]);

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
              ref={searchQueryRef}
              placeholder="Search by keyword, URL or brand name..."
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading} className="mobile:w-full">
            {loading ? (
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
                  <CountrySelect
                    value={selectedCountryRef.current}
                    onValueChange={(value) =>
                      (selectedCountryRef.current = value)
                    }
                  />
                </div>

                {/* Language Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <LanguageSelect
                    value={selectedLanguageRef.current}
                    onValueChange={(value) =>
                      (selectedLanguageRef.current = value)
                    }
                  />
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <CategorySelect
                    value={selectedCategoryRef.current}
                    onValueChange={(value) =>
                      (selectedCategoryRef.current = value)
                    }
                  />
                  <Select>
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
                      onChange={(e) => (dateFromRef.current = e.target.value)}
                    />
                    <Input
                      type="date"
                      placeholder="To date"
                      onChange={(e) => (dateToRef.current = e.target.value)}
                    />
                  </div>
                </div>

                {/* Show Videos Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Type</label>
                  <ShowVideosSelect
                    value={showVideosRef.current}
                    onValueChange={(value) => (showVideosRef.current = value)}
                  />
                </div>

                {/* Sort Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <SortSelect
                    value={sortByRef.current}
                    onValueChange={(value) =>
                      (sortByRef.current = value as
                        | "date"
                        | "totalSpend"
                        | "views"
                        | "relevance")
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="mobile:order-1">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                {/* Ads Search Results */}
                {adsSearchResults ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Ads Search Results</h2>
                      <p className="text-sm text-muted-foreground">
                        Found {adsSearchResults.data?.results?.length || 0} ads (
                        {adsSearchResults.total_available || 0} total available)
                      </p>
                    </div>

                    {adsSearchResults.data?.results &&
                    adsSearchResults.data.results.length > 0 ? (
                      <>
                        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                          {adsSearchResults.data.results.map(
                            (video: any, index: number) => (
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
                            )
                          )}
                        </div>

                        {/* Load More Button */}
                        {adsSearchResults.data?.pagination?.hasNextPage && (
                          <div className="text-center">
                            <Button
                              onClick={loadMore}
                              disabled={loading}
                              variant="outline"
                              size="lg"
                            >
                              {loading ? (
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
                          No ads found
                        </p>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Enter keyword to search for ads
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="brands" className="space-y-4">
                {/* Brands Search Results */}
                {brandsSearchResults ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Brands Search Results</h2>
                      <p className="text-sm text-muted-foreground">
                        Found {brandsSearchResults.data?.results?.length || 0} brands
                      </p>
                    </div>

                    {brandsSearchResults.data?.results &&
                    brandsSearchResults.data.results.length > 0 ? (
                      <div className="grid gap-4 tablet:grid-cols-1 desktop:grid-cols-2">
                        {brandsSearchResults.data.results.map((brand: any, index: number) => (
                          <BrandCard
                            key={index}
                            {...brand}
                            onClick={() => setSelectedBrand(brand)}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <p className="text-lg text-muted-foreground">
                          No brands found
                        </p>
                      </Card>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Enter keyword to search for brands or browse all brands below
                      </p>
                    </div>
                    <div className="grid gap-4 tablet:grid-cols-1 desktop:grid-cols-2">
                      {mockBrands.map((brand, index) => (
                        <BrandCard
                          key={index}
                          {...brand}
                          onClick={() => setSelectedBrand(brand)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="companies" className="space-y-4">
                {/* Companies Search Results */}
                {companiesSearchResults ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Companies Search Results</h2>
                      <p className="text-sm text-muted-foreground">
                        Found {companiesSearchResults.data?.results?.length || 0} companies
                      </p>
                    </div>

                    {companiesSearchResults.data?.results &&
                    companiesSearchResults.data.results.length > 0 ? (
                      <div className="grid gap-4 tablet:grid-cols-1 desktop:grid-cols-2">
                        {companiesSearchResults.data.results.map((company: any, index: number) => (
                          <CompanyCard
                            key={index}
                            {...company}
                            onClick={() => setSelectedCompany(company)}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <p className="text-lg text-muted-foreground">
                          No companies found
                        </p>
                      </Card>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Enter keyword to search for companies or browse all companies below
                      </p>
                    </div>
                    <div className="grid gap-4 tablet:grid-cols-1 desktop:grid-cols-2">
                      {mockCompanies.map((company, index) => (
                        <CompanyCard
                          key={index}
                          {...company}
                          onClick={() => setSelectedCompany(company)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>

            {/* Loading State */}
            {loading && !adsSearchResults && !brandsSearchResults && !companiesSearchResults && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-muted-foreground">
                  Searching for {activeTab}...
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
