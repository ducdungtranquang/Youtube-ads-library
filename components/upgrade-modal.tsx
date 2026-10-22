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

  if (!isOpen) return null

  const activeCycle = BILLING_CYCLES[selectedCycle]

  const handleCheckout = async () => {
    toast.info('Cổng thanh toán tự động gói Không Giới Hạn sẽ chính thức mở vào ngày 01/11. Cảm ơn bạn đã quan tâm!')
    return
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow ambient header */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 px-6 py-7 text-white text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            Đã đạt giới hạn tìm kiếm hôm nay (5 lượt)
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Nâng Cấp Gói Không Giới Hạn (Unlimited)
          </h2>

          <p className="mt-2 text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Tài khoản <span className="font-bold text-amber-400">Miễn phí</span> giới hạn 5 lượt/ngày. Nâng cấp ngay để Nghiên cứu video triệu view, tải MP4 unlisted và nghiên cứu đối thủ không giới hạn!
          </p>
        </div>

        {/* Content & Billing Cycle Selector */}
        <div className="p-6 md:p-8 space-y-6">
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
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 font-bold" />
                <span>Nghiên cứu video Unlisted & tải MP4</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 font-bold" />
                <span>Xem kịch bản Hook 3s & Landing Page</span>
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

          {/* Action Button */}
          <div className="space-y-2.5">
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

            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-center text-[11px] text-amber-800 font-medium leading-relaxed">
              🚀 Cổng thanh toán gói Không Giới Hạn sẽ chính thức mở vào ngày <strong>01/11</strong>. Lượt tìm kiếm miễn phí của bạn sẽ được làm mới lúc 00:00 mỗi ngày!
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
