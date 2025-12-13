"use client";

import { useState, useRef } from "react";
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

const MEDIA_TYPES = {
  image: "Image",
  video: "Video",
  carousel: "Carousel",
  album: "Album",
  multi: "Multi",
};
const MEDIA_TYPE_LIST = Object.entries(MEDIA_TYPES);

const sortFields = [
  { value: "creation_date", label: "Publication date (Ngày xuất bản)" },
  { value: "days_running", label: "Running time (Thời gian chạy)" },
  {
    value: "aggregated_archive_ads.total_ads",
    label: "Total adsets (Tổng số adset)",
  },
  { value: "aggregated_archive_ads.total_reach", label: "Spend (Chi tiêu)" },
];
const sortDirections = [
  { value: "asc", label: "Asc (tăng dần)" },
  { value: "desc", label: "Desc (giảm dần)" },
];

const CTA_OPTIONS = {
  BUY_NOW: "Buy Now",
  SHOP_NOW: "Shop Now",
  LEARN_MORE: "Learn More",
  MESSAGE_PAGE: "Message Page",
  SIGN_UP: "Sign Up",
  GET_OFFER: "Get Offer",
  DOWNLOAD: "Download",
  APPLY_NOW: "Apply Now",
  SUBSCRIBE: "Subscribe",
  WHATSAPP_MESSAGE: "WhatsApp Message",
  GET_QUOTE: "Get Quote",
  EVENT_RSVP: "Event RSVP",
  DONATE_NOW: "Donate Now",
  PLAY_GAME: "Play Game",
  CONTACT_US: "Contact Us",
  GET_DIRECTIONS: "Get Directions",
  SEE_MENU: "See Menu",
  LISTEN_NOW: "Listen Now",
  INSTALL_APP: "Install App",
  BUY_TICKETS: "Buy Tickets",
  ORDER_NOW: "Order Now",
  GET_SHOWTIMES: "Get Showtimes",
  CALL_NOW: "Call Now",
  OPEN_LINK: "Open Link",
};
const CTA_LIST = Object.entries(CTA_OPTIONS);

const ECOMMERCE_PLATFORMS = {
  shopify: "Shopify",
  woocommerce: "WooCommerce",
  "cart functionality": "Cart Functionality",
  magento: "Magento",
  "salesforce commerce cloud": "Salesforce Commerce Cloud",
};
const ECOMMERCE_PLATFORM_LIST = Object.entries(ECOMMERCE_PLATFORMS);

