"use client"

import { Flame, Play, Eye, DollarSign, Layers, CheckCircle2, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuthSpyShowcaseProps {
  mode: "login" | "register"
}

export function AuthSpyShowcase({ mode }: AuthSpyShowcaseProps) {
  return (
    <div className="hidden lg:flex flex-col justify-between space-y-8 py-4">
      {/* Top Header Badge & Headline */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
          <span className="tracking-wide uppercase text-[11px] font-mono">Radar Intelligence Real-time</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
          {mode === "login" ? (
            <>
              Nghiên cứu chiến dịch đối thủ <br />
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                đang scale ngân sách khủng
              </span>
            </>
          ) : (
            <>
              Khám phá kho 10M+ Winning Ads <br />
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                và nhân bản chiến dịch thắng
              </span>
            </>
          )}
        </h1>

        <p className="text-sm xl:text-base text-slate-600 leading-relaxed max-w-lg">
          {mode === "login"
            ? "Đăng nhập để theo dõi vòng đời creative, xem ước tính chi tiêu và lưu lại các mẫu quảng cáo YouTube & Facebook hiệu quả nhất."
            : "Chỉ mất 30 giây để bắt đầu. Truy cập thư viện Nghiên cứu quảng cáo hàng đầu cho Media Buyers, E-commerce và Affiliate Marketers."}
        </p>
      </div>

      {/* Simulated Live Winning Ad Spy Card - Crisp Light Card */}
      <div className="relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xl shadow-slate-200/70 overflow-hidden">
        {/* Ambient interior soft glow */}
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        {/* HUD Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">ADS_SPY_FEED #40829</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold py-0.5 px-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5 inline-block" />
              Active 52 ngày
            </Badge>
            <Badge className="bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-semibold py-0.5 px-2">
              <Flame className="h-3 w-3 text-orange-500 mr-1 inline-block" />
              Vít scale mạnh
            </Badge>
          </div>
        </div>

        {/* Video Card Preview Layout */}
        <div className="grid sm:grid-cols-12 gap-4 items-center">
          {/* Simulated Video Thumbnail with Overlay */}
          <div className="sm:col-span-5 relative aspect-[9/14] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-md">
            {/* Visual gradient mock for video creative */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-rose-950/50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-black/80" />

            {/* Video badges */}
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-medium text-slate-200 border border-white/10">
                YouTube Shorts
              </span>
            </div>
            <div className="absolute top-2.5 right-2.5">
              <span className="px-2 py-0.5 rounded-full bg-rose-600/90 text-[10px] font-bold text-white">
                0:42s
              </span>
            </div>

            {/* Simulated Center Play HUD */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="h-11 w-11 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-950/50 transition-transform group-hover:scale-110">
                <Play className="h-5 w-5 fill-white ml-0.5" />
              </div>
              <span className="text-[11px] font-medium text-slate-200 bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
                Hook Rate: 64.8%
              </span>
            </div>

            {/* Bottom sound/format wave */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-slate-300 bg-slate-950/90 px-2 py-1 rounded backdrop-blur-sm border border-slate-800">
              <span className="font-mono text-emerald-400 font-bold">CTR: 3.42%</span>
              <span className="text-slate-400">Audio: Viral Trending</span>
            </div>
          </div>

          {/* Tactical Metrics breakdown */}
          <div className="sm:col-span-7 space-y-3">
            <div>
              <p className="text-[11px] font-mono text-rose-600 uppercase tracking-wider font-semibold">Winning Creative Alert</p>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                Bàn Chải Điện Sonic Pro Clean 360°
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                &ldquo;Đừng để cao răng làm bạn mất tự tin! Xem ngay cách tôi làm sạch răng tại nhà trong 2 phút...&rdquo;
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-2.5">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Ước tính Spend</span>
                </div>
                <p className="text-sm font-bold text-emerald-600 font-mono mt-0.5">$38,500+</p>
              </div>

              <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-2.5">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Eye className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Lượt tiếp cận</span>
                </div>
                <p className="text-sm font-bold text-indigo-600 font-mono mt-0.5">2.4M Views</p>
              </div>

              <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-2.5">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Layers className="h-3.5 w-3.5 text-amber-600" />
                  <span>Nhân nhóm</span>
                </div>
                <p className="text-sm font-bold text-amber-600 font-mono mt-0.5">42 Duplicates</p>
              </div>

              <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-2.5">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <TrendingUp className="h-3.5 w-3.5 text-rose-600" />
                  <span>Niche / Ngành</span>
                </div>
                <p className="text-sm font-bold text-slate-800 truncate mt-0.5">E-com / Sức khỏe</p>
              </div>
            </div>

            {/* Quick Tactical Tag */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 font-mono bg-slate-50 border border-slate-200/60 rounded-md px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="truncate">Phát hiện: Phễu Pre-landing tặng voucher 20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Value Props & Trust Badges */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Tải Video HD & Script Hook</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Phân tích Landing Page đối thủ</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Ước tính ngân sách chạy thật</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Cập nhật liên tục 24/7</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
              AD
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center">
              VN
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-emerald-500 text-[10px] font-bold text-white flex items-center justify-center">
              MB
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center">
              5k+
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Tin dùng bởi <strong className="text-slate-900 font-bold">5,200+ Performance Marketers</strong> & Media Buyers tại Việt Nam.
          </p>
        </div>
      </div>
    </div>
  )
}
