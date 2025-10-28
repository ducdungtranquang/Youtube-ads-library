"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Video,
  Eye,
  TrendingUp,
  Heart,
  Calendar,
  DollarSign,
  Globe,
} from "lucide-react";
import { useBrandDetails } from "@/hooks/use-brand-details";
import { useCountries } from "@/hooks/use-countries";
import { useCategory } from "@/hooks/use-category";
import { FavoriteButton } from "@/components/favorite-button";
import { YouTubeImage } from "@/components/youtube-image";
import { BrandFavoriteData } from "@/lib/favorites";

interface BrandDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandId: string | null;
  onClose?: (brandId: string) => void; // Callback when modal closes to refresh favorite status
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

// Helper function to format currency
const formatCurrency = (num: number): string => {
  return "$" + formatNumber(num);
};

// Country name mapping (extended)
const getCountryName = (countryId: number): string => {
  // Handle special case: countryId = 0 means "Worldwide"
  if (countryId === 0) {
    return "Worldwide 🌍";
  }

  const countryMap: Record<number, string> = {
    236: "United States 🇺🇸",
    214: "United Kingdom 🇬🇧",
    150: "Germany 🇩🇪",
    44: "Canada 🇨🇦",
    76: "France 🇫🇷",
    380: "Italy 🇮🇹",
    392: "Japan 🇯🇵",
    36: "Australia 🇦🇺",
    724: "Spain 🇪🇸",
    528: "Netherlands 🇳🇱",
    752: "Sweden 🇸🇪",
    208: "Denmark 🇩🇰",
    578: "Norway 🇳🇴",
    246: "Finland 🇫🇮",
    756: "Switzerland 🇨🇭",
    40: "Austria 🇦🇹",
    56: "Belgium 🇧🇪",
    372: "Ireland 🇮🇪",
    620: "Portugal 🇵🇹",
    196: "Cyprus 🇨🇾",
    // Add more countries as needed
  };
  return countryMap[countryId] || `Country ${countryId} 🌍`;
};

