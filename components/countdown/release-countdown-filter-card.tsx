"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, CreditCard, Rocket, CheckCircle2 } from "lucide-react";
import { useVietnamCountdown } from "@/hooks/use-vietnam-countdown";
import { Button } from "@/components/ui/button";

interface ReleaseCountdownFilterCardProps {
  className?: string;
  onExplorePricing?: () => void;
}

export function ReleaseCountdownFilterCard({
  className = "",
  onExplorePricing,
}: ReleaseCountdownFilterCardProps) {
  const {
    formattedHours,
    formattedMinutes,
    formattedSeconds,
    isExpired,
    progressPercent,
    targetDisplay,
    isMounted,
  } = useVietnamCountdown(23, 0);

  // Tránh flash hiển thị khi chưa mount
  const displayHours = isMounted ? formattedHours : "08";
  const displayMinutes = isMounted ? formattedMinutes : "50";
  const displaySeconds = isMounted ? formattedSeconds : "00";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-purple-950/90 p-4 text-white shadow-xl shadow-indigo-950/40 transition-all duration-300 hover:border-indigo-400/60 ${className}`}
    >
      {/* Decorative Glow Elements */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl" />

      {/* Header Tag */}
      <div className="relative z-10 mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-900/40 px-2.5 py-1 text-[10px] font-bold tracking-wider text-indigo-300 uppercase">
          {!isExpired ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
              <span>LIVE COUNTDOWN</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-300">ĐÃ CHÍNH THỨC RELEASE</span>
            </>
          )}
        </div>

        <span className="font-mono text-[10px] text-slate-300" title="Giờ Việt Nam (GMT+7)">
          23:00 Tối Nay (VN)
        </span>
      </div>

      {/* Title & Slogan */}
      <div className="relative z-10 mb-3.5">
        <h4 className="flex items-center gap-1.5 text-xs font-black tracking-tight text-white uppercase sm:text-sm">
          <Rocket className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>Release Sản Phẩm Chính Thức</span>
        </h4>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
          {!isExpired
            ? "Mở toàn diện tính năng Facebook Ads & Kích hoạt cổng thanh toán Pricing."
            : "Toàn bộ tính năng Facebook Ads & Cổng thanh toán Pricing đã mở hoàn toàn!"}
        </p>
      </div>

      {/* Digital Countdown Boxes */}
      {!isExpired ? (
        <div className="relative z-10 mb-3.5">
          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Giờ */}
            <div className="group rounded-xl border border-indigo-500/30 bg-slate-900/80 p-2 shadow-inner backdrop-blur-sm transition-all hover:border-indigo-400">
              <span className="block font-mono text-xl font-black tracking-wider text-indigo-200">
                {displayHours}
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-indigo-300/80 uppercase">
                Giờ
              </span>
            </div>

            {/* Phút */}
            <div className="group rounded-xl border border-indigo-500/30 bg-slate-900/80 p-2 shadow-inner backdrop-blur-sm transition-all hover:border-indigo-400">
              <span className="block font-mono text-xl font-black tracking-wider text-indigo-200">
                {displayMinutes}
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-indigo-300/80 uppercase">
                Phút
              </span>
            </div>

            {/* Giây */}
            <div className="group rounded-xl border border-purple-500/30 bg-slate-900/80 p-2 shadow-inner backdrop-blur-sm transition-all hover:border-purple-400">
              <span className="block font-mono text-xl font-black tracking-wider text-purple-200">
                {displaySeconds}
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-purple-300/80 uppercase">
                Giây
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] text-slate-300 mb-1">
              <span>Tiến độ đến 23:00</span>
              <span className="font-mono font-bold text-indigo-300">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Expired Banner */
        <div className="relative z-10 mb-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-center">
          <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Cổng thanh toán & FB Ads đã mở!
          </p>
          <p className="text-[10px] text-slate-300 mt-1">
            Bắt đầu khám phá và nâng cấp ngay hôm nay để nhận ưu đãi đặc biệt.
          </p>
        </div>
      )}

      {/* Feature Bullet Points */}
      <div className="relative z-10 mb-3.5 space-y-1.5 rounded-xl bg-slate-900/60 p-2.5 text-[11px] border border-slate-800">
        <div className="flex items-center gap-2 text-slate-200">
          <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
          <span>Mở full dữ liệu Facebook Ads Spy</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <CreditCard className="h-3 w-3 text-cyan-400 shrink-0" />
          <span>Kích hoạt cổng thanh toán Pricing PayOS</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
          <span>Ưu đãi độc quyền kích hoạt đúng 23:00</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10">
        <Button
          asChild
          size="sm"
          onClick={onExplorePricing}
          className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:-translate-y-0.5"
        >
          <Link href="/pricing" className="flex items-center justify-center gap-1.5">
            <span>Xem Bảng Giá & Đặt Chỗ Ngay</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
