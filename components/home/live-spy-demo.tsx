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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5" />
          Nghiên cứu Trực Tiếp Dữ Liệu Thực Tế
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Xem Tường Tận Từng Chỉ Số <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Winning Ads</span>
        </h2>
        <p className="text-base text-slate-600 mt-4 leading-relaxed">
          Không còn phỏng đoán qua bề nổi. Xem cách Ads Spy Tool Nghiên cứu chi phí thực tế, số ngày vít ngân sách và cấu trúc phễu bán hàng của một chiến dịch đối thủ đang tạo doanh thu khủng.
        </p>
      </div>

      {/* Main Mockup Container */}
      <div className="relative mx-auto max-w-5xl rounded-3xl sm:rounded-[2.5rem] border border-slate-200 bg-white p-3.5 sm:p-6 md:p-8 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

        {/* Top Control Bar simulating software window */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 md:pb-5 mb-6 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5 sm:mr-2" />
              Đang Chạy (Active 48 ngày)
            </Badge>
            <Badge className="bg-purple-50 text-purple-700 border border-purple-200 font-semibold px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs">
              <Flame className="h-3.5 w-3.5 text-orange-500 mr-1 inline shrink-0" />
              Đang Vít Mạnh (36 Duplicates)
            </Badge>
          </div>
        </div>

        {/* Content Layout: Left Video Preview & Right Deep Analytics */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Creative Video Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4 min-w-0">
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
                  <Link href="/quicksearch" className="text-indigo-300 hover:text-white font-semibold flex items-center gap-1">
                    Dùng thử QuickSearch <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Direct Tool Action Buttons trỏ đến các trang thật */}
            <div className="grid grid-cols-2 gap-2 pt-1 max-w-sm mx-auto">
              <Button asChild size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs h-10 shadow-md shadow-indigo-600/20 cursor-pointer">
                <Link href="/quicksearch">
                  Dùng thử QuickSearch
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="w-full border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs h-10 cursor-pointer shadow-2xs">
                <Link href="/facebook-ads-search">
                  Xem Facebook Ads
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Deep Metrics & Reverse Engineering (7 cols) */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Ước Tính Chi Tiêu</span>
                </div>
                <div className="text-xl md:text-2xl font-black text-slate-900">$14,250</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">+18% tuần này</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Eye className="h-3.5 w-3.5 text-cyan-600" />
                  <span>Lượt Tiếp Cận (Reach)</span>
                </div>
                <div className="text-xl md:text-2xl font-black text-slate-900">1.85M</div>
                <div className="text-[11px] text-slate-500 mt-0.5">CPM TB: $7.70</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Layers className="h-3.5 w-3.5 text-purple-600" />
                  <span>Số Nhóm Nhân Bản</span>
                </div>
                <div className="text-xl md:text-2xl font-black text-purple-700">36 Ads</div>
                <div className="text-[11px] text-purple-600 font-semibold mt-0.5">Dấu hiệu Scale mạnh</div>
              </div>
            </div>

            {/* Switch Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("metrics")}
                className={`flex-1 px-1.5 sm:px-3 py-2 text-[11px] sm:text-xs md:text-sm font-bold rounded-lg text-center leading-tight transition-all cursor-pointer ${activeTab === "metrics"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Phân Bổ Geo & CPM
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("script")}
                className={`flex-1 px-1.5 sm:px-3 py-2 text-[11px] sm:text-xs md:text-sm font-bold rounded-lg text-center leading-tight transition-all cursor-pointer ${activeTab === "script"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Kịch Bản Hook 3s
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("funnel")}
                className={`flex-1 px-1.5 sm:px-3 py-2 text-[11px] sm:text-xs md:text-sm font-bold rounded-lg text-center leading-tight transition-all cursor-pointer ${activeTab === "funnel"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Phễu & Store Info
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 min-h-[220px]">
              {activeTab === "metrics" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-700">
                    <span className="font-semibold flex items-center gap-1.5 min-w-0">
                      <Globe2 className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span className="truncate">Phân bổ ngân sách theo Quốc gia (Geo)</span>
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 shrink-0">Thuật toán DSA Verified</span>
                  </div>

                  {/* Progress bars representing geo breakdown */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800">🇺🇸 Hoa Kỳ (Tier 1)</span>
                        <span className="text-indigo-600 font-bold">62% (~$8,835)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: "62%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800">🇬🇧 Vương quốc Anh (Tier 1)</span>
                        <span className="text-cyan-700 font-bold">23% (~$3,277)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: "23%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800">🇻🇳 Việt Nam / Đông Nam Á</span>
                        <span className="text-purple-700 font-bold">15% (~$2,138)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "15%" }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500">
                    <span>Thời gian bắt đầu: 12/08/2026</span>
                    <span>Tỷ lệ nhân nhóm: 3.2 nhóm mới/ngày</span>
                  </div>
                </div>
              )}

              {activeTab === "script" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-slate-800">
                    <span className="font-bold text-indigo-700 block mb-1">🔥 Hook 0:00 - 0:03 (Gây sốc thị giác):</span>
                    &ldquo;Đừng bao giờ tốn tiền thuê thợ dọn nội thất ô tô nữa nếu bạn chưa biết đến chiếc máy này...&rdquo;
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-slate-800">
                    <span className="font-bold text-amber-700 block mb-1">💡 Body 0:03 - 0:25 (Xử lý vấn đề & Demo):</span>
                    Trực tiếp hút sạch cát bẩn trên thảm xe chỉ sau 1 đường quét. So sánh lực hút 12000Pa với máy thông thường.
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-slate-800">
                    <span className="font-bold text-emerald-700 block mb-1">🎯 Call To Action 0:25 - 0:38:</span>
                    &ldquo;Ưu đãi 50% độc quyền hôm nay. Bấm vào link bên dưới nhận mã FREESHIP toàn quốc!&rdquo;
                  </div>
                </div>
              )}

              {activeTab === "funnel" && (
                <div className="space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ShoppingBag className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">Nền tảng E-commerce</div>
                        <div className="text-slate-500 truncate">Shopify (Theme Sense v11.0)</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 shrink-0 self-start sm:self-auto text-[11px] sm:text-xs font-semibold">
                      Dropshipping Winner
                    </Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5 min-w-0">
                    <div className="text-slate-600 flex items-center justify-between">
                      <span className="truncate">Đường dẫn Landing Page:</span>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 font-semibold shrink-0 ml-2 cursor-pointer"
                      >
                        {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Đã chép" : "Copy link"}
                      </button>
                    </div>
                    <div className="font-mono text-indigo-700 bg-slate-100 p-2 rounded-lg truncate text-[11px] sm:text-xs select-all">
                      https://trendstore-demo.myshopify.com/products/wireless-cleaner?utm_source=fb_ads
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1 text-[11px] text-slate-500">
                    <div className="truncate">Pixel phát hiện: <span className="text-slate-800 font-medium">Facebook Pixel, TikTok Pixel</span></div>
                    <div className="text-left sm:text-right shrink-0">Ước tính giá bán: <span className="text-slate-900 font-bold">$29.99 (Margin 68%)</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick action bar linking to real tools */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
              <span className="text-xs text-slate-700 font-semibold text-center sm:text-left">
                Bạn muốn Nghiên cứu ngay một fanpage hoặc kênh YouTube cụ thể?
              </span>
              <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                <Button asChild size="sm" className="w-full sm:w-auto h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs cursor-pointer">
                  <Link href="/quicksearch">
                    Trải Nghiệm QuickSearch
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="w-full sm:w-auto h-9 px-4 rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs">
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
