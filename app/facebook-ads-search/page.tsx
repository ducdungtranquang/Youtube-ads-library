"use client";

import { useState, useCallback, useRef, useMemo, memo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { useFacebookAdsSearch } from "@/hooks/use-facebook-search";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FacebookAdCard } from "@/components/facebook-ad-card";
import { FacebookAdDetailModal } from "@/components/facebook-ad-detail-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Sparkles, ArrowRight, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { AdsSpyFilterPanel } from "@/components/ads-spy/ads-spy-filter-panel";
import { AdsSpyResultsToolbar } from "@/components/ads-spy/ads-spy-results-toolbar";
import { FacebookAdsFilters } from "@/components/ads-spy/facebook-ads-filters";
import { useSearchQuota } from "@/hooks/use-search-quota";
import { SearchQuotaBadge } from "@/components/search-quota-badge";
import { UpgradeModal } from "@/components/upgrade-modal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const LEVEL_OPTIONS = [
  { value: "🔥 WINNER", label: "🔥 WINNER Ads (Sản phẩm Thắng lớn)" },
  { value: "⚡ GOOD", label: "⚡ GOOD Ads (Tiềm năng cao)" },
  { value: "LOW", label: "LOW Ads (Chạy thông thường)" },
];

const ESTIMATED_SPEND_OPTIONS = {
  LOW: "Thấp (Low)",
  MEDIUM: "Trung bình (Medium)",
  HIGH: "Cao (High)",
  VERY_HIGH: "Rất cao (Very High)",
};

const FUNNEL_OPTIONS = {
  TOF: "TOF - Top of Funnel",
  MOF: "MOF - Middle of Funnel",
  BOF: "BOF - Bottom of Funnel",
};

const SCALING_LEVEL_OPTIONS = [
  { value: "LOW", label: "Scaling thấp" },
  { value: "MEDIUM", label: "Scaling trung bình" },
  { value: "HIGH", label: "Scaling cao" },
];

// 📌 Banners & Slogans
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
                  {/* Cột chữ (Slogan) */}
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

                  {/* Cột ảnh (Banner) */}
                  <div className="flex-1 w-full max-w-md relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-indigo-950/50 group">
                    <div className="aspect-video w-full bg-slate-900 relative">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-fit transition-transform duration-500 group-hover:scale-105"
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

        {/* Indicator dots */}
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

