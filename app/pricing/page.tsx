'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Check, CheckCircle, X, Sparkles, ArrowRight, Zap, Shield, Users, Loader2, CreditCard, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { BILLING_CYCLES, BillingCycle } from "@/lib/subscription-plans"

export default function PricingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [hasMounted, setHasMounted] = useState(false)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('quarterly')
  const [showModal, setShowModal] = useState(false)
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

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const activeCycle = BILLING_CYCLES[billingCycle]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle PayOS payment for Unlimited plan (Temporarily disabled until release 01/11)
  const handlePayment = async (_cycle: BillingCycle = billingCycle) => {
    toast.info('Cổng thanh toán tự động gói Không Giới Hạn sẽ chính thức mở vào ngày 01/11. Cảm ơn bạn đã quan tâm!')
    return
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

  const openModal = () => {
    setShowModal(true)
    setFormData(f => ({
      ...f,
      subject: 'Tư vấn gói Không Giới Hạn',
      message: 'Tôi muốn tìm hiểu thêm về gói Không Giới Hạn và các tính năng Nghiên cứu.'
    }))
  }

  const closeModal = () => {
    setShowModal(false)
    setSubmitStatus('')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-16 md:py-20 text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider shadow-lg">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Chính sách bảng giá & Lượt tìm kiếm 2026
            </div>
            <h1 className="mb-4 text-3xl font-black tracking-tight text-white md:text-5xl lg:text-6xl leading-tight">
              Bảng Giá Dịch Vụ Ads Spy Tool
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Lựa chọn gói dịch vụ tối ưu để Nghiên cứu ngân sách, kịch bản video triệu view và sản phẩm win trên YouTube Ads & Facebook Ads.
            </p>
          </div>
        </div>
      </section>

      <main className="container py-12 -mt-10 relative z-20">
        {/* Billing Cycle Switcher */}
        <div className="flex flex-col items-center justify-center mb-12 max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Zap className="h-3.5 w-3.5 text-indigo-600 fill-indigo-600" />
            Chọn chu kỳ thanh toán linh hoạt
          </div>

          <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner w-full max-w-xl gap-1.5">
            {/* Monthly */}
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`relative px-3 sm:px-4 py-3 rounded-xl text-center transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/80 border border-slate-200/60 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-semibold'
              }`}
            >
              <div className="text-xs sm:text-sm">Hàng tháng</div>
              <div className={`text-xs mt-0.5 ${billingCycle === 'monthly' ? 'text-indigo-600 font-extrabold' : 'text-slate-500 font-medium'}`}>
                99k<span className="text-[10px]">/th</span>
              </div>
            </button>

            {/* Quarterly */}
            <button
              type="button"
              onClick={() => setBillingCycle('quarterly')}
              className={`relative px-3 sm:px-4 py-3 rounded-xl text-center transition-all cursor-pointer ${
                billingCycle === 'quarterly'
                  ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/80 border border-slate-200/60 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-semibold'
              }`}
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold shadow-sm whitespace-nowrap">
                TIẾT KIỆM 10%
              </span>
              <div className="text-xs sm:text-sm">Theo Quý (3T)</div>
              <div className={`text-xs mt-0.5 ${billingCycle === 'quarterly' ? 'text-emerald-600 font-extrabold' : 'text-emerald-700 font-medium'}`}>
                89k<span className="text-[10px]">/th</span>
              </div>
            </button>

            {/* Yearly */}
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`relative px-3 sm:px-4 py-3 rounded-xl text-center transition-all cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100/80 border border-slate-200/60 font-black ring-2 ring-indigo-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-semibold'
              }`}
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-[9px] font-extrabold shadow-md shadow-indigo-500/25 whitespace-nowrap">
                TIẾT KIỆM 20% • BEST
              </span>
              <div className="text-xs sm:text-sm">Theo Năm (12T)</div>
              <div className={`text-xs mt-0.5 ${billingCycle === 'yearly' ? 'text-purple-600 font-extrabold' : 'text-purple-700 font-medium'}`}>
                79k<span className="text-[10px]">/th</span>
              </div>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid (2 Plans: Free vs Unlimited) */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto items-stretch">
          {/* 1. Gói Miễn Phí */}
          <Card className="border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-200/50 rounded-3xl flex flex-col justify-between hover:border-slate-300 transition-all duration-300">
            <div>
              <CardHeader className="pb-6 pt-8 px-6 sm:px-8 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider w-fit mb-3">
                  Khởi đầu
                </div>
                <CardTitle className="text-2xl font-black text-slate-900">Gói Miễn Phí</CardTitle>
                <CardDescription className="text-sm text-slate-500 mt-1">
                  Dành cho người mới bắt đầu trải nghiệm công cụ tìm kiếm
                </CardDescription>

                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">0₫</span>
                    <span className="text-slate-500 text-sm font-bold">/ tháng</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
                    Miễn phí trọn đời • Không cần thẻ tín dụng
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6 px-6 sm:px-8">
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-900 font-medium leading-relaxed">
                  ⚡ <strong>5 lượt tìm kiếm/ngày:</strong> Giới hạn 5 lượt tra cứu mỗi ngày cho toàn bộ YouTube Ads & Facebook Ads.
                </div>

                <ul className="space-y-3.5 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <span><strong>5 lượt tìm kiếm/ngày</strong> (YouTube & FB Ads)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Tra cứu QuickSearch YouTube Ads</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Xem thông tin quảng cáo cơ bản</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>Lưu tối đa 20 mục yêu thích</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400 mt-0.5 shrink-0">
                      <X className="h-3.5 w-3.5" />
                    </div>
                    <span>Không hỗ trợ video Unlisted & tải MP4</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-400">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400 mt-0.5 shrink-0">
                      <X className="h-3.5 w-3.5" />
                    </div>
                    <span>Không có dữ liệu Spend, Reach & Scaling score</span>
                  </li>
                </ul>
              </CardContent>
            </div>

            <div className="p-6 sm:p-8 pt-0 space-y-3">
              <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-slate-300 hover:bg-slate-100 font-bold text-slate-800 cursor-pointer shadow-xs transition-all group px-4">
                <Link href={hasMounted && user ? "/quicksearch" : "/register"} className="flex items-center justify-center gap-2">
                  <span>{hasMounted && user ? "Trải nghiệm ngay" : "Bắt đầu miễn phí"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-slate-500 group-hover:text-slate-900" />
                </Link>
              </Button>
              <p className="text-center text-[11px] text-slate-400">
                Không yêu cầu thẻ tín dụng • Miễn phí trọn đời
              </p>
            </div>
          </Card>

          {/* 2. Gói Không Giới Hạn (Unlimited) */}
          <Card className="border-2 border-indigo-600 bg-white shadow-2xl shadow-indigo-600/15 rounded-3xl flex flex-col justify-between relative z-10 ring-4 ring-indigo-500/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-4 py-1.5 text-xs font-black text-white shadow-lg shadow-indigo-600/30 whitespace-nowrap uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                Marketer & Media Buyer Tin Dùng
              </div>
            </div>

            <div>
              <CardHeader className="pb-6 pt-10 px-6 sm:px-8 border-b border-indigo-50 bg-gradient-to-b from-indigo-50/70 via-indigo-50/30 to-transparent rounded-t-3xl">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider w-fit">
                    Gói Không Giới Hạn
                  </div>
                  {activeCycle.savings && (
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                      {activeCycle.savings}
                    </span>
                  )}
                </div>

                <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Unlimited Plan</CardTitle>
                <CardDescription className="text-sm text-slate-600 mt-1">
                  Mở khóa toàn bộ kho dữ liệu quảng cáo YouTube & Facebook Ads
                </CardDescription>

                {/* Price Display Box */}
                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 border border-indigo-100">
                  <div className="flex items-baseline gap-2">
                    {billingCycle !== 'monthly' && (
                      <span className="text-base font-bold text-slate-400 line-through">99.000₫</span>
                    )}
                    <span className="text-4xl sm:text-5xl font-black text-indigo-600 tracking-tight">
                      {activeCycle.monthlyPriceFormatted}
                    </span>
                    <span className="text-slate-500 text-sm font-bold">/ tháng</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-indigo-100/60 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium">
                      {billingCycle === 'monthly' && 'Thanh toán hàng tháng:'}
                      {billingCycle === 'quarterly' && 'Thanh toán 1 lần cho 3 tháng:'}
                      {billingCycle === 'yearly' && 'Thanh toán 1 lần cho 12 tháng:'}
                    </span>
                    <span className="font-black text-indigo-700 text-sm">
                      {activeCycle.totalPriceFormatted}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6 px-6 sm:px-8">
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50/50 to-indigo-50 border border-indigo-200 text-xs text-indigo-950 font-medium leading-relaxed">
                  👑 <strong>Tìm kiếm KHÔNG GIỚI HẠN:</strong> Thỏa sức phân tích đối thủ, Nghiên cứu hàng ngàn video ads mỗi ngày không lo giới hạn.
                </div>

                <ul className="space-y-3.5 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <span><strong className="text-indigo-950 font-black">Tìm kiếm KHÔNG GIỚI HẠN (∞)</strong> (YouTube & FB Ads)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <span>Xem chi tiết video, Hook 3s & Landing Page đối thủ</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <span>Nghiên cứu video Unlisted & tải video MP4</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <span>Ước tính Spend, Reach, Duplicates & Scaling score</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <span>Phân tích phễu chuyển đổi TOF / MOF / BOF</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <span>Dữ liệu phân bổ thị trường Quốc tế (Geo Tier 1, 2, 3)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <span><strong>Không giới hạn</strong> mục yêu thích lưu trữ</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 mt-0.5 shrink-0">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </div>
                    <span>Hỗ trợ kỹ thuật ưu tiên 24/7</span>
                  </li>
                </ul>
              </CardContent>
            </div>

            <div className="p-6 sm:p-8 pt-0 space-y-3">
              <Button
                disabled={true}
                className="w-full h-14 rounded-2xl bg-slate-100 hover:bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200 shadow-none px-4 select-none opacity-95 transition-none"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm sm:text-base font-extrabold tracking-tight leading-tight flex items-center gap-1.5 text-slate-800">
                      <Clock className="h-4 w-4 text-amber-500" />
                      Mở Thanh Toán Ngày 01/11
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      Tính năng thanh toán tự động chính thức mở từ 01/11
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 pl-3 border-l border-slate-300 shrink-0">
                    <span className="text-xs font-bold text-amber-700 bg-amber-100/90 border border-amber-300/80 px-2.5 py-1 rounded-full">
                      1/11 Release
                    </span>
                  </div>
                </div>
              </Button>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-center text-xs text-amber-800 font-medium leading-relaxed">
                🚀 Cổng thanh toán gói Không Giới Hạn đang trong giai đoạn hoàn thiện và sẽ chính thức mở vào ngày <strong>01/11</strong>. Hiện tại bạn vẫn có thể sử dụng miễn phí mỗi ngày!
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Shield className="h-3 w-3 text-emerald-600" />
                  Bảo mật VietQR PayOS
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" />
                  Kích hoạt tự động (Từ 01/11)
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">So Sánh Chi Tiết Quyền Lợi</h2>
            <p className="text-slate-500 text-sm mt-1">So sánh chi tiết tính năng giữa 2 gói dịch vụ</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Tính năng</th>
                  <th className="py-4 px-6 text-center">Gói Miễn phí (0₫)</th>
                  <th className="py-4 px-6 text-center bg-indigo-50/70 text-indigo-900">Gói Không Giới Hạn (Từ 79k/th)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Lượt tìm kiếm mỗi ngày</td>
                  <td className="py-4 px-6 text-center font-bold text-amber-600">5 lượt / ngày</td>
                  <td className="py-4 px-6 text-center font-black text-indigo-600 bg-indigo-50/30">Không giới hạn (∞)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Tìm kiếm YouTube Ads</td>
                  <td className="py-4 px-6 text-center"><Check className="h-4 w-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center bg-indigo-50/30 font-bold text-indigo-700">Không giới hạn</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Tìm kiếm Facebook Ads</td>
                  <td className="py-4 px-6 text-center"><Check className="h-4 w-4 text-emerald-600 mx-auto" /></td>
                  <td className="py-4 px-6 text-center bg-indigo-50/30 font-bold text-indigo-700">Không giới hạn</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Nghiên cứu video Unlisted & tải MP4</td>
                  <td className="py-4 px-6 text-center"><X className="h-4 w-4 text-slate-300 mx-auto" /></td>
                  <td className="py-4 px-6 text-center bg-indigo-50/30"><Check className="h-4 w-4 text-emerald-600 mx-auto font-bold" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Xem Hook 3s & Landing Page đối thủ</td>
                  <td className="py-4 px-6 text-center"><X className="h-4 w-4 text-slate-300 mx-auto" /></td>
                  <td className="py-4 px-6 text-center bg-indigo-50/30"><Check className="h-4 w-4 text-emerald-600 mx-auto font-bold" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Ước tính Spend, Reach & Duplicates</td>
                  <td className="py-4 px-6 text-center text-xs">Cơ bản</td>
                  <td className="py-4 px-6 text-center text-xs font-bold text-indigo-700 bg-indigo-50/30">Đầy đủ & chuyên sâu</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Phân tích phễu TOF / MOF / BOF</td>
                  <td className="py-4 px-6 text-center"><X className="h-4 w-4 text-slate-300 mx-auto" /></td>
                  <td className="py-4 px-6 text-center bg-indigo-50/30"><Check className="h-4 w-4 text-emerald-600 mx-auto font-bold" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Dữ liệu phân bổ thị trường Quốc tế</td>
                  <td className="py-4 px-6 text-center"><X className="h-4 w-4 text-slate-300 mx-auto" /></td>
                  <td className="py-4 px-6 text-center bg-indigo-50/30"><Check className="h-4 w-4 text-emerald-600 mx-auto font-bold" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Mục yêu thích lưu trữ</td>
                  <td className="py-4 px-6 text-center">20 mục</td>
                  <td className="py-4 px-6 text-center font-bold text-indigo-600 bg-indigo-50/30">Không giới hạn</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-slate-900">Hỗ trợ kỹ thuật</td>
                  <td className="py-4 px-6 text-center text-xs">Cộng đồng</td>
                  <td className="py-4 px-6 text-center text-xs font-bold text-indigo-700 bg-indigo-50/30">Ưu tiên 24/7</td>
                </tr>
              </tbody>
            </table>
          </div>
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
                  Tư vấn & Hỗ trợ giải pháp Ads Spy
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Điền thông tin để được đội ngũ kỹ thuật liên hệ tư vấn, giải đáp thắc mắc và hỗ trợ triển khai nhanh nhất.
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
