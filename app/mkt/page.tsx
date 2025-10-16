"use client";

import { useState, useCallback, useRef, useMemo, memo, useEffect } from "react";
import { Header } from "@/components/header";
import { VideoCard } from "@/components/video-card";
import { BrandCard } from "@/components/brand-card";
import { CompanyCard } from "@/components/company-card";
import { FrontendPagination } from "@/components/frontend-pagination";
import { SearchLoadingState } from "@/components/search-loading-state";
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
import { Search, Calendar, Globe, Filter, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useMKTSearch } from "@/hooks/use-mkt-search";
import { useFrontendPagination } from "@/hooks/use-frontend-pagination";
// Import optimized async select components
import {
  SimpleAsyncCountrySelect,
  SimpleAsyncLanguageSelect,
  SimpleAsyncCategorySelect,
} from "@/components/simple-async-select";

// Pre-process static data once at module level for better performance
const sortOptions = [
  { value: "date", label: "Date" },
  { value: "totalSpend", label: "Total Spend" },
  { value: "views", label: "Views" },
  { value: "relevance", label: "Relevance" },
];

const showVideosOptions = [
  { value: "unlisted", label: "Unlisted Only" },
  { value: "all", label: "All Videos" },
  { value: "public", label: "Public Only" },
];

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
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
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
        {showVideosOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
);
ShowVideosSelect.displayName = "ShowVideosSelect";

