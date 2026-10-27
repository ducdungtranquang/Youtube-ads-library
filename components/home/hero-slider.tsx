"use client";

import { useRef, useState, useEffect, memo, useCallback } from "react";
import Link from "next/link";
import {
  Video, Sparkles, Users, Zap, ArrowRight, ShieldCheck,
  Search, Play, Pause, Volume2, VolumeX, Radio
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

  // Background Fullscreen Video References & Controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Toggle Video Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  // Toggle Video Audio Mute / Unmute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  // Ensure Video Autoplays on Initial Mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      className="relative w-full min-h-[92vh] lg:min-h-screen flex flex-col justify-between overflow-hidden text-white bg-black"
      aria-label="Hero Giới Thiệu Ads Spy Tool"
    >
      {/* 1. FULLSCREEN VIDEO BACKGROUND LAYER (Directly behind the text) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none">
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-center scale-[1.01] transition-opacity duration-700"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster="/banner_ads_spy.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/hero-video-panels.mp4" type="video/mp4" />
          <source src="/hero-video-panels-alt.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>

        {/* Cinematic Film Vignette & Readability Gradient Masks */}
        {/* Balanced Dark Tint: Clear video visibility while guaranteeing text readability */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Directional Gradients: Dark top for navigation bar + dark bottom for page transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

        {/* Radial Center Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]" />

        {/* Subtle Ambient Pulse Lights */}
        <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-indigo-500/20 rounded-full blur-[140px] animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-[140px] animate-pulse-slow"
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      {/* 2. FOREGROUND CONTENT (Sitting Directly in Front of Fullscreen Video) */}
      <div className="container relative z-10 mx-auto px-4 my-auto pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Shimmer Pill Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white uppercase tracking-wider shadow-2xl hover:border-white/40 transition-all">
            <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Nền tảng Ads Intelligence Số #1 Cho Marketer</span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-1 text-emerald-400 font-bold text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live 2026
            </span>
          </div>

          {/* Semantic H1 directly on top of fullscreen video with high-contrast text drop shadow */}
          <h1 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12] max-w-4xl mx-auto drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
            Nghiên cứu Ngân Sách, Lượt Reach &{" "}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(245,158,11,0.4)]">
              Chiến Dịch Winning
            </span>{" "}
            Đối Thủ
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed mb-10 font-medium drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
            Không còn đốt tiền thử nghiệm mò mẫm. Xem chi tiết ngân sách ước tính (Spend), số ngày chạy liên tục (Duration), nhóm nhân bản (Duplicates) và kịch bản video để tối ưu chiến dịch của bạn.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 w-full max-w-2xl">
            <Button
              asChild
              size="lg"
              className="h-13 px-7 rounded-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-2xl shadow-red-600/40 hover:scale-103 transition-all cursor-pointer text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Link href="/mkt" title="Khám phá kho YouTube Ads Unlisted">
                <Video className="mr-2 h-4 w-4 fill-white" />
                Kho YouTube Ads Chuyên Sâu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="h-13 px-7 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl shadow-blue-600/40 hover:scale-103 transition-all cursor-pointer text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Link href="/facebook-ads-search" title="Xem Facebook Ads Scaling và Duplicates">
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
              className="h-13 px-6 rounded-2xl font-semibold border-white/30 text-white bg-black/50 hover:bg-white hover:text-slate-950 cursor-pointer backdrop-blur-xl transition-all text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-white shadow-xl shadow-black/40"
            >
              <Link href="/quicksearch" title="Tìm kiếm quảng cáo đa kênh quốc tế">
                <Search className="mr-2 h-4 w-4" />
                Tìm Kiếm Đa Kênh Quốc Tế
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 3. DOCKED LIVE METRICS STATS BAR (Docked At The Bottom Of Fullscreen Hero) */}
      <div className="container relative z-10 mx-auto px-4 pb-10 md:pb-14">
        <div className="flex flex-wrap justify-center gap-3.5 md:gap-6 text-white">
          <div className="flex items-center gap-3.5 bg-black/55 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/15 shadow-2xl hover:scale-102 hover:border-indigo-500/50 transition-all duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/30 text-yellow-300 border border-indigo-500/40">
              <Video className="h-5 w-5" />
            </div>
            <div className="text-left" ref={stat1.ref}>
              <p className="text-xl md:text-2xl font-black">{stat1.count}.5M+</p>
              <p className="text-[11px] text-slate-300 font-medium">Dữ liệu Ads toàn cầu</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-black/55 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/15 shadow-2xl hover:scale-102 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/30 text-cyan-300 border border-cyan-500/40">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-left" ref={stat2.ref}>
              <p className="text-xl md:text-2xl font-black">{stat2.count.toLocaleString()}+</p>
              <p className="text-[11px] text-slate-300 font-medium">Marketers & Media Buyers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-black/55 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/15 shadow-2xl hover:scale-102 hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xl md:text-2xl font-black">98.4%</p>
              <p className="text-[11px] text-slate-300 font-medium">Độ chuẩn xác Spend/CPM</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-black/55 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/15 shadow-2xl hover:scale-102 hover:border-pink-500/50 transition-all duration-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/30 text-pink-300 border border-pink-500/40">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xl md:text-2xl font-black">Real-time</p>
              <p className="text-[11px] text-slate-300 font-medium">Cập nhật 24/7 liên tục</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DISCREET BACKGROUND VIDEO CONTROLLER (Bottom-Right Floating Chip) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={togglePlay}
          type="button"
          className="h-8 w-8 rounded-full bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all shadow-xl focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
          aria-label={isPlaying ? "Tạm dừng video nền" : "Tiếp tục phát video nền"}
          title={isPlaying ? "Tạm dừng video nền" : "Tiếp tục phát video nền"}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
        </button>

        <button
          onClick={toggleMute}
          type="button"
          className="h-8 w-8 rounded-full bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all shadow-xl focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
          aria-label={isMuted ? "Bật âm thanh video nền" : "Tắt âm thanh video nền"}
          title={isMuted ? "Bật âm thanh video nền" : "Tắt âm thanh video nền"}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5 text-amber-300" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-300" />}
        </button>
      </div>
    </section>
  );
});

HeroSlider.displayName = "HeroSlider";