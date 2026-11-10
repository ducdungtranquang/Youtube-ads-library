"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Flame, Trophy, Layers, ArrowUpRight, Search, Globe, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WinningProduct } from "@/types/winning-product";

interface ProductCardProps {
  product: WinningProduct;
  onSelect: (product: WinningProduct) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const [faviconError, setFaviconError] = useState(false);

  const cleanDomain = product.domain?.replace(/^https?:\/\//i, "").replace(/\/+$/, "") || "";
  const websiteUrl = cleanDomain ? `https://${cleanDomain}` : null;
  const faviconUrl = cleanDomain ? `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=64` : null;

  // Format score color
  const score = product.product_score || 0;
  const getScoreBadgeClass = (s: number) => {
    if (s >= 80) return "bg-rose-500/10 text-rose-600 border-rose-200";
    if (s >= 50) return "bg-amber-500/10 text-amber-700 border-amber-200";
    if (s >= 20) return "bg-indigo-500/10 text-indigo-700 border-indigo-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <Card
      onClick={() => onSelect(product)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer select-none"
    >
      <div className="space-y-3">
        {/* Header: Favicon + Domain + Score Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 overflow-hidden text-slate-500 shadow-2xs">
              {faviconUrl && !faviconError ? (
                <Image
                  src={faviconUrl}
                  alt={cleanDomain}
                  width={28}
                  height={28}
                  className="h-6 w-6 object-contain"
                  onError={() => setFaviconError(true)}
                  unoptimized
                />
              ) : (
                <Globe className="h-5 w-5 text-slate-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 truncate" title={cleanDomain}>
                  {cleanDomain || "Unknown Domain"}
                </span>
                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5 rounded"
                    title="Mở website cửa hàng"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">Sản phẩm E-commerce</p>
            </div>
          </div>

          {/* Product Score Badge */}
          <Badge
            variant="outline"
            className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 ${getScoreBadgeClass(score)}`}
            title={`Điểm chiến thắng của sản phẩm: ${score.toFixed(1)}`}
          >
            <Flame className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>{score.toFixed(1)}</span>
          </Badge>
        </div>

        {/* Product Title */}
        <div>
          <h3
            className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors cursor-pointer"
            onClick={() => onSelect(product)}
            title={product.title || cleanDomain}
          >
            {product.title || cleanDomain || "Sản phẩm không có tiêu đề"}
          </h3>
        </div>

        {/* Key Metrics Pills */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2 rounded-xl bg-amber-50/70 border border-amber-100/80 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 shrink-0">
              <Trophy className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-amber-700/80">Winning Ads</p>
              <p className="text-sm font-black text-amber-900">{product.winning_ads || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-indigo-50/70 border border-indigo-100/80 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 shrink-0">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-700/80">Total Ads</p>
              <p className="text-sm font-black text-indigo-900">{product.total_ads || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          href={`/facebook-ads-search?text=${encodeURIComponent(cleanDomain)}`}
          className="text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          title="Soi toàn bộ quảng cáo của domain này trên Facebook Ads Spy"
          onClick={(e) => e.stopPropagation()}
        >
          <Search className="h-3.5 w-3.5 text-indigo-500" />
          <span>Soi Ads Facebook</span>
        </Link>

        <Button
          type="button"
          size="sm"
          onClick={() => onSelect(product)}
          className="h-8 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1 group-hover:scale-[1.02] transition-transform"
        >
          <span>Xem Top Ads</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}

