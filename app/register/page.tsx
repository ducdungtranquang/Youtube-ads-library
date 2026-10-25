"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { AuthSpyShowcase } from "@/components/auth/auth-spy-showcase"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import {
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap
} from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const { signUp, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && !hasRedirected.current) {
      hasRedirected.current = true
      setRedirecting(true)
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  // Show redirecting state
  if (!authLoading && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
          <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
          <p className="text-sm font-semibold text-slate-700">Đang chuyển hướng đến bảng điều khiển...</p>
        </div>
      </div>
    )
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error("Mật khẩu phải có tối thiểu 6 ký tự.")
      return
    }

    setLoading(true)

    try {
      const refCode = typeof window !== 'undefined' ? localStorage.getItem('ads_spy_ref') : null
      const { error } = await signUp(email, password, fullName, refCode || undefined)
      if (error) {
        toast.error(error.message || "Tạo tài khoản thất bại. Vui lòng kiểm tra lại thông tin.")
      } else {
        if (refCode) {
          fetch('/api/affiliate/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referralCode: refCode, eventType: 'signup' })
          }).catch(() => {})
        }
        toast.success("Tài khoản đã được tạo thành công! Vui lòng kiểm tra email để xác minh.")
      }
    } catch {
      toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* Background Grid & Ambient Radial Lighting */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)]" />
      <div className="fixed top-0 left-1/4 h-96 w-96 rounded-full bg-rose-200/40 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 h-96 w-96 rounded-full bg-indigo-200/40 blur-[140px] pointer-events-none" />

      {/* Main App Header */}
      <Header />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex items-center justify-center relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl w-full mx-auto">
          {/* Left Column: Ads Spy Tactical Showcase */}
          <div className="lg:col-span-7">
            <AuthSpyShowcase mode="register" />
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl shadow-slate-200/70">
              {/* Subtle top border highlight */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

              {/* Mode Switcher Tabs */}
              <div className="flex p-1 mb-6 rounded-xl bg-slate-100 border border-slate-200/70">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
                >
                  Đăng nhập
                </Link>
                <span className="flex-1 text-center py-2 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs border border-slate-200/80 transition-all">
                  Đăng ký mới
                </span>
              </div>

              {/* Card Title */}
              <div className="space-y-1.5 text-left mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Tạo tài khoản miễn phí</h2>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bắt đầu Nghiên cứu winning ads trong 30 giây. Không cần thẻ tín dụng.
                </p>
              </div>

              {/* Prominent Google OAuth Button (Featured at Top) */}
              <div className="mb-5">
                <GoogleAuthButton
                  mode="register"
                  disabled={loading || redirecting}
                  prominent={true}
                />
              </div>

              {/* Clean Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-mono">
                  <span className="bg-white px-3 text-slate-400 font-semibold">Hoặc đăng ký bằng email</span>
                </div>
              </div>

              {/* Register Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                    Họ và tên
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-10 h-11 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-rose-500 focus-visible:ring-rose-500/20 text-slate-900 placeholder:text-slate-400 rounded-xl text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                    Email công việc
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="media-buyer@agency.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-rose-500 focus-visible:ring-rose-500/20 text-slate-900 placeholder:text-slate-400 rounded-xl text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                      Mật khẩu
                    </Label>
                    <span className="text-[11px] text-slate-400 font-medium">Tối thiểu 6 ký tự</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tạo mật khẩu an toàn"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10 pr-10 h-11 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-rose-500 focus-visible:ring-rose-500/20 text-slate-900 placeholder:text-slate-400 rounded-xl text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit CTA Button */}
                <Button
                  type="submit"
                  disabled={loading || redirecting}
                  className="w-full h-11 font-bold rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-lg shadow-rose-600/25 cursor-pointer active:scale-[0.99] transition-all disabled:opacity-60"
                >
                  {redirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang chuyển hướng...
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang khởi tạo tài khoản...
                    </>
                  ) : (
                    <>
                      Tạo tài khoản & Bắt đầu Spy
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Switch to Login */}
              <div className="text-center text-xs text-slate-500 pt-5">
                Đã có tài khoản Ads Spy Tool?{" "}
                <Link href="/login" className="text-rose-600 font-bold hover:text-rose-700 transition-colors">
                  Đăng nhập ngay
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Không cần thẻ tín dụng • Miễn phí vĩnh viễn gói cơ bản</span>
              </div>
            </div>

            {/* Bottom terms */}
            <p className="text-center text-[11px] text-slate-500 mt-4 leading-relaxed">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <Link href="/terms" className="text-slate-600 hover:text-rose-600 transition-colors underline underline-offset-2">
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-slate-600 hover:text-rose-600 transition-colors underline underline-offset-2">
                Chính sách bảo mật
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Clean White Tactical Footer */}
      <footer className="border-t border-slate-200 py-6 relative z-10 bg-white/80 backdrop-blur-sm">
        <div className="container px-4 text-center text-xs text-slate-500">
          <p>© 2025 Ads Spy Tool. Nền tảng phân tích và Nghiên cứu quảng cáo hàng đầu cho Performance Marketers.</p>
        </div>
      </footer>
    </div>
  )
}
