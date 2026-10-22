"use client";

import { useRef, useState, useEffect, memo } from "react";
import Link from "next/link";
import {
  Video, Sparkles, Users, Zap, ArrowRight, ShieldCheck,
  Search, Flame, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

export const HeroSlider = memo(() => {
  const stat1 = useCountUp(12, 2000, false);
  const stat2 = useCountUp(8500, 2500, false);

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28 lg:py-32 text-white bg-slate-950">
      {/* Background Glow Mesh & Radial Gradients */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-all duration-700 pointer-events-none"
        style={{ backgroundImage: "url('/banner_ads_spy.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/90 via-slate-950/95 to-slate-950 pointer-events-none" />

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Multi-layer Ambient Pulsing Lights */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/25 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-cyan-400/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Main Hero Content - Fixed Layout Zero CLS */}
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Shimmer Pill Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md border border-indigo-400/30 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white uppercase tracking-wider shadow-xl hover:border-indigo-400/60 transition-all">
            <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Nền tảng Ads Intelligence Số #1 Cho Marketer</span>
          </div>

          {/* Solid Non-Jumping Headline with Rich Gradient */}
          <h1 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12] max-w-4xl mx-auto">
            Nghiên cứu Ngân Sách, Lượt Reach &{" "}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Chiến Dịch Winning
            </span>{" "}
            Đối Thủ
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Không còn đốt tiền thử nghiệm mò mẫm. Xem chi tiết ngân sách ước tính (Spend), số ngày chạy liên tục (Duration), nhóm nhân bản (Duplicates) và kịch bản video để tối ưu chiến dịch của bạn.
          </p>

          {/* Primary Action Buttons - Prominent & Perfectly Centered */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 w-full max-w-2xl">
            <Button
              asChild
              size="lg"
              className="h-13 px-7 rounded-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-xl shadow-red-600/30 hover:scale-103 transition-all cursor-pointer text-sm sm:text-base"
            >
              <Link href="/mkt">
                <Video className="mr-2 h-4 w-4 fill-white" />
                Kho YouTube Ads Chuyên Sâu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="h-13 px-7 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 hover:scale-103 transition-all cursor-pointer text-sm sm:text-base"
            >
              <Link href="/facebook-ads-search">
                <ShieldCheck className="mr-2 h-4 w-4 fill-white/20" />
                Facebook Ads Spy & Duplicates
                <span className="ml-2.5 px-2.5 py-0.5 text-xs font-black bg-amber-400 text-slate-950 rounded-full shadow-md animate-pulse">1/11</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 px-6 rounded-2xl font-semibold border-white/20 text-white bg-slate-900/60 hover:bg-white cursor-pointer transition-all text-sm sm:text-base"
            >
              <Link href="/quicksearch">
                <Search className="mr-2 h-4 w-4" />
                Tìm Kiếm Đa Kênh Quốc Tế
              </Link>
            </Button>
          </div>
        </div>

        {/* Floating Mockup Cards (Desktop Visual Flair) */}
        <div className="relative mt-12 max-w-5xl mx-auto">
          {/* Floating Left Card: YouTube Spy Card */}
          <div className="hidden lg:block absolute -top-40 -left-12 z-20 w-72 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-indigo-500/30 p-4 shadow-2xl shadow-indigo-950/80 animate-float">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 border border-red-500/30 text-red-300">
                <Play className="h-2.5 w-2.5 fill-current" />
                YouTube Unlisted Ad
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="space-y-1.5">
              <p className="font-bold text-xs text-white line-clamp-1">Kịch bản Nghiên cứu Hook 3s Dropshipping</p>
              <p className="text-[11px] text-slate-400">Kênh: Alpha Scale Brands</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Ước tính Spend</p>
                <p className="font-black text-emerald-400 text-sm">$18,450</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Tỷ lệ CTR</p>
                <p className="font-black text-indigo-400 text-sm">4.2%</p>
              </div>
            </div>
          </div>

          {/* Floating Right Card: Facebook Scaling Card */}
          <div className="hidden lg:block absolute -top-36 -right-12 z-20 w-72 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-purple-500/30 p-4 shadow-2xl shadow-purple-950/80 animate-float-reverse">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300">
                <Flame className="h-3 w-3 text-amber-400 fill-current" />
                18 Duplicates Scaling
              </span>
              <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                Hot Scale
              </span>
            </div>
            <div className="space-y-1.5">
              <p className="font-bold text-xs text-white line-clamp-1">GlowSkin Pro - Serum Dưỡng Trắng</p>
              <p className="text-[11px] text-slate-400">Fanpage: Glow Official Store</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Tốc độ bùng nổ</p>
                <p className="font-black text-amber-400 text-sm">Burst 96/100</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Lịch chạy</p>
                <p className="font-black text-cyan-400 text-sm">21 ngày liên tục</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Stats Grid */}
        <div className="mt-14 md:mt-18 flex flex-wrap justify-center gap-4 md:gap-6 text-white">
          <div className="flex items-center gap-3.5 bg-slate-900/70 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-xl hover:scale-102 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-yellow-300 border border-indigo-500/30">
              <Video className="h-5 w-5" />
            </div>
            <div className="text-left" ref={stat1.ref}>
              <p className="text-2xl font-black">{stat1.count}.5M+</p>
              <p className="text-xs text-slate-300 font-medium">Dữ liệu Ads toàn cầu</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-900/70 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-xl hover:scale-102 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-left" ref={stat2.ref}>
              <p className="text-2xl font-black">{stat2.count.toLocaleString()}+</p>
              <p className="text-xs text-slate-300 font-medium">Marketers & Media Buyers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-900/70 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-xl hover:scale-102 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black">98.4%</p>
              <p className="text-xs text-slate-300 font-medium">Độ chuẩn xác Spend/CPM</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-900/70 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-xl hover:scale-102 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black">Real-time</p>
              <p className="text-xs text-slate-300 font-medium">Cập nhật 24/7 liên tục</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSlider.displayName = "HeroSlider";