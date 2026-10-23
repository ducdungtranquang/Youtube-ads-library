"use client";

import { useState, useCallback, useRef, useMemo, memo, useEffect } from "react";
import Image from "next/image";
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
  TrendingUp,
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
import { useSearchQuota } from "@/hooks/use-search-quota";
import { SearchQuotaBadge } from "@/components/search-quota-badge";
import { UpgradeModal } from "@/components/upgrade-modal";

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
      <SelectTrigger className="h-9 text-sm bg-white border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50 transition-colors">
        <SelectValue placeholder="Sắp xếp theo" />
      </SelectTrigger>
      <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg">
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer">
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
      <SelectTrigger className="h-9 text-sm bg-white border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50 transition-colors">
        <SelectValue placeholder="Hiển thị video" />
      </SelectTrigger>
      <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg">
        {showVideosOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="focus:bg-slate-100 focus:text-slate-900 cursor-pointer">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
);
ShowVideosSelect.displayName = "ShowVideosSelect";

// 📌 Tích hợp 3 Affiliate Banners kèm Slogan kích thích chuyển đổi (Theme tối)
const heroSlides = [
  {
    badge: "Scale Up Doanh Thu",
    title: "Tiếp Cận 70 Triệu Khách Hàng Zalo",
    description: "Tối ưu chi phí, bùng nổ đơn hàng với Zalo Ads. Giải pháp quảng cáo nội địa hiệu quả nhất hiện nay.",
    buttonText: "Nhận Ưu Đãi Zalo Ads",
    buttonHref: "https://shorten.asia/QGjMfDbB",
    image: "/zalo_ad.png",
    alt: "Zalo Ads Platform"
  },
  {
    badge: "Công Cụ Livestream #1",
    title: "Livestream Đa Nền Tảng Chuyên Nghiệp",
    description: "Phát lại video có sẵn, tăng mắt xem tự nhiên và chốt sale tự động với GoStream.",
    buttonText: "Dùng Thử GoStream Miễn Phí",
    buttonHref: "https://shorten.asia/befQzneV",
    image: "/gostream.png",
    alt: "GoStream Livestream Tool"
  },
  {
    badge: "Nâng Cấp Kỹ Năng",
    title: "Trở Thành Chuyên Gia Digital Marketing",
    description: "Khóa học thực chiến từ cơ bản đến nâng cao trên Gitiho. Áp dụng ngay để vít ads ra đơn.",
    buttonText: "Đăng Ký Khóa Học Gitiho",
    buttonHref: "https://shorten.asia/TY1pP1AR",
    image: "/gitiho.png",
    alt: "Gitiho Online Courses"
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
    }, 4500);

    return () => {
      api.off("select", onSelect);
      clearInterval(timer);
    };
  }, [api]);

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-12 md:py-20 text-white border-b border-slate-800">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {heroSlides.map((slide, idx) => (
              <CarouselItem key={idx}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-8 py-4">
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 border border-slate-700 px-4 py-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" />
                      {slide.badge}
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white md:text-4xl lg:text-5xl leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                      {slide.description}
                    </p>
                    {slide.buttonText && (
                      <div className="pt-2">
                        <Button
                          asChild
                          size="lg"
                          className="rounded-full gap-2 bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1"
                        >
                          <a href={slide.buttonHref} target="_blank" rel="noopener noreferrer">
                            {slide.buttonText}
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full max-w-md relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-indigo-950/50 group">
                    <div className="aspect-video w-full bg-slate-900 relative">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-8 border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 hover:text-white" />
          <CarouselNext className="right-2 md:-right-8 border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 hover:text-white" />
        </Carousel>

        <div className="flex justify-center gap-2 mt-8">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${current === idx ? "w-8 bg-indigo-500" : "w-2 bg-slate-700 hover:bg-slate-500"
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

// Cute No Data Component - Chuyển sang theme sáng
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
      <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/80 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
              <Sparkles className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
          {!hasSearched && (
            <div className="mt-4 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
              <span className="text-sm text-indigo-600 font-medium">
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

  const handleClearAllFilters = useCallback(() => {
    setSelectedCountry("0");
    setSelectedLanguage("all");
    setSelectedCategory("0");
    setShowVideos("unlisted");
    setDateFrom("");
    setDateTo("");
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCountry !== "0") count++;
    if (selectedLanguage !== "all") count++;
    if (selectedCategory !== "0") count++;
    if (showVideos !== "unlisted") count++;
    if (dateFrom || dateTo) count++;
    return count;
  }, [selectedCountry, selectedLanguage, selectedCategory, showVideos, dateFrom, dateTo]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (selectedCountry !== "0") {
      chips.push({ id: "country", label: `Quốc gia (${selectedCountry})`, onRemove: () => setSelectedCountry("0") });
    }
    if (selectedLanguage !== "all") {
      chips.push({ id: "language", label: `Ngôn ngữ: ${selectedLanguage}`, onRemove: () => setSelectedLanguage("all") });
    }
    if (selectedCategory !== "0") {
      chips.push({ id: "category", label: "Danh mục ngành", onRemove: () => setSelectedCategory("0") });
    }
    if (showVideos !== "unlisted") {
      chips.push({ id: "showVideos", label: showVideos === "all" ? "Tất cả video" : "Chỉ video công khai", onRemove: () => setShowVideos("unlisted") });
    }
    if (dateFrom || dateTo) {
      chips.push({ id: "date", label: `${dateFrom || "..."} → ${dateTo || "..."}`, onRemove: () => { setDateFrom(""); setDateTo(""); } });
    }
    return chips;
  }, [selectedCountry, selectedLanguage, selectedCategory, showVideos, dateFrom, dateTo]);

  const { user, loading: authLoading } = useAuth();
  const {
    quota,
    checkCanSearch,
    consumeSearch,
    isUpgradeModalOpen,
    openUpgradeModal,
    closeUpgradeModal,
  } = useSearchQuota('yt');

  const [activeTab, setActiveTab] = useState<"ads" | "brands" | "companies">("ads");

  const [adsSearchResults, setAdsSearchResults] = useState<any>(null);
  const [brandsSearchResults, setBrandsSearchResults] = useState<any>(null);
  const [companiesSearchResults, setCompaniesSearchResults] = useState<any>(null);

  const adsPagination = useFrontendPagination(adsSearchResults?.data?.results || [], { itemsPerPage: 20 });
  const brandsPagination = useFrontendPagination(brandsSearchResults?.data?.results || [], { itemsPerPage: 20 });
  const companiesPagination = useFrontendPagination(companiesSearchResults?.data?.results || [], { itemsPerPage: 20 });

  // Preview ads — shown before user performs any search
  const [previewAds, setPreviewAds] = useState<any[]>([])
  const [previewLoading, setPreviewLoading] = useState(true)

  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const handleOpenBrandModal = useCallback((brandId: string | number | undefined) => {
    if (brandId) {
      setSelectedBrand({ brandId });
    }
  }, []);

  // Fetch preview ads from cache immediately on mount (no auth required)
  useEffect(() => {
    let isMounted = true

    const fetchPreview = async () => {
      setPreviewLoading(true)
      try {
        console.log('[MKT] Fetching preview ads from cache...')
        const res = await fetch('/api/ads/preview', { cache: 'no-store' })
        const json = await res.json()
        if (isMounted) {
          console.log('[MKT] Preview ads loaded:', json.ads?.length || 0)
          setPreviewAds(json.ads || [])
        }
      } catch (err) {
        console.error('[MKT] Failed to fetch preview ads:', err)
        if (isMounted) {
          setPreviewAds([])
        }
      } finally {
        if (isMounted) {
          setPreviewLoading(false)
        }
      }
    }

    fetchPreview()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (selectedCompany?.categoryId || selectedCompany?.summary_data?.category_id) {
      const categoryId = selectedCompany.categoryId || selectedCompany.summary_data.category_id;
      fetchCategory(categoryId);
    }
  }, [selectedCompany, fetchCategory]);

  const {
    searchWithCache: searchAdsWithCache,
    loading: adsSearchLoading,
    data: adsSearchData,
    error: adsSearchError,
    status: adsSearchStatus,
  } = useMKTSearchWithCache();

  const {
    searchWithCache: searchBrandsWithCache,
    loading: brandsSearchLoading,
    data: brandsSearchData,
    error: brandsSearchError,
    status: brandsSearchStatus,
  } = useBrandsSearchWithCache();

  const {
    searchWithCache: searchCompaniesWithCache,
    loading: companiesSearchLoading,
    data: companiesSearchData,
    error: companiesSearchError,
    status: companiesSearchStatus,
  } = useCompaniesSearchWithCache();

  const loading =
    activeTab === "ads"
      ? adsSearchLoading
      : activeTab === "brands"
        ? brandsSearchLoading
        : activeTab === "companies"
          ? companiesSearchLoading
          : false;

  const { refreshFavoriteStatus } = useFavorites();

  useEffect(() => {
    if (activeTab === "ads" && adsSearchStatus === "completed" && adsSearchData) {
      setAdsSearchResults(adsSearchData);
      const resultCount = adsSearchData?.data?.results?.length || 0;
      if (resultCount > 0) {
        toast.success(`Tìm thấy ${resultCount} quảng cáo từ ${adsSearchData.total_available} có sẵn`);
      } else {
        toast.info("Không tìm thấy kết quả");
      }
    } else if (activeTab === "ads" && adsSearchStatus === "error") {
      setAdsSearchResults(null);
      toast.error(adsSearchError || "Tìm kiếm thất bại");
    }
  }, [activeTab, adsSearchStatus, adsSearchData, adsSearchError]);

  useEffect(() => {
    if (activeTab === "brands" && brandsSearchStatus === "completed" && brandsSearchData) {
      setBrandsSearchResults(brandsSearchData);
      const resultCount = brandsSearchData?.data?.results?.length || 0;
      if (resultCount > 0) {
        toast.success(`Tìm thấy ${resultCount} thương hiệu từ ${brandsSearchData.total_available} có sẵn`);
      } else {
        toast.info("Không tìm thấy thương hiệu");
      }
    } else if (activeTab === "brands" && brandsSearchStatus === "error") {
      setBrandsSearchResults(null);
      toast.error(brandsSearchError || "Tìm kiếm thương hiệu thất bại");
    }
  }, [activeTab, brandsSearchStatus, brandsSearchData, brandsSearchError]);

  useEffect(() => {
    if (activeTab === "companies" && companiesSearchStatus === "completed" && companiesSearchData) {
      setCompaniesSearchResults(companiesSearchData);
      const resultCount = companiesSearchData?.data?.results?.length || 0;
      if (resultCount > 0) {
        toast.success(`Tìm thấy ${resultCount} doanh nghiệp từ ${companiesSearchData.total_available} có sẵn`);
      } else {
        toast.info("Không tìm thấy doanh nghiệp");
      }
    } else if (activeTab === "companies" && companiesSearchStatus === "error") {
      setCompaniesSearchResults(null);
      toast.error(companiesSearchError || "Tìm kiếm doanh nghiệp thất bại");
    }
  }, [activeTab, companiesSearchStatus, companiesSearchData, companiesSearchError]);

  const handleTabChange = useCallback((value: string) => {
    const newTab = value as "ads" | "brands" | "companies";
    setActiveTab(newTab);
    if (newTab === "ads") {
      setAdsSearchResults(null);
    } else if (newTab === "brands") {
      setBrandsSearchResults(null);
    } else if (newTab === "companies") {
      setCompaniesSearchResults(null);
    }
  }, []);

  const handleAdsSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      // Check search quota limit: Free (1/day), Personal (20/day), Business (Unlimited)
      if (!checkCanSearch()) {
        return;
      }

      const searchQuery = searchQueryRef.current?.value?.trim();
      if (page === 1) {
        setAdsSearchResults(null)
        // Hide preview when user starts a real search
        setPreviewAds([])
      }

      try {
        const result = await searchAdsWithCache({
          type: "ads",
          searchTerm: searchQuery,
          page: 1,
          limit: 200,
          filters: {
            countryId: parseInt(selectedCountry),
            language: selectedLanguage && selectedLanguage !== "all" ? selectedLanguage : "",
            categoryIds: selectedCategory && selectedCategory !== "0" ? [parseInt(selectedCategory)] : [],
            dateFrom: dateFrom || "",
            dateTo: dateTo || "",
            showVideos: showVideos as "unlisted" | "all" | "public",
            sortProp: sortBy,
            orderAsc: false,
          },
        });

        if (result?.pending) {
          setAdsSearchResults(null);
          consumeSearch();
        } else if (result?.success && result?.data) {
          setAdsSearchResults(result.data);
          consumeSearch();
          const resultCount = result.data?.data?.results?.length || 0;
          if (resultCount > 0) {
            toast.success(`Tìm thấy ${resultCount} quảng cáo từ ${result.data.total_available} có sẵn`);
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
    [searchAdsWithCache, selectedCountry, selectedLanguage, selectedCategory, dateFrom, dateTo, showVideos, sortBy, checkCanSearch, consumeSearch]
  );

  const handleBrandsSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      // Check search quota limit
      if (!checkCanSearch()) {
        return;
      }

      const searchQuery = searchQueryRef.current?.value?.trim();
      if (page === 1) setBrandsSearchResults(null);

      try {
        const result = await searchBrandsWithCache({
          type: "brands",
          searchTerm: searchQuery,
          page: 1,
          limit: 200,
          filters: {
            countryId: parseInt(selectedCountry),
            categoryIds: selectedCategory && selectedCategory !== "0" ? [parseInt(selectedCategory)] : [],
            language: selectedLanguage && selectedLanguage !== "all" ? selectedLanguage : "",
            dateFrom: dateFrom || "",
            dateTo: dateTo || "",
            sortProp: sortBy,
            orderAsc: false,
          },
        });

        if (result?.success) {
          consumeSearch();
          if (result.pending) {
            toast.info("Bắt đầu tìm kiếm thương hiệu, vui lòng đợi...");
          } else {
            setBrandsSearchResults(result.data);
            const resultCount = result.data?.data?.results?.length || 0;
            if (resultCount > 0) {
              toast.success(`Tìm thấy ${resultCount} thương hiệu từ ${result.data.total_available} có sẵn`);
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
    [searchBrandsWithCache, selectedCountry, selectedCategory, sortBy, checkCanSearch, consumeSearch]
  );

  const handleCompaniesSearch = useCallback(
    async (e: React.FormEvent | null, page: number = 1) => {
      if (e) e.preventDefault();

      // Check search quota limit
      if (!checkCanSearch()) {
        return;
      }

      const searchQuery = searchQueryRef.current?.value?.trim();
      if (page === 1) setCompaniesSearchResults(null);

      try {
        const result = await searchCompaniesWithCache({
          type: "companies",
          searchTerm: searchQuery,
          page: 1,
          limit: 200,
          filters: {
            countryId: parseInt(selectedCountry),
            categoryIds: selectedCategory && selectedCategory !== "0" ? [parseInt(selectedCategory)] : [],
            language: selectedLanguage && selectedLanguage !== "all" ? selectedLanguage : "",
            dateFrom: dateFrom || "",
            dateTo: dateTo || "",
            sortProp: sortBy,
            orderAsc: false,
          },
        });

        if (result?.success) {
          consumeSearch();
          if (result.pending) {
            toast.info("Bắt đầu tìm kiếm doanh nghiệp, vui lòng đợi...");
          } else {
            setCompaniesSearchResults(result.data);
            const resultCount = result.data?.data?.results?.length || 0;
            if (resultCount > 0) {
              toast.success(`Tìm thấy ${resultCount} doanh nghiệp từ ${result.data.total_available} có sẵn`);
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
    [searchCompaniesWithCache, selectedCountry, selectedCategory, sortBy, checkCanSearch, consumeSearch]
  );

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

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main className="container py-12">
          <Card className="max-w-md mx-auto border border-slate-200 bg-white shadow-xl rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-6 border border-indigo-100">
                <LogIn className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                Đăng nhập để tìm kiếm Youtube Ads - ADS Spy Tool
              </h3>
              <p className="mb-6 text-sm text-slate-500">
                Bạn cần đăng nhập để sử dụng tính năng tìm kiếm quảng cáo và
                phân tích đối thủ
              </p>
              <Button asChild className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 w-full max-w-[200px] transition-all">
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
    // 📌 Đổi vùng nội dung tìm kiếm thành nền sáng (bg-slate-50, text-slate-900)
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Header />

      {/* Hero Section Slider giữ nguyên nền đen để nổi bật */}
      <HeroSlider />

      <main className="container px-4 md:px-6 lg:px-8 py-8 relative z-20">
        <div className="grid gap-8 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)] items-start">

          {/* Cột bộ lọc - Theme sáng tối ưu UI/UX */}
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <AdsSpyFilterPanel
              title="Bộ lọc Ads"
              activeCount={activeFilterCount}
              onClear={handleClearAllFilters}
            >
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
            </AdsSpyFilterPanel>
          </div>

          {/* Cột nội dung chính - Theme sáng */}
          <div className="min-w-0">
            {/* Search Quota Indicator */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <SearchQuotaBadge quota={quota} onUpgradeClick={openUpgradeModal} />
            </div>

            <form
              onSubmit={handleSearch}
              className="mb-6 flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  ref={searchQueryRef}
                  placeholder="Tìm kiếm bằng từ khóa, URL hoặc tên thương hiệu..."
                  className="pl-12 h-12 bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl shadow-xs transition-all text-sm"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto shrink-0 h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 cursor-pointer transition-all font-semibold">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Đang quét...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Tìm kiếm
                  </>
                )}
              </Button>
            </form>

            <div className="w-full">
              <AdsSpyResultsToolbar
                title="Thư viện quảng cáo YouTube"
                subtitle="Theo dõi và Nghiên cứu các video ads đang chạy trên YouTube toàn cầu"
                count={activeTab === "ads" ? adsPagination.totalItems : activeTab === "brands" ? brandsPagination.totalItems : companiesPagination.totalItems}
                activeChips={activeChips}
                onClearAll={handleClearAllFilters}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sắp xếp:</span>
                  <div className="w-36 sm:w-40">
                    <SortSelect value={sortBy} onValueChange={(val: any) => setSortBy(val)} />
                  </div>
                </div>
              </AdsSpyResultsToolbar>

              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full mt-4"
              >
                <TabsList className="mb-6 grid w-full grid-cols-3 sm:inline-flex sm:w-auto bg-slate-100/90 border border-slate-200 p-1.5 rounded-xl gap-1">
                  <TabsTrigger value="ads" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-600 font-semibold transition-all px-2 sm:px-4 py-2 text-center truncate">
                    Quảng cáo
                  </TabsTrigger>
                  <TabsTrigger value="brands" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-600 font-semibold transition-all px-2 sm:px-4 py-2 text-center truncate">
                    Thương hiệu
                  </TabsTrigger>
                  <TabsTrigger value="companies" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-600 font-semibold transition-all px-2 sm:px-4 py-2 text-center truncate">
                    Doanh nghiệp
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ads" className="space-y-4">
                  <SearchLoadingState
                    isSearching={loading}
                    isPending={activeTab === "ads" && adsSearchStatus === "pending"}
                    searchType="ads"
                    className="mb-6"
                  />

                  {adsSearchResults ? (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 whitespace-nowrap">
                          Kết quả tìm kiếm
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 shrink-0 font-medium">
                          {adsPagination.totalItems} kết quả
                        </p>
                      </div>

                      {adsPagination.totalItems > 0 ? (
                        <>
                          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  ) : previewLoading ? (
                    // Skeleton loading for preview while initial cache is fetched
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-48 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="h-5 w-16 bg-indigo-100 rounded-full animate-pulse" />
                      </div>
                      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="aspect-video bg-slate-100 animate-pulse" />
                            <div className="p-4 space-y-2">
                              <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : previewAds.length > 0 ? (
                    // Preview section — shown before any search, sourced from cache
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg sm:text-xl font-bold text-slate-900 whitespace-nowrap">Khám phá quảng cáo</h2>
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 shrink-0">
                            <TrendingUp className="h-3 w-3" />
                            Mới nhất
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 shrink-0 font-medium">{previewAds.length} quảng cáo</p>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 -mt-3">
                        💡 Dữ liệu từ thư viện cache — Nhập từ khóa để tìm kiếm theo nhu cầu
                      </p>
                      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {previewAds.map((video: any, index: number) => (
                          <VideoCard
                            key={video.ytVideoId || `preview-${index}`}
                            {...video}
                            onClick={() => setSelectedVideo(video)}
                            onCompanyClick={() => handleOpenBrandModal(video.brandId)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <NoDataDisplay type="ads" hasSearched={false} />
                  )}
                </TabsContent>

                <TabsContent value="brands" className="space-y-4">
                  <SearchLoadingState isSearching={loading} isPending={activeTab === "brands" && brandsSearchStatus === "pending"} searchType="brands" className="mb-6" />
                  {brandsSearchResults ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Kết quả tìm kiếm</h2>
                        <p className="text-sm text-slate-500">{brandsPagination.totalItems} kết quả</p>
                      </div>
                      {brandsPagination.totalItems > 0 ? (
                        <>
                          <div className="grid gap-5 md:grid-cols-2 grid-cols-1 lg:grid-cols-3">
                            {brandsPagination.currentItems.map((brand: any, index: number) => (
                              <BrandCard key={brand.brandId || `brand-${index}`} brandId={brand.brandId?.toString() || `brand-${index}`} name={brand.name || `Brand ${index + 1}`} description={brand.description || "Không có mô tả"} logo={brand.thumbnail || "/placeholder.svg"} totalAds={brand.summary_data?.total_spend || brand.totalSpend || 0} totalViews={String(brand.summary_data?.total_views || brand.totalViews || 0)} activeMonths={Math.ceil((brand.summary_data?.spend_365 || 0) / 30) || 1} totalSpend={brand.summary_data?.total_spend || brand.totalSpend || 0} summaryDate={brand.summary_data?.summary_date} onClick={() => setSelectedBrand(brand)} />
                            ))}
                          </div>
                          <FrontendPagination currentPage={brandsPagination.currentPage} totalPages={brandsPagination.totalPages} totalItems={brandsPagination.totalItems} itemsPerPage={20} hasNextPage={brandsPagination.hasNextPage} hasPrevPage={brandsPagination.hasPrevPage} onNextPage={brandsPagination.nextPage} onPrevPage={brandsPagination.prevPage} onGoToPage={brandsPagination.goToPage} className="mt-8" />
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
                  <SearchLoadingState isSearching={loading} isPending={activeTab === "companies" && companiesSearchStatus === "pending"} searchType="companies" className="mb-6" />
                  {companiesSearchResults ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Kết quả tìm kiếm</h2>
                        <p className="text-sm text-slate-500">{companiesPagination.totalItems} kết quả</p>
                      </div>
                      {companiesPagination.totalItems > 0 ? (
                        <>
                          <div className="grid gap-5 md:grid-cols-2 grid-cols-1 lg:grid-cols-3">
                            {companiesPagination.currentItems.map((company: any, index: number) => (
                              <CompanyCard key={company.companyId || `company-${index}`} name={company.legalName || company.summary_data?.legal_name || "Tên không xác định"} description={`Doanh nghiệp ${company.isAffiliate ? "Affiliate" : "Marketing"} - ID: ${company.companyId}`} totalBrands={1} markets={[`Quốc gia ID: ${company.countryId || company.summary_data?.country_id || "N/A"}`]} estimatedSpend={`$${((company.summary_data?.total_spend || company.totalSpend || 0) / 1000000).toFixed(1)}M`} totalSpend={Math.floor(company.summary_data?.total_spend || company.totalSpend || 0)} summaryDate={company.summary_data?.summary_date} onClick={() => setSelectedCompany(company)} companyId={company.companyId?.toString() || ""} isAffiliate={company.isAffiliate || false} totalVideos={Math.floor(company.summary_data?.total_views || 0)} />
                            ))}
                          </div>
                          <FrontendPagination currentPage={companiesPagination.currentPage} totalPages={companiesPagination.totalPages} totalItems={companiesPagination.totalItems} itemsPerPage={20} hasNextPage={companiesPagination.hasNextPage} hasPrevPage={companiesPagination.hasPrevPage} onNextPage={companiesPagination.nextPage} onPrevPage={companiesPagination.prevPage} onGoToPage={companiesPagination.goToPage} className="mt-8" />
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

              {adsSearchError && (
                <Card className="p-8 text-center border-red-200 bg-red-50 mt-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-2 text-red-600">
                    Lỗi tìm kiếm
                  </h3>
                  <p className="text-red-500/80 mb-4">{adsSearchError}</p>
                  <Button onClick={() => handleSearch(null)} variant="outline" className="border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700">
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
          ytVideoId: selectedVideo?.ytVideoId || selectedVideo?.videoId || "",
          brandId: selectedVideo?.brandId,
          landingPage: (selectedVideo as any)?.landingPage || ((selectedVideo as any)?.clickUrls && (selectedVideo as any).clickUrls[0]),
          clickUrls: (selectedVideo as any)?.clickUrls,
          transcript: (selectedVideo as any)?.transcript
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

      {/* Upgrade Modal on Limit Reached */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        quota={quota}
      />

      <footer className="border-t border-slate-200 py-8 mt-12 bg-white">
        <div className="container text-center text-sm text-slate-500">
          <p>© 2026 Ads Spy Tool. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  );
}