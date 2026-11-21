"use client";

import { useState, useEffect, useCallback, Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/winning-products/product-card";
import { LockedProductSkeletonCard } from "@/components/winning-products/locked-product-card";
import { ProductGridSkeleton } from "@/components/winning-products/product-skeleton";
import { ProductDetailModal } from "@/components/winning-products/product-detail-modal";
import { useAuth } from "@/contexts/auth-context";
import { useSearchQuota } from "@/hooks/use-search-quota";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Flame,
  Trophy,
  Sparkles,
  Search,
  PackageSearch,
  RotateCcw,
  Lock,
  Zap,
  Globe,
  X,
  Play,
  ArrowRight,
} from "lucide-react";
import { VideoTutorialModal } from "@/components/tutorials/video-tutorial-modal";
import type { WinningProduct } from "@/types/winning-product";

function WinningProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Subscription Quota Check
  const { user, loading: authLoading } = useAuth();
  const {
    quota,
    loading: quotaLoading,
    isUpgradeModalOpen,
    openUpgradeModal,
    closeUpgradeModal,
  } = useSearchQuota("fb");

  const isUnlimited = Boolean(quota?.isUnlimited);
  const isCheckingAccess = authLoading || quotaLoading;

  // Filter States
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [marketFilter, setMarketFilter] = useState<"ALL" | "VN" | "GLOBAL">(() => {
    const raw = searchParams.get("market")?.toUpperCase();
    return raw === "VN" || raw === "GLOBAL" ? raw : "ALL";
  });
  const [page, setPage] = useState(() => parseInt(searchParams.get("page") || "1", 10) || 1);

  // Data States
  const [products, setProducts] = useState<WinningProduct[]>([]);
  const [stats, setStats] = useState({ total: 0, vn_count: 0, global_count: 0 });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<WinningProduct | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Trigger Upgrade Modal with Toast Notice
  const handleLockedAction = useCallback((customMsg?: string) => {
    toast.info(customMsg || "Vui lòng nâng cấp lên gói Unlimited để mở khóa tính năng này!", {
      action: {
        label: "Nâng cấp",
        onClick: () => openUpgradeModal(),
      },
    });
    openUpgradeModal();
  }, [openUpgradeModal]);

  // Fetch products from API (Cached Google Sheets data)
  const fetchProducts = useCallback(async (qVal: string, mVal: "ALL" | "VN" | "GLOBAL", pageVal: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (qVal.trim()) params.set("q", qVal.trim());
      if (mVal !== "ALL") params.set("market", mVal);
      if (pageVal > 1) params.set("page", String(pageVal));
      params.set("limit", "24");

      const res = await fetch(`/api/products/search?${params.toString()}`);
      const json = await res.json();

      if (json?.success && Array.isArray(json?.data)) {
        setProducts(json.data);
        if (json.pagination) {
          setTotal(json.pagination.total);
          setTotalPages(json.pagination.pages || 1);
        }
        if (json.stats) {
          setStats(json.stats);
        }
      } else {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error loading winning products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync state to URL and fetch on change
  useEffect(() => {
    fetchProducts(searchQuery, marketFilter, page);

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (marketFilter !== "ALL") params.set("market", marketFilter);
    if (page > 1) params.set("page", String(page));

    const newUrl = params.toString() ? `/winning-products?${params.toString()}` : `/winning-products`;
    window.history.replaceState(null, "", newUrl);
  }, [searchQuery, marketFilter, page, fetchProducts]);

  const handleSelectProduct = (product: WinningProduct) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleMarketChange = (m: "ALL" | "VN" | "GLOBAL") => {
    startTransition(() => {
      setMarketFilter(m);
      setPage(1);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setMarketFilter("ALL");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-12 md:py-16 text-white border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="container relative z-10 mx-auto px-4 max-w-6xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1 text-xs font-bold text-indigo-300 uppercase tracking-wider backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Kho Sản Phẩm Chiến Thắng (Winning Products)</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  Sản Phẩm Đang{" "}
                  <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                    Vít Camp Mạnh Nhất
                  </span>
                </h1>

                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Dữ liệu trích xuất từ Meta Ads Library, kèm giá bán, số ads chạy, thời gian chạy và phân tích chuyên sâu lý do sản phẩm chiến thắng.
                </p>
              </div>

              {/* Stats Counters */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 bg-white/5 border border-white/10 p-3 sm:p-4 rounded-3xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={!isUnlimited ? () => handleLockedAction("Mở khóa toàn bộ 88+ sản phẩm chiến thắng với gói Unlimited!") : undefined}
                  className={`px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-center transition-all ${
                    !isUnlimited ? "hover:bg-white/10 cursor-pointer group" : ""
                  }`}
                  title={!isUnlimited ? "Nâng cấp để mở khóa toàn bộ sản phẩm" : undefined}
                >
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tổng SP Win</p>
                    {!isUnlimited && <Lock className="h-2.5 w-2.5 text-amber-400 group-hover:scale-110 transition-transform" />}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-xl font-black text-amber-300">{stats.total || "88"}</p>
                    {!isUnlimited && <Lock className="h-3.5 w-3.5 text-amber-400" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={!isUnlimited ? () => handleLockedAction("Mở khóa toàn bộ sản phẩm Việt Nam với gói Unlimited!") : undefined}
                  className={`px-3 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center transition-all ${
                    !isUnlimited ? "hover:bg-rose-500/20 cursor-pointer group" : ""
                  }`}
                  title={!isUnlimited ? "Nâng cấp để mở khóa toàn bộ sản phẩm" : undefined}
                >
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">🇻🇳 Việt Nam</p>
                    {!isUnlimited && <Lock className="h-2.5 w-2.5 text-rose-300 group-hover:scale-110 transition-transform" />}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-xl font-black text-rose-400">{stats.vn_count || "55"}</p>
                    {!isUnlimited && <Lock className="h-3.5 w-3.5 text-rose-300" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={!isUnlimited ? () => handleLockedAction("Mở khóa toàn bộ sản phẩm Quốc tế với gói Unlimited!") : undefined}
                  className={`px-3 py-2 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center transition-all ${
                    !isUnlimited ? "hover:bg-sky-500/20 cursor-pointer group" : ""
                  }`}
                  title={!isUnlimited ? "Nâng cấp để mở khóa toàn bộ sản phẩm" : undefined}
                >
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-[10px] uppercase font-bold text-sky-300 tracking-wider">🌐 Quốc Tế</p>
                    {!isUnlimited && <Lock className="h-2.5 w-2.5 text-sky-300 group-hover:scale-110 transition-transform" />}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-xl font-black text-sky-400">{stats.global_count || "33"}</p>
                    {!isUnlimited && <Lock className="h-3.5 w-3.5 text-sky-300" />}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container py-8 md:py-12 mx-auto px-4 max-w-6xl">
          {/* Access Checking Skeleton */}
          {isCheckingAccess ? (
            <div className="space-y-6">
              <div className="h-12 w-64 bg-slate-200 rounded-xl animate-pulse" />
              <ProductGridSkeleton count={6} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filter Toolbar: Market Tabs & Search Bar */}
              <div className="p-4 sm:p-5 rounded-3xl border border-slate-200/90 bg-white shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Market Filter Tabs */}
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => handleMarketChange("ALL")}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                        marketFilter === "ALL"
                          ? "bg-white text-slate-950 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Tất cả sản phẩm</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                        {isUnlimited ? (
                          stats.total || total
                        ) : (
                          <>
                            <span>1 / {stats.total || total}</span>
                            <Lock className="h-2.5 w-2.5 text-amber-600" />
                          </>
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMarketChange("VN")}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                        marketFilter === "VN"
                          ? "bg-rose-500 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>🇻🇳 Việt Nam</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        marketFilter === "VN" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}>
                        {isUnlimited ? (
                          stats.vn_count || 0
                        ) : (
                          <>
                            <span>{stats.vn_count || 0}</span>
                            <Lock className="h-2.5 w-2.5" />
                          </>
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMarketChange("GLOBAL")}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                        marketFilter === "GLOBAL"
                          ? "bg-sky-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>🌐 Nước ngoài</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        marketFilter === "GLOBAL" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                      }`}>
                        {isUnlimited ? (
                          stats.global_count || 0
                        ) : (
                          <>
                            <span>{stats.global_count || 0}</span>
                            <Lock className="h-2.5 w-2.5" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Active Count & Reset */}
                  <div className="flex items-center gap-2 justify-end text-xs text-slate-500">
                    {isUnlimited ? (
                      <span className="font-semibold">
                        Hiển thị <strong>{total}</strong> sản phẩm
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleLockedAction("Nâng cấp gói Unlimited để mở khóa toàn bộ kho sản phẩm chiến thắng!")}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer group"
                      >
                        <span>Hiển thị <strong>1</strong> trong số <strong>{stats.total || total}</strong> sản phẩm</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 group-hover:bg-amber-100">
                          <Lock className="h-3 w-3 text-amber-600" />
                          <span>Đã khóa {Math.max(0, (stats.total || total) - 1)} SP</span>
                        </span>
                      </button>
                    )}
                    {(searchQuery || marketFilter !== "ALL") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResetFilters}
                        className="h-8 px-2.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        <span>Đặt lại</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Search Bar Input */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên sản phẩm, tên Fanpage..."
                    className="w-full h-11 pl-11 pr-10 rounded-2xl border-slate-200 bg-slate-50/60 focus:bg-white text-sm shadow-2xs transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </form>
              </div>

              {/* Product Grid / Loading / Empty */}
              {loading ? (
                <ProductGridSkeleton count={12} />
              ) : products.length === 0 ? (
                <Card className="p-12 text-center rounded-3xl border-dashed border-slate-200 bg-white shadow-2xs">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 mx-auto mb-4">
                    <PackageSearch className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Không tìm thấy sản phẩm phù hợp
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                    Không có sản phẩm nào khớp với từ khóa &quot;{searchQuery}&quot; trong bộ lọc hiện tại.
                    Hãy thử xóa từ khóa hoặc chọn tab thị trường khác để tìm kiếm.
                  </p>
                  <Button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-5 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Xem tất cả sản phẩm</span>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {isUnlimited ? (
                    products.map((product) => (
                      <ProductCard
                        key={product.id || product.title}
                        product={product}
                        onSelect={handleSelectProduct}
                      />
                    ))
                  ) : (
                    <>
                      {/* User Free: Chỉ hiện 1 product thật duy nhất */}
                      {products.length > 0 && (
                        <ProductCard
                          key={products[0].id || products[0].title}
                          product={products[0]}
                          onSelect={handleSelectProduct}
                        />
                      )}
                      {/* Các ad còn lại hiển thị dạng Skeleton với biểu tượng khóa */}
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <LockedProductSkeletonCard
                          key={`locked-skeleton-${idx}`}
                          index={idx + 1}
                          onUpgrade={() => handleLockedAction(`Mở khóa sản phẩm chiến thắng #${idx + 2} với gói Unlimited!`)}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* Free User Upgrade Banner */}
              {!isUnlimited && products.length > 0 && (
                <div className="mt-8 p-6 sm:p-8 rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="space-y-2 max-w-xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Mở khóa toàn bộ {stats.total || "88"}+ Sản Phẩm Chiến Thắng</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Bạn đang xem bản dùng thử (1 sản phẩm)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Nâng cấp lên gói Unlimited để mở khóa toàn bộ danh sách sản phẩm chiến thắng, xem toàn bộ liên kết Facebook Ad Library và bóc tách Landing Page đối thủ.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleLockedAction("Nâng cấp gói Unlimited để mở khóa toàn bộ kho sản phẩm chiến thắng!")}
                      className="h-12 px-7 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <Sparkles className="h-4 w-4 mr-2 text-slate-950 fill-slate-950" />
                      <span>Nâng cấp Unlimited ngay</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Pagination Controls - CHỈ HIỂN THỊ KHI IS_UNLIMITED */}
              {isUnlimited && !loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 pt-6 pb-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage(Math.max(page - 1, 1))}
                    className="h-9 px-4 rounded-xl border-slate-200 text-xs font-semibold cursor-pointer disabled:opacity-40"
                  >
                    Trang trước
                  </Button>

                  <span className="text-xs text-slate-600 font-semibold px-2">
                    Trang <strong className="text-slate-900">{page}</strong> / {totalPages}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage(Math.min(page + 1, totalPages))}
                    className="h-9 px-4 rounded-xl border-slate-200 text-xs font-semibold cursor-pointer disabled:opacity-40"
                  >
                    Trang sau
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct}
        isUnlimited={isUnlimited}
        onUpgrade={() => handleLockedAction("Vui lòng nâng cấp gói Unlimited để mở link xem chi tiết!")}
      />

      {/* Upgrade Plan Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        quota={quota}
      />

      <SiteFooter />
    </div>
  );
}

export default function WinningProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WinningProductsContent />
    </Suspense>
  );
}
