"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  ExternalLink,
  DollarSign,
  Eye,
  Layers,
  Calendar,
  TrendingUp,
  Globe2,
  Sparkles,
  Copy,
  Check,
  ShoppingBag,
  Flame,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LiveSpyDemo() {
  const [activeTab, setActiveTab] = useState<"metrics" | "script" | "funnel">("metrics");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://trendstore-demo.myshopify.com/products/wireless-cleaner");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="container py-20 scroll-fade-section transition-all duration-700">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Bóc Tách Trực Tiếp Dữ Liệu Thực Tế
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Xem Tường Tận Từng Chỉ Số <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Winning Ads</span>
        </h2>
        <p className="text-base text-slate-400 mt-4 leading-relaxed">
          Không còn phỏng đoán qua bề nổi. Xem cách Ads Spy Tool bóc tách chi phí thực tế, số ngày vít ngân sách và cấu trúc phễu bán hàng của một chiến dịch đối thủ đang tạo doanh thu khủng.
        </p>
      </div>

      {/* Main Mockup Container */}
      <div className="relative mx-auto max-w-5xl rounded-[2.5rem] border border-indigo-500/30 bg-slate-900/90 p-4 md:p-8 backdrop-blur-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-indigo-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

        {/* Top Control Bar simulating software window */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
            {/* <span className="ml-3 font-mono text-slate-400 hidden sm:inline">
              LIVE_AD_INSPECTOR // ID: #YT-ADS-89421
            </span> */}
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
              Đang Chạy (Active 48 ngày)
            </Badge>
            <Badge className="bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold px-3 py-1">
              <Flame className="h-3.5 w-3.5 text-orange-400 mr-1 inline" />
              Đang Vít Mạnh (36 Duplicates)
            </Badge>
          </div>
        </div>

        {/* Content Layout: Left Video Preview & Right Deep Analytics */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Creative Video Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[9/16] max-h-[460px] mx-auto w-full max-w-sm rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
              {/* Background Mock Video Image */}
              <Image
                src="/marketing-video-thumbnail.png"
                alt="Winning Ad Creative Preview"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* Floating Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  YouTube Shorts / FB Reel
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/80 text-white text-[11px] font-bold">
                  0:38s
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-16 w-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl border border-white/30 backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Play className="h-7 w-7 fill-white ml-1" />
                </div>
              </div>

              {/* Bottom Video Meta */}
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <p className="text-sm font-bold text-white line-clamp-2">
                  Máy Hút Bụi Mini Cầm Tay Không Dây 12000Pa - Deal Sốc Giảm 50%
                </p>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-white/10">
                  <span>Trang đích: trendstore-demo...</span>
                  <Link href="/mkt" className="text-indigo-300 hover:text-white font-semibold flex items-center gap-1">
                    Xem trên YouTube Ads <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Direct Tool Action Buttons trỏ đến các trang thật */}
            <div className="grid grid-cols-2 gap-2 pt-1 max-w-sm mx-auto">
              <Button asChild size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs h-10 shadow-lg shadow-indigo-600/30 cursor-pointer">
                <Link href="/mkt">
                  Xem YouTube Ads
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="w-full border-slate-700 bg-slate-950/80 hover:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs h-10 cursor-pointer">
                <Link href="/facebook-ads-search">
                  Xem Facebook Ads
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Deep Metrics & Reverse Engineering (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Ước Tính Chi Tiêu</span>
                </div>
                <div className="text-xl md:text-2xl font-black text-white">$14,250</div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">+18% tuần này</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Lượt Tiếp Cận (Reach)</span>
                </div>
                <div className="text-xl md:text-2xl font-black text-white">1.85M</div>
                <div className="text-[11px] text-slate-400 mt-0.5">CPM TB: $7.70</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Layers className="h-3.5 w-3.5 text-purple-400" />
                  <span>Số Nhóm Nhân Bản</span>
                </div>
                <div className="text-xl md:text-2xl font-black text-purple-300">36 Ads</div>
                <div className="text-[11px] text-purple-400 font-medium mt-0.5">Dấu hiệu Scale mạnh</div>
              </div>
            </div>

            {/* Switch Tabs */}
            <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("metrics")}
                className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === "metrics"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                Phân Bổ Geo & CPM
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("script")}
                className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === "script"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                Kịch Bản Hook 3s
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("funnel")}
                className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === "funnel"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                Phễu & Store Info
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 min-h-[220px]">
              {activeTab === "metrics" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Globe2 className="h-4 w-4 text-indigo-400" />
                      Phân bổ ngân sách theo Quốc gia (Geo Targeting)
                    </span>
                    <span className="text-slate-400">Thuật toán DSA Verified</span>
                  </div>

                  {/* Progress bars representing geo breakdown */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-white">🇺🇸 Hoa Kỳ (Tier 1)</span>
                        <span className="text-indigo-300">62% (~$8,835)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: "62%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-white">🇬🇧 Vương quốc Anh (Tier 1)</span>
                        <span className="text-indigo-300">23% (~$3,277)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: "23%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-white">🇻🇳 Việt Nam / Đông Nam Á</span>
                        <span className="text-indigo-300">15% (~$2,138)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "15%" }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Thời gian bắt đầu: 12/08/2026</span>
                    <span>Tỷ lệ nhân nhóm: 3.2 nhóm mới/ngày</span>
                  </div>
                </div>
              )}

              {activeTab === "script" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-slate-200">
                    <span className="font-bold text-indigo-400 block mb-1">🔥 Hook 0:00 - 0:03 (Gây sốc thị giác):</span>
                    &ldquo;Đừng bao giờ tốn tiền thuê thợ dọn nội thất ô tô nữa nếu bạn chưa biết đến chiếc máy này...&rdquo;
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                    <span className="font-bold text-amber-400 block mb-1">💡 Body 0:03 - 0:25 (Xử lý vấn đề & Demo):</span>
                    Trực tiếp hút sạch cát bẩn trên thảm xe chỉ sau 1 đường quét. So sánh lực hút 12000Pa với máy thông thường.
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-slate-200">
                    <span className="font-bold text-emerald-400 block mb-1">🎯 Call To Action 0:25 - 0:38:</span>
                    &ldquo;Ưu đãi 50% độc quyền hôm nay. Bấm vào link bên dưới nhận mã FREESHIP toàn quốc!&rdquo;
                  </div>
                </div>
              )}

              {activeTab === "funnel" && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="h-4 w-4 text-emerald-400" />
                      <div>
                        <div className="font-bold text-white">Nền tảng E-commerce</div>
                        <div className="text-slate-400">Shopify (Theme Sense v11.0)</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      Dropshipping Winner
                    </Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="text-slate-400 flex items-center justify-between">
                      <span>Đường dẫn Landing Page:</span>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-semibold"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Đã chép" : "Copy link"}
                      </button>
                    </div>
                    <div className="font-mono text-indigo-300 bg-slate-950 p-2 rounded-lg truncate">
                      https://trendstore-demo.myshopify.com/products/wireless-cleaner?utm_source=fb_ads
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
                    <div>Pixel phát hiện: Facebook Pixel, TikTok Pixel</div>
                    <div className="text-right">Ước tính giá bán: $29.99 (Margin 68%)</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick action bar linking to real tools */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
              <span className="text-xs text-slate-300 font-medium text-center sm:text-left">
                Bạn muốn bóc tách ngay một fanpage hoặc kênh YouTube cụ thể?
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button asChild size="sm" className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md cursor-pointer">
                  <Link href="/quicksearch">
                    Mở QuickSearch
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-9 px-4 rounded-xl border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer">
                  <Link href="/pricing">
                    Xem Bảng Giá
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
