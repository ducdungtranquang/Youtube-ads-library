"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { ProductFilters } from "@/components/winning-products/product-filters";
import { ProductCard } from "@/components/winning-products/product-card";
import { ProductGridSkeleton } from "@/components/winning-products/product-skeleton";
import { ProductDetailModal } from "@/components/winning-products/product-detail-modal";
import { MonthlyWinnersView } from "@/components/winning-products/monthly-winners-view";
import { useAuth } from "@/contexts/auth-context";
import { useSearchQuota } from "@/hooks/use-search-quota";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Flame,
  Trophy,
  Sparkles,
  Crown,
  Search,
  PackageSearch,
  RotateCcw,
  TrendingUp,
  Store,
  Layers,
  ArrowRight,
  Lock,
  Zap,
  AlertTriangle,
  FlaskConical,
} from "lucide-react";
import type {
  WinningProduct,
  ProductSearchParams,
  ProductsSearchResponse,
} from "@/types/winning-product";

// Paywall Gate for Non-Unlimited Members
function WinningProductsPaywallGate({
  user,
  onUpgrade,
}: {
  user: any;
  onUpgrade: () => void;
}) {
  const router = useRouter();

  return (
    <div className="space-y-10">
      {/* Paywall Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-2xl shadow-indigo-950/40">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400/20 via-rose-500/20 to-indigo-500/20 border border-amber-300/40 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300 shadow-sm">
            <Crown className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span>Đặc quyền dành riêng cho Gói Không Giới Hạn (Unlimited)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Mở Khóa Kho Sản Phẩm{" "}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
              Chiến Thắng (Winning)
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Kho dữ liệu phân tích sản phẩm thương mại điện tử chiến thắng chỉ dành riêng cho thành viên gói{" "}
            <strong className="text-white">Không Giới Hạn (Unlimited)</strong>. Nâng cấp ngay để theo dõi các sản phẩm
            vít ads mạnh nhất, điểm Product Score và top creatives của đối thủ.
          </p>

          {/* 3 Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 mb-2.5">
                <Flame className="h-4 w-4 fill-rose-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">AI Product Score</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Thuật toán độc quyền đo lường độ hot và đà tăng trưởng của từng store.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 mb-2.5">
                <Trophy className="h-4 w-4 fill-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Winning Ads & Scale</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Phát hiện sản phẩm đang nhân bản ad set và vít mạnh ngân sách.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 mb-2.5">
                <Crown className="h-4 w-4 text-indigo-400" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Bảng Vàng Hàng Tháng</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Bảng xếp hạng domain chiến thắng nhiều nhất tháng và top 1 mỗi ngày.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Button
                type="button"
                onClick={onUpgrade}
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <Zap className="h-4 w-4 mr-2 text-amber-300 fill-amber-300" />
                <span>Nâng cấp lên gói Unlimited ngay (Từ 79k/tháng)</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => router.push("/login?redirect=/winning-products")}
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <span>Đăng nhập để nâng cấp</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/pricing")}
              className="w-full sm:w-auto h-12 px-6 rounded-2xl border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-sm font-bold cursor-pointer"
            >
              <span>Xem chi tiết Bảng Giá</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Blurred Sample Preview (Creates curiosity & high conversion) */}
      <div className="relative">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-[3px] rounded-3xl">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center gap-3 text-slate-800 text-xs font-bold">
            <Lock className="h-4 w-4 text-indigo-600" />
            <span>Nội dung bị khóa — Dành riêng cho thành viên gói Unlimited</span>
          </div>
        </div>

        {/* Dummy/Sample Blurred Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 select-none opacity-40">
          <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="h-6 w-16 bg-rose-100 rounded-full" />
            </div>
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-12 bg-amber-50 rounded-xl" />
              <div className="h-12 bg-indigo-50 rounded-xl" />
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-28 bg-slate-200 rounded" />
              <div className="h-6 w-16 bg-amber-100 rounded-full" />
            </div>
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-12 bg-amber-50 rounded-xl" />
              <div className="h-12 bg-indigo-50 rounded-xl" />
            </div>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-36 bg-slate-200 rounded" />
              <div className="h-6 w-16 bg-indigo-100 rounded-full" />
            </div>
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-3/4 bg-slate-100 rounded" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-12 bg-amber-50 rounded-xl" />
              <div className="h-12 bg-indigo-50 rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

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

  // Mode: "explorer" (Tất cả sản phẩm) | "monthly" (Bảng vàng theo tháng)
  const [activeTab, setActiveTab] = useState<"explorer" | "monthly">("explorer");

  // Filter state
  const [filters, setFilters] = useState<ProductSearchParams>(() => {
    return {
      q: searchParams.get("q") || "",
      domain: searchParams.get("domain") || "",
      min_product_score: searchParams.get("min_product_score") || undefined,
      min_winning_ads: searchParams.get("min_winning_ads") || undefined,
      min_total_ads: searchParams.get("min_total_ads") || undefined,
      sort_by: (searchParams.get("sort_by") as any) || "product_score",
      sort_order: (searchParams.get("sort_order") as any) || "-1",
      page: parseInt(searchParams.get("page") || "1", 10) || 1,
      limit: 24,
    };
  });

  const [products, setProducts] = useState<WinningProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<WinningProduct | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Sync state to URL without reloading page
  const updateUrlParams = useCallback((newFilters: ProductSearchParams) => {
    const params = new URLSearchParams();
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.domain) params.set("domain", newFilters.domain);
    if (newFilters.min_product_score && newFilters.min_product_score !== "0") {
      params.set("min_product_score", String(newFilters.min_product_score));
    }
    if (newFilters.min_winning_ads && newFilters.min_winning_ads !== "0") {
      params.set("min_winning_ads", String(newFilters.min_winning_ads));
    }
    if (newFilters.min_total_ads && newFilters.min_total_ads !== "0") {
      params.set("min_total_ads", String(newFilters.min_total_ads));
    }
    if (newFilters.sort_by && newFilters.sort_by !== "product_score") {
      params.set("sort_by", newFilters.sort_by);
    }
    if (newFilters.sort_order && newFilters.sort_order !== "-1") {
      params.set("sort_order", String(newFilters.sort_order));
    }
    if (newFilters.page && newFilters.page > 1) {
      params.set("page", String(newFilters.page));
    }

    const query = params.toString();
    const newUrl = query ? `/winning-products?${query}` : `/winning-products`;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  // Fetch products from API (Only when user has unlimited plan)
  const fetchProducts = useCallback(async (currentFilters: ProductSearchParams) => {
    if (!isUnlimited) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.q) params.set("q", currentFilters.q);
      if (currentFilters.domain) params.set("domain", currentFilters.domain);
      if (currentFilters.min_product_score && currentFilters.min_product_score !== "0") {
        params.set("min_product_score", String(currentFilters.min_product_score));
      }
      if (currentFilters.min_winning_ads && currentFilters.min_winning_ads !== "0") {
        params.set("min_winning_ads", String(currentFilters.min_winning_ads));
      }
      if (currentFilters.min_total_ads && currentFilters.min_total_ads !== "0") {
        params.set("min_total_ads", String(currentFilters.min_total_ads));
      }
      if (currentFilters.sort_by) params.set("sort_by", currentFilters.sort_by);
      if (currentFilters.sort_order) params.set("sort_order", String(currentFilters.sort_order));
      params.set("page", String(currentFilters.page || 1));
      params.set("limit", String(currentFilters.limit || 24));

      const res = await fetch(`/api/products/search?${params.toString()}`);
      const json: ProductsSearchResponse = await res.json();

      if (json?.success) {
        setProducts(Array.isArray(json.data) ? json.data : []);
        if (json.pagination) {
          setTotal(json.pagination.total || 0);
          setTotalPages(json.pagination.pages || 1);
        }
      } else {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.warn("Lỗi khi tìm kiếm sản phẩm:", err);
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [isUnlimited]);

  // Run fetch whenever filters change and user is unlimited
  useEffect(() => {
    if (activeTab === "explorer" && isUnlimited) {
      fetchProducts(filters);
      updateUrlParams(filters);
    }
  }, [filters, activeTab, isUnlimited, fetchProducts, updateUrlParams]);

  const handleFilterChange = (newValues: Partial<ProductSearchParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newValues,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: "",
      domain: "",
      min_product_score: undefined,
      min_winning_ads: undefined,
      min_total_ads: undefined,
      sort_by: "product_score",
      sort_order: "-1",
      page: 1,
      limit: 24,
    });
  };

  const handleSelectProduct = (product: WinningProduct) => {
    setSelectedProduct(product);
    setModalOpen(true);
    if (typeof window !== "undefined") {
      window.history.pushState({ modalOpen: true, domain: product.domain }, "");
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      if (typeof window !== "undefined" && window.history.state?.modalOpen) {
        window.history.back();
      }
      setModalOpen(false);
      setSelectedProduct(null);
    } else {
      setModalOpen(true);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (modalOpen) {
        setModalOpen(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [modalOpen]);

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ page: newPage });
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-12 md:py-16">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))] pointer-events-none" />

          <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 border border-amber-400/40 px-4 py-1.5 text-xs font-bold text-amber-300 shadow-sm backdrop-blur-md">
                <FlaskConical className="h-4 w-4 text-amber-400 animate-pulse" />
                <span>Tính Năng Đang Thử Nghiệm (BETA)</span>
                <span className="text-slate-500">•</span>
                <Crown className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span>Gói Không Giới Hạn (Unlimited)</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
                <span>Kho Sản Phẩm</span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">
                  Chiến Thắng (Winning)
                </span>
                <span className="text-xs sm:text-sm font-black uppercase px-2.5 py-0.5 rounded-xl bg-amber-400 text-slate-950 tracking-wider shadow-lg shadow-amber-400/25">
                  BETA
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Khám phá các sản phẩm và cửa hàng E-commerce đang scale mạnh nhất trên Facebook Ads (Phiên bản thử nghiệm).
                Phân tích điểm số Product Score, số lượng ads chiến thắng và xem toàn bộ creative mẫu.
              </p>

              {/* Key Value Metric Badges */}
              <div className="pt-4 flex items-center justify-center gap-3 sm:gap-6 flex-wrap text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  <Flame className="h-3.5 w-3.5 text-rose-400" />
                  <span>Điểm Product Score chuẩn xác</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  <span>Lọc theo Winning Ads</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  <Store className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Domain & Top Creatives</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* ⚠️ CẢNH BÁO TÍNH NĂNG ĐANG THỬ NGHIỆM */}
          <div className="mb-6 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50/70 p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/25">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-amber-950 text-sm sm:text-base">
                    Lưu ý: Tính năng Winning Products đang trong giai đoạn thử nghiệm (BETA)
                  </h3>
                  <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                    Thuật toán đang hiệu chỉnh
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                  Kho dữ liệu phân tích sản phẩm và điểm số <strong>Product Score</strong> đang được thử nghiệm thực tế và liên tục tối ưu.
                  Bạn <strong>vẫn có thể tìm kiếm, lọc theo các tiêu chí và xem chi tiết ads bình thường</strong>.
                </p>
                <div className="flex items-center gap-4 pt-1 flex-wrap text-xs text-amber-800 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <strong>Tìm kiếm &amp; Lọc sản phẩm:</strong> Đang hoạt động
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <strong>Dữ liệu:</strong> Cập nhật liên tục
                  </span>
                  <span className="text-amber-700/90">
                    Mọi ý kiến đóng góp xin gửi qua nút <strong>Hỗ trợ &amp; Góp ý</strong> ở góc dưới bên phải.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Access Checking Skeleton */}
          {isCheckingAccess ? (
            <div className="space-y-6">
              <div className="h-12 w-64 bg-slate-200 rounded-xl animate-pulse" />
              <ProductGridSkeleton count={6} />
            </div>
          ) : !isUnlimited ? (
            /* 🔒 Paywall Gate for Non-Unlimited Users */
            <WinningProductsPaywallGate user={user} onUpgrade={openUpgradeModal} />
          ) : (
            /* 🔓 Full Access for Unlimited Users */
            <div>
              {/* Tabs Navigation Switcher */}
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-200/70 border border-slate-300/60 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("explorer")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === "explorer"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Search className="h-4 w-4 text-indigo-600" />
                    <span>Khám phá sản phẩm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("monthly")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === "monthly"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span>Bảng vàng tháng</span>
                  </button>
                </div>

                {/* Unlimited Plan Active Badge */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <Crown className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>Gói Unlimited Active</span>
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/facebook-ads-search")}
                    className="hidden md:flex items-center gap-1.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Facebook Ads Spy</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                </div>
              </div>

              {/* Tab 1: Product Explorer */}
              {activeTab === "explorer" && (
                <div className="space-y-6">
                  {/* Filter Panel */}
                  <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                    isLoading={loading}
                  />

                  {/* Results Toolbar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <p>
                      {loading ? (
                        <span>Đang tìm kiếm trong kho sản phẩm...</span>
                      ) : (
                        <span>
                          Tìm thấy{" "}
                          <strong className="text-slate-900 font-bold">
                            {total.toLocaleString("vi-VN")}
                          </strong>{" "}
                          sản phẩm chiến thắng
                        </span>
                      )}
                    </p>

                    {totalPages > 1 && (
                      <p>
                        Trang <strong className="text-slate-800">{filters.page || 1}</strong> / {totalPages}
                      </p>
                    )}
                  </div>

                  {/* Product Grid / Loading / Empty */}
                  {loading ? (
                    <ProductGridSkeleton count={filters.limit || 24} />
                  ) : products.length === 0 ? (
                    <Card className="p-12 text-center rounded-2xl border-dashed border-slate-200 bg-white shadow-2xs">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 mx-auto mb-4">
                        <PackageSearch className="h-8 w-8" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        Không tìm thấy sản phẩm phù hợp
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                        Không có sản phẩm nào khớp với tiêu chí tìm kiếm hiện tại. Hãy thử giảm ngưỡng điểm số,
                        xóa từ khóa hoặc bấm đặt lại bộ lọc để mở rộng kết quả.
                      </p>
                      <Button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-5 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Đặt lại bộ lọc</span>
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {products.map((product, idx) => (
                        <ProductCard
                          key={product._id || product.domain || idx}
                          product={product}
                          onSelect={handleSelectProduct}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 pt-8 pb-4">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={(filters.page || 1) <= 1}
                        onClick={() => handlePageChange(Math.max((filters.page || 1) - 1, 1))}
                        className="h-10 px-4 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs text-xs font-semibold"
                      >
                        Trang trước
                      </Button>

                      <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-2xs">
                        Trang {filters.page || 1} / {totalPages}
                      </span>

                      <Button
                        type="button"
                        variant="outline"
                        disabled={(filters.page || 1) >= totalPages}
                        onClick={() => handlePageChange(Math.min((filters.page || 1) + 1, totalPages))}
                        className="h-10 px-4 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs text-xs font-semibold"
                      >
                        Trang sau
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Monthly Winners View */}
              {activeTab === "monthly" && (
                <MonthlyWinnersView onSelectProduct={handleSelectProduct} />
              )}

              {/* Product Detail Modal */}
              <ProductDetailModal
                open={modalOpen}
                onOpenChange={handleModalClose}
                product={selectedProduct}
              />
            </div>
          )}
        </main>
      </div>

      {/* Upgrade Modal for Instant Payment via PayOS */}
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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
          <Header />
          <div className="container max-w-6xl mx-auto px-4 py-16">
            <ProductGridSkeleton count={9} />
          </div>
          <SiteFooter />
        </div>
      }
    >
      <WinningProductsContent />
    </Suspense>
  );
}
