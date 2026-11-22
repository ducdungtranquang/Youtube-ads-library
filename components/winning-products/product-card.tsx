"use client";

import { useState } from "react";
import Image from "next/image";
import { Flame, Clock, Store, Tag, ArrowUpRight, ShoppingBag, Globe, MessageCircle, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WinningProduct } from "@/types/winning-product";

interface ProductCardProps {
  product: WinningProduct;
  onSelect: (product: WinningProduct) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [flagError, setFlagError] = useState(false);

  const thumbnail = (product.thumbnail || product.thumbnail_r2) && !imageError
    ? (product.thumbnail || product.thumbnail_r2)
    : null;

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

        {/* Price Tag if available */}
        {product.price && (
          <div className="flex items-start gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <Tag className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] font-semibold text-slate-700 line-clamp-1 leading-snug">
              {product.price}
            </p>
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

      {/* Footer CTA Button */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
          Bấm xem chi tiết
        </span>

        <span className="h-7 w-7 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Card>
  );
}
