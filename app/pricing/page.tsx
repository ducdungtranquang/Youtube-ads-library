'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Check, CheckCircle, X, Sparkles, ArrowRight, Zap, Shield, Users, Loader2, CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function PricingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<null | 'personal' | 'business'>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle PayOS payment for Personal plan
  const handlePayment = async (planId: 'personal' | 'business') => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng ký gói')
      router.push('/login')
      return
    }

    if (planId === 'business') {
      // Business plan uses contact form
      openModal('business')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          planId: planId,
        }),
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        // Redirect to PayOS checkout page
        window.location.href = data.checkoutUrl
      } else {
        toast.error(data.error || 'Không thể tạo thanh toán. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('')
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxlZrmJH2N_9b4MK5LVtZc6OCQ6lT4CV8nmd4FTtHWvnrPoXCNywMZV0mvaDjrlGoZ6/exec'
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('message', formData.message)
      formDataToSend.append('timestamp', new Date().toISOString())
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formDataToSend,
      })
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openModal = (plan: 'personal' | 'business') => {
    setSelectedPlan(plan)
    setShowModal(true)
    // Set subject and message based on plan
    if (plan === 'personal') {
      setFormData(f => ({
        ...f,
        subject: 'Đăng ký gói Cá nhân',
        message: 'Tôi muốn đăng ký gói Cá nhân. Vui lòng liên hệ tư vấn.'
      }))
    } else {
      setFormData(f => ({
        ...f,
        subject: 'Đăng ký gói Doanh nghiệp',
        message: 'Tôi muốn đăng ký gói Doanh nghiệp. Vui lòng liên hệ tư vấn.'
      }))
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPlan(null)
    setSubmitStatus('')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-16 md:py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4" />
              Bảng giá minh bạch, đơn giản
            </div>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              Chọn gói phù hợp với bạn
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto">
              Bắt đầu miễn phí, nâng cấp khi cần. Hủy bất cứ lúc nào.
            </p>
          </div>
        </div>
      </section>

      <main className="container py-12 -mt-8 relative z-20">
        {/* Pricing Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Gói Miễn phí */}
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Miễn phí</CardTitle>
              <CardDescription>Phù hợp để bắt đầu trải nghiệm</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">0₫</span>
                <span className="text-muted-foreground text-sm">/tháng</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Chỉ sử dụng QuickSearch</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Giới hạn 20 lượt yêu thích</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">Xem kết quả cơ bản</span>
                </li>
              </ul>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full cursor-pointer">
                  Bắt đầu ngay
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gói Cá nhân - Popular */}
          <Card className="border-2 border-primary shadow-xl relative scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                <Sparkles className="h-3.5 w-3.5" />
                Phổ biến nhất
              </div>
            </div>
            <CardHeader className="pb-4 pt-8">
              <CardTitle className="text-xl">Cá nhân</CardTitle>
              <CardDescription>Dành cho người dùng cá nhân</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">229.000₫</span>
                <span className="text-muted-foreground text-sm">/tháng</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Tìm kiếm tối đa 10 lần/ngày</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Xem chi tiết video</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Không giới hạn mục yêu thích</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Hỗ trợ qua email</span>
                </li>
              </ul>
              <Button
                className="w-full cursor-pointer"
                onClick={() => handlePayment('personal')}
                disabled={isProcessing || authLoading}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Thanh toán ngay
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Gói Doanh nghiệp */}
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Doanh nghiệp</CardTitle>
              <CardDescription>Dành cho tổ chức, doanh nghiệp</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">999.000₫</span>
                <span className="text-muted-foreground text-sm">/tháng</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium">Tìm kiếm không giới hạn</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium">Hỗ trợ 24/7</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium">API riêng nếu cần</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium">Tư vấn triển khai</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full cursor-pointer" onClick={() => handlePayment('business')}>
                Liên hệ tư vấn
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">Tại sao chọn chúng tôi?</h2>
            <p className="text-muted-foreground">Những lợi ích khi sử dụng nền tảng của chúng tôi</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Cập nhật realtime</h3>
              <p className="text-sm text-muted-foreground">
                Dữ liệu được cập nhật liên tục 24/7, không bỏ lỡ bất kỳ xu hướng nào
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Bảo mật dữ liệu</h3>
              <p className="text-sm text-muted-foreground">
                Thông tin của bạn được bảo vệ với các tiêu chuẩn bảo mật cao nhất
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Hỗ trợ tận tâm</h3>
              <p className="text-sm text-muted-foreground">
                Đội ngũ hỗ trợ sẵn sàng giúp đỡ bạn mọi lúc mọi nơi
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Form for Business Plan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl shadow-2xl max-w-lg w-full mx-4 relative animate-fadeInUp border">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={closeModal}
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedPlan === 'personal' ? 'Đăng ký gói Cá nhân' : 'Đăng ký gói Doanh nghiệp'}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedPlan === 'personal'
                    ? 'Điền thông tin để đăng ký. Chúng tôi sẽ liên hệ tư vấn và kích hoạt tài khoản cho bạn.'
                    : 'Điền thông tin để đăng ký. Chúng tôi sẽ liên hệ tư vấn và hỗ trợ triển khai.'}
                </p>
              </div>

              <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Họ và tên"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Chủ đề"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground transition-colors"
                />
                <textarea
                  rows={4}
                  name="message"
                  disabled={true}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Nội dung cần tư vấn..."
                  required
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none"
                ></textarea>
                {submitStatus === 'success' && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 flex items-center gap-2 text-sm">
                    <CheckCircle className="w-5 h-5" /> Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-center gap-2 text-sm">
                    Đã có lỗi xảy ra, vui lòng thử lại sau.
                  </div>
                )}
                <Button type="submit" size="lg" className="w-full font-semibold cursor-pointer" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký'}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Ads Spy Tool. Được xây dựng cho marketers và affiliate marketers.</p>
        </div>
      </footer>
    </div>
  )
}
