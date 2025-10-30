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
import {
  Search,
  Calendar,
  Globe,
  Filter,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useFrontendPagination } from "@/hooks/use-frontend-pagination";
import { useCategory } from "@/hooks/use-category";
// Import optimized async select components
import {
  SimpleAsyncCountrySelect,
  SimpleAsyncLanguageSelect,
  SimpleAsyncCategorySelect,
} from "@/components/simple-async-select";
import {
  useMKTSearchWithCache,
  useBrandsSearchWithCache,
  useCompaniesSearchWithCache,
} from "@/hooks/use-cache-polling";

import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/contexts/auth-context";

// Pre-process static data once at module level for better performance
const sortOptions = [
  { value: "date", label: "Ngày tháng" },
  { value: "totalSpend", label: "Tổng chi tiêu" },
  { value: "views", label: "Lượt xem" },
  { value: "relevance", label: "Độ liên quan" },
];

const showVideosOptions = [
  { value: "unlisted", label: "Chỉ video ẩn" },
  { value: "all", label: "Tất cả video" },
  { value: "public", label: "Chỉ video công khai" },
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
        <SelectValue placeholder="Sắp xếp theo" />
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
        <SelectValue placeholder="Hiển thị video" />
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
  ({
    type,
    hasSearched,
  }: {
    type: "ads" | "brands" | "companies";
    hasSearched: boolean;
  }) => {
    const getDisplayText = () => {
      if (!hasSearched) {
        switch (type) {
          case "ads":
            return {
              title: "🎬 Sẵn sàng khám phá những quảng cáo tuyệt vời?",
              subtitle:
                "Nhập từ khóa ở trên để bắt đầu tìm kiếm quảng cáo và chiến dịch của đối thủ",
            };
          case "brands":
            return {
              title: "🏢 Khám phá chiến lược thương hiệu",
              subtitle:
                "Tìm kiếm thương hiệu để phân tích cách tiếp cận quảng cáo và hiệu suất của họ",
            };
          case "companies":
            return {
              title: "🏭 Thông tin doanh nghiệp đang chờ bạn",
              subtitle:
                "Khám phá các doanh nghiệp và chiến lược marketing của họ qua nhiều thương hiệu",
            };
        }
      } else {
        switch (type) {
          case "ads":
            return {
              title: "🔍 Không tìm thấy quảng cáo",
              subtitle:
                "Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc để tìm thêm kết quả",
            };
          case "brands":
            return {
              title: "🔍 Không tìm thấy thương hiệu",
              subtitle:
                "Thử các từ khóa khác hoặc duyệt cơ sở dữ liệu thương hiệu đang phát triển của chúng tôi",
            };
          case "companies":
            return {
              title: "🔍 Không tìm thấy doanh nghiệp",
              subtitle:
                "Điều chỉnh tiêu chí tìm kiếm để khám phá thêm doanh nghiệp",
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
                💡 Mẹo nhỏ: Sử dụng từ khóa cụ thể để có kết quả tốt hơn
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
  const { user, loading: authLoading } = useAuth();
  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Đang kiểm tra đăng nhập...</div>
      </div>
    );
  }
  const searchQueryRef = useRef<HTMLInputElement>(null);
  const { category: selectedCompanyCategory, fetchCategory } = useCategory();
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

  // Fetch category for selected company
  useEffect(() => {
    if (
      selectedCompany?.categoryId ||
      selectedCompany?.summary_data?.category_id
    ) {
      const categoryId =
        selectedCompany.categoryId || selectedCompany.summary_data.category_id;
      fetchCategory(categoryId);
    }
  }, [selectedCompany, fetchCategory]);

  // Use MKT search with cache polling for ads
  const {
    searchWithCache: searchAdsWithCache,
    loading: adsSearchLoading,
    data: adsSearchData,
    error: adsSearchError,
    status: adsSearchStatus,
    stopPolling: stopAdsPolling,
  } = useMKTSearchWithCache();

  const {
    searchWithCache: searchBrandsWithCache,
    loading: brandsSearchLoading,
    data: brandsSearchData,
    error: brandsSearchError,
    status: brandsSearchStatus,
    stopPolling: stopBrandsPolling,
  } = useBrandsSearchWithCache();

  const {
    searchWithCache: searchCompaniesWithCache,
    loading: companiesSearchLoading,
    data: companiesSearchData,
    error: companiesSearchError,
    status: companiesSearchStatus,
    stopPolling: stopCompaniesPolling,
  } = useCompaniesSearchWithCache();

  // Determine loading state based on active tab
  const loading =
    activeTab === "ads"
      ? adsSearchLoading
      : activeTab === "brands"
      ? brandsSearchLoading
      : activeTab === "companies"
      ? companiesSearchLoading
      : false;

  // Hook for refreshing favorite status
  const { refreshFavoriteStatus } = useFavorites();

  // Handle polling results for ads
  useEffect(() => {
    if (
      activeTab === "ads" &&
      adsSearchStatus === "completed" &&
      adsSearchData
    ) {
      console.log(
        "MKT Ads Polling completed, updating results:",
        adsSearchData
      );

      setAdsSearchResults(adsSearchData);

      // Show success toast for completed polling
      const resultCount = adsSearchData?.data?.results?.length || 0;
      if (resultCount > 0) {
        toast.success(
          `Found ${resultCount} ads from ${adsSearchData.total_available} available`
        );
      } else {
        toast.info("No results found");
      }
    } else if (activeTab === "ads" && adsSearchStatus === "error") {
      console.log("MKT Ads Polling failed with error:", adsSearchError);
      setAdsSearchResults(null);
      toast.error(adsSearchError || "Tìm kiếm thất bại");
    }
  }, [activeTab, adsSearchStatus, adsSearchData, adsSearchError]);

  // Handle polling results for brands
  useEffect(() => {
    if (
      activeTab === "brands" &&
      brandsSearchStatus === "completed" &&
      brandsSearchData
    ) {
      console.log(
        "MKT Brands Polling completed, updating results:",
        brandsSearchData
      );

      setBrandsSearchResults(brandsSearchData);

      // Show success toast for completed polling
      const resultCount = brandsSearchData?.data?.results?.length || 0;
      if (resultCount > 0) {
        toast.success(
          `Tìm thấy ${resultCount} thương hiệu từ ${brandsSearchData.total_available} có sẵn`
        );
      } else {
        toast.info("Không tìm thấy thương hiệu");
      }
    } else if (activeTab === "brands" && brandsSearchStatus === "error") {
      console.log("MKT Brands Polling failed with error:", brandsSearchError);
      setBrandsSearchResults(null);
      toast.error(brandsSearchError || "Tìm kiếm thương hiệu thất bại");
    }
  }, [activeTab, brandsSearchStatus, brandsSearchData, brandsSearchError]);

  // Handle polling results for companies
  useEffect(() => {
    if (
      activeTab === "companies" &&
      companiesSearchStatus === "completed" &&
      companiesSearchData
    ) {
      console.log(
        "MKT Companies Polling completed, updating results:",
        companiesSearchData
      );

      setCompaniesSearchResults(companiesSearchData);

      // Show success toast for completed polling
      const resultCount = companiesSearchData?.data?.results?.length || 0;
      if (resultCount > 0) {
        toast.success(
          `Tìm thấy ${resultCount} doanh nghiệp từ ${companiesSearchData.total_available} có sẵn`
        );
      } else {
        toast.info("Không tìm thấy doanh nghiệp");
      }
    } else if (activeTab === "companies" && companiesSearchStatus === "error") {
      console.log(
        "MKT Companies Polling failed with error:",
        companiesSearchError
      );
      setCompaniesSearchResults(null);
      toast.error(companiesSearchError || "Tìm kiếm doanh nghiệp thất bại");
    }
  }, [
    activeTab,
    companiesSearchStatus,
    companiesSearchData,
    companiesSearchError,
  ]);

  // Tab change handler
  const handleTabChange = useCallback((value: string) => {
    // Hủy polling khi chuyển tab
    stopAdsPolling();
    stopBrandsPolling();
    stopCompaniesPolling();
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
  }, [stopAdsPolling, stopBrandsPolling, stopCompaniesPolling]);

  // Ads search function
  const handleAdsSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      const searchQuery = searchQueryRef.current?.value?.trim();
      if (!searchQuery) {
        toast.error("Vui lòng nhập từ khóa tìm kiếm");
        return;
      }

      if (page === 1) {
        setAdsSearchResults(null);
      }

      try {
        const result = await searchAdsWithCache({
          type: "ads",
          searchTerm: searchQuery,
          page: 1, // Always use page 1 since API returns 1000 results
          limit: 500, // Get more results for FE pagination
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
          // Don't show any toast for pending - polling will handle it
          setAdsSearchResults(null); // Clear previous results
        } else if (result?.success && result?.data) {
          setAdsSearchResults(result.data);

          // Only show success toast for completed results
          const resultCount = result.data?.data?.results?.length || 0;
          if (resultCount > 0) {
            toast.success(
              `Tìm thấy ${resultCount} quảng cáo từ ${result.data.total_available} có sẵn`
            );
          } else {
            toast.info("Không tìm thấy kết quả");
          }
        } else {
          toast.info("Không tìm thấy kết quả");
          setAdsSearchResults(null);
        }
      } catch (error) {
        toast.error("Tìm kiếm thất bại. Vui lòng thử lại.");
        setAdsSearchResults(null);
      }
    },
    [
      searchAdsWithCache,
      selectedCountry,
      selectedLanguage,
      selectedCategory,
      dateFrom,
      dateTo,
      showVideos,
      sortBy,
    ]
  );

  // Brands search function with cache polling
  const handleBrandsSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      const searchQuery = searchQueryRef.current?.value?.trim();
      if (!searchQuery) {
        toast.error("Vui lòng nhập từ khóa tìm kiếm");
        return;
      }

      if (page === 1) {
        setBrandsSearchResults(null);
      }

      try {
        const result = await searchBrandsWithCache({
          type: "brands",
          searchTerm: searchQuery,
          page: 1, // Always use page 1 since API returns many results
          limit: 500, // Get more results for FE pagination
          filters: {
            countryId: parseInt(selectedCountry),
            categoryIds:
              selectedCategory && selectedCategory !== "0"
                ? [parseInt(selectedCategory)]
                : [],
            language:
              selectedLanguage && selectedLanguage !== "all"
                ? selectedLanguage
                : "",
            dateFrom: dateFrom || "",
            dateTo: dateTo || "",
            sortProp: sortBy,
            orderAsc: false,
          },
        });

        if (result?.success) {
          if (result.pending) {
            toast.info("Bắt đầu tìm kiếm thương hiệu, vui lòng đợi...");
          } else {
            // Direct result from cache
            setBrandsSearchResults(result.data);

            const resultCount = result.data?.data?.results?.length || 0;
            if (resultCount > 0) {
              toast.success(
                `Tìm thấy ${resultCount} thương hiệu từ ${result.data.total_available} có sẵn`
              );
            } else {
              toast.info("Không tìm thấy thương hiệu");
            }
          }
        } else {
          toast.info("Không tìm thấy thương hiệu");
          setBrandsSearchResults(null);
        }
      } catch (error) {
        toast.error("Tìm kiếm thương hiệu thất bại. Vui lòng thử lại.");
        setBrandsSearchResults(null);
      }
    },
    [searchBrandsWithCache, selectedCountry, selectedCategory, sortBy]
  );

  // Companies search function with cache polling
  const handleCompaniesSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      const searchQuery = searchQueryRef.current?.value?.trim();
      if (!searchQuery) {
        toast.error("Vui lòng nhập từ khóa tìm kiếm");
        return;
      }

      if (page === 1) {
        setCompaniesSearchResults(null);
      }

      try {
        const result = await searchCompaniesWithCache({
          type: "companies",
          searchTerm: searchQuery,
          page: 1, // Always use page 1 since API returns many results
          limit: 500, // Get more results for FE pagination
          filters: {
            countryId: parseInt(selectedCountry),
            categoryIds:
              selectedCategory && selectedCategory !== "0"
                ? [parseInt(selectedCategory)]
                : [],
            language:
              selectedLanguage && selectedLanguage !== "all"
                ? selectedLanguage
                : "",
            dateFrom: dateFrom || "",
            dateTo: dateTo || "",
            sortProp: sortBy,
            orderAsc: false,
          },
        });

        if (result?.success) {
          if (result.pending) {
            toast.info("Bắt đầu tìm kiếm doanh nghiệp, vui lòng đợi...");
          } else {
            // Direct result from cache
            setCompaniesSearchResults(result.data);

            const resultCount = result.data?.data?.results?.length || 0;
            if (resultCount > 0) {
              toast.success(
                `Tìm thấy ${resultCount} doanh nghiệp từ ${result.data.total_available} có sẵn`
              );
            } else {
              toast.info("Không tìm thấy doanh nghiệp");
            }
          }
        } else {
          toast.info("Không tìm thấy doanh nghiệp");
          setCompaniesSearchResults(null);
        }
      } catch (error) {
        toast.error("Tìm kiếm doanh nghiệp thất bại. Vui lòng thử lại.");
        setCompaniesSearchResults(null);
      }
    },
    [searchCompaniesWithCache, selectedCountry, selectedCategory, sortBy]
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

  // Callback when video modal closes - refresh favorite status
  // const handleVideoModalClose = useCallback(async (videoId: string) => {
  //   await refreshFavoriteStatus('video', videoId);
  // }, [refreshFavoriteStatus]);

  // // Callback when brand modal closes - refresh favorite status
  // const handleBrandModalClose = useCallback(async (brandId: string) => {
  //   await refreshFavoriteStatus('brand', brandId);
  // }, [refreshFavoriteStatus]);

  // // Callback when company modal closes - refresh favorite status
  // const handleCompanyModalClose = useCallback(async (companyId: string) => {
  //   await refreshFavoriteStatus('company', companyId);
  // }, [refreshFavoriteStatus]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 md:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Tìm kiếm Marketing
          </h1>
          <p className="text-muted-foreground">
            Nghiên cứu quảng cáo đối thủ, phân tích thương hiệu và theo dõi
            chiến dịch doanh nghiệp
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
              placeholder="Tìm kiếm bằng từ khóa, URL hoặc tên thương hiệu..."
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading} className="mobile:w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tìm kiếm...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </>
            )}
          </Button>
        </form>

        {/* Advanced Filters - Horizontal on Desktop, Vertical on Tablet */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4" />
              Bộ lọc nâng cao
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1">
              {/* Row 1 - Country & Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Quốc gia
                </label>
                <SimpleAsyncCountrySelect
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ngôn ngữ</label>
                <SimpleAsyncLanguageSelect
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                  className="w-full"
                />
              </div>

              {/* Row 2 - Category & Video Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục</label>
                <SimpleAsyncCategorySelect
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Loại video</label>
                <ShowVideosSelect
                  value={showVideos}
                  onValueChange={setShowVideos}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ngày bắt đầu
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="Từ ngày"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ngày kết thúc
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="Đến ngày"
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
                Tìm kiếm quảng cáo
              </TabsTrigger>
              <TabsTrigger value="brands" className="mobile:text-xs">
                Thương hiệu
              </TabsTrigger>
              <TabsTrigger value="companies" className="mobile:text-xs">
                Doanh nghiệp
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ads" className="space-y-4">
              {/* Loading State */}
              <SearchLoadingState
                isSearching={loading}
                isPending={activeTab === "ads" && adsSearchStatus === "pending"}
                searchType="ads"
                className="mb-6"
              />

              {/* Ads Search Results */}
              {adsSearchResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      Kết quả tìm kiếm quảng cáo
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Tìm thấy {adsPagination.totalItems} quảng cáo (
                      {adsSearchResults.total_available || 0} tổng cộng có sẵn)
                      {adsPagination.totalPages > 1 && (
                        <span>
                          {" "}
                          - Trang {adsPagination.currentPage} của{" "}
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
                                toast.info(
                                  "Thông tin doanh nghiệp sắp ra mắt!"
                                );
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
              {/* Loading State */}
              <SearchLoadingState
                isSearching={loading}
                isPending={
                  activeTab === "brands" && brandsSearchStatus === "pending"
                }
                searchType="brands"
                className="mb-6"
              />

              {/* Brands Search Results */}
              {brandsSearchResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      Kết quả tìm kiếm thương hiệu
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Tìm thấy {brandsPagination.totalItems} thương hiệu (
                      {brandsSearchResults.total_available || 0} tổng cộng có
                      sẵn)
                      {brandsPagination.totalPages > 1 && (
                        <span>
                          {" "}
                          - Trang {brandsPagination.currentPage} của{" "}
                          {brandsPagination.totalPages}
                        </span>
                      )}
                    </p>
                  </div>

                  {brandsPagination.totalItems > 0 ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        {brandsPagination.currentItems.map(
                          (brand: any, index: number) => (
                            <BrandCard
                              key={brand.brandId || `brand-${index}`}
                              brandId={
                                brand.brandId?.toString() || `brand-${index}`
                              }
                              name={brand.name || `Brand ${index + 1}`}
                              description={
                                brand.description || "Không có mô tả"
                              }
                              logo={brand.thumbnail || "/placeholder.svg"}
                              totalAds={
                                brand.summary_data?.total_spend ||
                                brand.totalSpend ||
                                0
                              }
                              totalViews={String(
                                brand.summary_data?.total_views ||
                                  brand.totalViews ||
                                  0
                              )}
                              activeMonths={
                                Math.ceil(
                                  (brand.summary_data?.spend_365 || 0) / 30
                                ) || 1
                              }
                              totalSpend={
                                brand.summary_data?.total_spend ||
                                brand.totalSpend ||
                                0
                              }
                              summaryDate={brand.summary_data?.summary_date}
                              onClick={() => setSelectedBrand(brand)}
                            />
                          )
                        )}
                      </div>

                      {/* Frontend Pagination */}
                      <FrontendPagination
                        currentPage={brandsPagination.currentPage}
                        totalPages={brandsPagination.totalPages}
                        totalItems={brandsPagination.totalItems}
                        itemsPerPage={20}
                        hasNextPage={brandsPagination.hasNextPage}
                        hasPrevPage={brandsPagination.hasPrevPage}
                        onNextPage={brandsPagination.nextPage}
                        onPrevPage={brandsPagination.prevPage}
                        onGoToPage={brandsPagination.goToPage}
                        className="mt-8"
                      />
                    </>
                  ) : (
                    <NoDataDisplay type="brands" hasSearched={true} />
                  )}
                </div>
              ) : (
                <NoDataDisplay type="brands" hasSearched={false} />
              )}
            </TabsContent>

            <TabsContent value="companies" className="space-y-4">
              {/* Loading State */}
              <SearchLoadingState
                isSearching={loading}
                isPending={
                  activeTab === "companies" &&
                  companiesSearchStatus === "pending"
                }
                searchType="companies"
                className="mb-6"
              />

              {/* Companies Search Results */}
              {companiesSearchResults ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                      Kết quả tìm kiếm doanh nghiệp
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Tìm thấy {companiesPagination.totalItems} doanh nghiệp (
                      {companiesSearchResults.total_available || 0} tổng cộng có
                      sẵn)
                      {companiesPagination.totalPages > 1 && (
                        <span>
                          {" "}
                          - Trang {companiesPagination.currentPage} của{" "}
                          {companiesPagination.totalPages}
                        </span>
                      )}
                    </p>
                  </div>

                  {companiesPagination.totalItems > 0 ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                        {companiesPagination.currentItems.map(
                          (company: any, index: number) => (
                            <CompanyCard
                              key={company.companyId || `company-${index}`}
                              name={
                                company.legalName ||
                                company.summary_data?.legal_name ||
                                "Tên không xác định"
                              }
                              description={`Doanh nghiệp ${
                                company.isAffiliate ? "Affiliate" : "Marketing"
                              } - ID: ${company.companyId}`}
                              totalBrands={1} // Companies API không trả về totalBrands, default 1
                              // totalAds={Math.floor((company.summary_data?.total_spend || company.totalSpend || 0) / 1000)} // Estimate ads from spend
                              markets={[
                                `Quốc gia ID: ${
                                  company.countryId ||
                                  company.summary_data?.country_id ||
                                  "N/A"
                                }`,
                              ]}
                              estimatedSpend={`$${(
                                (company.summary_data?.total_spend ||
                                  company.totalSpend ||
                                  0) / 1000000
                              ).toFixed(1)}M`}
                              totalSpend={Math.floor(
                                company.summary_data?.total_spend ||
                                  company.totalSpend ||
                                  0
                              )}
                              summaryDate={company.summary_data?.summary_date}
                              onClick={() => setSelectedCompany(company)}
                              companyId={company.companyId?.toString() || ""}
                              isAffiliate={company.isAffiliate || false}
                              totalVideos={Math.floor(
                                company.summary_data?.total_views || 0
                              )}
                            />
                          )
                        )}
                      </div>

                      {/* Frontend Pagination */}
                      <FrontendPagination
                        currentPage={companiesPagination.currentPage}
                        totalPages={companiesPagination.totalPages}
                        totalItems={companiesPagination.totalItems}
                        itemsPerPage={20}
                        hasNextPage={companiesPagination.hasNextPage}
                        hasPrevPage={companiesPagination.hasPrevPage}
                        onNextPage={companiesPagination.nextPage}
                        onPrevPage={companiesPagination.prevPage}
                        onGoToPage={companiesPagination.goToPage}
                        className="mt-8"
                      />
                    </>
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
          {adsSearchError && (
            <Card className="p-8 text-center border-destructive">
              <h3 className="text-lg font-semibold mb-2 text-destructive">
                Lỗi tìm kiếm
              </h3>
              <p className="text-muted-foreground mb-4">{adsSearchError}</p>
              <Button onClick={() => handleSearch(null)} variant="outline">
                Thử lại
              </Button>
            </Card>
          )}
        </div>
      </main>

      <VideoDetailModal
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
        video={{
          title: selectedVideo?.title || "",
          channel: selectedVideo?.channel || "",
          views: selectedVideo?.views || "0",
          ctr: selectedVideo?.ctr || "0%",
          date: selectedVideo?.date || "",
          thumbnail: selectedVideo?.thumbnail || "",
          url: selectedVideo?.url || "",
          companyName: selectedVideo?.companyName || "",
          description: selectedVideo?.description || "",
          duration: selectedVideo?.duration || "",
          engagement: selectedVideo?.engagement || "",
          avgViewDuration: selectedVideo?.avgViewDuration || "",
          ytVideoId: selectedVideo?.ytVideoId || selectedVideo?.videoId || "",
        }}
        onCompanyClick={() => {
          // Company details coming soon
          toast.info("Thông tin doanh nghiệp sắp ra mắt!");
        }}
        onClose={() => {}}
      />

      <BrandDetailModal
        open={!!selectedBrand}
        onOpenChange={(open) => !open && setSelectedBrand(null)}
        brandId={selectedBrand?.brandId?.toString() || null}
        onClose={() => {}}
      />

      <CompanyDetailModal
        open={!!selectedCompany}
        onOpenChange={(open) => !open && setSelectedCompany(null)}
        companyId={selectedCompany?.companyId?.toString() || null}
        company={selectedCompany}
        onClose={() => {}}
      />
    </div>
  );
}