export function BrandDetailModal({
  open,
  onOpenChange,
  brandId,
  onClose,
}: BrandDetailModalProps) {
  const { loading, error, brandDetails, fetchBrandDetails } = useBrandDetails();
  const {
    countries,
    fetchCountries,
    getCountryName: getCountryNameFromHook,
  } = useCountries();
  const { category, fetchCategory } = useCategory();
  const [categoryName, setCategoryName] = useState<string | null>(null);

  useEffect(() => {
    if (open && brandId) {
      fetchBrandDetails(brandId);
    }
  }, [open, brandId, fetchBrandDetails]);

  // Handle modal close with callback
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    // If modal is closing and we have a close callback, trigger it
    if (!newOpen && onClose && brandId) {
      onClose(brandId);
    }
  };

  // Fetch countries when brand details are loaded
  useEffect(() => {
    if (brandDetails?.top5Countries && brandDetails.top5Countries.length > 0) {
      const countryIds = brandDetails.top5Countries.map(
        (country) => country.countryId
      );
      fetchCountries(countryIds);
    }
  }, [brandDetails, fetchCountries]);

  // Fetch category name by id
  useEffect(() => {
    if (brandDetails?.brand?.categoryId) {
      fetchCategory(brandDetails.brand.categoryId);
    }
  }, [brandDetails, fetchCategory]);

  // Update category name when category is fetched
  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  if (!open || !brandId) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="grid gap-4 tablet:grid-cols-4 mobile:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Lỗi: {error}</p>
          <Button onClick={() => brandId && fetchBrandDetails(brandId)}>
            Thử lại
          </Button>
        </div>
      );
    }

    if (!brandDetails) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Không tìm thấy thông tin thương hiệu
          </p>
        </div>
      );
    }

    const brand = brandDetails.brand;
    // Ensure thumbnail is present so validateFavoriteData won't reject it
    const favoriteData: BrandFavoriteData = {
      name: brand.name,
      thumbnail: brand.thumbnail || "/placeholder.svg",
      description: brand.description || "",
      categoryId: brand.categoryId,
      totalCreatives: brandDetails.creativeCount,
      totalViews: brand.views.last30Days,
      totalSpend: brand.spend.last365Days,
    };

    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
            <YouTubeImage
              src={brand.thumbnail || "/placeholder.svg"}
              alt={brand.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{brand.name}</h2>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 laptop:grid-cols-4 tablet:grid-cols-2 mobile:grid-cols-2">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Video className="h-4 w-4" />
              Tổng quảng cáo
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
              {brandDetails.creativeCount}
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Eye className="h-4 w-4" />
              Lượt xem hôm nay
            </div>
            <p className="mt-2 text-2xl font-bold text-green-700 dark:text-green-300">
              {formatNumber(brand.views.today)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              30 ngày: {formatNumber(brand.views.last30Days)}
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <DollarSign className="h-4 w-4" />
              Chi tiêu hôm nay
            </div>
            <p className="mt-2 text-2xl font-bold text-purple-700 dark:text-purple-300">
              {formatCurrency(brand.spend.today)}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              30 ngày: {formatCurrency(brand.spend.last30Days)}
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
              <TrendingUp className="h-4 w-4" />
              Danh mục
            </div>
            <p className="mt-2 text-2xl font-bold text-orange-700 dark:text-orange-300">
              {categoryName || "Đang tải..."}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Danh mục
            </p>
          </div>
        </div>

        <Separator />

        {/* Detailed Performance Charts */}
        <div className="grid gap-6 laptop:grid-cols-2">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Eye className="h-5 w-5" />
              Lượt xem theo thời gian
            </h3>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm font-medium">Hôm nay:</span>
                  <span className="font-bold text-green-600">
                    {formatNumber(brand.views.today)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">7 ngày:</span>
                  <span className="font-semibold">
                    {formatNumber(brand.views.last7Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">14 ngày:</span>
                  <span className="font-semibold">
                    {formatNumber(brand.views.last14Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">30 ngày:</span>
                  <span className="font-semibold">
                    {formatNumber(brand.views.last30Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">60 ngày:</span>
                  <span className="font-semibold">
                    {formatNumber(brand.views.last60Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">90 ngày:</span>
                  <span className="font-semibold">
                    {formatNumber(brand.views.last90Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">180 ngày:</span>
                  <span className="font-semibold">
                    {formatNumber(brand.views.last180Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">365 ngày:</span>
                  <span className="font-semibold">
                    {formatNumber(brand.views.last365Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">720 ngày:</span>
                  <span className="font-semibold">
                    {formatNumber(brand.views.last720Days)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <DollarSign className="h-5 w-5" />
              Chi tiêu theo thời gian
            </h3>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm font-medium">Hôm nay:</span>
                  <span className="font-bold text-purple-600">
                    {formatCurrency(brand.spend.today)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">7 ngày:</span>
                  <span className="font-semibold">
                    {formatCurrency(brand.spend.last7Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">14 ngày:</span>
                  <span className="font-semibold">
                    {formatCurrency(brand.spend.last14Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">30 ngày:</span>
                  <span className="font-semibold">
                    {formatCurrency(brand.spend.last30Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">60 ngày:</span>
                  <span className="font-semibold">
                    {formatCurrency(brand.spend.last60Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">90 ngày:</span>
                  <span className="font-semibold">
                    {formatCurrency(brand.spend.last90Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">180 ngày:</span>
                  <span className="font-semibold">
                    {formatCurrency(brand.spend.last180Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">365 ngày:</span>
                  <span className="font-semibold">
                    {formatCurrency(brand.spend.last365Days)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">720 ngày:</span>
                  <span className="font-semibold">
                    {formatCurrency(brand.spend.last720Days)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Enhanced Top Countries */}
        {brandDetails.top5Countries &&
          brandDetails.top5Countries.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Globe className="h-5 w-5" />
                Top 5 quốc gia có quảng cáo
              </h3>
              <div className="grid gap-4 laptop:grid-cols-3 tablet:grid-cols-2">
                {brandDetails.top5Countries.map((country, index) => (
                  <div
                    key={country.countryId}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          #{index + 1}
                        </div>
                        <span className="font-medium">
                          {getCountryNameFromHook(country.countryId)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Số quảng cáo:
                        </span>
                        <span className="font-semibold text-foreground">
                          {country.count}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Tỷ lệ:
                        </span>
                        <Badge variant="secondary" className="font-medium">
                          {country.percentage}%
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Enhanced Data Collection Info */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Calendar className="h-5 w-5" />
            Thông tin thu thập dữ liệu
          </h3>
          <div className="grid gap-4 laptop:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="font-medium text-foreground mb-2">
                Dữ liệu lượt xem
              </h4>
              <p className="text-sm text-muted-foreground">
                Thu thập lúc:{" "}
                {new Date(brand.views.collected_on).toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(brand.views.collected_on).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <h4 className="font-medium text-foreground mb-2">
                Dữ liệu chi tiêu
              </h4>
              <p className="text-sm text-muted-foreground">
                Thu thập lúc:{" "}
                {new Date(brand.spend.collected_on).toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(brand.spend.collected_on).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {/* Brand Information Summary */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <TrendingUp className="h-5 w-5" />
            Tóm tắt thông tin thương hiệu
          </h3>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="grid gap-4 laptop:grid-cols-3 tablet:grid-cols-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {brandDetails.creativeCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tổng số quảng cáo
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(brand.views.today)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Lượt xem hôm nay
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(brand.spend.today)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Chi tiêu hôm nay
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Thương hiệu {brand.name} thuộc danh mục{" "}
                {categoryName || "đang tải..."} với {brandDetails.creativeCount}{" "}
                quảng cáo được phân bố trên{" "}
                {brandDetails.top5Countries?.length || 0} quốc gia chính.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-col md:flex-row">
          <FavoriteButton
            itemType="brand"
            itemId={brandId}
            itemData={favoriteData}
            showText
            className="flex-1"
          />
          <Button
            variant="secondary"
            className="max-sm:w-full"
            onClick={() => {
              if (brandId) {
                window.open(`/brands/${brandId}/videos`, '_blank');
              }
            }}
          >
            Xem tất cả quảng cáo
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[85vw] desktop:max-w-6xl max-h-[95vh] overflow-y-auto mobile:max-w-[calc(100vw-1rem)] mobile:max-h-[95vh] mobile:m-2">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {brandDetails?.brand.name || "Chi tiết thương hiệu"}
          </DialogTitle>
          <DialogDescription>
            {(brandDetails?.brand.description && brandDetails.brand.description.replace(/<[^>]*>/g, '')) ||
              (brandDetails
                ? `Thương hiệu trong danh mục ${categoryName || "đang tải..."}`
                : "Đang tải thông tin thương hiệu...")}
          </DialogDescription>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
