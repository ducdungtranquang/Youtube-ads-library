"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLink,
  Flame,
  Trophy,
  Layers,
  Globe,
  Calendar,
  DollarSign,
  Search,
  Sparkles,
  ArrowUpRight,
  Film,
  X,
  Copy,
  Check,
  Store,
  Share2,
} from "lucide-react";
import type { WinningProduct, ProductDetail, ProductAd } from "@/types/winning-product";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: WinningProduct | null;
}

export function ProductDetailModal({
  open,
  onOpenChange,
  product,
}: ProductDetailModalProps) {
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [copiedAdId, setCopiedAdId] = useState<string | null>(null);
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  const cleanDomain = product?.domain?.replace(/^https?:\/\//i, "").replace(/\/+$/, "") || "";
  const websiteUrl = cleanDomain ? `https://${cleanDomain}` : null;
  const faviconUrl = cleanDomain ? `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=64` : null;

  useEffect(() => {
    if (!open || !cleanDomain) {
      setDetail(null);
      setError(null);
      return;
    }

    let isMounted = true;
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/detail/${encodeURIComponent(cleanDomain)}`);
        const json = await res.json();
        if (isMounted) {
          if (json?.success && json?.data) {
            setDetail(json.data);
          } else {
            setError(json?.message || "Không tìm thấy chi tiết sản phẩm.");
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Lỗi kết nối khi tải chi tiết sản phẩm.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDetail();
    return () => {
      isMounted = false;
    };
  }, [open, cleanDomain]);

  const displayProduct = detail || product;
  const topAds = detail?.top_ads || [];

  const formatCurrency = (amount?: number) => {
    if (amount == null) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCopyDomain = () => {
    if (cleanDomain) {
      navigator.clipboard.writeText(cleanDomain);
      setCopiedDomain(true);
      toast.success(`Đã sao chép domain "${cleanDomain}"!`);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  const handleCopyAdId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedAdId(id);
    toast.success(`Đã sao chép Ad ID: ${id}`);
    setTimeout(() => setCopiedAdId(null), 2000);
  };

  const handleCopyText = (id: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    toast.success("Đã sao chép nội dung quảng cáo!");
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl max-h-[88vh] overflow-y-auto p-0 rounded-2xl bg-slate-50 border-slate-200 shadow-2xl focus:outline-none"
      >
        {/* Sticky Header Section with Explicit Close X Button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 p-4 sm:p-6 shadow-xs">
          <DialogHeader className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              {/* Left: Favicon + Domain Title */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 shadow-xs overflow-hidden">
                  {faviconUrl ? (
                    <Image
                      src={faviconUrl}
                      alt={cleanDomain}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                      unoptimized
                    />
                  ) : (
                    <Globe className="h-6 w-6 text-slate-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 truncate">
                      {cleanDomain || "Chi tiết sản phẩm"}
                    </DialogTitle>

                    {websiteUrl && (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors shrink-0"
                        title="Mở website cửa hàng"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Mở Website</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={handleCopyDomain}
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Sao chép tên miền"
                    >
                      {copiedDomain ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <DialogDescription className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {displayProduct?.title || "Phân tích sản phẩm E-commerce & Top Winning Ads"}
                  </DialogDescription>
                </div>
              </div>

              {/* Right: Quick Action Controls & Prominent Close (X) Button */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/facebook-ads-search?text=${encodeURIComponent(cleanDomain)}`}
                  className="hidden sm:inline-flex"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    <Search className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                    <span>Soi trên FB Spy</span>
                  </Button>
                </Link>

                {/* ❌ Clear, Accessible Close Button */}
                <DialogClose asChild>
                  <button
                    type="button"
                    className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 shadow-2xs focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none"
                    aria-label="Đóng cửa sổ"
                    title="Đóng (Esc)"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </DialogClose>
              </div>
            </div>

            {/* Metrics Overview Bar */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-1">
              <div className="rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/60 border border-rose-200/80 p-3 flex items-center gap-3 shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shrink-0 shadow-xs">
                  <Flame className="h-5 w-5 fill-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Product Score</p>
                  <p className="text-base sm:text-lg font-black text-rose-950">
                    {(displayProduct?.product_score || 0).toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200/80 p-3 flex items-center gap-3 shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 shadow-xs">
                  <Trophy className="h-5 w-5 fill-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Winning Ads</p>
                  <p className="text-base sm:text-lg font-black text-amber-950">
                    {displayProduct?.winning_ads || 0}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 border border-indigo-200/80 p-3 flex items-center gap-3 shadow-2xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Total Ads</p>
                  <p className="text-base sm:text-lg font-black text-indigo-950">
                    {displayProduct?.total_ads || 0}
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content Section: Top Winning Ads */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Top Quảng cáo hiệu quả nhất ({loading ? "..." : topAds.length} ads)</span>
            </h4>
            <span className="text-xs text-slate-400">
              Sắp xếp theo Ad Score cao nhất
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-full rounded-md" />
                      <Skeleton className="h-3.5 w-4/5 rounded-md" />
                      <Skeleton className="h-3 w-1/2 rounded-md" />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl">
              {error}
            </div>
          ) : topAds.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-white border border-dashed border-slate-200 rounded-2xl">
              <Store className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              Chưa có dữ liệu Top Ads cụ thể cho domain này trong cơ sở dữ liệu.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topAds.map((ad, idx) => {
                const thumbnail =
                  ad.thumbnail_r2 ||
                  ad.images?.[0]?.resized_image_url ||
                  ad.images?.[0]?.original_image_url ||
                  ad.videos?.[0]?.thumbnail_url;

                const spendText = formatCurrency(ad.estimated_spend_usd);
                const adIdStr = String(ad.ad_archive_id || idx);

                return (
                  <div
                    key={ad.ad_archive_id || idx}
                    className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
                  >
                    <div className="space-y-3">
                      {/* Top bar of ad item */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border-rose-200"
                          >
                            Score: {ad.score || 0}
                          </Badge>
                          {ad.level != null && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border-slate-200"
                            >
                              Tier {ad.level}
                            </Badge>
                          )}
                        </div>

                        {ad.start_date && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                            <Calendar className="h-3 w-3" />
                            {new Date(ad.start_date).toLocaleDateString("vi-VN")}
                          </span>
                        )}
                      </div>

                      {/* Creative preview & Text */}
                      <div className="flex gap-3">
                        <div className="relative h-20 w-20 shrink-0 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt="Ad Thumbnail"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Film className="h-6 w-6 text-slate-300" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="relative group/copy">
                            <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                              {ad.text || "Quảng cáo hình ảnh / video không có văn bản."}
                            </p>
                            {ad.text && (
                              <button
                                type="button"
                                onClick={() => handleCopyText(adIdStr, ad.text)}
                                className="absolute right-0 top-0 bg-white/90 p-1 rounded border border-slate-200 text-slate-400 hover:text-slate-700 opacity-0 group-hover/copy:opacity-100 transition-opacity cursor-pointer shadow-2xs"
                                title="Sao chép văn bản quảng cáo"
                              >
                                {copiedTextId === adIdStr ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            )}
                          </div>

                          {spendText && (
                            <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>Chi tiêu: ~{spendText}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer of ad item */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <span>ID: {ad.ad_archive_id}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyAdId(adIdStr)}
                          className="hover:text-slate-700 p-0.5 rounded cursor-pointer"
                          title="Sao chép ID"
                        >
                          {copiedAdId === adIdStr ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>

                      {ad.ad_library_url && (
                        <a
                          href={ad.ad_library_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                        >
                          <span>Mở Ad Library</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
