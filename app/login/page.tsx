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
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const { signIn, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!authLoading && user && !hasRedirected.current) {
      hasRedirected.current = true
      setRedirecting(true)
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  if (!authLoading && user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-700">Đang chuyển hướng đến bảng điều khiển...</p>
        </div>
      </div>
    )
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        toast.error(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
      } else {
        toast.success("Đăng nhập thành công! Đang chuyển hướng...")
        setRedirecting(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 600)
      }
    } catch {
      toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Header />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex items-center justify-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl w-full mx-auto">
          {/* Left Column: Product Overview */}
          <div className="lg:col-span-7">
            <AuthSpyShowcase mode="login" />
          </div>

          {/* Right Column: Login Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              {/* Mode Switcher Tabs */}
              <div className="flex p-1 mb-6 rounded-xl bg-slate-100 border border-slate-200/70">
                <span className="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-white text-slate-900 shadow-2xs">
                  Đăng nhập
                </span>
                <Link
                  href="/register"
                  className="flex-1 text-center py-2 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
                >
                  Đăng ký
                </Link>
              </div>

              {/* Card Title */}
              <div className="space-y-1 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Chào mừng trở lại</h2>
                <p className="text-sm text-slate-500">
                  Đăng nhập để tiếp tục sử dụng Ads Spy Tool.
                </p>
              </div>

              {/* Google OAuth Button */}
              <div className="mb-5">
                <GoogleAuthButton
                  mode="login"
                  disabled={loading || redirecting}
                />
              </div>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400">hoặc đăng nhập bằng email</span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11 bg-white border-slate-300 focus:border-indigo-600 focus-visible:ring-indigo-600/20 text-slate-900 placeholder:text-slate-400 rounded-xl text-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                      Mật khẩu
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 h-11 bg-white border-slate-300 focus:border-indigo-600 focus-visible:ring-indigo-600/20 text-slate-900 placeholder:text-slate-400 rounded-xl text-sm transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || redirecting}
                  className="w-full h-11 font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer active:scale-[0.99] transition-all disabled:opacity-60"
                >
                  {redirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang chuyển hướng...
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      Đăng nhập
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-xs text-slate-500 pt-5">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                  Đăng ký miễn phí
                </Link>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Bảo mật SSL • Dữ liệu được mã hóa an toàn</span>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <Link href="/terms" className="text-slate-700 hover:text-indigo-600 transition-colors underline underline-offset-2">
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-slate-700 hover:text-indigo-600 transition-colors underline underline-offset-2">
                Chính sách bảo mật
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
