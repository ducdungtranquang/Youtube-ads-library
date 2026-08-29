"use client";

import { useState, useRef, useEffect, memo } from "react";
import { useFacebookAdsSearch } from "@/hooks/use-facebook-search";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
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
import { Search, Loader2, Sparkles, ArrowRight } from "lucide-react";
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

const heroSlides = [
  {
    badge: "Facebook Ads Spy Tool",
    title: "Tìm kiếm Facebook Ads",
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
                        className="rounded-full gap-2 bg-white text-indigo-900 hover:bg-white/90 shadow-md transition-all hover:scale-105 cursor-pointer"
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
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${current === idx ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
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

  // Các state lưu bộ lọc tương thích trực tiếp với searchApi mới
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

  // Quản lý Phân trang (Đã đồng bộ trực tiếp Server-side Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Trigger tìm kiếm lại khi bấm nút chuyển trang (Pagination)
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
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Card className="max-w-md mx-auto border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Đăng nhập để tìm kiếm Facebook Ads
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Bạn cần đăng nhập để sử dụng tính năng tìm kiếm quảng cáo Facebook.
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

      {/* Hero Section */}
      <HeroSlider />

      <main className="container px-4 py-8 relative z-20">
        {/* Thu hẹp cột bộ lọc xuống 250px và thêm items-start để sticky hoạt động */}
        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] items-start">

          {/* Vùng chứa bộ lọc - Thêm class sticky */}
          <div className="sticky top-24 max-h-[calc(100vh-3rem)] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
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
              {/* Giảm gap từ 5 xuống 3 để nhỏ gọn hơn */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Quốc gia / Nền tảng hiển thị</label>
                  <Input
                    type="text"
                    placeholder="Ví dụ: VN, US, IG..."
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Cấp độ Quảng cáo</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue placeholder="Tất cả cấp độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVEL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Điểm số thấp nhất</label>
                  <Input
                    type="number"
                    placeholder="Ví dụ: 7"
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Điểm số cao nhất</label>
                  <Input
                    type="number"
                    placeholder="Ví dụ: 25"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Từ ngày</label>
                  <Input
                    type="date"
                    value={publicDateFrom}
                    onChange={(e) => setPublicDateFrom(e.target.value)}
                    className="w-full h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Đến ngày</label>
                  <Input
                    type="date"
                    value={publicDateTo}
                    onChange={(e) => setPublicDateTo(e.target.value)}
                    className="w-full h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Mức chi tiêu</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal whitespace-normal h-auto text-left py-2 text-sm">
                        {selectedSpends.length > 0
                          ? selectedSpends.map(s => ESTIMATED_SPEND_OPTIONS[s as keyof typeof ESTIMATED_SPEND_OPTIONS]).join(', ')
                          : "Chọn mức chi tiêu"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {Object.entries(ESTIMATED_SPEND_OPTIONS).map(([value, label]) => (
                        <div key={value} className="flex items-center p-2">
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
                          />
                          <label htmlFor={`spend-${value}`} className="ml-2 text-sm cursor-pointer">
                            {label}
                          </label>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Điểm xu hướng từ</label>
                  <Input
                    type="number"
                    placeholder="Ví dụ: 80"
                    value={minTrendingScore}
                    onChange={(e) => setMinTrendingScore(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Phễu Marketing (Funnel)</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal whitespace-normal h-auto text-left py-2 text-sm">
                        {selectedFunnels.length > 0
                          ? selectedFunnels.map(f => FUNNEL_OPTIONS[f as keyof typeof FUNNEL_OPTIONS]).join(', ')
                          : "Chọn phễu"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {Object.entries(FUNNEL_OPTIONS).map(([value, label]) => (
                        <div key={value} className="flex items-center p-2">
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
                          />
                          <label htmlFor={`funnel-${value}`} className="ml-2 text-sm cursor-pointer">{label}</label>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium">Mức độ Scaling</label>
                  <Select value={scalingLevel} onValueChange={setScalingLevel}>
                    <SelectTrigger className="w-full h-9 text-sm">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCALING_LEVEL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AdsSpyFilterPanel>
          </div>

          <div className="min-w-0">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-6 flex md:flex-row gap-2 flex-col">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchQueryRef}
                  placeholder="Tìm kiếm bằng từ khóa Ads, tên Page, hoặc nội dung bài viết ..."
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

            {/* Results Container Section */}
            <section>
              <AdsSpyResultsToolbar title="Kết quả Facebook Ads" count={results.length} />
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div>
                  {results.length === 0 ? (
                    <Card className="p-8 text-center border-2 mt-4">
                      <CardTitle className="mb-4">Không tìm thấy dữ liệu kết quả</CardTitle>
                      <CardContent className="text-muted-foreground">
                        Không tìm thấy dữ liệu nào phù hợp với mốc điều kiện tìm kiếm của bạn.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                      {results.map((ad, idx) => (
                        <FacebookAdCard
                          key={ad.ad_archive_id || ad._id || ad.id || idx}
                          ad={ad}
                          onClick={() => handleAdClick(ad)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Server-Side Pagination Controller */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="cursor-pointer"
                      >
                        Trang trước
                      </Button>
                      <span className="text-sm font-medium text-muted-foreground">
                        Trang {currentPage} trên tổng {totalPages}
                      </span>
                      <Button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="cursor-pointer"
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

      <footer className="border-t border-border/40 py-8 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Ads Spy Tool. Dữ liệu phân tích quảng cáo.</p>
        </div>
      </footer>
    </div>
  );
}