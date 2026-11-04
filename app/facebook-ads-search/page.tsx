"use client";

import { useState, useCallback, useRef, useMemo, memo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import {
  Search,
  Loader2,
  Sparkles,
  ArrowRight,
  LogIn,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import { AdsSpyFilterPanel } from "@/components/ads-spy/ads-spy-filter-panel";
import { AdsSpyResultsToolbar } from "@/components/ads-spy/ads-spy-results-toolbar";
import { FacebookAdsFilters } from "@/components/ads-spy/facebook-ads-filters";
import { PresetTabs } from "@/components/ads-spy/preset-tabs";
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
import { getIndustryLabel } from "@/lib/constants/industries";

const SORT_OPTIONS = [
  { value: "start_date", label: "📅 Mới xuất bản nhất" },
  { value: "scaling_score", label: "🚀 Điểm Scaling (Vít mạnh)" },
  { value: "duplicates_count", label: "👥 Nhiều bản sao nhất (Duplicates)" },
  { value: "duration_days", label: "⏳ Chạy lâu nhất (Duration)" },
  { value: "estimated_spend_usd", label: "💰 Chi tiêu ước tính cao nhất" },
  { value: "estimated_reach", label: "👁️ Lượt tiếp cận ước tính" },
  { value: "seen_count", label: "🎯 Lượt quét thấy (Seen count)" },
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
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <FacebookAdsSearchContent />
    </Suspense>
  );
}

function FacebookAdsSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { user, loading: authLoading } = useAuth();
  const {
    quota,
    checkCanSearch,
    consumeSearch,
    isUpgradeModalOpen,
    openUpgradeModal,
    closeUpgradeModal,
  } = useSearchQuota("fb");

  const searchQueryRef = useRef<HTMLInputElement>(null);

  // Initialize filter state from URL SearchParams
  const [selectedPreset, setSelectedPreset] = useState<string>(() => searchParams.get("filter") || "");
  const [selectedCountry, setSelectedCountry] = useState<string>(() => searchParams.get("country") || "");
  const [selectedIndustry, setSelectedIndustry] = useState<string>(() => searchParams.get("industry") || "");
  const [publicDateFrom, setPublicDateFrom] = useState<string>(() => searchParams.get("date_from") || "");
  const [publicDateTo, setPublicDateTo] = useState<string>(() => searchParams.get("date_to") || "");
  const [selectedSpends, setSelectedSpends] = useState<string[]>(() => {
    const s = searchParams.get("estimated_spend");
    return s ? s.split(",").filter(Boolean) : [];
  });
  const [scalingLevel, setScalingLevel] = useState<string>(() => searchParams.get("scaling_level") || "");
  const [isActive, setIsActive] = useState<string>(() => searchParams.get("is_active") || "");
  const [pageName, setPageName] = useState<string>(() => searchParams.get("page_name") || "");
  const [domain, setDomain] = useState<string>(() => searchParams.get("domain") || "");
  const [sortBy, setSortBy] = useState<string>(() => searchParams.get("sort_by") || "start_date");
  const [sortOrder, setSortOrder] = useState<number>(() => {
    const o = searchParams.get("sort_order");
    return o ? parseInt(o, 10) : -1;
  });
  const [isSortExplicit, setIsSortExplicit] = useState<boolean>(() => Boolean(searchParams.get("sort_by")));
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const p = searchParams.get("page");
    return p ? Math.max(1, parseInt(p, 10)) : 1;
  });

  // Track initial query text from URL
  const initialText = searchParams.get("text") || "";
  useEffect(() => {
    if (searchQueryRef.current && initialText) {
      searchQueryRef.current.value = initialText;
    }
  }, [initialText]);

  // Keep URL updated with state without full reloads
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", String(currentPage));
    const queryText = searchQueryRef.current?.value?.trim();
    if (queryText) params.set("text", queryText);
    if (selectedPreset) params.set("filter", selectedPreset);
    if (selectedCountry) params.set("country", selectedCountry);
    if (selectedIndustry) params.set("industry", selectedIndustry);
    if (isActive) params.set("is_active", isActive);
    if (pageName) params.set("page_name", pageName);
    if (domain) params.set("domain", domain);
    if (publicDateFrom) params.set("date_from", publicDateFrom);
    if (publicDateTo) params.set("date_to", publicDateTo);
    if (selectedSpends.length > 0) params.set("estimated_spend", selectedSpends.join(","));
    if (scalingLevel) params.set("scaling_level", scalingLevel);
    if (isSortExplicit || sortBy !== "start_date") params.set("sort_by", sortBy);
    if (isSortExplicit || sortOrder !== -1) params.set("sort_order", String(sortOrder));

    const newQuery = params.toString();
    const newUrl = `${pathname}${newQuery ? `?${newQuery}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [
    currentPage,
    selectedPreset,
    selectedCountry,
    selectedIndustry,
    isActive,
    pageName,
    domain,
    publicDateFrom,
    publicDateTo,
    selectedSpends,
    scalingLevel,
    sortBy,
    sortOrder,
    isSortExplicit,
    pathname,
  ]);

  // Filter Stats
  const [filterStats, setFilterStats] = useState<{
    total?: number;
    presets?: Record<string, number>;
  }>({});

  const [results, setResults] = useState<any[]>([]);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const itemsPerPage = 20;

  const { searchFacebookAds, loading, error, data } = useFacebookAdsSearch();

  // Preset stats không còn hiển thị số lượng trên bộ lọc nên không cần fetch để giảm tải database

  const handleClearAllFilters = useCallback(() => {
    if (searchQueryRef.current) {
      searchQueryRef.current.value = "";
    }
    setSelectedPreset("");
    setSelectedCountry("");
    setSelectedIndustry("");
    setPublicDateFrom("");
    setPublicDateTo("");
    setSelectedSpends([]);
    setScalingLevel("");
    setIsActive("");
    setPageName("");
    setDomain("");
    setSortBy("start_date");
    setSortOrder(-1);
    setIsSortExplicit(false);
    setCurrentPage(1);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPreset) count++;
    if (selectedCountry) count++;
    if (selectedIndustry) count++;
    if (publicDateFrom || publicDateTo) count++;
    if (selectedSpends.length > 0) count++;
    if (scalingLevel) count++;
    if (isActive) count++;
    if (pageName) count++;
    if (domain) count++;
    return count;
  }, [
    selectedPreset,
    selectedCountry,
    selectedIndustry,
    publicDateFrom,
    publicDateTo,
    selectedSpends,
    scalingLevel,
    isActive,
    pageName,
    domain,
  ]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (selectedPreset) {
      const presetLabels: Record<string, string> = {
        new_ads: "⚡ Ads mới lên (<= 5 ngày)",
        ready_to_scale: "🚀 Sẵn sàng Scale",
        weekly_winner: "🏆 Quảng cáo bứt phá tuần",
      };
      chips.push({
        id: "preset",
        label: presetLabels[selectedPreset] || selectedPreset,
        onRemove: () => {
          setSelectedPreset("");
          setCurrentPage(1);
        },
      });
    }
    if (selectedCountry) {
      chips.push({
        id: "country",
        label: `Quốc gia: ${selectedCountry === "VN" ? "🇻🇳 Việt Nam (VN)" : selectedCountry}`,
        onRemove: () => {
          setSelectedCountry("");
          setCurrentPage(1);
        },
      });
    }
    if (selectedIndustry) {
      chips.push({
        id: "industry",
        label: `Ngành: ${getIndustryLabel(selectedIndustry) || selectedIndustry}`,
        onRemove: () => {
          setSelectedIndustry("");
          setCurrentPage(1);
        },
      });
    }
    if (isActive) {
      chips.push({
        id: "is_active",
        label: isActive === "true" ? "🟢 Đang chạy" : "⚪ Đã tắt",
        onRemove: () => {
          setIsActive("");
          setCurrentPage(1);
        },
      });
    }
    if (pageName) {
      chips.push({
        id: "page_name",
        label: `Page: ${pageName}`,
        onRemove: () => {
          setPageName("");
          setCurrentPage(1);
          executeSearchRef.current?.(false, { pageName: "", page: 1 });
        },
      });
    }
    if (domain) {
      chips.push({
        id: "domain",
        label: `Domain: ${domain}`,
        onRemove: () => {
          setDomain("");
          setCurrentPage(1);
          executeSearchRef.current?.(false, { domain: "", page: 1 });
        },
      });
    }
    if (scalingLevel) {
      chips.push({
        id: "scaling",
        label: `Scale: ${scalingLevel}`,
        onRemove: () => {
          setScalingLevel("");
          setCurrentPage(1);
        },
      });
    }
    if (selectedSpends.length > 0) {
      chips.push({
        id: "spend",
        label: `Spend: ${selectedSpends.join(", ")}`,
        onRemove: () => {
          setSelectedSpends([]);
          setCurrentPage(1);
        },
      });
    }
    if (publicDateFrom || publicDateTo) {
      chips.push({
        id: "date",
        label: `Ngày: ${publicDateFrom || "..."} → ${publicDateTo || "..."}`,
        onRemove: () => {
          setPublicDateFrom("");
          setPublicDateTo("");
          setCurrentPage(1);
        },
      });
    }
    return chips;
  }, [
    selectedPreset,
    selectedCountry,
    selectedIndustry,
    isActive,
    pageName,
    domain,
    scalingLevel,
    selectedSpends,
    publicDateFrom,
    publicDateTo,
  ]);

  const normalizeAdForModal = (ad: any) => {
    const images = Array.isArray(ad?.images) ? ad.images : [];
    const videos = Array.isArray(ad?.videos) ? ad.videos : [];
    const snapshot = ad?.snapshot || {};

    const imageItem = images.length > 0 ? images[0] : (snapshot?.images?.[0] || undefined);
    const videoItem = videos.length > 0 ? videos[0] : (snapshot?.videos?.[0] || undefined);

    const mediaUrl =
      ad?.thumbnail_r2 ||
      imageItem?.resized_image_url ||
      imageItem?.original_image_url ||
      imageItem?.watermarked_resized_image_url ||
      videoItem?.video_hd_url ||
      videoItem?.video_sd_url ||
      snapshot?.page_profile_picture_url ||
      ad?.thumbnail_r2 ||
      ad?.thumbnail_local;

    const mediaType = videoItem?.video_hd_url || videoItem?.video_sd_url ? "video" : "image";
    const attachment = mediaUrl
      ? [
        {
          media_url: mediaUrl,
          media_poster_url:
            imageItem?.resized_image_url ||
            imageItem?.original_image_url ||
            ad?.thumbnail_r2 ||
            ad?.thumbnail_local ||
            undefined,
          media_url_type: mediaType,
          title: ad?.headline || ad?.text?.split(/\n/)[0]?.trim() || ad?.page_name || "Facebook Ad",
          description: ad?.text || ad?.description || snapshot?.body?.text || "",
        },
      ]
      : [];

    return {
      ...ad,
      page_name: ad?.page_name || snapshot?.page_name || "Facebook Ad",
      page_profile_image_url: ad?.page_profile_image_url || snapshot?.page_profile_picture_url,
      text: ad?.text || ad?.description || snapshot?.body?.text || "",
      link: ad?.link || ad?.link_url || snapshot?.link_url || null,
      attachments: attachment,
      snapshot: {
        ...snapshot,
        page_name: ad?.page_name || snapshot?.page_name || "Facebook Ad",
        page_profile_picture_url: ad?.page_profile_image_url || snapshot?.page_profile_picture_url,
        title: ad?.headline || ad?.text?.split(/\n/)[0]?.trim() || ad?.page_name || "Facebook Ad",
        body: { text: ad?.text || ad?.description || snapshot?.body?.text || "" },
        link_url: ad?.link || ad?.link_url || snapshot?.link_url || null,
        videos: videos.length > 0 ? videos : snapshot?.videos || [],
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

    // Thêm modal state vào history để khi ấn nút Back của trình duyệt, modal tự đóng thay vì bị văng về trang trước
    if (typeof window !== "undefined") {
      window.history.pushState({ modalOpen: true, adId: itemId }, "");
    }

    if (!itemId) {
      setDetailLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/ads/detail/${encodeURIComponent(itemId)}?include_similar=true&similar_limit=15`);
      const result = await res.json();
      const detailAd = result?.success
        ? {
          ...result.data,
          similar_ads: Array.isArray(result.similar_ads) ? result.similar_ads : [],
          similar_pagination: result.similar_pagination || null,
        }
        : ad;
      setSelectedAd(normalizeAdForModal(detailAd || ad));
    } catch (err) {
      console.error("Lỗi gọi API chi tiết Facebook Ad:", err);
      setSelectedAd(normalizedAd);
    } finally {
      setDetailLoading(false);
    }
  };

  // Lắng nghe nút Back của browser để đóng modal nếu modal đang mở
  useEffect(() => {
    const handlePopState = () => {
      if (modalOpen) {
        setModalOpen(false);
        setSelectedAd(null);
        setDetailLoading(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [modalOpen]);

  const executeSearchRef = useRef<(isInitialLoad?: boolean, override?: { pageName?: string; page?: number; domain?: string }) => Promise<void>>(null!);

  const handleFilterByPage = useCallback((targetPageName: string) => {
    if (!targetPageName || targetPageName === "Facebook Ad") return;
    setPageName(targetPageName);
    setCurrentPage(1);
    toast.success(`Đang lọc quảng cáo của Fanpage: "${targetPageName}" (tối đa 20 ads/trang)`);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 520, behavior: "smooth" });
    }
    // Tự động tìm kiếm ngay lập tức với Fanpage vừa chọn
    executeSearchRef.current?.(false, { pageName: targetPageName, page: 1 });
  }, []);

  useEffect(() => {
    if (user) {
      executeSearch(true);
    }
  }, [
    user,
    currentPage,
    selectedPreset,
    selectedCountry,
    selectedIndustry,
    isActive,
    scalingLevel,
    selectedSpends,
    publicDateFrom,
    publicDateTo,
    sortBy,
    sortOrder,
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage === 1) {
      executeSearch(false);
    } else {
      setCurrentPage(1);
    }
  };

  const executeSearch = async (
    isInitialLoad: boolean = false,
    override?: { pageName?: string; page?: number; domain?: string }
  ) => {
    if (!isInitialLoad && !checkCanSearch()) {
      return;
    }

    const effectivePage = override?.page ?? currentPage;
    const effectivePageName = override?.pageName !== undefined ? override.pageName : pageName;
    const effectiveDomain = override?.domain !== undefined ? override.domain : domain;

    const params = new URLSearchParams();
    params.append("page", effectivePage.toString());
    params.append("limit", itemsPerPage.toString());

    if (searchQueryRef.current?.value) params.append("text", searchQueryRef.current.value.trim());
    if (selectedPreset) {
      params.append("filter", selectedPreset);
      if (selectedPreset === "new_ads") {
        params.append("new_max_days", "5");
      } else if (selectedPreset === "weekly_winner") {
        params.append("winner_min_days", "7");
        params.append("winner_max_days", "9");
      }
    }
    if (selectedCountry) params.append("country", selectedCountry);
    if (selectedIndustry) params.append("industry", selectedIndustry);
    if (isActive) params.append("is_active", isActive);
    if (effectivePageName?.trim()) params.append("page_name", effectivePageName.trim());
    if (effectiveDomain?.trim()) params.append("domain", effectiveDomain.trim());
    if (publicDateFrom) params.append("date_from", publicDateFrom);
    if (publicDateTo) params.append("date_to", publicDateTo);
    if (selectedSpends.length > 0) params.append("estimated_spend", selectedSpends.join(","));
    if (scalingLevel && scalingLevel !== "ALL") params.append("scaling_level", scalingLevel);
    // Khi có preset được chọn mà người dùng chưa đổi sort thủ công,
    // hãy để backend dùng sort tự nhiên của preset để tối ưu hiệu năng
    if (isSortExplicit || !selectedPreset) {
      if (sortBy) params.append("sort_by", sortBy);
      if (sortOrder) params.append("sort_order", sortOrder.toString());
    }

    try {
      const result = await searchFacebookAds({ queryString: params.toString() });

      // Đồng bộ URL với các filter hiện tại
      updateUrlParams();

      if (result?.success) {
        setResults(result.data || []);
        if (!isInitialLoad) {
          consumeSearch();
        }
        if (result.pagination) {
          setTotalPages(result.pagination.pages || 1);
          setTotalCount(result.pagination.total ?? null);
        } else {
          setTotalCount(null);
        }
      } else {
        setResults([]);
        setTotalPages(1);
        setTotalCount(null);
      }
    } catch (err) {
      console.error("Lỗi gọi kết nối search API:", err);
      setResults([]);
      setTotalPages(1);
      setTotalCount(null);
    }
  };

  executeSearchRef.current = executeSearch;

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
                Bạn cần đăng nhập để sử dụng tính năng tìm kiếm và phân tích quảng cáo Facebook.
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Header />

      {/* Hero Banner Slider */}
      <HeroSlider />

      <main className="container px-4 md:px-6 lg:px-8 py-8 relative z-20">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] items-start">
          {/* Vùng chứa bộ lọc Sidebar -  Standard */}
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <AdsSpyFilterPanel
              title="Bộ lọc Facebook Ads ()"
              activeCount={activeFilterCount}
              onClear={handleClearAllFilters}
            >
              <FacebookAdsFilters
                selectedPreset={selectedPreset}
                setSelectedPreset={(val) => {
                  setSelectedPreset(val);
                  setCurrentPage(1);
                }}
                selectedCountry={selectedCountry}
                setSelectedCountry={(c) => {
                  setSelectedCountry(c);
                  setCurrentPage(1);
                }}
                selectedIndustry={selectedIndustry}
                setSelectedIndustry={(ind) => {
                  setSelectedIndustry(ind);
                  setCurrentPage(1);
                }}
                publicDateFrom={publicDateFrom}
                setPublicDateFrom={(d) => {
                  setPublicDateFrom(d);
                  setCurrentPage(1);
                }}
                publicDateTo={publicDateTo}
                setPublicDateTo={(d) => {
                  setPublicDateTo(d);
                  setCurrentPage(1);
                }}
                selectedSpends={selectedSpends}
                setSelectedSpends={(s) => {
                  setSelectedSpends(s);
                  setCurrentPage(1);
                }}
                scalingLevel={scalingLevel}
                setScalingLevel={(sl) => {
                  setScalingLevel(sl);
                  setCurrentPage(1);
                }}
                isActive={isActive}
                setIsActive={(a) => {
                  setIsActive(a);
                  setCurrentPage(1);
                }}
                pageName={pageName}
                setPageName={(pn) => {
                  setPageName(pn);
                  setCurrentPage(1);
                }}
                domain={domain}
                setDomain={(dm) => {
                  setDomain(dm);
                  setCurrentPage(1);
                }}
                filterStats={filterStats}
              />
            </AdsSpyFilterPanel>
          </div>

          <div className="min-w-0 space-y-6">
            {/* Search Quota Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <SearchQuotaBadge quota={quota} onUpgradeClick={openUpgradeModal} />
            </div>

            {/* 🚀  Preset Quick Bar */}
            <PresetTabs
              currentPreset={selectedPreset}
              onSelectPreset={(preset) => {
                setSelectedPreset(preset);
                setCurrentPage(1);
              }}
              stats={filterStats}
            />

            {/* Search Bar - Modern White Card */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  ref={searchQueryRef}
                  placeholder="Tìm kiếm bằng từ khóa Ads, tên Page, hoặc nội dung bài viết..."
                  className="pl-12 h-12 bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl shadow-xs transition-all text-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto shrink-0 h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 cursor-pointer transition-all font-bold"
              >
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

            {/* Results Toolbar with  Sorting */}
            <section>
              <AdsSpyResultsToolbar
                title="Thư viện Facebook Ads"
                subtitle="Nghiên cứu & Khám phá các chiến dịch quảng cáo Facebook, Instagram bùng nổ doanh số"
                count={results.length}
                total={totalCount}
                currentPage={currentPage}
                totalPages={totalPages}
                hideTotalCount={!selectedPreset && activeFilterCount === 0 && !searchQueryRef.current?.value}
                activeChips={activeChips}
                onClearAll={handleClearAllFilters}
              >
                {/* Sort Controller */}
                <div className="flex items-center gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={(val) => {
                      setSortBy(val);
                      setIsSortExplicit(true);
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs bg-white border-slate-200 text-slate-800 rounded-xl shadow-2xs font-medium w-[210px] sm:w-[230px]">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-800 text-xs shadow-xl">
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs cursor-pointer">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSortOrder((prev) => (prev === -1 ? 1 : -1));
                      setIsSortExplicit(true);
                    }}
                    title={sortOrder === -1 ? "Thứ tự: Giảm dần" : "Thứ tự: Tăng dần"}
                    className="h-9 px-3 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-slate-500" />
                    {sortOrder === -1 ? "Giảm dần" : "Tăng dần"}
                  </Button>
                </div>
              </AdsSpyResultsToolbar>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                </div>
              ) : (
                <div className="mt-4">
                  {results.length === 0 ? (
                    <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl mt-4">
                      <div className="p-10 sm:p-14 text-center max-w-md mx-auto">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-4">
                          <Search className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Chưa có kết quả tìm kiếm
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                          Thử chọn chiến lược  (Ads mới lên, Sẵn sàng Scale, Weekly Winner) hoặc thay đổi từ khóa/bộ lọc quốc gia để tìm thêm quảng cáo.
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {results.map((ad, idx) => (
                        <FacebookAdCard
                          key={ad.ad_archive_id || ad._id || ad.id || idx}
                          ad={ad}
                          onClick={() => handleAdClick(ad)}
                          onFilterByPage={handleFilterByPage}
                        />
                      ))}
                    </div>
                  )}

                  {/* Server-Side Pagination Controller */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="cursor-pointer bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
                      >
                        Trang trước
                      </Button>
                      <span className="text-sm font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs">
                        Trang {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="cursor-pointer bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
                      >
                        Trang sau
                      </Button>
                    </div>
                  )}

                  {/* Detail Info Modal View with exam_res.txt data */}
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
                      onFilterByPage={handleFilterByPage}
                      onSelectAd={handleAdClick}
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
          <p>© 2026 Ads Spy Tool. Dữ liệu phân tích quảng cáo chuyên sâu theo chuẩn .</p>
        </div>
      </footer>
    </div>
  );
}