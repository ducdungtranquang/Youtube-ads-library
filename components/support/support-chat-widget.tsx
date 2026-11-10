'use client'

import { useState, useEffect, useRef, useId, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Bug,
  Lightbulb,
  CreditCard,
  HelpCircle,
  Phone,
  Mail,
  User as UserIcon,
  Crown,
  Lock,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

type SupportTopic = 'bug' | 'feature' | 'billing' | 'other'

interface TopicOption {
  id: SupportTopic
  label: string
  icon: typeof Bug
}

const TOPIC_OPTIONS: TopicOption[] = [
  { id: 'bug', label: 'Báo lỗi', icon: Bug },
  { id: 'feature', label: 'Góp ý tính năng', icon: Lightbulb },
  { id: 'billing', label: 'Gói & Thanh toán', icon: CreditCard },
  { id: 'other', label: 'Hỏi đáp khác', icon: HelpCircle },
]

interface SupportQuotaState {
  plan: string
  isUnlimited: boolean
  limit: number
  used: number
  remaining: number
  canSend: boolean
}

export function SupportChatWidget() {
  const { user } = useAuth()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)
  const [topic, setTopic] = useState<SupportTopic>('bug')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showGreetingTooltip, setShowGreetingTooltip] = useState(false)

  // Trạng thái hạn mức phản hồi (Quota)
  const [quota, setQuota] = useState<SupportQuotaState>({
    plan: 'free',
    isUnlimited: false,
    limit: 1,
    used: 0,
    remaining: 1,
    canSend: true,
  })
  const [isLoadingQuota, setIsLoadingQuota] = useState(false)

  const messageTextareaRef = useRef<HTMLTextAreaElement>(null)
  const nameInputId = useId()
  const emailInputId = useId()
  const contactInputId = useId()
  const messageInputId = useId()

  // Đồng bộ quota từ server
  const fetchQuotaStatus = useCallback(async () => {
    try {
      setIsLoadingQuota(true)
      const url = user?.id
        ? `/api/support?userId=${encodeURIComponent(user.id)}`
        : '/api/support'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setQuota({
            plan: data.plan || 'free',
            isUnlimited: Boolean(data.isUnlimited),
            limit: typeof data.limit === 'number' ? data.limit : 1,
            used: typeof data.used === 'number' ? data.used : 0,
            remaining: typeof data.remaining === 'number' ? data.remaining : 1,
            canSend: Boolean(data.canSend),
          })
        }
      }
    } catch {
      // Bỏ qua lỗi mạng nền
    } finally {
      setIsLoadingQuota(false)
    }
  }, [user?.id])

  // Tự động điền thông tin người dùng khi đăng nhập
  useEffect(() => {
    if (user) {
      if (user.email && !email) {
        setEmail(user.email)
      }
      const metadataName =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined)
      if (metadataName && !name) {
        setName(metadataName)
      }

      let isMounted = true

      async function loadUserProfile() {
        try {
          const { data } = await supabase
            .from('user_profiles')
            .select('subscription_plan, subscription_status')
            .eq('id', user?.id)
            .maybeSingle()

          if (!isMounted) return

          const rawPlan = (
            data?.subscription_plan ||
            data?.subscription_status ||
            'free'
          ).toLowerCase()

          const isUnlim =
            rawPlan === 'unlimited' ||
            rawPlan === 'business' ||
            rawPlan === 'company' ||
            rawPlan === 'personal'

          setQuota((prev) => ({
            ...prev,
            plan: isUnlim ? 'unlimited' : 'free',
            isUnlimited: isUnlim,
            limit: isUnlim ? -1 : 1,
          }))
        } catch {
          // Bỏ qua lỗi query profile
        }
      }

      loadUserProfile()

      return () => {
        isMounted = false
      }
    }
  }, [user, email, name])

  // Lấy quota khi mở widget hoặc khi user thay đổi
  useEffect(() => {
    if (isOpen) {
      fetchQuotaStatus()
    }
  }, [isOpen, fetchQuotaStatus])

  // Hiện tooltip chào mời nhẹ nhàng sau 4 giây truy cập nếu widget chưa mở
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreetingTooltip(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  // Xử lý khi mở/đóng widget: nếu là Unlimited thì sẵn sàng cho lượt gửi tiếp theo
  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (next) {
        setShowGreetingTooltip(false)
        // Nếu là gói Unlimited hoặc trước đó đã gửi thành công, reset trạng thái để có thể gửi tiếp
        if (quota.isUnlimited && isSuccess) {
          setIsSuccess(false)
          setMessage('')
        }
        setTimeout(() => {
          messageTextareaRef.current?.focus()
        }, 150)
      }
      return next
    })
  }

  const handleResetForm = () => {
    setMessage('')
    setIsSuccess(false)
    setTimeout(() => {
      messageTextareaRef.current?.focus()
    }, 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Kiểm tra quota phía client trước khi gửi
    if (!quota.isUnlimited && !quota.canSend) {
      toast.error('Gói Miễn phí chỉ được gửi 1 lần mỗi ngày. Vui lòng nâng cấp Unlimited để gửi không giới hạn.')
      return
    }

    const trimmedMsg = message.trim()
    if (!trimmedMsg) {
      toast.error('Vui lòng nhập nội dung cần hỗ trợ hoặc phản hồi')
      messageTextareaRef.current?.focus()
      return
    }

    if (trimmedMsg.length < 2) {
      toast.error('Nội dung phản hồi cần tối thiểu 2 ký tự')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        message: trimmedMsg,
        name: name.trim() || (user?.email ? user.email.split('@')[0] : 'Người dùng ẩn danh'),
        email: email.trim() || user?.email || null,
        contact: contact.trim() || null,
        topic,
        currentUrl: typeof window !== 'undefined' ? window.location.href : pathname,
        userId: user?.id || null,
        userPlan: quota.isUnlimited ? 'Gói Unlimited' : 'Gói Miễn phí',
      }

      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        if (response.status === 429 || data.code === 'DAILY_LIMIT_EXCEEDED') {
          setQuota((prev) => ({ ...prev, used: 1, remaining: 0, canSend: false }))
        }
        throw new Error(data.message || 'Không thể gửi phản hồi lúc này. Vui lòng thử lại sau.')
      }

      // Cập nhật lại quota sau khi gửi thành công
      if (data.isUnlimited) {
        setQuota((prev) => ({
          ...prev,
          isUnlimited: true,
          plan: 'unlimited',
          limit: -1,
          remaining: -1,
          canSend: true,
        }))
      } else {
        setQuota((prev) => ({
          ...prev,
          used: 1,
          remaining: 0,
          canSend: false,
        }))
      }

      setIsSuccess(true)
      toast.success('Đã gửi phản hồi tới đội ngũ hỗ trợ qua Slack thành công!')
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi tin nhắn hỗ trợ.'
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* Tooltip chào mời nhẹ nhàng */}
      {!isOpen && showGreetingTooltip && (
        <div className="pointer-events-auto mb-3 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-3 text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2">
            <span className="flex-shrink-0 text-base leading-none">👋</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">Cần hỗ trợ hoặc góp ý?</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Nhắn cho đội ngũ Ads Spy Tool, phản hồi sẽ được gửi trực tiếp về Slack hỗ trợ!
              </p>
            </div>
            <button
              onClick={() => setShowGreetingTooltip(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 -mr-1 -mt-1 transition-colors"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-800 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Cửa sổ Chat Support */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-[92vw] sm:w-[390px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-xs border border-white/25">
                <MessageSquare className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-rose-600 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-wide text-white">Ads Spy Tool Support</h3>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-rose-100">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Trực tuyến • Báo trực tiếp về Slack</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Đóng cửa sổ hỗ trợ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Thanh hiển thị trạng thái gói cước & Quota */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            {quota.isUnlimited ? (
              <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Gói Unlimited: Gửi phản hồi không giới hạn</span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Gói Miễn phí:</span>
                  <span className={`font-semibold ${quota.canSend ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {quota.canSend ? '1/1 lượt còn lại hôm nay' : 'Đã dùng 1/1 lượt hôm nay'}
                  </span>
                </div>
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Nâng cấp</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto max-h-[calc(85vh-120px)] space-y-3.5 text-xs text-slate-700 dark:text-slate-200">
            {/* Trường hợp 1: Vừa gửi thành công */}
            {isSuccess ? (
              <div className="py-6 px-2 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Gửi phản hồi thành công!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Cảm ơn bạn! Đội ngũ Ads Spy Tool đã nhận được tin nhắn qua kênh Slack nội bộ và sẽ hỗ trợ giải quyết sớm nhất.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  {quota.isUnlimited ? (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-semibold text-white shadow-sm transition-all"
                    >
                      ✉️ Gửi thêm tin nhắn khác
                    </button>
                  ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-left space-y-2">
                      <div className="flex items-start gap-2 text-amber-800 dark:text-amber-200">
                        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                        <div className="text-[11px] leading-relaxed">
                          Bạn đã sử dụng hết <strong>1 lượt gửi phản hồi hôm nay</strong> của gói Miễn phí. Lượt gửi sẽ được làm mới lúc <strong>00:00 ngày mai</strong>.
                        </div>
                      </div>
                      <Link
                        href="/pricing"
                        onClick={() => setIsOpen(false)}
                        className="w-full block text-center py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
                      >
                        👑 Nâng cấp Unlimited để gửi không giới hạn
                      </Link>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 px-4 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            ) : !quota.isUnlimited && !quota.canSend ? (
              /* Trường hợp 2: Gói Free đã hết lượt trong ngày */
              <div className="py-6 px-2 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Hết lượt gửi hôm nay
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Tài khoản của bạn đã gửi 1 phản hồi trong ngày hôm nay. Lượt gửi mới sẽ tự động mở lại sau <strong>00:00 đêm nay</strong>.
                  </p>
                </div>

                <div className="pt-2 p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2.5 text-left">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900 dark:text-amber-300">
                    <Crown className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>Muốn gửi thêm phản hồi ngay bây giờ?</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Nâng cấp lên gói <strong>Unlimited</strong> để chat hỗ trợ không giới hạn, tìm kiếm quảng cáo không giới hạn và truy cập kho Winning Products.
                  </p>
                  <Link
                    href="/pricing"
                    onClick={() => setIsOpen(false)}
                    className="w-full block text-center py-2.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs shadow-sm transition-all"
                  >
                    Xem bảng giá & Nâng cấp ngay
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 px-4 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Đóng cửa sổ
                </button>
              </div>
            ) : (
              /* Trường hợp 3: Được phép gửi tin nhắn */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Lời chào */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  💡 Bạn gặp khó khăn khi tìm quảng cáo, phát hiện lỗi hoặc muốn đề xuất tính năng mới? Gửi ngay bên dưới nhé!
                </div>

                {/* Chọn chủ đề */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Chủ đề phản hồi <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {TOPIC_OPTIONS.map((item) => {
                      const Icon = item.icon
                      const isSelected = topic === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTopic(item.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-medium transition-all ${isSelected
                              ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-rose-500' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Người gửi & Email (nếu chưa đăng nhập) */}
                {!user && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor={nameInputId} className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        Họ & tên
                      </label>
                      <div className="relative">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                        <input
                          id={nameInputId}
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Tên của bạn"
                          className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor={emailInputId} className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        Email liên hệ
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                        <input
                          id={emailInputId}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@..."
                          className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Số điện thoại / Zalo để admin liên hệ hỗ trợ trực tiếp */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor={contactInputId} className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      SĐT / Zalo / Telegram
                    </label>
                    <span className="text-[10px] text-slate-400">Để nhận phản hồi</span>
                  </div>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    <input
                      id={contactInputId}
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="VD: 0987654321 (Zalo)"
                      className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Nội dung phản hồi */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor={messageInputId} className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Nội dung phản hồi / yêu cầu <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {message.length}/3000
                    </span>
                  </div>
                  <textarea
                    id={messageInputId}
                    ref={messageTextareaRef}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={3000}
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải, từ khóa hoặc link bạn đang xem..."
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 resize-none leading-relaxed placeholder:text-slate-400"
                  />
                </div>

                {/* Nút gửi */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-semibold text-xs shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang gửi về Slack...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi yêu cầu hỗ trợ</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleToggleOpen}
        className="pointer-events-auto relative group flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 cursor-pointer"
        aria-label={isOpen ? 'Đóng hộp thoại hỗ trợ' : 'Mở hộp thoại hỗ trợ khách hàng'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <div className="relative">
              <MessageSquare className="w-6 h-6 text-white" />
              {/* Online Green Pulsing Indicator */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
              </span>
            </div>
            <span className="hidden sm:inline font-bold text-xs tracking-wide">
              Hỗ trợ & Góp ý
            </span>
          </>
        )}
      </button>
    </div>
  )
}
