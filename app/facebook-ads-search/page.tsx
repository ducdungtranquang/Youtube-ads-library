"use client";

import { useState, useCallback, useRef, useMemo, memo, useEffect } from "react";
import Image from "next/image";
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
    description: "Khóa học thực chiến từ cơ bản đến nâng cao trên Gotihi. Áp dụng ngay để vít ads ra đơn.",
    buttonText: "Đăng Ký Khóa Học Gotihi",
    buttonHref: "https://shorten.asia/TY1pP1AR",
    image: "/gitiho.png",
    alt: "Gotihi Online Courses"
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
      executeSearch();
    }
  }, [currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage === 1) {
      executeSearch();
    } else {
      setCurrentPage(1);
    }
  };

  const executeSearch = async () => {
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
                Đăng nhập để tìm kiếm Facebook Ads
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
        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] items-start">

          {/* Vùng chứa bộ lọc - Chuyển sang Light Theme */}
          <div className="lg:sticky top-24 max-h-[calc(100vh-3rem)] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5">
              <AdsSpyFilterPanel
                title="Bộ lọc"
                onClear={() => {
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
                }}
              >
                <div className="flex flex-col gap-3 mt-4">
                  <div className="space-y-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-700">Quốc gia / Nền tảng hiển thị</label>
                    <Input
                      type="text"
                      placeholder="Ví dụ: VN, US, IG..."
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="h-9 text-sm bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-500 shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-700">Cấp độ Quảng cáo</label>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger className="w-full h-9 text-sm bg-white border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50">
                        <SelectValue placeholder="Tất cả cấp độ" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg">
                        {LEVEL_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="focus:bg-slate-100 cursor-pointer">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="space-y-1.5 w-full">
                      <label className="text-xs font-semibold text-slate-700">Điểm tối thiểu</label>
                      <Input
                        type="number"
                        placeholder="VD: 7"
                        value={minScore}
                        onChange={(e) => setMinScore(e.target.value)}
                        className="h-9 text-sm bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-500 shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5 w-full">
                      <label className="text-xs font-semibold text-slate-700">Điểm tối đa</label>
                      <Input
                        type="number"
                        placeholder="VD: 25"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        className="h-9 text-sm bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-700">Từ ngày</label>
                    <Input
                      type="date"
                      value={publicDateFrom}
                      onChange={(e) => setPublicDateFrom(e.target.value)}
                      className="w-full h-9 text-sm bg-white border-slate-200 text-slate-900 shadow-sm focus-visible:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-700">Đến ngày</label>
                    <Input
                      type="date"
                      value={publicDateTo}
                      onChange={(e) => setPublicDateTo(e.target.value)}
                      className="w-full h-9 text-sm bg-white border-slate-200 text-slate-900 shadow-sm focus-visible:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-700">Mức chi tiêu</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal whitespace-normal h-auto text-left py-2 text-sm bg-white border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50">
                          {selectedSpends.length > 0
                            ? selectedSpends.map(s => ESTIMATED_SPEND_OPTIONS[s as keyof typeof ESTIMATED_SPEND_OPTIONS]).join(', ')
                            : "Chọn mức chi tiêu"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full bg-white border-slate-200 text-slate-900 shadow-lg">
                        {Object.entries(ESTIMATED_SPEND_OPTIONS).map(([value, label]) => (
                          <div key={value} className="flex items-center p-2 hover:bg-slate-50 rounded-md">
                            <Checkbox
                              id={`spend-${value}`}
                              checked={selectedSpends.includes(value)}
                              onCheckedChange={(checked) => {
                                setSelectedSpends(
                                  checked
                                    ? [...selectedSpends, value]
                                    : selectedSpends.filter((v) => v !== value)
                                );
                              }}
                              className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                            />
                            <label htmlFor={`spend-${value}`} className="ml-2 text-sm cursor-pointer w-full">
                              {label}
                            </label>
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-700">Điểm xu hướng từ</label>
                    <Input
                      type="number"
                      placeholder="Ví dụ: 80"
                      value={minTrendingScore}
                      onChange={(e) => setMinTrendingScore(e.target.value)}
                      className="h-9 text-sm bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-500 shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-700">Phễu Marketing (Funnel)</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal whitespace-normal h-auto text-left py-2 text-sm bg-white border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50">
                          {selectedFunnels.length > 0
                            ? selectedFunnels.map(f => FUNNEL_OPTIONS[f as keyof typeof FUNNEL_OPTIONS]).join(', ')
                            : "Chọn phễu"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full bg-white border-slate-200 text-slate-900 shadow-lg">
                        {Object.entries(FUNNEL_OPTIONS).map(([value, label]) => (
                          <div key={value} className="flex items-center p-2 hover:bg-slate-50 rounded-md">
                            <Checkbox
                              id={`funnel-${value}`}
                              checked={selectedFunnels.includes(value)}
                              onCheckedChange={(checked) => {
                                setSelectedFunnels(
                                  checked
                                    ? [...selectedFunnels, value]
                                    : selectedFunnels.filter((v) => v !== value)
                                );
                              }}
                              className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                            />
                            <label htmlFor={`funnel-${value}`} className="ml-2 text-sm cursor-pointer w-full">{label}</label>
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-700">Mức độ Scaling</label>
                    <Select value={scalingLevel} onValueChange={setScalingLevel}>
                      <SelectTrigger className="w-full h-9 text-sm bg-white border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-lg">
                        {SCALING_LEVEL_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="focus:bg-slate-100 cursor-pointer">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AdsSpyFilterPanel>
            </div>
          </div>

          <div className="min-w-0">
            {/* Search Bar - Light Theme */}
            <form onSubmit={handleSearchSubmit} className="mb-6 flex md:flex-row gap-3 flex-col">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  ref={searchQueryRef}
                  placeholder="Tìm kiếm bằng từ khóa Ads, tên Page, hoặc nội dung bài viết ..."
                  className="pl-12 h-12 bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl shadow-sm transition-all"
                />
              </div>
              <Button type="submit" disabled={loading} className="mobile:w-full h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 cursor-pointer transition-all">
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
              <AdsSpyResultsToolbar title="Kết quả Facebook Ads" count={results.length} />
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                </div>
              ) : (
                <div className="mt-6">
                  {results.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/80 shadow-sm mt-4">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                          <Search className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-900">Không tìm thấy dữ liệu</h3>
                          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                            Không tìm thấy dữ liệu nào phù hợp với điều kiện tìm kiếm của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa.
                          </p>
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

      <footer className="border-t border-slate-200 py-8 mt-12 bg-white">
        <div className="container text-center text-sm text-slate-500">
          <p>© 2026 Ads Spy Tool. Dữ liệu phân tích quảng cáo chuyên sâu.</p>
        </div>
      </footer>
    </div>
  );
}