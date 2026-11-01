"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useVietnamCountdown } from "@/hooks/use-vietnam-countdown";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ads_spy_release_banner_dismissed_v1";

export function ReleaseCountdownTopBar() {
  const {
    formattedHours,
    formattedMinutes,
    formattedSeconds,
    isExpired,
    isMounted,
  } = useVietnamCountdown(23, 0);

  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        setIsDismissed(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors
    }
  };

  if (isDismissed) {
    return null;
  }

  // Giữ fallback ổn định trước khi mount ở client
  const displayHours = isMounted ? formattedHours : "08";
  const displayMinutes = isMounted ? formattedMinutes : "50";
  const displaySeconds = isMounted ? formattedSeconds : "00";

  return (
    <div className="relative z-50 w-full border-b border-indigo-500/30 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white shadow-md">
      {/* Background Subtle Gradient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] pointer-events-none" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex min-h-[42px] py-1.5 sm:py-2 items-center justify-between gap-3 text-xs">
          {/* Left Tag + Slogan */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Live Indicator Badge */}
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-indigo-400/40 bg-indigo-900/60 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 uppercase tracking-wider shadow-xs">
              {!isExpired ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                  </span>
                  <span>Sự kiện 23h Tối Nay</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  <span>Đã Phát Hành</span>
                </>
              )}
            </span>

            {/* Announcement Text */}
            <p className="truncate text-slate-200 text-[11px] sm:text-xs">
              <span className="font-semibold text-white">Chính thức Release:</span>{" "}
              <span className="hidden sm:inline">Mở toàn bộ tính năng</span>{" "}
              <span className="text-indigo-300 font-bold">Facebook Ads</span> &amp;{" "}
              <span className="text-purple-300 font-bold">Cổng thanh toán Pricing</span>{" "}
              <span className="text-slate-400 font-mono text-[11px]">(23:00 GMT+7)</span>
            </p>
          </div>

          {/* Right: Live Countdown Clock + CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isExpired ? (
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-indigo-200 bg-slate-900/90 border border-indigo-500/30 px-2.5 py-1 rounded-lg shadow-inner">
                <Clock className="h-3.5 w-3.5 text-indigo-400 mr-1 hidden sm:inline" />
                <span className="bg-indigo-950/80 px-1.5 py-0.5 rounded text-white border border-indigo-500/20">
                  {displayHours}
                </span>
                <span className="text-indigo-400 animate-pulse">:</span>
                <span className="bg-indigo-950/80 px-1.5 py-0.5 rounded text-white border border-indigo-500/20">
                  {displayMinutes}
                </span>
                <span className="text-indigo-400 animate-pulse">:</span>
                <span className="bg-indigo-950/80 px-1.5 py-0.5 rounded text-white border border-indigo-500/20">
                  {displaySeconds}
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                <Sparkles className="h-3 w-3" />
                Đang Mở Cổng
              </span>
            )}

            {/* CTA Button */}
            <Button
              asChild
              size="sm"
              className="h-7 px-3 text-[11px] font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 hidden md:inline-flex cursor-pointer"
            >
              <Link href="/pricing" className="flex items-center gap-1">
                <span>Xem Pricing</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Ẩn thông báo"
              aria-label="Đóng thanh đếm ngược"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
