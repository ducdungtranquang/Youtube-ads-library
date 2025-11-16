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
import { Search, Filter, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiAsyncCountrySelect } from "@/components/multi-async-country-select";

const adFormats = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "carousel", label: "Carousel" },
  { value: "slideshow", label: "Slideshow" },
];

const sortFields = [
  { value: "creation_date", label: "Publication date (Ngày xuất bản)" },
  { value: "running_time", label: "Running time (Thời gian chạy)" },
  { value: "total_adsets", label: "Total adsets (Tổng số adset)" },
  { value: "spend", label: "Spend (Chi tiêu)" },
];
const sortDirections = [
  { value: "asc", label: "Asc (tăng dần)" },
  { value: "desc", label: "Desc (giảm dần)" },
];

const ecommercePlatforms = [
  { value: "shopify", label: "Shopify" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "custom", label: "Custom Store" },
];

export default function FacebookAdsPage() {
  const { user, loading: authLoading } = useAuth();
  const searchQueryRef = useRef<HTMLInputElement>(null);
  const [adFormat, setAdFormat] = useState("");
  const [sortField, setSortField] = useState("total_adsets");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [ecommercePlatform, setEcommercePlatform] = useState("");
  const [publicDateFrom, setPublicDateFrom] = useState("");
  const [publicDateTo, setPublicDateTo] = useState("");
  const [cta, setCta] = useState("");
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
    // ...existing code for building payload...
    const payload: any = {
      page: currentPage,
      per_page: itemsPerPage,
      show_total_count: true,
      // lang:["vi"],
      sort_by: sortDirection === "desc" ? `-${sortField}` : sortField,
      format: adFormat ? [adFormat] : undefined,
      cta: cta ? [cta] : undefined,
      ecom_platform: ecommercePlatform ? [ecommercePlatform] : undefined,
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
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Đăng nhập để tìm kiếm Facebook Ads
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Bạn cần đăng nhập để sử dụng tính năng tìm kiếm quảng cáo
                Facebook và phân tích đối thủ
              </p>
              <Button asChild>
                <a href="/login">Đăng nhập</a>
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
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Facebook Ads Search
          </h1>
          <p className="text-muted-foreground">
            Tìm kiếm, phân tích quảng cáo Facebook với bộ lọc nâng cao cho
            marketers và e-commerce
          </p>
        </div>

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

        {/* Filters - Consistent Card UI */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4" />
              Bộ lọc nâng cao
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAdFormat("");
                setSortField("total_adsets");
                setSortDirection("desc");
                setSelectedCountries([]);
                setEcommercePlatform("");
                setPublicDateFrom("");
                setPublicDateTo("");
                setCta("");
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
                <Select value={adFormat} onValueChange={setAdFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {adFormats.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <label className="text-sm font-medium">
                  E-commerce Platform
                </label>
                <Select
                  value={ecommercePlatform}
                  onValueChange={setEcommercePlatform}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {ecommercePlatforms.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Input
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="Call to action"
                  className="w-full"
                />
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
                          onCheckedChange={(checked) => {
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
                <Card className="p-8 text-center">
                  <CardTitle>Không tìm thấy kết quả</CardTitle>
                  <CardContent>
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
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
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
    </div>
  );
}
