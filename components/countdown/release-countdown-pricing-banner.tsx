"use client";

import { Sparkles, Clock, Rocket, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useVietnamCountdown } from "@/hooks/use-vietnam-countdown";

export function ReleaseCountdownPricingBanner() {
  const {
    formattedHours,
    formattedMinutes,
    formattedSeconds,
    isExpired,
    progressPercent,
    targetDisplay,
    isMounted,
  } = useVietnamCountdown(23, 0);

  const displayHours = isMounted ? formattedHours : "08";
  const displayMinutes = isMounted ? formattedMinutes : "50";
  const displaySeconds = isMounted ? formattedSeconds : "00";

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-purple-950/80 p-6 md:p-8 text-white shadow-2xl shadow-indigo-950/50">
      {/* Decorative Orbs */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Information */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-900/50 px-3.5 py-1 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            {!isExpired ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                </span>
                <span>Thông Báo Release Chính Thức</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Đã Mở Cổng Thanh Toán</span>
              </>
            )}
            <span className="text-slate-400 font-mono text-[11px]">• 23:00 GMT+7 Tối Nay</span>
          </div>

          <h2 className="text-xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Rocket className="h-6 w-6 text-indigo-400 shrink-0" />
            <span>Mở Cổng Thanh Toán &amp; Kích Hoạt Facebook Ads</span>
          </h2>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            {!isExpired ? (
              <>
                Hệ thống thanh toán tự động qua <strong className="text-white">PayOS</strong> và toàn quyền truy cập{" "}
                <strong className="text-indigo-300">Facebook Ads Intelligence</strong> sẽ chính thức mở vào lúc{" "}
                <strong className="text-amber-300">23:00 tối nay (Giờ Việt Nam)</strong>. Bạn có thể xem trước các gói cước và sẵn sàng nâng cấp ngay khi giờ G điểm!
              </>
            ) : (
              <>
                🎉 Cổng thanh toán và toàn bộ tính năng Facebook Ads đã chính thức kích hoạt thành công! Hãy chọn gói cước phù hợp bên dưới để bắt đầu ngay.
              </>
            )}
          </p>

          {/* Quick Badges */}
          <div className="pt-1 flex flex-wrap gap-2.5 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-slate-800 px-2.5 py-1">
              <CreditCard className="h-3.5 w-3.5 text-cyan-400" />
              Thanh toán QR Tự động 100%
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-slate-800 px-2.5 py-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Full Facebook &amp; Youtube Ads
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-slate-800 px-2.5 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Bảo hành kích hoạt tức thì
            </span>
          </div>
        </div>

        {/* Right Countdown Clock Display */}
        <div className="shrink-0 lg:w-80">
          {!isExpired ? (
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
                  <Clock className="h-4 w-4" />
                  Thời gian đếm ngược
                </span>
                <span className="font-mono text-[11px] text-slate-400">Target: 23:00</span>
              </div>

              {/* 3 Large Digits */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/40 p-3">
                  <span className="block font-mono text-2xl md:text-3xl font-black text-indigo-100">
                    {displayHours}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400/80 uppercase">Giờ</span>
                </div>

                <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/40 p-3">
                  <span className="block font-mono text-2xl md:text-3xl font-black text-indigo-100">
                    {displayMinutes}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-400/80 uppercase">Phút</span>
                </div>

                <div className="rounded-xl border border-purple-500/20 bg-purple-950/40 p-3">
                  <span className="block font-mono text-2xl md:text-3xl font-black text-purple-200">
                    {displaySeconds}
                  </span>
                  <span className="text-[10px] font-bold text-purple-400/80 uppercase">Giây</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Tiến trình ngày hôm nay</span>
                  <span className="font-mono font-bold text-indigo-300">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/50 p-6 text-center shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-300 mb-1">
                Đã Chính Thức Mở Cổng
              </h4>
              <p className="text-xs text-slate-300">
                Cổng thanh toán PayOS đang hoạt động bình thường. Chọn gói phía dưới để thanh toán ngay!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
