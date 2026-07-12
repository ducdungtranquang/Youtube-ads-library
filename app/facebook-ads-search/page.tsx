"use client";

import { useState, useRef, useEffect } from "react";
import { useFacebookAdsSearch } from "@/hooks/use-facebook-search";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Filter, Loader2, Sparkles, ArrowRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiAsyncCountrySelect } from "@/components/multi-async-country-select";


/* =========================================================================
   ⚠️ CÁC DANH MỤC FILTER CŨ KHÔNG DÙNG ĐẾN - COMMENT TẠM THEO YÊU CẦU
   =========================================================================
const MEDIA_TYPES = { image: "Image", video: "Video", carousel: "Carousel", album: "Album", multi: "Multi" };
const MEDIA_TYPE_LIST = Object.entries(MEDIA_TYPES);

const sortFields = [
  { value: "creation_date", label: "Publication date (Ngày xuất bản)" },
  { value: "days_running", label: "Running time (Thời gian chạy)" },
  { value: "aggregated_archive_ads.total_ads", label: "Total adsets (Tổng số adset)" },
  { value: "aggregated_archive_ads.total_reach", label: "Spend (Chi tiêu)" },
];
const sortDirections = [
  { value: "asc", label: "Asc (tăng dần)" },
  { value: "desc", label: "Desc (giảm dần)" },
];

const CTA_OPTIONS = { BUY_NOW: "Buy Now", SHOP_NOW: "Shop Now", LEARN_MORE: "Learn More" };
const CTA_LIST = Object.entries(CTA_OPTIONS);

const ECOMMERCE_PLATFORMS = { shopify: "Shopify", woocommerce: "WooCommerce" };
const ECOMMERCE_PLATFORM_LIST = Object.entries(ECOMMERCE_PLATFORMS);

const ageRanges = [
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
];
========================================================================= */

const LEVEL_OPTIONS = [
  { value: "🔥 WINNER", label: "🔥 WINNER Ads (Sản phẩm Thắng lớn)" },
  { value: "⚡ GOOD", label: "⚡ GOOD Ads (Tiềm năng cao)" },
  { value: "LOW", label: "LOW Ads (Chạy thông thường)" },
];

export default function FacebookAdsPage() {
  const { user, loading: authLoading } = useAuth();
  const searchQueryRef = useRef<HTMLInputElement>(null);

  // Các state lưu bộ lọc tương thích trực tiếp với searchApi mới
  const [selectedCountry, setSelectedCountry] = useState<string>(""); // API nhận 1 chuỗi string text
  const [publicDateFrom, setPublicDateFrom] = useState("");
  const [publicDateTo, setPublicDateTo] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  /* --- CÁC STATE BỘ LỌC CŨ TẠM THỜI KHÔNG DÙNG ĐẾN --- */
  // const [sortField, setSortField] = useState("creation_date");
  // const [sortDirection, setSortDirection] = useState("desc");
  // const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  // const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  // const [selectedCtas, setSelectedCtas] = useState<string[]>([]);
  // const [isActive, setIsActive] = useState("");
  // const [selectedAges, setSelectedAges] = useState<string[]>([]);
  // const [totalAdsMin, setTotalAdsMin] = useState("");
  // const [totalAdsMax, setTotalAdsMax] = useState("");

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
  const itemsPerPage = 20; // limit gửi lên api

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
      setCurrentPage(1); // Ép về trang 1, useEffect sẽ tự động gọi executeSearch
    }
  };

  const executeSearch = async () => {
    // Xây dựng URLSearchParams khớp hoàn toàn với API Backend Express
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
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-12 md:py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4" />
              Facebook Ads Centralized Search
            </div>
            <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
              Facebook Ads Search
            </h1>
            <p className="text-base text-white/80 max-w-xl mx-auto">
              Tìm kiếm các bài Ads độc nhất dựa trên dữ liệu 200k mẫu đã tính điểm tăng trưởng Winner và Scaling.
            </p>
          </div>
        </div>
      </section>

      <main className="container px-4 py-8 -mt-6 relative z-20">

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

        {/* Filters Card */}
        <Card className="mb-6 border-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4" />
              Bộ lọc phân tích nâng cao
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCountry("");
                setPublicDateFrom("");
                setPublicDateTo("");
                setMinScore("");
                setMaxScore("");
                setSelectedLevel("");
              }}
            >
              Xóa bộ lọc
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">

              {/* 1. Filter theo Nước (Dựa trên trường publisher_platforms) */}
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Quốc gia / Nền tảng hiển thị</label>
                <Input
                  type="text"
                  placeholder="Ví dụ: VN, US, IG..."
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                />
              </div>

              {/* 2. Filter theo Level (Winner / Good) */}
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Cấp độ Quảng cáo (Level)</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full">
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

              {/* 3. Filter theo Khoảng Điểm Min Score */}
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Điểm số hệ thống thấp nhất (Min Score)</label>
                <Input
                  type="number"
                  placeholder="Ví dụ: 7"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                />
              </div>

              {/* 4. Filter theo Khoảng Điểm Max Score */}
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Điểm số hệ thống cao nhất (Max Score)</label>
                <Input
                  type="number"
                  placeholder="Ví dụ: 25"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                />
              </div>

              {/* 5. Filter Thời gian bắt đầu chạy (Date From) */}
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Chạy từ ngày (Date From)</label>
                <Input
                  type="date"
                  value={publicDateFrom}
                  onChange={(e) => setPublicDateFrom(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* 6. Filter Thời gian bắt đầu chạy (Date To) */}
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Đến ngày (Date To)</label>
                <Input
                  type="date"
                  value={publicDateTo}
                  onChange={(e) => setPublicDateTo(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* =========================================================================
                 ⚠️ CÁC GIAO DIỆN COMPONENT FILTER CŨ - TẠM THỜI COMMENT GIỮ LẠI KHUNG CẤU TRÚC
                 =========================================================================
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Ad Format</label>
                <DropdownMenu>...</DropdownMenu>
              </div>
              ========================================================================= */}

            </div>
          </CardContent>
        </Card>

        {/* Results Container Section */}
        <section>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div>
              {results.length === 0 ? (
                <Card className="p-8 text-center border-2">
                  <CardTitle className="mb-4">Không tìm thấy dữ liệu kết quả</CardTitle>
                  <CardContent className="text-muted-foreground">
                    Không tìm thấy dữ liệu nào phù hợp với mốc điều kiện tìm kiếm của bạn.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      </main>

      <footer className="border-t border-border/40 py-8 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Ads Spy Tool. Dữ liệu phân tích quảng cáo.</p>
        </div>
      </footer>
    </div>
  );
}