export default function FacebookAdsPage() {
  const { user, loading: authLoading } = useAuth();
  const searchQueryRef = useRef<HTMLInputElement>(null);
  const [sortField, setSortField] = useState("creation_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [publicDateFrom, setPublicDateFrom] = useState("");
  const [publicDateTo, setPublicDateTo] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedCtas, setSelectedCtas] = useState<string[]>([]);
  const [isActive, setIsActive] = useState("");
  const ageRanges = [
    { value: "18-24", label: "18–24" },
    { value: "25-34", label: "25–34" },
    { value: "35-44", label: "35–44" },
    { value: "45-54", label: "45–54" },
    { value: "55-64", label: "55–64" },
    { value: "61-100", label: "61–100" },
  ];
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [totalAdsMin, setTotalAdsMin] = useState("");
  const [totalAdsMax, setTotalAdsMax] = useState("");
  const { searchFacebookAds, loading, error, data, status, clearError } =
    useFacebookAdsSearch();
  const [results, setResults] = useState<any[]>([]);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      page: currentPage,
      per_page: itemsPerPage,
      show_total_count: true,
      sort_by: sortDirection === "desc" ? `-${sortField}` : sortField,
      format: selectedFormats.length > 0 ? selectedFormats : undefined,
      cta: selectedCtas.length > 0 ? selectedCtas : undefined,
      ecom_platform: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
      lang: selectedCountries.length > 0 ? selectedCountries : undefined,
      creation_date:
        publicDateFrom && publicDateTo
          ? [
              new Date(publicDateFrom).toISOString(),
              new Date(publicDateTo).toISOString(),
            ]
          : undefined,
      text: searchQueryRef.current?.value || "",
      total_ads:
        totalAdsMin && totalAdsMax ? [totalAdsMin, totalAdsMax] : undefined,
      age:
        selectedAges.length > 0
          ? selectedAges
              .map((range) => {
                const [min, max] = range.split("-");
                return [parseInt(min), parseInt(max)];
              })
              .flat()
          : undefined,
      is_active:
        isActive === "yes" ? true : isActive === "no" ? false : undefined,
    };
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );
    const result = await searchFacebookAds(payload);
    // Support both result.data and result.data.data
    const items =
      result?.data?.searchMeta?.items ||
      result?.data?.data?.searchMeta?.items ||
      [];
    setResults(items);
  };

  // Pagination logic
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(results.length / itemsPerPage);

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
                Bạn cần đăng nhập để sử dụng tính năng tìm kiếm quảng cáo
                Facebook và phân tích đối thủ
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
              Facebook Ads Spy Tool
            </div>
            <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
              Facebook Ads Search
            </h1>
            <p className="text-base text-white/80 max-w-xl mx-auto">
              Tìm kiếm, phân tích quảng cáo Facebook với bộ lọc nâng cao cho marketers và e-commerce
            </p>
          </div>
        </div>
      </section>

      <main className="container px-4 py-8 -mt-6 relative z-20">

        {/* Search Bar - Consistent with MKT Search */}
        <form
          onSubmit={handleSearch}
          className="mb-6 flex md:flex-row gap-2 flex-col"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchQueryRef}
              placeholder="Tìm kiếm bằng từ khóa, headline, comment, landing page..."
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

        {/* Filters - Consistent Card UI */}
        <Card className="mb-6 border-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4" />
              Bộ lọc nâng cao
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFormats([]);
                setSortField("creation_date");
                setSortDirection("desc");
                setSelectedCountries([]);
                setSelectedPlatforms([]);
                setPublicDateFrom("");
                setPublicDateTo("");
                setSelectedCtas([]);
                setIsActive("");
                setSelectedAges([]);
                setTotalAdsMin("");
                setTotalAdsMax("");
              }}
            >
              Xóa bộ lọc
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1">
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Ad Format</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedFormats.length > 0
                        ? selectedFormats
                            .map(
                              (val) =>
                                MEDIA_TYPES[val as keyof typeof MEDIA_TYPES]
                            )
                            .join(", ")
                        : "Chọn định dạng"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                    {MEDIA_TYPE_LIST.map(([key, label]) => (
                      <div key={key} className="flex items-center px-2 py-1">
                        <Checkbox
                          checked={selectedFormats.includes(key)}
                          onCheckedChange={(checked: any) => {
                            setSelectedFormats((prev) =>
                              checked
                                ? [...prev, key]
                                : prev.filter((v) => v !== key)
                            );
                          }}
                          id={`format-${key}`}
                        />
                        <label
                          htmlFor={`format-${key}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">
                  Kiểu sắp xếp chính
                </label>
                <Select value={sortDirection} onValueChange={setSortDirection}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn kiểu sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortDirections.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">
                  Trường để sắp xếp theo
                </label>
                <Select value={sortField} onValueChange={setSortField}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trường sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortFields.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Countries</label>
                <MultiAsyncCountrySelect
                  value={selectedCountries}
                  onValueChange={setSelectedCountries}
                  className="w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">E-commerce Platform</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedPlatforms.length > 0
                        ? selectedPlatforms.map((val) => ECOMMERCE_PLATFORMS[val as keyof typeof ECOMMERCE_PLATFORMS]).join(", ")
                        : "Chọn nền tảng"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                    {ECOMMERCE_PLATFORM_LIST.map(([key, label]) => (
                      <div key={key} className="flex items-center px-2 py-1">
                        <Checkbox
                          checked={selectedPlatforms.includes(key)}
                          onCheckedChange={(checked: any) => {
                            setSelectedPlatforms((prev) =>
                              checked
                                ? [...prev, key]
                                : prev.filter((v) => v !== key)
                            );
                          }}
                          id={`platform-${key}`}
                        />
                        <label htmlFor={`platform-${key}`} className="ml-2 text-sm cursor-pointer">
                          {label}
                        </label>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Public Date From</label>
                <Input
                  type="date"
                  value={publicDateFrom}
                  onChange={(e) => setPublicDateFrom(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Public Date To</label>
                <Input
                  type="date"
                  value={publicDateTo}
                  onChange={(e) => setPublicDateTo(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">CTA</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between overflow-hidden text-ellipsis"
                    >
                      {selectedCtas.length > 0
                        ? selectedCtas
                            .map(
                              (val) =>
                                CTA_OPTIONS[val as keyof typeof CTA_OPTIONS]
                            )
                            .join(", ")
                        : "Chọn CTA"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                    {CTA_LIST.map(([key, label]) => (
                      <div key={key} className="flex items-center px-2 py-1">
                        <Checkbox
                          checked={selectedCtas.includes(key)}
                          onCheckedChange={(checked: any) => {
                            setSelectedCtas((prev) =>
                              checked
                                ? [...prev, key]
                                : prev.filter((v) => v !== key)
                            );
                          }}
                          id={`cta-${key}`}
                        />
                        <label
                          htmlFor={`cta-${key}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Is Active</label>
                <Select value={isActive} onValueChange={setIsActive}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Active status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Active</SelectItem>
                    <SelectItem value="no">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Total Ads (Min)</label>
                <Input
                  type="number"
                  value={totalAdsMin}
                  onChange={(e) => setTotalAdsMin(e.target.value)}
                  placeholder="Min"
                  className="w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Total Ads (Max)</label>
                <Input
                  type="number"
                  value={totalAdsMax}
                  onChange={(e) => setTotalAdsMax(e.target.value)}
                  placeholder="Max"
                  className="w-full"
                />
              </div>
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Age Range</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedAges.length > 0
                        ? selectedAges
                            .map(
                              (val) =>
                                ageRanges.find((a) => a.value === val)?.label
                            )
                            .join(", ")
                        : "Chọn khoảng tuổi"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {ageRanges.map((range) => (
                      <div
                        key={range.value}
                        className="flex items-center px-2 py-1"
                      >
                        <Checkbox
                          checked={selectedAges.includes(range.value)}
                          onCheckedChange={(checked: any) => {
                            setSelectedAges((prev) =>
                              checked
                                ? [...prev, range.value]
                                : prev.filter((v) => v !== range.value)
                            );
                          }}
                          id={`age-${range.value}`}
                        />
                        <label
                          htmlFor={`age-${range.value}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
        <section>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div>
              {results.length === 0 ? (
                <Card className="p-8 text-center border-2">
                  <CardTitle className="mb-4">Không tìm thấy kết quả</CardTitle>
                  <CardContent className="text-muted-foreground">
                    Vui lòng thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedResults.map((ad, idx) => (
                    <FacebookAdCard
                      key={ad.id || idx}
                      ad={ad}
                      onClick={() => {
                        setSelectedAd(ad);
                        setModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              )}
              {/* Detail Modal */}
              {selectedAd && (
                <FacebookAdDetailModal
                  open={modalOpen}
                  onOpenChange={(open) => {
                    setModalOpen(open);
                    if (!open) setSelectedAd(null);
                  }}
                  ad={selectedAd}
                />
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 mt-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 YouTube ADS Library. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  );
}
