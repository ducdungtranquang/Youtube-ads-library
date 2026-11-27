"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  Gift
} from "lucide-react"
import { toast } from "sonner"

function RegisterPageContent() {
  const searchParams = useSearchParams()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [referralCode, setReferralCode] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const { signUp, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    const urlRef = searchParams.get("ref")?.trim()
    const storedRef = typeof window !== "undefined" ? localStorage.getItem("ads_spy_ref") : null
    const activeRef = (urlRef || storedRef || "").toUpperCase().trim()
    if (activeRef) {
      setReferralCode(activeRef)
      if (typeof window !== "undefined") {
        localStorage.setItem("ads_spy_ref", activeRef)
        document.cookie = `ads_spy_ref=${encodeURIComponent(activeRef)}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax`
      }
      fetch("/api/affiliate/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: activeRef, eventType: "click" }),
      }).catch(() => {})
    }
  }, [searchParams])

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

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) {
      toast.error("Vui lòng tích chọn đồng ý với Điều khoản dịch vụ để tiếp tục.")
      return
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có tối thiểu 6 ký tự.")
      return
    }

    setLoading(true)

    try {
      const activeRef = referralCode.trim().toUpperCase() || (typeof window !== 'undefined' ? localStorage.getItem('ads_spy_ref') : null)
      const { error } = await signUp(email, password, fullName, activeRef || undefined)
      if (error) {
        toast.error(error.message || "Tạo tài khoản thất bại. Vui lòng kiểm tra lại thông tin.")
      } else {
        if (activeRef) {
          fetch('/api/affiliate/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referralCode: activeRef, eventType: 'signup' })
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Header />

      <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex items-center justify-center">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl w-full mx-auto">
          {/* Left Column: Product Overview */}
          <div className="lg:col-span-7">
            <AuthSpyShowcase mode="register" />
          </div>

          {/* Right Column: Register Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              {/* Mode Switcher Tabs */}
              <div className="flex p-1 mb-6 rounded-xl bg-slate-100 border border-slate-200/70">
                <Link
                  href="/login"
                  className="flex-1 text-center py-2 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
                >
                  Đăng nhập
                </Link>
                <span className="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-white text-slate-900 shadow-2xs">
                  Đăng ký
                </span>
              </div>

              {/* Card Title */}
              <div className="space-y-1 mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tạo tài khoản mới</h2>
                <p className="text-sm text-slate-500">
                  Miễn phí trải nghiệm 3 lượt tìm kiếm mỗi ngày.
                </p>
              </div>

              {/* Google OAuth Button */}
              <div className="mb-5">
                <GoogleAuthButton
                  mode="register"
                  disabled={loading || redirecting}
                />
              </div>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400">hoặc đăng ký bằng email</span>
                </div>
              </div>

              {/* Register Form */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
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
                      className="pl-10 h-11 bg-white border-slate-300 focus:border-indigo-600 focus-visible:ring-indigo-600/20 text-slate-900 placeholder:text-slate-400 rounded-xl text-sm transition-colors"
                    />
                  </div>
                </div>

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
                    <span className="text-[11px] text-slate-400">Tối thiểu 6 ký tự</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tạo mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
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

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="referral-code" className="text-xs font-semibold text-slate-700">
                      Mã giới thiệu <span className="font-normal text-slate-400">(Không bắt buộc)</span>
                    </Label>
                    {referralCode && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Đã áp dụng mã
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="referral-code"
                      type="text"
                      placeholder="VD: ADS888"
                      value={referralCode}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().trim()
                        setReferralCode(val)
                        if (typeof window !== "undefined") {
                          if (val) {
                            localStorage.setItem("ads_spy_ref", val)
                            document.cookie = `ads_spy_ref=${encodeURIComponent(val)}; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax`
                          } else {
                            localStorage.removeItem("ads_spy_ref")
                            document.cookie = `ads_spy_ref=; path=/; max-age=0`
                          }
                        }
                      }}
                      maxLength={20}
                      className="pl-10 h-11 bg-white border-slate-300 focus:border-indigo-600 focus-visible:ring-indigo-600/20 text-slate-900 placeholder:text-slate-400 rounded-xl text-sm uppercase tracking-wider transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <Checkbox
                    id="agree-terms-register"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(Boolean(checked))}
                    className="mt-0.5 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 cursor-pointer"
                  />
                  <Label
                    htmlFor="agree-terms-register"
                    className="text-xs text-slate-600 leading-relaxed cursor-pointer font-normal select-none"
                  >
                    Tôi đồng ý với{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-indigo-600 font-semibold hover:underline underline-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-indigo-600 font-semibold hover:underline underline-offset-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Chính sách bảo mật
                    </Link>
                    .
                  </Label>
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
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    <>
                      Tạo tài khoản
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-xs text-slate-500 pt-5">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                  Đăng nhập
                </Link>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Không cần thẻ tín dụng • Bảo mật SSL</span>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
              Bằng việc tiếp tục, bạn đồng ý với{" "}
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
          <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
            <p className="text-sm font-medium text-slate-700">Đang tải trang đăng ký...</p>
          </div>
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  )
}
