'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { QuotaStatus } from '@/lib/search-quota'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  quota: QuotaStatus
}

export function UpgradeModal({ isOpen, onClose, quota }: UpgradeModalProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const isPersonal = quota.plan === 'personal'
  const isFree = quota.plan === 'free'

  const handlePersonalCheckout = async () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để đăng ký gói dịch vụ')
      onClose()
      router.push('/login')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          planId: 'personal',
        }),
      })

      const data = await response.json()
      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        toast.error(data.error || 'Không thể tạo thanh toán. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Payment create error:', error)
      toast.error('Đã xảy ra lỗi kết nối thanh toán. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow ambient header */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 px-6 py-8 text-white text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            Đã đạt giới hạn tìm kiếm hôm nay
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {isPersonal
              ? 'Nâng Cấp Gói Doanh Nghiệp (Không Giới Hạn)'
              : 'Nâng Cấp Để Tiếp Tục Nghiên Cứu Quảng Cáo'}
          </h2>

          <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto">
            {isFree ? (
              <>
                Tài khoản <span className="font-bold text-amber-400">Miễn phí</span> có{' '}
                <span className="font-bold text-white">5 lượt tìm kiếm/ngày</span>. Nâng cấp ngay để mở khóa{' '}
                <span className="font-bold text-emerald-400">25 lượt/ngày</span> hoặc{' '}
                <span className="font-bold text-indigo-400">Không giới hạn</span>!
              </>
            ) : (
              <>
                Bạn đã sử dụng hết <span className="font-bold text-amber-400">25 lượt tìm kiếm</span> hôm nay của gói Cá nhân. Nâng cấp lên gói Doanh nghiệp để bóc tách không giới hạn.
              </>
            )}
          </p>
        </div>

        {/* Content & Plans */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Gói Cá Nhân */}
            <div
              className={`rounded-2xl p-5 border-2 transition-all ${
                isFree
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-slate-50 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  Gói Cá Nhân • 25 lượt/ngày
                </span>
                {isFree && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Phổ biến nhất
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">99.000₫</span>
                <span className="text-xs text-slate-500 font-medium">/ tháng</span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 font-bold" />
                  <span className="font-semibold text-slate-900">25 lượt tìm kiếm/ngày</span> (YouTube & FB Ads)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  Xem chi tiết video & kịch bản Hook 3s
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  Bóc tách video Unlisted & tải MP4
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  Không giới hạn mục yêu thích
                </li>
              </ul>

              <div className="mt-5">
                <Button
                  onClick={handlePersonalCheckout}
                  disabled={isProcessing || authLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 rounded-xl shadow-md shadow-indigo-200 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-1.5 h-4 w-4" />
                      Nâng Cấp Gói Cá Nhân (99k)
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Gói Doanh Nghiệp / Max */}
            <div
              className={`rounded-2xl p-5 border-2 transition-all ${
                isPersonal
                  ? 'border-purple-600 bg-purple-50/50 shadow-lg shadow-purple-100 ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                  Doanh Nghiệp • Không giới hạn
                </span>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Max Quota
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">199.000₫</span>
                <span className="text-xs text-slate-500 font-medium">/ tháng</span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0 font-bold" />
                  <span className="font-semibold text-slate-900">Tìm kiếm KHÔNG GIỚI HẠN (Unlimited)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  Đầy đủ dữ liệu Spend, Reach, Duplicates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  Hỗ trợ ưu tiên 24/7 & tư vấn triển khai
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  API riêng nếu cần bóc tách dữ liệu
                </li>
              </ul>

              <div className="mt-5">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-purple-300 hover:bg-purple-100 text-purple-800 font-bold text-xs h-10 rounded-xl cursor-pointer"
                >
                  <Link href="/pricing" onClick={onClose}>
                    Xem Chi Tiết & Đăng Ký
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100">
            <span>
              💡 Lượt tìm kiếm miễn phí sẽ tự động được làm mới vào ngày mai (00:00).
            </span>
            <div className="flex items-center gap-3">
              <Link
                href="/pricing"
                onClick={onClose}
                className="font-semibold text-indigo-600 hover:text-indigo-700 underline"
              >
                Xem toàn bộ bảng giá
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
