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
  LogIn,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useFrontendPagination } from "@/hooks/use-frontend-pagination";
import { useCategory } from "@/hooks/use-category";
// Import optimized async select components
import {
  SimpleAsyncCountrySelect,
  SimpleStaticLanguageSelect,
  SimpleAsyncCategorySelect,
} from "@/components/simple-async-select";
import {
  useMKTSearchWithCache,
  useBrandsSearchWithCache,
  useCompaniesSearchWithCache,
} from "@/hooks/use-cache-polling";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/contexts/auth-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { AdsSpyFilterPanel } from "@/components/ads-spy/ads-spy-filter-panel";
import { AdsSpyResultsToolbar } from "@/components/ads-spy/ads-spy-results-toolbar";
import { YoutubeAdsFilters } from "@/components/ads-spy/youtube-ads-filters";

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
      <SelectTrigger className="h-9 text-sm">
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
      <SelectTrigger className="h-9 text-sm">
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

const heroSlides = [
  {
    badge: "YouTube Ads Spy Tool",
    title: "Tìm kiếm Youtube Ads",
    description:
      "Nghiên cứu quảng cáo đối thủ, phân tích thương hiệu và theo dõi chiến dịch doanh nghiệp",
  },
  {
    badge: "Affiliate Placement",
    title: "Đặt banner affiliate của bạn tại đây",
    description:
      "Một vị trí nổi bật giữa hành trình nghiên cứu quảng cáo. Tiếp cận hàng ngàn marketer và agency.",
    buttonText: "Đăng ký đối tác",
    buttonHref: "#",
  },
  {
    badge: "Featured Partner",
    title: "Khám phá công cụ tăng trưởng mới",
    description:
      "Dễ dàng thay bằng ưu đãi, landing page hoặc link đối tác của bạn để tối ưu hiệu suất.",
    buttonText: "Tìm hiểu thêm",
    buttonHref: "#",
  },
  {
    badge: "Growth Toolkit",
    title: "Tối ưu creative nhanh hơn",
    description:
      "Đưa đúng lời mời hành động đến đúng nhóm người dùng mục tiêu với dữ liệu quảng cáo chính xác.",
    buttonText: "Khám phá ngay",
    buttonHref: "#",
  },
];

