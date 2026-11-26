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
import {
  ExternalLink,
  Flame,
  Globe,
  Calendar,
  Clock,
  Sparkles,
  Copy,
  Check,
  Store,
  Tag,
  ShoppingBag,
  X,
  Lock,
  MessageCircle,
  MessageSquare,
} from "lucide-react";
import type { WinningProduct } from "@/types/winning-product";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: WinningProduct | null;
  isUnlimited?: boolean;
  onUpgrade?: () => void;
}

export function ProductDetailModal({
  open,
  onOpenChange,
  product,
  isUnlimited = true,
  onUpgrade,
}: ProductDetailModalProps) {
  const [detail, setDetail] = useState<WinningProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [flagError, setFlagError] = useState(false);

  const productId = product?.id || "";

  useEffect(() => {
    setImageError(false);
    setFlagError(false);
    setDetail(null);
    setError(null);

    // Nếu product đã có library_url thì đã có đầy đủ 100% dữ liệu, không cần gọi fetch ngầm tránh rủi ro lệch cache
    if (!open || !productId || product?.library_url) {
      return;
    }

    let isMounted = true;
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const titleParam = product?.title ? `?title=${encodeURIComponent(product.title)}` : "";
        const res = await fetch(`/api/products/detail/${encodeURIComponent(productId)}${titleParam}`);
        const json = await res.json();
        if (isMounted) {
          if (json?.success && json?.data) {
            setDetail(json.data);
          } else {
            setError(json?.message || "Không tìm thấy chi tiết sản phẩm.");
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Lỗi kết nối khi tải chi tiết sản phẩm.";
          setError(message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDetail();
    return () => {
      isMounted = false;
    };
  }, [open, productId, product]);

  // Luôn ưu tiên dữ liệu từ product của card được click (chống lệch dữ liệu Product A thành Product B)
  const display = {
    ...detail,
    ...product,
    library_url: product?.library_url || detail?.library_url || "",
    landing_url: product?.landing_url || detail?.landing_url || "",
    thumbnail: product?.thumbnail || detail?.thumbnail || product?.thumbnail_r2 || detail?.thumbnail_r2 || "",
  };
  if (!display || (!display.title && !display.id)) return null;

  const rawThumbnail = display.thumbnail;
  const thumbnail = rawThumbnail && !imageError && !rawThumbnail.toLowerCase().includes("không lấy được")
    ? rawThumbnail
    : null;

  const countryCode = display.country_code;
  const hasCountryFlag = Boolean(countryCode && !flagError);

  const handleCopyTitle = () => {
    if (display.title) {
      navigator.clipboard.writeText(display.title);
      setCopiedTitle(true);
      toast.success("Đã sao chép tên sản phẩm!");
      setTimeout(() => setCopiedTitle(false), 2000);
    }
  };

  const handleCopyLink = () => {
    const targetUrl = display.library_url || display.landing_url || window.location.href;
    navigator.clipboard.writeText(targetUrl);
    setCopiedLink(true);
    toast.success("Đã sao chép liên kết sản phẩm!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[96vw] max-w-4xl h-[90vh] max-h-[calc(100vh-3.5rem)] p-0 overflow-hidden flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl z-[100]"
      >
        {/* Pinned Sticky Header (Always fixed at top, never scrolls away) */}
        <div className="sticky top-0 z-30 flex items-start justify-between border-b border-slate-100 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 shrink-0">
          <div className="space-y-2 pr-4 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Country Flag Badge - CHỈ hiển thị nếu có country_code rõ ràng */}
              {hasCountryFlag && (
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white border-slate-800 shadow-xs"
                >
                  <img
                    src={`https://flagcdn.com/24x18/${countryCode}.png`}
                    alt={display.country_name || display.market || "Flag"}
                    className="h-3.5 w-5 object-cover rounded-xs"
                    onError={() => setFlagError(true)}
                  />
                  <span className="text-xs font-bold">{display.country_name || display.market}</span>
                </Badge>
              )}

              <Badge
                variant="outline"
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${display.market_type === "VN"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-sky-50 text-sky-700 border-sky-200"
                  }`}
              >
                {display.market_type === "VN" ? "Thị trường Việt Nam" : "Thị trường Quốc tế"}
              </Badge>

              {/* Dạng chạy / Nền tảng Badge */}
              {display.platform_type === "LANDING" && (
                <Badge
                  variant="outline"
                  className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border-indigo-200 flex items-center gap-1.5"
                >
                  <Globe className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Dạng chạy: Landing Page</span>
                </Badge>
              )}
              {display.platform_type === "MESSENGER" && (
                <Badge
                  variant="outline"
                  className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-blue-600" />
                  <span>Dạng chạy: Mess tin nhắn</span>
                </Badge>
              )}
              {display.platform_type === "WHATSAPP" && (
                <Badge
                  variant="outline"
                  className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Dạng chạy: WhatsApp</span>
                </Badge>
              )}

              {display.scan_date && (
                <span className="text-xs text-slate-400 flex items-center gap-1 sm:ml-auto">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Quét ngày: {display.scan_date}</span>
                </span>
              )}
            </div>

            <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {display.title}
            </DialogTitle>

            <DialogDescription className="text-xs text-slate-500 flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-indigo-500" />
              <span>Fanpage chạy ads: </span>
              <strong className="text-slate-800 font-bold">{display.page_name || "Chưa rõ"}</strong>
            </DialogDescription>
          </div>

          {/* Pinned Large Close Button with Clear Hover and Cursor Pointer */}
          <DialogClose asChild>
            <button
              type="button"
              className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 shadow-2xs hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Đóng chi tiết sản phẩm"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </DialogClose>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Cột trái (5 cột): Ảnh Sản Phẩm */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={display.title || "Winning Product Thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain"
                    onError={() => setImageError(true)}
                    referrerPolicy="no-referrer"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-900">
                    <ShoppingBag className="h-10 w-10 text-indigo-400 mb-2" />
                    <span className="text-xs font-semibold">Ảnh sản phẩm đang cập nhật</span>
                  </div>
                )}

                {/* Country Flag Overlay */}
                {hasCountryFlag && (
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white shadow-md">
                    <img
                      src={`https://flagcdn.com/24x18/${countryCode}.png`}
                      alt={display.country_name || "Flag"}
                      className="h-3.5 w-5 object-cover rounded-xs shrink-0"
                    />
                    <span className="text-[11px] font-bold">{display.country_name || display.market}</span>
                  </div>
                )}
              </div>

              {/* Copy Actions Bar */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyTitle}
                  className="flex-1 h-9 rounded-xl border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  {copiedTitle ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                      <span className="text-emerald-700">Đã chép tên</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      <span>Sao chép tên hàng</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="h-9 px-3 rounded-xl border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                  title="Sao chép liên kết"
                >
                  {copiedLink ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Cột phải (7 cột): Thông Số & Hành Động */}
            <div className="md:col-span-7 space-y-4">
              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70">
                  <div className="flex items-center gap-1.5 text-amber-700 mb-1">
                    <Flame className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Ads Chạy</span>
                  </div>
                  <p className="text-base font-black text-amber-950">
                    {display.ads_running_count ? `${display.ads_running_count} ads` : "Đang vít"}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200/70">
                  <div className="flex items-center gap-1.5 text-indigo-700 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Số ngày chạy</span>
                  </div>
                  <p className="text-base font-black text-indigo-950">
                    {display.duration_days || "Đang chạy"}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                    <Globe className="h-4 w-4 text-slate-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Thị trường</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={display.market}>
                    {display.market || "Chưa rõ"}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200/70">
                  <div className="flex items-center gap-1.5 text-purple-700 mb-1">
                    {display.platform_type === "MESSENGER" ? (
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    ) : display.platform_type === "WHATSAPP" ? (
                      <MessageSquare className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Globe className="h-4 w-4 text-indigo-600" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider">Dạng chạy</span>
                  </div>
                  <p className="text-xs sm:text-sm font-black text-purple-950 truncate" title={display.platform_label || display.platform_raw}>
                    {display.platform_label || display.platform_raw || "Landing Page"}
                  </p>
                </div>
              </div>

              {/* Price Row */}
              {display.price && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                      Giá Sản Phẩm / Chính Sách Bán
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed">
                      {display.price}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {display.library_url && (
                  isUnlimited ? (
                    <Button
                      asChild
                      className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      <a href={display.library_url} target="_blank" rel="noopener noreferrer">
                        <span>Xem trên Facebook Ad Library</span>
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        toast.info("Vui lòng nâng cấp gói Unlimited để mở link Facebook Ad Library!");
                        onUpgrade?.();
                      }}
                      className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 shadow-2xs hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-between px-4"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-600" />
                        <span>Xem trên Facebook Ad Library</span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        Đã khóa 🔒
                      </span>
                    </Button>
                  )
                )}

                {display.landing_url && (
                  isUnlimited ? (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-10 rounded-xl border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs cursor-pointer"
                    >
                      <a href={display.landing_url} target="_blank" rel="noopener noreferrer">
                        {display.platform_type === "MESSENGER" ? (
                          <MessageCircle className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                        ) : display.platform_type === "WHATSAPP" ? (
                          <MessageSquare className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <ShoppingBag className="mr-1.5 h-3.5 w-3.5 text-indigo-600" />
                        )}
                        <span>
                          {display.platform_type === "MESSENGER"
                            ? "Mở Tin Nhắn Messenger (Fanpage)"
                            : display.platform_type === "WHATSAPP"
                            ? "Mở Chat WhatsApp"
                            : "Mở Trang Đích (Landing Page)"}
                        </span>
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5 text-slate-400" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        toast.info(
                          display.platform_type === "MESSENGER"
                            ? "Vui lòng nâng cấp gói Unlimited để mở link Messenger Fanpage!"
                            : "Vui lòng nâng cấp gói Unlimited để mở link Landing Page!"
                        );
                        onUpgrade?.();
                      }}
                      className="w-full h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-dashed border-slate-300 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-between px-4"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-amber-600" />
                        <span>
                          {display.platform_type === "MESSENGER"
                            ? "Mở Tin Nhắn Messenger"
                            : display.platform_type === "WHATSAPP"
                            ? "Mở Chat WhatsApp"
                            : "Mở Trang Đích (Landing Page)"}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        Đã khóa 🔒
                      </span>
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
