"use client";

import { useRef, useState, useEffect, memo } from "react";
import { Video, Sparkles, Users, Zap } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

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

const heroSlides = [
  {
    badge: "#1 Nền tảng Spy Ads Cho Marketers Việt Nam",
    title: "Khám Phá Bí Mật Quảng Cáo Thành Công",
    description: "Phân tích hàng triệu quảng cáo YouTube & Facebook. Tìm insight đối thủ và chiến lược winning ads chuẩn xác nhất.",
  },
  {
    badge: "YouTube Ads Intelligence",
    title: "Nghiên Cứu Video Ads Đối Thủ Từng Giây",
    description: "Khám phá video ẩn & công khai, theo dõi chiến dịch ngân sách lớn từ các thương hiệu hàng đầu.",
  },
  {
    badge: "Facebook Winning Ads Scale",
    title: "Đón Đầu Xu Hướng Scaling & E-commerce",
    description: "Lọc các mẫu quảng cáo chiến thắng, bóc tách phễu marketing và đo lường mức độ chi tiêu hiệu quả.",
  },
];

export const HeroSlider = memo(() => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    const timer = setInterval(() => api.scrollNext(), 5000);
    return () => {
      api.off("select", onSelect);
      clearInterval(timer);
    };
  }, [api]);

  const stat1 = useCountUp(10, 2000, false);
  const stat2 = useCountUp(5000, 2500, false);

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-36 lg:py-44 text-white bg-slate-950">
      <div className="absolute inset-0 bg-[image:var(--bg-mobile)] sm:bg-[image:var(--bg-tablet)] md:bg-[image:var(--bg-desktop)] bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          ["--bg-desktop" as any]: "url('/banner_ads_spy.jpg')",
          ["--bg-tablet" as any]: "url('/banner_ads_spy_tb.jpg')",
          ["--bg-mobile" as any]: "url('/baner_ads_spy_mb.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/85 via-indigo-950/75 to-blue-950/90 backdrop-blur-[2px]" />
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none animate-ping" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <Carousel setApi={setApi} opts={{ loop: true }} className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {heroSlides.map((slide, idx) => (
              <CarouselItem key={idx}>
                <div className="flex flex-col items-center justify-center text-center px-4 py-4">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs md:text-sm font-semibold text-white uppercase tracking-wider shadow-xl animate-bounce-subtle">
                    <Sparkles className="h-4 w-4 text-yellow-300 animate-spin" style={{ animationDuration: '5s' }} />
                    {slide.badge}
                  </div>
                  <h1 className="mb-4 text-3xl font-black tracking-tight text-white md:text-5xl lg:text-6xl leading-tight max-w-3xl">
                    {slide.title.split(" ")[0]} {slide.title.split(" ")[1]}{" "}
                    <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                      {slide.title.split(" ").slice(2).join(" ")}
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-12 border-white/20 bg-white/10 text-white hover:bg-white/25 hover:text-white cursor-pointer transition-all hidden lg:flex" />
          <CarouselNext className="right-2 md:-right-12 border-white/20 bg-white/10 text-white hover:bg-white/25 hover:text-white cursor-pointer transition-all hidden lg:flex" />
        </Carousel>

        <div className="mt-14 mb-8 flex flex-wrap justify-center gap-6 md:gap-10 text-white">
          <div className="flex items-center gap-3.5 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-yellow-300 border border-indigo-500/30">
              <Video className="h-5 w-5" />
            </div>
            <div className="text-left" ref={stat1.ref}>
              <p className="text-2xl font-extrabold">{stat1.count}M+</p>
              <p className="text-xs text-white/70 font-medium">Quảng cáo phân tích</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-left" ref={stat2.ref}>
              <p className="text-2xl font-extrabold">{stat2.count.toLocaleString()}+</p>
              <p className="text-xs text-white/70 font-medium">Marketers tin dùng</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-extrabold">24/7</p>
              <p className="text-xs text-white/70 font-medium">Cập nhật real-time</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${current === idx ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
HeroSlider.displayName = "HeroSlider";