"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  Home,
  ArrowLeft,
  Search,
  Sparkles,
  TrendingUp,
  Video,
  Pause,
  Play,
  RotateCcw,
  Compass,
  HeartCrack,
} from "lucide-react"

const AUTO_REDIRECT_SECONDS = 10

const QUICK_LINKS = [
  {
    href: "/",
    title: "Trang chủ",
    desc: "Khám phá tổng quan nền tảng Ads Spy",
    icon: Home,
    badge: "Chính",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
  },
  {
    href: "/quicksearch",
    title: "Quick Search",
    desc: "Tìm nhanh quảng cáo theo từ khóa & brand",
    icon: Sparkles,
    badge: "Mới",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
  },
  {
    href: "/facebook-ads-search",
    title: "Facebook Ads Spy",
    desc: "Kho dữ liệu quảng cáo Facebook toàn cầu",
    icon: Video,
    badge: "Hot",
    color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400",
  },
  {
    href: "/mkt",
    title: "YouTube Ads Spy",
    desc: "Bóc tách ngân sách & reach video ads",
    icon: TrendingUp,
    badge: "Trending",
    color: "from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400",
  },
]

export function NotFoundContent() {
  const router = useRouter()
  const [secondsLeft, setSecondsLeft] = useState<number>(AUTO_REDIRECT_SECONDS)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [hasHistory, setHasHistory] = useState<boolean>(false)

  // Kiểm tra xem trình duyệt có lịch sử trang trước đó không
  useEffect(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      setHasHistory(true)
    }
  }, [])

  // Đếm ngược tự động chuyển hướng về trang chủ
  useEffect(() => {
    if (isPaused) return

    if (secondsLeft <= 0) {
      router.push("/")
      return
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsLeft, isPaused, router])

  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  const handleResetTimer = useCallback(() => {
    setSecondsLeft(AUTO_REDIRECT_SECONDS)
    setIsPaused(false)
  }, [])

  const handleGoBack = useCallback(() => {
    if (hasHistory) {
      router.back()
    } else {
      router.push("/")
    }
  }, [hasHistory, router])

  const progressPercentage = ((AUTO_REDIRECT_SECONDS - secondsLeft) / AUTO_REDIRECT_SECONDS) * 100

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-pink-500/30 selection:text-pink-200">
      {/* Header điều hướng chung */}
      <Header />

      {/* Main Container */}
      <main className="relative flex-1 flex items-center justify-center px-4 py-12 md:py-16 overflow-hidden">
        {/* Glow Gradients nền phong cách anime pastel & cyber */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60"
        >
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink-500/15 blur-3xl" />
          <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950" />
        </div>

        {/* Nội dung chính dạng Card Glassmorphism */}
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="rounded-3xl border border-pink-500/20 bg-slate-900/60 p-6 md:p-10 backdrop-blur-xl shadow-2xl shadow-pink-500/5 ring-1 ring-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Cột trái: Ảnh Anime Cute Buồn Lạc Đường */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
                <div className="relative group">
                  {/* Aura sáng lung linh quanh ảnh anime */}
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-40 blur-xl group-hover:opacity-60 transition duration-700 animate-pulse" />
                  
                  {/* Khung chứa ảnh */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden border-2 border-pink-300/30 bg-slate-900/80 shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]">
                    <Image
                      src="/404-anime.jpg"
                      alt="Anime chibi bé gái dễ thương tìm trang bị lạc 404"
                      fill
                      priority
                      sizes="(max-width: 768px) 280px, 320px"
                      className="object-cover"
                    />
                  </div>

                  {/* Floating Anime Badge */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-slate-900/90 border border-pink-400/40 backdrop-blur-md shadow-lg flex items-center gap-2">
                    <HeartCrack className="w-4 h-4 text-pink-400 animate-bounce" />
                    <span className="text-xs font-medium text-pink-200">
                      (｡•́︿•̀｡) Lạc mất rồi...
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-xs text-slate-400 italic">
                  &ldquo;Bé tìm khắp dải ngân hà mà không thấy trang này đâu cả...&rdquo;
                </p>
              </div>

              {/* Cột phải: Thông điệp 404 & Nút Chuyển Hướng */}
              <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left space-y-6">
                
                {/* 404 Tag & Heading */}
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-pink-500/10 text-pink-300 border border-pink-500/30">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span>LỖI 404 - KHÔNG TÌM THẤY TRANG</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                      404 Not Found
                    </span>
                  </h1>

                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                    Huhu, trang bạn đang truy cập có thể đã bị xóa, thay đổi tên miền hoặc chưa từng tồn tại trên Ads Spy Tool.
                  </p>
                </div>

                {/* Thanh Đếm Ngược Tự Động Chuyển Hướng Về Trang Chủ */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span>
                        Tự động về <strong>Trang Chủ</strong> sau:{" "}
                        <span className="font-mono font-bold text-pink-400 text-base">
                          {secondsLeft}s
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleTogglePause}
                        className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center gap-1"
                        title={isPaused ? "Tiếp tục đếm ngược" : "Tạm dừng đếm ngược"}
                      >
                        {isPaused ? (
                          <>
                            <Play className="w-3 h-3 text-emerald-400" /> Tiếp tục
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3 text-amber-400" /> Dừng lại
                          </>
                        )}
                      </button>

                      {secondsLeft < AUTO_REDIRECT_SECONDS && (
                        <button
                          type="button"
                          onClick={handleResetTimer}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          title="Đặt lại thời gian"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Nhóm nút Chuyển hướng chính */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                  {/* Nút Về Trang Chủ Chính */}
                  <Button
                    asChild
                    size="lg"
                    className="relative group bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-pink-500/25 border-0 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Link href="/">
                      <Home className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-y-0.5" />
                      <span>Về Trang Chủ Ngay</span>
                    </Link>
                  </Button>

                  {/* Nút Quay Lại Trang Trước */}
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleGoBack}
                    className="bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-500 px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span>Quay lại trang trước</span>
                  </Button>

                  {/* Nút Tìm Kiếm Nhanh */}
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="text-slate-300 hover:text-pink-300 hover:bg-pink-500/10 px-4 py-3 rounded-xl transition-all duration-300"
                  >
                    <Link href="/quicksearch">
                      <Search className="w-4 h-4 mr-2 text-pink-400" />
                      <span>Tìm quảng cáo</span>
                    </Link>
                  </Button>
                </div>

                {/* Danh mục đề xuất truy cập nhanh */}
                <div className="pt-4 border-t border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                    Hoặc bạn có thể ghé thăm:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {QUICK_LINKS.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group p-2.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 hover:border-pink-500/40 transition-all duration-200 flex flex-col items-center text-center"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} border mb-1.5 transition-transform duration-300 group-hover:scale-110`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-medium text-slate-200 group-hover:text-pink-300 transition-colors line-clamp-1">
                            {item.title}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