// Cute No Data Component
const NoDataDisplay = memo(
  ({ type, hasSearched }: { type: "ads" | "brands" | "companies"; hasSearched: boolean }) => {
    const getDisplayText = () => {
      if (!hasSearched) {
        switch (type) {
          case "ads":
            return {
              title: "🎬 Ready to discover amazing ads?",
              subtitle: "Enter a keyword above to start searching for competitor ads and campaigns",
            };
          case "brands":
            return {
              title: "🏢 Explore brand strategies",
              subtitle: "Search for brands to analyze their advertising approach and performance",
            };
          case "companies":
            return {
              title: "🏭 Company intelligence awaits",
              subtitle: "Discover companies and their marketing strategies across multiple brands",
            };
        }
      } else {
        switch (type) {
          case "ads":
            return {
              title: "🔍 No ads found",
              subtitle: "Try adjusting your search terms or filters to find more results",
            };
          case "brands":
            return {
              title: "🔍 No brands found",
              subtitle: "Try different keywords or browse our growing brand database",
            };
          case "companies":
            return {
              title: "🔍 No companies found",
              subtitle: "Adjust your search criteria to discover more companies",
            };
        }
      }
    };

    const { title, subtitle } = getDisplayText();

    return (
      <Card className="p-12 text-center border-dashed border-2 border-muted-foreground/20 bg-gradient-to-br from-muted/10 to-muted/5">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary/60" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
          {!hasSearched && (
            <div className="mt-4 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
              <span className="text-sm text-primary font-medium">
                💡 Pro tip: Use specific keywords for better results
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }
);
NoDataDisplay.displayName = "NoDataDisplay";

export default function MKTPage() {
  const searchQueryRef = useRef<HTMLInputElement>(null);
  const [selectedCountry, setSelectedCountry] = useState("0");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showVideos, setShowVideos] = useState("unlisted");
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [sortBy, setSortBy] = useState<
    "date" | "totalSpend" | "views" | "relevance"
  >("date");

  // Tab management state
  const [activeTab, setActiveTab] = useState<"ads" | "brands" | "companies">(
    "ads"
  );

  // Search results for each tab
  const [adsSearchResults, setAdsSearchResults] = useState<any>(null);
  const [brandsSearchResults, setBrandsSearchResults] = useState<any>(null);
  const [companiesSearchResults, setCompaniesSearchResults] =
    useState<any>(null);

  // Frontend pagination for each tab
  const adsPagination = useFrontendPagination(
    adsSearchResults?.data?.results || [],
    { itemsPerPage: 20 }
  );
  const brandsPagination = useFrontendPagination(
    brandsSearchResults?.data?.results || [],
    { itemsPerPage: 20 }
  );
  const companiesPagination = useFrontendPagination(
    companiesSearchResults?.data?.results || [],
    { itemsPerPage: 20 }
  );

  // Modal states
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const { searchMKTAds, loading, error, data, status } = useMKTSearch();

  // Handle polling results for ads
  useEffect(() => {
    if (activeTab === "ads" && status === "completed" && data) {
      console.log("MKT Ads Polling completed, updating results:", data);

      setAdsSearchResults(data);

      // Show success toast for completed polling
      const resultCount = data?.data?.results?.length || 0;
      if (resultCount > 0) {
        toast.success(
          `Found ${resultCount} ads from ${data.total_available} available`
        );
      } else {
        toast.info("No results found");
      }
    } else if (activeTab === "ads" && status === "error") {
      console.log("MKT Ads Polling failed with error:", error);
      setAdsSearchResults(null);
      toast.error(error || "Search failed");
    }
  }, [activeTab, status, data, error]);



  // Tab change handler
  const handleTabChange = useCallback((value: string) => {
    const newTab = value as "ads" | "brands" | "companies";
    setActiveTab(newTab);
    // Reset search results when switching tabs
    if (newTab === "ads") {
      setAdsSearchResults(null);
    } else if (newTab === "brands") {
      setBrandsSearchResults(null);
    } else if (newTab === "companies") {
      setCompaniesSearchResults(null);
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
      }

      try {
        const result = await searchMKTAds({
          searchTerm: searchQuery,
          page: 1, // Always use page 1 since API returns 1000 results
          limit: 1000, // Get more results for FE pagination
          filters: {
            countryId: parseInt(selectedCountry),
            language:
              selectedLanguage && selectedLanguage !== "all"
                ? selectedLanguage
                : "",
            categoryIds:
              selectedCategory && selectedCategory !== "0"
                ? [parseInt(selectedCategory)]
                : [],
            dateFrom: dateFrom || "",
            dateTo: dateTo || "",
            showVideos: showVideos as "unlisted" | "all" | "public",
            sortProp: sortBy,
            orderAsc: false,
          },
        });

        if (result?.pending) {
          console.log(
            "MKT Search is pending, polling will start automatically..."
          );
          // Don't show any toast for pending - polling will handle it
          setAdsSearchResults(null); // Clear previous results
        } else if (result?.success && result?.data) {
          console.log("MKT Search completed:", result);

          setAdsSearchResults(result.data);

          // Only show success toast for completed results
          const resultCount = result.data?.data?.results?.length || 0;
          if (resultCount > 0) {
            toast.success(
              `Found ${resultCount} ads from ${result.data.total_available} available`
            );
          } else {
            toast.info("No results found");
          }
        } else {
          toast.info("No results found");
          setAdsSearchResults(null);
        }
      } catch (error) {
        console.error("Ads Search error:", error);
        toast.error("Search failed. Please try again.");
        setAdsSearchResults(null);
      }
    },
    [
      searchMKTAds,
      selectedCountry,
      selectedLanguage,
      selectedCategory,
      dateFrom,
      dateTo,
      showVideos,
      sortBy,
    ]
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
      }

      try {
        // TODO: Replace with actual brands search API
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        // Return empty results for now
        const result = {
          success: true,
          data: { results: [] },
          total_available: 0,
        };

        setBrandsSearchResults(result);
        toast.info("No brands found");
      } catch (error) {
        console.error("Brands Search error:", error);
        toast.error("Brands search failed. Please try again.");
      }
    },
    []
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
      }

      try {
        // TODO: Replace with actual companies search API
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

        // Return empty results for now
        const result = {
          success: true,
          data: { results: [] },
          total_available: 0,
        };

        setCompaniesSearchResults(result);
        toast.info("No companies found");
      } catch (error) {
        console.error("Companies Search error:", error);
        toast.error("Companies search failed. Please try again.");
      }
    },
    []
  );

  // Generic search handler that delegates to the appropriate search function
  const handleSearch = useCallback(
    (e: React.FormEvent | null, page: number = 1) => {
      if (activeTab === "ads") {
        return handleAdsSearch(e, page);
      } else if (activeTab === "brands") {
        return handleBrandsSearch(e, page);
      } else if (activeTab === "companies") {
        return handleCompaniesSearch(e, page);
      }
    },
    [activeTab, handleAdsSearch, handleBrandsSearch, handleCompaniesSearch]
  );

  // Handle polling results for ads
  useEffect(() => {
    if (activeTab === "ads" && status === "completed" && data) {
      console.log("MKT Ads polling completed, updating results:", data);

      setAdsSearchResults(data);

      // Show success toast for completed polling
      const resultCount = data?.data?.results?.length || 0;
      if (resultCount > 0) {
        toast.success(
          `Found ${resultCount} ads from ${data.total_available} available`
        );
      } else {
        toast.info("No ads found");
      }
    } else if (activeTab === "ads" && status === "error") {
      console.log("MKT Ads polling failed with error:", error);
      setAdsSearchResults(null);
      toast.error(error || "Ads search failed");
    }
  }, [activeTab, status, data, error]);

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

        {/* Advanced Filters - Horizontal on Desktop, Vertical on Tablet */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1">
              {/* Row 1 - Country & Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Country
                </label>
                <SimpleAsyncCountrySelect
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <SimpleAsyncLanguageSelect
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                  className="w-full"
                />
              </div>

              {/* Row 2 - Category & Video Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <SimpleAsyncCategorySelect
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Video Type</label>
                <ShowVideosSelect
                  value={showVideos}
                  onValueChange={setShowVideos}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="From date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="To date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-full">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
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
              {/* Loading State */}
              <SearchLoadingState
                isSearching={loading}
                isPending={activeTab === "ads" && status === "pending"}
                searchType="ads"
                className="mb-6"
              />

              {/* Ads Search Results */}
              {adsSearchResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Ads Search Results</h2>
                    <p className="text-sm text-muted-foreground">
                      Found {adsPagination.totalItems} ads (
                      {adsSearchResults.total_available || 0} total available)
                      {adsPagination.totalPages > 1 && (
                        <span>
                          {" "}
                          - Page {adsPagination.currentPage} of{" "}
                          {adsPagination.totalPages}
                        </span>
                      )}
                    </p>
                  </div>

                  {adsPagination.totalItems > 0 ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        {adsPagination.currentItems.map(
                          (video: any, index: number) => (
                            <VideoCard
                              key={video.ytVideoId || `video-${index}`}
                              {...video}
                              onClick={() => setSelectedVideo(video)}
                              onCompanyClick={() => {
                                // Company click disabled for now
                                toast.info("Company details coming soon!");
                              }}
                            />
                          )
                        )}
                      </div>

                      {/* Frontend Pagination */}
                      <FrontendPagination
                        currentPage={adsPagination.currentPage}
                        totalPages={adsPagination.totalPages}
                        totalItems={adsPagination.totalItems}
                        itemsPerPage={20}
                        hasNextPage={adsPagination.hasNextPage}
                        hasPrevPage={adsPagination.hasPrevPage}
                        onNextPage={adsPagination.nextPage}
                        onPrevPage={adsPagination.prevPage}
                        onGoToPage={adsPagination.goToPage}
                        className="mt-8"
                      />
                    </>
                  ) : (
                    <NoDataDisplay type="ads" hasSearched={true} />
                  )}
                </div>
              ) : (
                <NoDataDisplay type="ads" hasSearched={false} />
              )}
            </TabsContent>

            <TabsContent value="brands" className="space-y-4">
              {/* Brands Search Results */}
              {brandsSearchResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      Brands Search Results
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Found {brandsSearchResults.data?.results?.length || 0}{" "}
                      brands
                    </p>
                  </div>

                  {brandsSearchResults.data?.results &&
                  brandsSearchResults.data.results.length > 0 ? (
                    <div className="grid gap-4 tablet:grid-cols-1 desktop:grid-cols-2">
                      {brandsSearchResults.data.results.map(
                        (brand: any, index: number) => (
                          <BrandCard
                            key={index}
                            {...brand}
                            onClick={() => setSelectedBrand(brand)}
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <NoDataDisplay type="brands" hasSearched={true} />
                  )}
                </div>
              ) : (
                <NoDataDisplay type="brands" hasSearched={false} />
              )}
            </TabsContent>

            <TabsContent value="companies" className="space-y-4">
              {/* Companies Search Results */}
              {companiesSearchResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      Companies Search Results
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Found {companiesSearchResults.data?.results?.length || 0}{" "}
                      companies
                    </p>
                  </div>

                  {companiesSearchResults.data?.results &&
                  companiesSearchResults.data.results.length > 0 ? (
                    <div className="grid gap-4 tablet:grid-cols-1 desktop:grid-cols-2">
                      {companiesSearchResults.data.results.map(
                        (company: any, index: number) => (
                          <CompanyCard
                            key={index}
                            {...company}
                            onClick={() => setSelectedCompany(company)}
                          />
                        )
                      )}
                    </div>
                  ) : (
                    <NoDataDisplay type="companies" hasSearched={true} />
                  )}
                </div>
              ) : (
                <NoDataDisplay type="companies" hasSearched={false} />
              )}
            </TabsContent>
          </Tabs>

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
      </main>

      <VideoDetailModal
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
        video={selectedVideo || {}}
        onCompanyClick={() => {
          // Company details coming soon
          toast.info("Company details coming soon!");
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
