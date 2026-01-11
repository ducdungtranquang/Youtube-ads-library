"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { Video, Loader2, Sparkles, ArrowRight, CheckCircle, Zap, Heart } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const { signUp, signInWithOAuth, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && !hasRedirected.current) {
      hasRedirected.current = true
      setRedirecting(true)
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  // Show redirecting state
  if (!authLoading && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Đang chuyển hướng đến bảng điều khiển...</p>
        </div>
      </div>
    )
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        toast.error(error.message || 'Tạo tài khoản thất bại')
      } else {
        toast.success('Tài khoản đã được tạo! Vui lòng kiểm tra email để xác minh tài khoản.')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi không mong muốn')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithOAuth('google')
      if (error) {
        toast.error(error.message || 'Đăng ký bằng Google thất bại')
        setLoading(false)
      } else {
        // Keep loading state for redirect
        setRedirecting(true)
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi không mong muốn')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left side - Benefits */}
          <div className="hidden lg:block space-y-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Bắt đầu miễn phí
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Tạo tài khoản để
                <span className="block text-primary mt-1">khám phá winning ads</span>
              </h1>
              <p className="text-muted-foreground">
                Truy cập hàng triệu quảng cáo YouTube & Facebook. Tìm insight đối thủ chỉ trong vài click.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Miễn phí để bắt đầu</h3>
                  <p className="text-sm text-muted-foreground">Không cần thẻ tín dụng. Dùng thử ngay với gói miễn phí</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white flex-shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Truy cập ngay lập tức</h3>
                  <p className="text-sm text-muted-foreground">Đăng ký chỉ mất 30 giây, bắt đầu spy ads ngay</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white flex-shrink-0">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Lưu ads yêu thích</h3>
                  <p className="text-sm text-muted-foreground">Bookmark và theo dõi các quảng cáo hiệu quả nhất</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-foreground">10M+</p>
                <p className="text-sm text-muted-foreground">Quảng cáo</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5,000+</p>
                <p className="text-sm text-muted-foreground">Marketers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Cập nhật</p>
              </div>
            </div>
          </div>

          {/* Right side - Register Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="border-2 shadow-xl">
              <CardHeader className="space-y-1 text-center pb-4">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600">
                  <Video className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl">Tạo tài khoản</CardTitle>
                <CardDescription>Bắt đầu khám phá quảng cáo thành công ngay hôm nay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ten@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 font-semibold cursor-pointer" disabled={loading || redirecting}>
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Hoặc</span>
                  </div>
                </div>

                {/*
                <Button
                  variant="outline"
                  className="w-full h-11 cursor-pointer"
                  onClick={handleGoogleSignUp}
                  disabled={loading || redirecting}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {redirecting ? 'Đang chuyển hướng...' : loading ? 'Đang đăng ký...' : 'Đăng ký bằng Google'}
                </Button>
                */}

                <div className="text-center text-sm text-muted-foreground">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Đăng nhập
                  </Link>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <Link href="/terms" className="text-primary hover:underline">Điều khoản dịch vụ</Link>
              {" "}và{" "}
              <Link href="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Ads Spy Tool. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  )
}
