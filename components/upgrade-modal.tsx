'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Zap,
  Check,
  X,
  CreditCard,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { QuotaStatus } from '@/lib/search-quota'
import { BILLING_CYCLES, BillingCycle } from '@/lib/subscription-plans'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  quota: QuotaStatus
}

export function UpgradeModal({ isOpen, onClose, quota }: UpgradeModalProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('quarterly')
  const [isProcessing, setIsProcessing] = useState(false)

  const activeCycle = BILLING_CYCLES[selectedCycle]

  // Khóa cuộn trang nền và hỗ trợ đóng modal bằng phím ESC
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để nâng cấp gói Không Giới Hạn')
      onClose()
      router.push('/login?redirect=/pricing')
      return
    }

    setIsProcessing(true)
    try {
      const refCode = typeof window !== 'undefined' ? localStorage.getItem('ads_spy_ref') : null
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          planId: 'unlimited',
          billingCycle: selectedCycle,
          referralCode: refCode || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success || !data.checkoutUrl) {
        throw new Error(data.error || 'Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.')
      }

      window.location.href = data.checkoutUrl
    } catch (error: any) {
      toast.error(error?.message || 'Đã có lỗi xảy ra khi tạo thanh toán')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫'
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 p-2 sm:p-4 flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[min(94dvh,820px)] m-auto animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow ambient header (Shrink-0: Luôn ghim ở đầu modal, không bị cuộn mất nút X) */}
        <div className="relative shrink-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 px-4 py-3 sm:px-6 sm:py-4 text-white text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

          {/* Close button - Luôn hiển thị rõ ràng và nổi bật */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-30 p-2 rounded-full text-white/90 hover:text-white bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md transition-all cursor-pointer border border-white/20 shadow-md"
            aria-label="Đóng modal"
            title="Đóng (ESC)"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="h-3 w-3 text-rose-400" />
            Đã đạt giới hạn tìm kiếm hôm nay (3 lượt)
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white pr-7 sm:pr-0">
            Nâng Cấp Gói Không Giới Hạn (Unlimited)
          </h2>

          <p className="mt-1 text-xs text-slate-300 max-w-lg mx-auto leading-relaxed line-clamp-2 sm:line-clamp-none">
            Tài khoản <span className="font-bold text-amber-400">Miễn phí</span> vẫn xem được Full thông tin quảng cáo nhưng giới hạn 3 lượt tìm kiếm/ngày và không xem được Winning Products. Nâng cấp ngay để tìm kiếm không giới hạn, xem Winning Products và nhận 3–5 sản phẩm tiềm năng mỗi tuần!
          </p>
        </div>

        {/* Content & Billing Cycle Selector */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Cycle Options */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              1. Chọn chu kỳ thanh toán:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Theo Tháng */}
              <button
                type="button"
                onClick={() => setSelectedCycle('monthly')}
                className={`relative p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${selectedCycle === 'monthly'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
              >
                <div className="font-bold text-xs text-slate-700">Theo Tháng</div>
                <div className="mt-1 text-lg font-black text-slate-900">99.000₫</div>
                <div className="text-[11px] text-slate-500 font-medium">/ tháng</div>
                <div className="mt-1 text-[11px] text-slate-400">Trả từng tháng</div>
              </button>

              {/* Theo Quý */}
              <button
                type="button"
                onClick={() => setSelectedCycle('quarterly')}
                className={`relative p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${selectedCycle === 'quarterly'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
              >
                <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                  Tiết kiệm 10%
                </span>
                <div className="font-bold text-xs text-slate-700">Theo Quý (3T)</div>
                <div className="mt-1 text-lg font-black text-indigo-700">89.000₫</div>
                <div className="text-[11px] text-slate-500 font-medium">/ tháng</div>
                <div className="mt-1 text-[11px] font-semibold text-emerald-700">
                  267.000₫ / 3 tháng
                </div>
              </button>

              {/* Theo Năm */}
              <button
                type="button"
                onClick={() => setSelectedCycle('yearly')}
                className={`relative p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${selectedCycle === 'yearly'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
              >
                <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold shadow-xs">
                  Tiết kiệm 20%
                </span>
                <div className="font-bold text-xs text-slate-700">Theo Năm (12T)</div>
                <div className="mt-1 text-lg font-black text-indigo-700">79.000₫</div>
                <div className="text-[11px] text-slate-500 font-medium">/ tháng</div>
                <div className="mt-1 text-[11px] font-semibold text-purple-700">
                  948.000₫ / 12 tháng
                </div>
              </button>
            </div>
          </div>

          {/* Plan Benefits Checklist */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Quyền lợi gói Không Giới Hạn (Unlimited):
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 font-bold" />
                <span className="font-bold text-slate-900">Tìm kiếm KHÔNG GIỚI HẠN (∞)</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                <span className="font-black text-amber-950">Độc quyền: Mở khóa Kho Sản Phẩm Chiến Thắng (Winning Products)</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <Sparkles className="h-4 w-4 text-indigo-600 fill-indigo-600 shrink-0" />
                <span className="font-bold text-indigo-950">ĐẶC QUYỀN: Được giới thiệu 3–5 sản phẩm tiềm năng mỗi tuần</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 font-bold" />
                <span>Nghiên cứu video Unlisted & tải MP4</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 font-bold" />
                <span>Xem Full kịch bản Hook 3s & Landing Page</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 font-bold" />
                <span>Nghiên cứu Spend, Reach & Scaling score</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 font-bold" />
                <span>Không giới hạn mục yêu thích lưu trữ</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 font-bold" />
                <span>Hỗ trợ ưu tiên kỹ thuật 24/7</span>
              </div>
            </div>
          </div>

          {/* Lưu ý quan trọng khi thanh toán */}
          <div className="rounded-2xl bg-amber-50/90 border border-amber-200/90 p-3.5 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
            <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>Lưu ý thanh toán VietQR:</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                  Hiệu lực 24 giờ
                </span>
              </p>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                Mã VietQR có hiệu lực trong vòng <strong>24 giờ</strong> kể từ lúc khởi tạo. Vui lòng chuyển khoản đúng số tiền &amp; nội dung trên màn hình để hệ thống <strong>kích hoạt gói tự động ngay lập tức</strong>.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-2.5">
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:via-indigo-600 hover:to-purple-700 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer px-4"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang khởi tạo thanh toán...
                </span>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 fill-white" />
                    <span>Nâng Cấp Ngay ({formatCurrency(activeCycle.totalPrice)})</span>
                  </div>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                Bảo mật VietQR PayOS
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Kích hoạt tự động tức thì
              </span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100">
            <span>
              💡 Lượt tìm kiếm miễn phí làm mới vào ngày mai (00:00).
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/pricing"
                onClick={onClose}
                className="font-semibold text-indigo-600 hover:text-indigo-700 underline"
              >
                Xem chi tiết bảng giá
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-bold transition-colors cursor-pointer text-xs"
              >
                Đóng / Để sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
