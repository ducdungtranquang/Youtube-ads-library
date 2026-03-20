"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorite-button";
import { Video, Eye, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { BrandFavoriteData } from "@/lib/favorites";

interface BrandCardProps {
  brandId: string;
  name: string;
  description: string;
  logo: string;
  totalAds: number;
  totalViews: string;
  activeMonths: number;
  totalSpend?: number;
  summaryDate?: string;
  onClick?: () => void;
}

export function BrandCard({
  brandId,
  name,
  description,
  logo,
  totalAds,
  totalViews,
  activeMonths,
  totalSpend,
  summaryDate,
  onClick,
}: BrandCardProps) {
  // Parse numeric value from totalViews with comprehensive error handling
  const numericViews = (() => {
    if (typeof totalViews === "number" && !isNaN(totalViews)) return totalViews;
    if (typeof totalViews === "string" && totalViews.trim() !== "") {
      // Handle edge cases like "undefined", "null", "NaN"
      if (
        totalViews === "undefined" ||
        totalViews === "null" ||
        totalViews === "NaN"
      )
        return 0;
      const parsed = parseInt(totalViews.replace(/[^\d]/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  })();

  const favoriteData: BrandFavoriteData = {
    name: name || "Unknown Brand",
    thumbnail: logo || "/placeholder.svg",
    description: description || "",
    categoryId: 0, // Default category
    totalCreatives: totalAds || 0,
    totalViews: numericViews || 0,
    totalSpend: totalSpend || 0,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
            <img
              src={logo || "/placeholder.svg"}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 ">
            <h3 className="mb-1 font-semibold text-foreground line-clamp-3">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
            {summaryDate && (
              <div className="flex items-center gap-1 mt-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Cập nhật: {formatDate(summaryDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              Chi tiêu
            </div>
            <p className="mt-1 font-semibold text-foreground">
              ${totalSpend || 0}
            </p>
          </div>
          <div className="rounded-lg bg-accent p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              Lượt xem
            </div>
            <p className="mt-1 font-semibold text-foreground">{totalViews}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <FavoriteButton
              itemType="brand"
              itemId={brandId}
              itemData={favoriteData}
              size="sm"
              variant="outline"
              className="flex-1"
              showText
            />
          </div>
          <Button
            className="flex-1"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