export default function FacebookAdsPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    quota,
    checkCanSearch,
    consumeSearch,
    isUpgradeModalOpen,
    openUpgradeModal,
    closeUpgradeModal,
  } = useSearchQuota('fb');

  const searchQueryRef = useRef<HTMLInputElement>(null);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [publicDateFrom, setPublicDateFrom] = useState("");
  const [publicDateTo, setPublicDateTo] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSpends, setSelectedSpends] = useState<string[]>([]);
  const [minTrendingScore, setMinTrendingScore] = useState("");
  const [selectedFunnels, setSelectedFunnels] = useState<string[]>([]);
  const [scalingLevel, setScalingLevel] = useState("");

  const handleClearAllFilters = useCallback(() => {
    setSelectedCountry("");
    setPublicDateFrom("");
    setPublicDateTo("");
    setMinScore("");
    setMaxScore("");
    setSelectedLevel("");
    setSelectedSpends([]);
    setMinTrendingScore("");
    setSelectedFunnels([]);
    setScalingLevel("");
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCountry) count++;
    if (selectedLevel) count++;
    if (minScore || maxScore) count++;
    if (publicDateFrom || publicDateTo) count++;
    if (selectedSpends.length > 0) count++;
    if (minTrendingScore) count++;
    if (selectedFunnels.length > 0) count++;
    if (scalingLevel) count++;
    return count;
  }, [
    selectedCountry,
    selectedLevel,
    minScore,
    maxScore,
    publicDateFrom,
    publicDateTo,
    selectedSpends,
    minTrendingScore,
    selectedFunnels,
    scalingLevel,
  ]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (selectedCountry) {
      chips.push({ id: "country", label: `Quốc gia: ${selectedCountry}`, onRemove: () => setSelectedCountry("") });
    }
    if (selectedLevel) {
      chips.push({ id: "level", label: selectedLevel, onRemove: () => setSelectedLevel("") });
    }
    if (scalingLevel) {
      chips.push({ id: "scaling", label: `Scale: ${scalingLevel}`, onRemove: () => setScalingLevel("") });
    }
    if (selectedSpends.length > 0) {
      chips.push({ id: "spend", label: `Spend: ${selectedSpends.join(", ")}`, onRemove: () => setSelectedSpends([]) });
    }
    if (selectedFunnels.length > 0) {
      chips.push({ id: "funnel", label: `Phễu: ${selectedFunnels.join(", ")}`, onRemove: () => setSelectedFunnels([]) });
    }
    if (minScore || maxScore) {
      chips.push({ id: "score", label: `Điểm: ${minScore || 0} - ${maxScore || "max"}`, onRemove: () => { setMinScore(""); setMaxScore(""); } });
    }
    if (publicDateFrom || publicDateTo) {
      chips.push({ id: "date", label: `Ngày: ${publicDateFrom || "..."} → ${publicDateTo || "..."}`, onRemove: () => { setPublicDateFrom(""); setPublicDateTo(""); } });
    }
    if (minTrendingScore) {
      chips.push({ id: "trending", label: `Trending ≥ ${minTrendingScore}`, onRemove: () => setMinTrendingScore("") });
    }
    return chips;
  }, [
    selectedCountry,
    selectedLevel,
    scalingLevel,
    selectedSpends,
    selectedFunnels,
    minScore,
    maxScore,
    publicDateFrom,
    publicDateTo,
    minTrendingScore,
  ]);

  const { searchFacebookAds, loading, error, data } = useFacebookAdsSearch();

  const [results, setResults] = useState<any[]>([]);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const normalizeAdForModal = (ad: any) => {
    const imageItem = ad?.images?.[0];
    const videoItem = ad?.videos?.[0];
    const mediaUrl =
      imageItem?.resized_image_url ||
      imageItem?.original_image_url ||
      imageItem?.watermarked_resized_image_url ||
      videoItem?.video_hd_url ||
      videoItem?.video_sd_url;
    const mediaType = videoItem?.video_hd_url || videoItem?.video_sd_url ? "video" : "image";
    const attachment = mediaUrl
      ? [{
        media_url: mediaUrl,
        media_poster_url: imageItem?.resized_image_url || imageItem?.original_image_url || undefined,
        media_url_type: mediaType,
        title: ad?.text?.split(/\n/)[0]?.trim() || ad?.page_name || "Facebook Ad",
        description: ad?.text || ad?.description || "",
      }]
      : [];

    return {
      ...ad,
      page_name: ad?.page_name || "Facebook Ad",
      page_profile_image_url: ad?.page_profile_image_url,
      text: ad?.text || ad?.description || "",
      link: ad?.link || ad?.link_url || null,
      attachments: attachment,
      snapshot: {
        ...(ad?.snapshot || {}),
        page_name: ad?.page_name || "Facebook Ad",
        page_profile_picture_url: ad?.page_profile_image_url,
        title: ad?.text?.split(/\n/)[0]?.trim() || ad?.page_name || "Facebook Ad",
        body: { text: ad?.text || ad?.description || "" },
        link_url: ad?.link || ad?.link_url || null,
        videos: ad?.videos || [],
        cards: attachment,
      },
    };
  };

  const handleAdClick = async (ad: any) => {
    const itemId = ad?.ad_archive_id || ad?._id || ad?.id;
    const normalizedAd = normalizeAdForModal(ad);

    setSelectedAd(normalizedAd);
    setModalOpen(true);
    setDetailLoading(Boolean(itemId));

    if (!itemId) {
      setDetailLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/ads/detail/${encodeURIComponent(itemId)}`);
      const result = await res.json();
      const detailAd = result?.success ? result.data : ad;
      setSelectedAd(normalizeAdForModal(detailAd || ad));
    } catch (err) {
      console.error("Lỗi gọi API chi tiết Facebook Ad:", err);
      setSelectedAd(normalizedAd);
    } finally {
      setDetailLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (user) {
      // Pass isInitialLoad = true so initial feed display on mount does not deduct quota
      executeSearch(true);
    }
  }, [currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Chức năng Facebook Ads sẽ chính thức ra mắt vào ngày 01/11/2026. Mời bạn trải nghiệm YouTube Ads trong thời gian này nhé!");
  };

  const executeSearch = async (isInitialLoad: boolean = false) => {
    if (!isInitialLoad && !checkCanSearch()) {
      return;
    }

    const params = new URLSearchParams();
    params.append("page", currentPage.toString());
    params.append("limit", itemsPerPage.toString());

    if (searchQueryRef.current?.value) params.append("text", searchQueryRef.current.value);
    if (selectedCountry) params.append("country", selectedCountry);
    if (publicDateFrom) params.append("date_from", publicDateFrom);
    if (publicDateTo) params.append("date_to", publicDateTo);
    if (minScore) params.append("min_score", minScore);
    if (maxScore) params.append("max_score", maxScore);
    if (selectedLevel) params.append("level", selectedLevel);

    if (selectedSpends.length > 0) params.append("estimated_spend", selectedSpends.join(","));
    if (minTrendingScore) params.append("min_trending_score", minTrendingScore);
    if (selectedFunnels.length > 0) params.append("funnel", selectedFunnels.join(","));
    if (scalingLevel) params.append("scaling_level", scalingLevel);

    try {
      const result = await searchFacebookAds({ queryString: params.toString() });

      if (result?.success) {
        setResults(result.data || []);
        if (!isInitialLoad) {
          consumeSearch();
        }
        if (result.pagination) {
          setTotalPages(result.pagination.pages || 1);
        }
      } else {
        setResults([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Lỗi gọi kết nối search API:", err);
      setResults([]);
    }
  };

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
                Đăng nhập để tìm kiếm Facebook Ads - ADS Spy Tool
              </h3>
              <p className="mb-6 text-sm text-slate-500">
                Bạn cần đăng nhập để sử dụng tính năng tìm kiếm quảng cáo Facebook.
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
    // 📌 Chuyển vùng nội dung sang Light Theme
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Header />

      {/* Hero Section */}
      <HeroSlider />

      <main className="container px-4 md:px-6 lg:px-8 py-8 relative z-20">
        <div className="grid gap-8 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)] items-start">

          {/* Vùng chứa bộ lọc - Chuyển sang Light Theme tối ưu UI/UX */}
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <AdsSpyFilterPanel
              title="Bộ lọc Facebook Ads"
              activeCount={activeFilterCount}
              onClear={handleClearAllFilters}
            >
              <FacebookAdsFilters
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                publicDateFrom={publicDateFrom}
                setPublicDateFrom={setPublicDateFrom}
                publicDateTo={publicDateTo}
                setPublicDateTo={setPublicDateTo}
                minScore={minScore}
                setMinScore={setMinScore}
                maxScore={maxScore}
                setMaxScore={setMaxScore}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                selectedSpends={selectedSpends}
                setSelectedSpends={setSelectedSpends}
                minTrendingScore={minTrendingScore}
                setMinTrendingScore={setMinTrendingScore}
                selectedFunnels={selectedFunnels}
                setSelectedFunnels={setSelectedFunnels}
                scalingLevel={scalingLevel}
                setScalingLevel={setScalingLevel}
              />
            </AdsSpyFilterPanel>
          </div>

          <div className="min-w-0">
            {/* Search Quota Badge */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <SearchQuotaBadge quota={quota} onUpgradeClick={openUpgradeModal} />
            </div>

            {/* Launch Announcement Banner */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200/90 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                        Chức năng Facebook Ads sẽ chính thức ra mắt vào ngày 01/11/2026
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-2xs">
                        🚀 Sắp Ra Mắt
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Hệ thống đang được đội ngũ kỹ sư kết nối kho dữ liệu quảng cáo Facebook & Instagram toàn cầu. Mời bạn trải nghiệm trước tính năng Thư Viện YouTube Ads.
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs font-semibold h-10 px-4 cursor-pointer">
                  <Link href="/mkt">
                    <span>Xem YouTube Ads</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Search Bar - Light Theme */}
            <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  ref={searchQueryRef}
                  placeholder="Tìm kiếm bằng từ khóa Ads, tên Page, hoặc nội dung bài viết ..."
                  className="pl-12 h-12 bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl shadow-xs transition-all text-sm"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto shrink-0 h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 cursor-pointer transition-all font-semibold">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Đang tìm kiếm...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Tìm kiếm
                  </>
                )}
              </Button>
            </form>

            {/* Results Container Section */}
            <section>
              <AdsSpyResultsToolbar
                title="Thư viện quảng cáo Facebook"
                subtitle="Khám phá và Nghiên cứu các chiến dịch quảng cáo Facebook & Instagram toàn cầu"
                count={results.length}
                activeChips={activeChips}
                onClearAll={handleClearAllFilters}
              />
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                </div>
              ) : (
                <div className="mt-6">
                  {results.length === 0 ? (
                    <Card className="overflow-hidden border border-indigo-200/80 bg-gradient-to-b from-white via-slate-50/50 to-indigo-50/20 shadow-xl shadow-indigo-500/5 rounded-3xl mt-4">
                      <div className="p-8 sm:p-12 text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-5">
                          <Sparkles className="h-4 w-4" />
                          Hẹn Ngày Ra Mắt Chính Thức: 01/11/2026
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                          Tính Năng Facebook Ads Spy Sắp Xuất Hiện
                        </h3>

                        <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                          Chức năng này sẽ được <strong>ra mắt chính thức vào ngày 01/11/2026</strong>. Đội ngũ kỹ sư đang hoàn thiện hạ tầng dữ liệu để mang tới cho bạn khả năng soi ngân sách, kịch bản video và sản phẩm win trên Facebook & Instagram Ads.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8 text-left">
                          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2">
                              50k+
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Mẫu Ads mới/ngày</h4>
                            <p className="text-[11px] text-slate-500 mt-1">Cập nhật liên tục từ thị trường US, VN, SEA</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mb-2">
                              🎯
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Bộ lọc WINNER Ads</h4>
                            <p className="text-[11px] text-slate-500 mt-1">Phát hiện camp vít ngân sách lớn, scaling mạnh</p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm mb-2">
                              📊
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Ước tính Spend & Reach</h4>
                            <p className="text-[11px] text-slate-500 mt-1">Đo lường ngân sách chi tiêu và ngày chạy</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <Button asChild size="lg" className="w-full sm:w-auto h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg shadow-indigo-600/25 cursor-pointer">
                            <Link href="/mkt">
                              <span>Trải nghiệm Thư viện YouTube Ads</span>
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 rounded-xl border-slate-300 font-semibold hover:bg-slate-100 cursor-pointer">
                            <Link href="/quicksearch">
                              Dùng thử QuickSearch
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {results.map((ad, idx) => (
                        <FacebookAdCard
                          key={ad.ad_archive_id || ad._id || ad.id || idx}
                          ad={ad}
                          onClick={() => handleAdClick(ad)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Server-Side Pagination Controller - Light Theme */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="cursor-pointer bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Trang trước
                      </Button>
                      <span className="text-sm font-medium text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-md shadow-sm">
                        Trang {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="cursor-pointer bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Trang sau
                      </Button>
                    </div>
                  )}

                  {/* Detail Info Modal View */}
                  {selectedAd && (
                    <FacebookAdDetailModal
                      open={modalOpen}
                      onOpenChange={(open) => {
                        setModalOpen(open);
                        if (!open) {
                          setSelectedAd(null);
                          setDetailLoading(false);
                        }
                      }}
                      ad={selectedAd}
                      loading={detailLoading}
                    />
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Upgrade Modal on Quota Exceeded */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        quota={quota}
      />

      <footer className="border-t border-slate-200 py-8 mt-12 bg-white">
        <div className="container text-center text-sm text-slate-500">
          <p>© 2026 Ads Spy Tool. Dữ liệu phân tích quảng cáo chuyên sâu.</p>
        </div>
      </footer>
    </div>
  );
}