const HeroSlider = memo(() => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    const timer = setInterval(() => {
      api.scrollNext();
    }, 2500);

    return () => {
      api.off("select", onSelect);
      clearInterval(timer);
    };
  }, [api]);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-blue-950 py-10 md:py-14 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {heroSlides.map((slide, idx) => (
              <CarouselItem key={idx}>
                <div className="flex flex-col items-center justify-center text-center px-4 md:px-12 py-4 min-h-[160px]">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-white uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    {slide.badge}
                  </div>
                  <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto">
                    {slide.description}
                  </p>
                  {slide.buttonText && (
                    <div className="mt-4">
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="rounded-full gap-2 bg-white text-indigo-900 hover:bg-white/90 shadow-md transition-all hover:scale-105"
                      >
                        <a href={slide.buttonHref || "#"}>
                          {slide.buttonText}
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-8 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
          <CarouselNext className="right-2 md:-right-8 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
        </Carousel>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-4">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${current === idx ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
HeroSlider.displayName = "HeroSlider";

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

  const { user, loading: authLoading } = useAuth();

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

  // Handler to open brand modal from video card or detail modal
  const handleOpenBrandModal = useCallback((brandId: string | number | undefined) => {
    if (brandId) {
      setSelectedBrand({ brandId });
    }
  }, []);

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
  } = useMKTSearchWithCache();

  // Use Brands search with cache polling
  const {
    searchWithCache: searchBrandsWithCache,
    loading: brandsSearchLoading,
    data: brandsSearchData,
    error: brandsSearchError,
    status: brandsSearchStatus,
  } = useBrandsSearchWithCache();

  // Use Companies search with cache polling
  const {
    searchWithCache: searchCompaniesWithCache,
    loading: companiesSearchLoading,
    data: companiesSearchData,
    error: companiesSearchError,
    status: companiesSearchStatus,
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

      if (page === 1) {
        setAdsSearchResults(null);
      }

      try {
        const result = await searchAdsWithCache({
          type: "ads",
          searchTerm: searchQuery,
          page: 1, // Always use page 1 since API returns 1000 results
          limit: 300, // Get more results for FE pagination
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
          setAdsSearchResults(null);
        } else if (result?.success && result?.data) {
          setAdsSearchResults(result.data);

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

      if (page === 1) {
        setBrandsSearchResults(null);
      }

      try {
        const result = await searchBrandsWithCache({
          type: "brands",
          searchTerm: searchQuery,
          page: 1,
          limit: 300,
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

      if (page === 1) {
        setCompaniesSearchResults(null);
      }

      try {
        const result = await searchCompaniesWithCache({
          type: "companies",
          searchTerm: searchQuery,
          page: 1,
          limit: 300,
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

  // Show login prompt if not authenticated
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card className="max-w-md mx-auto border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white mb-4">
                <LogIn className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Đăng nhập để tìm kiếm Youtube Ads
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Bạn cần đăng nhập để sử dụng tính năng tìm kiếm quảng cáo và
                phân tích đối thủ
              </p>
              <Button asChild className="cursor-pointer">
                <a href="/login">
                  Đăng nhập
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section Slider */}
      <HeroSlider />

      <main className="container px-4 md:px-6 lg:px-8 py-8 relative z-20">
        {/* Thu hẹp cột bộ lọc xuống 250px và thêm items-start để sticky hoạt động */}
        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] items-start">

          {/* Vùng chứa bộ lọc - Thêm class sticky */}
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <AdsSpyFilterPanel
              title="Bộ lọc"
              onClear={() => { setSelectedCountry("0"); setSelectedLanguage("all"); setSelectedCategory("0"); setShowVideos("unlisted"); setDateFrom(""); setDateTo(""); }}
            >
              <div className="mt-4">
                <YoutubeAdsFilters
                  country={selectedCountry}
                  setCountry={setSelectedCountry}
                  language={selectedLanguage}
                  setLanguage={setSelectedLanguage}
                  category={selectedCategory}
                  setCategory={setSelectedCategory}
                  showVideos={showVideos}
                  setShowVideos={setShowVideos}
                  dateFrom={dateFrom}
                  setDateFrom={setDateFrom}
                  dateTo={dateTo}
                  setDateTo={setDateTo}
                />
              </div>
            </AdsSpyFilterPanel>
          </div>

          <div className="min-w-0">
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
              <Button type="submit" disabled={loading} className="mobile:w-full cursor-pointer">
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

            <div className="w-full">
              <AdsSpyResultsToolbar title="Thư viện quảng cáo" count={activeTab === "ads" ? adsPagination.totalItems : activeTab === "brands" ? brandsPagination.totalItems : companiesPagination.totalItems} />
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full mt-4"
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
                          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {adsPagination.currentItems.map(
                              (video: any, index: number) => (
                                <VideoCard
                                  key={video.ytVideoId || `video-${index}`}
                                  {...video}
                                  onClick={() => setSelectedVideo(video)}
                                  onCompanyClick={() => handleOpenBrandModal(video.brandId)}
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
                          <div className="grid gap-4 md:grid-cols-2 grid-cols-1 lg:grid-cols-3">
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
                          <div className="grid gap-4 md:grid-cols-2 grid-cols-1 lg:grid-cols-3">
                            {companiesPagination.currentItems.map(
                              (company: any, index: number) => (
                                <CompanyCard
                                  key={company.companyId || `company-${index}`}
                                  name={
                                    company.legalName ||
                                    company.summary_data?.legal_name ||
                                    "Tên không xác định"
                                  }
                                  description={`Doanh nghiệp ${company.isAffiliate ? "Affiliate" : "Marketing"
                                    } - ID: ${company.companyId}`}
                                  totalBrands={1}
                                  markets={[
                                    `Quốc gia ID: ${company.countryId ||
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
                <Card className="p-8 text-center border-destructive mt-4">
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
          </div>
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
          brandId: selectedVideo?.brandId
        }}
        onCompanyClick={() => handleOpenBrandModal(selectedVideo?.brandId)}
        onClose={() => { }}
      />

      <BrandDetailModal
        open={!!selectedBrand}
        onOpenChange={(open) => !open && setSelectedBrand(null)}
        brandId={selectedBrand?.brandId?.toString() || null}
        onClose={() => setSelectedBrand(null)}
      />

      <CompanyDetailModal
        open={!!selectedCompany}
        onOpenChange={(open) => !open && setSelectedCompany(null)}
        companyId={selectedCompany?.companyId?.toString() || null}
        company={selectedCompany}
        onClose={() => { }}
      />

      <footer className="border-t border-border/40 py-8 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Ads Spy Tool. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  );
}