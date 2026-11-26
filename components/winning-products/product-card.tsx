"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Flame,
  Clock,
  Store,
  Tag,
  ArrowUpRight,
  ShoppingBag,
  Globe,
  MessageCircle,
  MessageSquare,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WinningProduct } from "@/types/winning-product";

interface ProductCardProps {
  product: WinningProduct;
  onSelect: (product: WinningProduct) => void;
  isUnlimited?: boolean;
  onUpgrade?: () => void;
}

export function ProductCard({
  product,
  onSelect,
  isUnlimited = true,
  onUpgrade,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [flagError, setFlagError] = useState(false);

  const rawThumbnail = product.thumbnail || product.thumbnail_r2;
  const thumbnail = rawThumbnail && !imageError && !rawThumbnail.toLowerCase().includes("không lấy được")
    ? rawThumbnail
    : null;

  // Nếu sản phẩm không có ảnh hoặc ảnh bị lỗi, tạm ẩn khỏi danh sách theo yêu cầu
  if (!thumbnail || imageError) {
    return null;
  }

  // Xử lý icon cờ quốc gia: CHỈ hiển thị nếu xác định được mã quốc gia rõ ràng (country_code)
  // Các trường hợp ghi chung chung "Nước ngoài" / chưa rõ nước -> KHÔNG hiện icon cờ
  const hasCountryFlag = Boolean(product.country_code && !flagError);

  return (
    <Card
      onClick={() => onSelect(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer select-none"
    >
      <div className="space-y-3">
        {/* Product Media Thumbnail Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-200/80">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.title || "Winning Product Thumbnail"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              unoptimized
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-400">
              <div className="h-10 w-10 rounded-full bg-slate-800 shadow-inner flex items-center justify-center border border-slate-700">
                <ShoppingBag className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 px-3 truncate max-w-full">
                {product.title || "Winning Product"}
              </span>
            </div>
          )}

          {/* 🚩 Country Flag Badge: Chỉ hiện khi có country_code rõ ràng, không rõ nước thì không hiện */}
          {hasCountryFlag && (
            <div
              className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white shadow-md pointer-events-none"
              title={`Thị trường: ${product.country_name || product.market}`}
            >
              <img
                src={`https://flagcdn.com/24x18/${product.country_code}.png`}
                alt={product.country_name || product.market || "Flag"}
                className="h-3.5 w-5 object-cover rounded-xs shrink-0 shadow-2xs"
                onError={() => setFlagError(true)}
              />
              <span className="text-[10px] font-bold tracking-tight">
                {product.country_name || product.market}
              </span>
            </div>
          )}

          {/* Floating Ads Running Count on Media */}
          {product.ads_running_count ? (
            <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
              <Badge
                variant="outline"
                className="font-mono text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md backdrop-blur-md bg-slate-950/85 text-amber-300 border-amber-400/30"
              >
                <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{product.ads_running_count} ADS</span>
              </Badge>
            </div>
          ) : null}
        </div>

        {/* Page / Brand & Platform Row */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Store className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span
              className="text-xs font-bold text-slate-700 truncate"
              title={product.page_name || "Fanpage"}
            >
              {product.page_name || "Chưa rõ Fanpage"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Nền tảng / Dạng chạy (Landing vs Messenger vs WhatsApp) */}
            {product.platform_type === "LANDING" && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
                title="Dạng chạy: Landing Page chuyển đổi"
              >
                <Globe className="h-3 w-3 text-indigo-600" />
                <span>Landing</span>
              </span>
            )}
            {product.platform_type === "MESSENGER" && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
                title="Dạng chạy: Mess tin nhắn Messenger"
              >
                <MessageCircle className="h-3 w-3 text-blue-600" />
                <span>Mess</span>
              </span>
            )}
            {product.platform_type === "WHATSAPP" && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs"
                title="Dạng chạy: Mess WhatsApp"
              >
                <MessageSquare className="h-3 w-3 text-emerald-600" />
                <span>WhatsApp</span>
              </span>
            )}

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                product.market_type === "VN"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-sky-50 text-sky-700 border border-sky-200"
              }`}
            >
              {product.market_type === "VN" ? "Việt Nam" : "Quốc tế"}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <div>
          <h3
            className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors min-h-[2.5rem]"
            title={product.title}
          >
            {product.title || "Sản phẩm chiến thắng"}
          </h3>
        </div>

        {/* Price Tag Prominent */}
        {product.price && !product.price.toLowerCase().includes("không lấy được") && !product.price.toLowerCase().includes("n/a") ? (
          <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-xs shadow-2xs min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="p-1 rounded-md bg-emerald-500/15 text-emerald-700 shrink-0">
                <Tag className="h-3.5 w-3.5" />
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider whitespace-nowrap">
                Giá:
              </span>
            </div>
            <span
              className="min-w-0 flex-1 truncate text-right font-black text-xs sm:text-sm text-emerald-950"
              title={product.price}
            >
              {product.price}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs min-w-0">
            <span className="text-[10px] text-slate-400 font-medium shrink-0 whitespace-nowrap">Giá:</span>
            <span className="text-[11px] text-slate-500 italic truncate text-right">Liên hệ Fanpage</span>
          </div>
        )}

        {/* Key Metrics Row: Ads chạy & Ngày chạy */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="flex items-center gap-2 rounded-xl bg-amber-50/80 border border-amber-200/60 px-2.5 py-1.5">
            <Flame className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold tracking-wider text-amber-700/80">Ads chạy</p>
              <p className="text-xs font-black text-amber-950 truncate">
                {product.ads_running_count ? `${product.ads_running_count} ads` : "Đang vít"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-indigo-50/80 border border-indigo-200/60 px-2.5 py-1.5">
            <Clock className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold tracking-wider text-indigo-700/80">Thời gian</p>
              <p className="text-xs font-black text-indigo-950 truncate">
                {product.duration_days || "Đang chạy"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA: Landing Page Link & Detail Modal */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {product.landing_url ? (
          isUnlimited ? (
            <a
              href={product.landing_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs transition-all border border-indigo-200/60 hover:border-indigo-600 shadow-2xs cursor-pointer group/btn"
              title={
                product.platform_type === "MESSENGER"
                  ? "Mở Mess Fanpage (Tab mới)"
                  : product.platform_type === "WHATSAPP"
                  ? "Mở WhatsApp (Tab mới)"
                  : "Mở Landing Page (Tab mới)"
              }
            >
              {product.platform_type === "MESSENGER" ? (
                <MessageCircle className="h-3.5 w-3.5 shrink-0 text-blue-600 group-hover/btn:text-white" />
              ) : product.platform_type === "WHATSAPP" ? (
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-emerald-600 group-hover/btn:text-white" />
              ) : (
                <Globe className="h-3.5 w-3.5 shrink-0 text-indigo-600 group-hover/btn:text-white" />
              )}
              <span className="truncate">
                {product.platform_type === "MESSENGER"
                  ? "Mở Mess"
                  : product.platform_type === "WHATSAPP"
                  ? "Mở WhatsApp"
                  : "Xem Landing"}
              </span>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
            </a>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpgrade?.();
              }}
              className="flex-1 inline-flex items-center justify-between h-8 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors border border-dashed border-slate-300 shadow-2xs cursor-pointer group/btn"
              title="Nâng cấp gói Unlimited để mở link này"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Lock className="h-3 w-3 text-amber-600 shrink-0 group-hover/btn:scale-110 transition-transform" />
                <span className="truncate">
                  {product.platform_type === "MESSENGER" ? "Mở Mess" : "Xem Landing"}
                </span>
              </div>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                Khóa 🔒
              </span>
            </button>
          )
        ) : (
          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
            Bấm xem chi tiết
          </span>
        )}

        <button
          type="button"
          onClick={() => onSelect(product)}
          className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
          title="Xem phân tích chi tiết sản phẩm"
          aria-label="Xem chi tiết"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
