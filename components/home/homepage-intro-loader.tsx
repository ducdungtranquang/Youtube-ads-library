"use client";

import { useState, useEffect, useRef } from "react";
import { Playfair_Display } from "next/font/google";
import { Sparkles, ArrowRight, ShieldCheck, Video, Flame } from "lucide-react";

// Font serif cổ điển sang trọng chuẩn Editorial / Luxury Typography
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const WELCOME_CHARS = "Welcome".split("");
const BRAND_WORDS = [
  { text: "ADS", gradient: "from-indigo-600 via-indigo-500 to-purple-600", delay: 0 },
  { text: "SPY", gradient: "from-purple-600 via-pink-600 to-rose-500", delay: 120 },
  { text: "TOOL", gradient: "from-rose-500 via-orange-500 to-amber-500", delay: 240 }
];

export function HomepageIntroLoader() {
  const [stage, setStage] = useState<"welcome" | "transition" | "brand" | "exit" | "hidden">("welcome");
  const [progress, setProgress] = useState(15);
  const isSkippedRef = useRef(false);

  useEffect(() => {
    // Tôn trọng prefers-reduced-motion của người dùng
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("hidden");
      return;
    }

    // Timeline điều phối chuyển động nhanh gọn, mềm mại:
    // 0ms: Chữ Welcome (Playfair Display Italic) lướt vào (7 chữ x 100ms)
    // 1300ms: Welcome bắt đầu chuyển tiếp mờ dần nhẹ nhàng
    const tTransition = setTimeout(() => {
      if (isSkippedRef.current) return;
      setStage("transition");
    }, 1300);

    // 1650ms: Kích hoạt stage "brand" -> ADS SPY TOOL bung nở rực rỡ
    const tBrand = setTimeout(() => {
      if (isSkippedRef.current) return;
      setStage("brand");
      setProgress(60);
    }, 1650);

    // 2250ms: Progress đạt 100%
    const tProgress = setTimeout(() => {
      if (isSkippedRef.current) return;
      setProgress(100);
    }, 2250);

    // 2800ms: Rèm trượt lên để lộ homepage
    const tExit = setTimeout(() => {
      if (isSkippedRef.current) return;
      setStage("exit");
    }, 2800);

    // 3600ms: Ẩn hẳn khỏi DOM
    const tHidden = setTimeout(() => {
      setStage("hidden");
    }, 3600);

    return () => {
      clearTimeout(tTransition);
      clearTimeout(tBrand);
      clearTimeout(tProgress);
      clearTimeout(tExit);
      clearTimeout(tHidden);
    };
  }, []);

  const handleSkip = () => {
    isSkippedRef.current = true;
    setStage("exit");
    setTimeout(() => {
      setStage("hidden");
    }, 650);
  };

  if (stage === "hidden") return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-all duration-800 ease-[cubic-bezier(0.85,0,0.15,1)] cursor-pointer select-none ${stage === "exit" ? "-translate-y-full shadow-2xl opacity-95" : "translate-y-0 opacity-100"
        }`}
      aria-label="Welcome Intro Animation - Bấm bất kỳ đâu để vào trang"
      title="Bấm để vào trang ngay"
    >
      {/* Background Subtle Tech Grid on Pure White */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:32px_32px] pointer-events-none opacity-80" />

      {/* Ambient Soft Glow Spots */}
      <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-indigo-50/70 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-purple-50/70 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* Top Bar with Skip CTA */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100/90 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-950 transition-all cursor-pointer shadow-2xs group hover:scale-102"
        >
          <span>Vào trang ngay</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Central Sequence - Stacked in single fixed container */}
      <div className="relative z-10 px-6 w-full max-w-4xl mx-auto text-center min-h-[300px] flex items-center justify-center">
        {/* Slide 1: WELCOME (Playfair Display Italic, chạy chậm, siêu mềm mại) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-600 ease-in-out ${stage === "welcome"
            ? "opacity-100 translate-y-0 scale-100 filter-none pointer-events-auto"
            : "opacity-0 -translate-y-8 scale-95 blur-md pointer-events-none"
            }`}
        >
          {/* Subtitle Badge */}
          <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-spin" style={{ animationDuration: "5s" }} />
            <span>Chào mừng bạn đến với</span>
          </div>

          {/* Letter by Letter: Welcome in Playfair Display Italic */}
          <h1 className={`${playfair.className} italic font-semibold text-6xl sm:text-8xl md:text-9xl text-slate-900 tracking-tight flex items-center justify-center drop-shadow-sm`}>
            {WELCOME_CHARS.map((char, idx) => (
              <span
                key={idx}
                className="inline-block animate-char-luxury"
                style={{
                  animationDelay: `${idx * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                {char}
              </span>
            ))}
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto transition-opacity duration-700 delay-400">
            Nền tảng phân tích dữ liệu quảng cáo YouTube & Facebook chuyên sâu
          </p>
        </div>

        {/* Slide 2: ADS SPY TOOL (Chỉ kích hoạt khi stage chuyển sang brand) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-600 ease-out ${stage === "brand" || stage === "exit"
            ? "opacity-100 translate-y-0 scale-100 filter-none pointer-events-auto"
            : "opacity-0 translate-y-8 scale-95 blur-md pointer-events-none"
            }`}
        >
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-current" />
            <span>Intelligence Platform #1</span>
          </div>

          {/* ADS SPY TOOL: Tối ưu 100% cho iOS Safari WebKit, gradient rực rỡ và lướt lên mượt mà */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight uppercase flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
            {stage === "brand" || stage === "exit"
              ? BRAND_WORDS.map((word, wIdx) => (
                  <span
                    key={wIdx}
                    className={`inline-block animate-brand-word bg-gradient-to-r ${word.gradient} bg-clip-text text-transparent`}
                    style={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animationDelay: `${word.delay}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {word.text}
                  </span>
                ))
              : null}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto">
            Nghiên cứu ngân sách, lượt reach & kịch bản winning đối thủ
          </p>

          {/* Progress Bar & Realtime Badges */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="w-56 sm:w-72 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5 shadow-2xs">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Video className="h-3.5 w-3.5 text-red-500" />
                YouTube Ads
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                Facebook Ads
              </span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Realtime 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-6 z-10 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          Bấm bất kỳ đâu để bỏ qua màn hình chào mừng
        </p>
      </div>
    </div>
  );
}
