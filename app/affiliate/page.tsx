"use client"

import { useState, useEffect, useMemo, useId } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Copy,
  Check,
  ExternalLink,
  Users,
  MousePointerClick,
  UserCheck,
  CreditCard,
  Share2,
  ShieldCheck,
  Clock,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Calculator,
  Gift,
  FileText,
  Building2,
  Wallet,
  Zap,
  Loader2,
  AlertCircle,
  Send,
  QrCode,
} from "lucide-react"
import { toast } from "sonner"
import {
  AFFILIATE_COMMISSION_RATE,
  MIN_PAYOUT_AMOUNT,
  formatVND,
  AffiliateStatsData,
  AffiliatePartner,
  AffiliateCommission,
  AffiliatePayout,
} from "@/lib/affiliate"
import { BILLING_CYCLES, BillingCycle } from "@/lib/subscription-plans"

export default function AffiliatePage() {
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<AffiliateStatsData | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [isCopiedLink, setIsCopiedLink] = useState(false)
  const [isCopiedCode, setIsCopiedCode] = useState(false)
  const [copiedSwipeIdx, setCopiedSwipeIdx] = useState<number | null>(null)

  // Calculator State
  const [referralCount, setReferralCount] = useState(15)
  const [calcCycle, setCalcCycle] = useState<BillingCycle>("quarterly")

  // Payout Form State
  const [payoutAmount, setPayoutAmount] = useState(MIN_PAYOUT_AMOUNT.toString())
  const [bankName, setBankName] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankHolder, setBankHolder] = useState("")
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false)
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false)

  // FAQ Expand State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0)

  // Fetch Affiliate Stats for logged in user
  useEffect(() => {
    async function loadStats() {
      if (!user) {
        setStats(null)
        return
      }

      setLoadingStats(true)
      try {
        const res = await fetch(`/api/affiliate/stats?userId=${user.id}`, {
          headers: {
            "x-user-id": user.id,
          },
        })
        const json = await res.json()
        if (json.success && json.data) {
          setStats(json.data)
          if (json.data.partner.bankName) setBankName(json.data.partner.bankName)
          if (json.data.partner.bankAccount) setBankAccount(json.data.partner.bankAccount)
          if (json.data.partner.bankHolder) setBankHolder(json.data.partner.bankHolder)
        }
      } catch (err) {
        console.error("Error loading affiliate stats:", err)
      } finally {
        setLoadingStats(false)
      }
    }

    loadStats()
  }, [user])

  // Calculated estimated earnings
  const calculatedEarnings = useMemo(() => {
    const cycle = BILLING_CYCLES[calcCycle]
    const orderPrice = cycle.totalPrice
    const totalRevenue = referralCount * orderPrice
    const totalCommission = Math.round(totalRevenue * AFFILIATE_COMMISSION_RATE)
    const annualEst = totalCommission * 12
    return {
      orderPrice,
      totalRevenue,
      totalCommission,
      annualEst,
    }
  }, [referralCount, calcCycle])

  // Current domain referral URL
  const currentReferralUrl = useMemo(() => {
    if (stats?.referralUrl) return stats.referralUrl
    if (typeof window !== "undefined" && stats?.partner?.referralCode) {
      return `${window.location.origin}/register?ref=${stats.partner.referralCode}`
    }
    return "https://adsspytool.io/register?ref=DEMO888"
  }, [stats])

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(currentReferralUrl)
      setIsCopiedLink(true)
      toast.success("Đã sao chép liên kết tiếp thị độc quyền của bạn!")
      setTimeout(() => setIsCopiedLink(false), 2000)
    }
  }

  const handleCopyCode = () => {
    const code = stats?.partner?.referralCode || "DEMO888"
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(code)
      setIsCopiedCode(true)
      toast.success(`Đã sao chép mã giới thiệu: ${code}`)
      setTimeout(() => setIsCopiedCode(false), 2000)
    }
  }

  const handleCopySwipe = (text: string, index: number) => {
    if (typeof navigator !== "undefined") {
      const replaced = text.replace(/{{LINK}}/g, currentReferralUrl)
      navigator.clipboard.writeText(replaced)
      setCopiedSwipeIdx(index)
      toast.success("Đã sao chép kịch bản bài viết kèm link tiếp thị của bạn!")
      setTimeout(() => setCopiedSwipeIdx(null), 2000)
    }
  }

  const handleShareFacebook = () => {
    const url = encodeURIComponent(currentReferralUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=450")
  }

  const handleShareTelegram = () => {
    const url = encodeURIComponent(currentReferralUrl)
    const text = encodeURIComponent("Khám phá công cụ Spy Video YouTube Ads & Facebook Ads đỉnh cao:")
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank", "width=600,height=450")
  }

  const handleShareZalo = () => {
    const url = encodeURIComponent(currentReferralUrl)
    window.open(`https://zalo.me/share?url=${url}`, "_blank", "width=600,height=450")
  }

  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("Vui lòng đăng nhập để yêu cầu rút tiền")
      return
    }

    const amountNum = Number(payoutAmount)
    if (isNaN(amountNum) || amountNum < MIN_PAYOUT_AMOUNT) {
      toast.error(`Số tiền rút tối thiểu là ${formatVND(MIN_PAYOUT_AMOUNT)}`)
      return
    }

    if (!bankName.trim() || !bankAccount.trim() || !bankHolder.trim()) {
      toast.error("Vui lòng điền đầy đủ tên ngân hàng, số tài khoản và họ tên chủ thẻ")
      return
    }

    if ((stats?.partner?.balance || 0) < amountNum) {
      toast.error("Số dư hoa hồng khả dụng không đủ để rút số tiền này")
      return
    }

    setIsSubmittingPayout(true)
    try {
      const res = await fetch("/api/affiliate/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          amount: amountNum,
          bankName: bankName.trim(),
          bankAccount: bankAccount.trim(),
          bankHolder: bankHolder.trim(),
        }),
      })

      const json = await res.json()
      if (json.success) {
        toast.success(json.message || "Gửi yêu cầu rút tiền thành công!")
        setPayoutDialogOpen(false)
        // Refresh stats
        if (stats) {
          setStats({
            ...stats,
            partner: {
              ...stats.partner,
              balance: json.newBalance ?? stats.partner.balance - amountNum,
              totalWithdrawn: stats.partner.totalWithdrawn + amountNum,
              bankName: bankName.trim(),
              bankAccount: bankAccount.trim(),
              bankHolder: bankHolder.trim(),
            },
            payouts: [json.data, ...(stats.payouts || [])],
          })
        }
      } else {
        toast.error(json.error || "Gửi yêu cầu thất bại. Vui lòng thử lại sau.")
      }
    } catch {
      toast.error("Đã xảy ra lỗi kết nối khi gửi yêu cầu rút tiền.")
    } finally {
      setIsSubmittingPayout(false)
    }
  }

  // Pre-made marketing swipe files
  const swipeFiles = [
    {
      title: "Bài đăng Facebook Group Marketer / Dropshipping",
      badge: "Chuyển đổi cao",
      content: `🔥 Ae đang chạy YouTube Ads hoặc Facebook Ads mà chưa biết đối thủ vít tiền thế nào, kịch bản video ra sao thì test ngay con tool Ads Spy Tool này nhé!

✅ Spy kịch bản video Ads ẩn & kênh đối thủ
✅ Bóc tách Transcript, Landing Page & Phễu bán hàng
✅ Quét sản phẩm Win Dropshipping / Affiliate toàn cầu

👉 Đăng ký trải nghiệm miễn phí tại đây: {{LINK}}`,
    },
    {
      title: "Kịch bản đăng Zalo / Tin nhắn cá nhân cho đối tác",
      badge: "Ngắn gọn",
      content: `Chào bạn, mình vừa tìm thấy thư viện Ads Spy Tool chuyên tra cứu video quảng cáo YouTube & Facebook cực kỳ hay cho Marketers & E-commerce. Bạn có thể tra cứu góc bán hàng (Angle) và Landing page đối thủ chỉ trong 5s. Trải nghiệm thử link này nhé: {{LINK}}`,
    },
    {
      title: "Bài chia sẻ Telegram / Diễn đàn MMO",
      badge: "Cộng đồng MMO",
      content: `🚀 Share ae công cụ Spy Ads xịn xò cho ae làm Dropship, POD và Affiliate:
- Tìm sản phẩm win qua video ads YouTube
- Bóc transcript video triệu view làm kịch bản AI
- Xem chi tiết link affiliate & network đối thủ chạy

Link đăng ký nhận lượt tìm kiếm: {{LINK}}`,
    },
  ]

  // FAQs
  const faqs = [
    {
      q: "Tỷ lệ hoa hồng là bao nhiêu và được tính thế nào?",
      a: "Bạn được hưởng 20% hoa hồng trên TẤT CẢ các đơn hàng đăng ký gói trả phí (Gói Unlimited 1 tháng 99k, 3 tháng 267k hoặc 1 năm 948k) từ người dùng đăng ký qua link hoặc mã giới thiệu của bạn. Hoa hồng được cộng ngay vào tài khoản khi đơn hàng thanh toán thành công.",
    },
    {
      q: "Cookie lưu trong bao lâu? Nếu khách không mua ngay thì sao?",
      a: "Hệ thống áp dụng cơ chế lưu Cookie theo dõi trong vòng 30 ngày. Khi khách hàng bấm vào link của bạn, dù 1 tuần hay 29 ngày sau họ mới tạo tài khoản và mua gói, bạn vẫn được tự động ghi nhận 20% hoa hồng.",
    },
    {
      q: "Điều kiện và thời gian nhận tiền hoa hồng thế nào?",
      a: "Hạn mức rút tiền tối thiểu chỉ từ 200.000 VNĐ. Bạn chỉ cần nhập số tài khoản ngân hàng và bấm yêu cầu rút tiền. Đội ngũ Ads Spy Tool sẽ duyệt và chuyển khoản trực tiếp qua ngân hàng (Vietcombank, MB, Techcombank...) trong vòng 24h làm việc.",
    },
    {
      q: "Tôi có thể quảng bá link tiếp thị ở những kênh nào?",
      a: "Bạn có thể chia sẻ thoải mái trên Facebook (trang cá nhân, group cộng đồng, fanpage), kênh YouTube, TikTok, blog cá nhân, Zalo, Telegram... Miễn là không vi phạm pháp luật và không chạy spam tin nhắn rác gây phiền hà.",
    },
    {
      q: "Nếu tôi đã có tài khoản Ads Spy Tool thì có cần tạo tài khoản mới không?",
      a: "Không cần! Tài khoản hiện tại của bạn đã được tự động kích hoạt mã tiếp thị độc quyền. Bạn chỉ cần đăng nhập là có thể lấy link chia sẻ và quản lý doanh thu ngay.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <Header />

      {/* 🌟 HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:py-24 border-b border-slate-850">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] rounded-full bg-emerald-600/15 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b25_1px,transparent_1px),linear-gradient(to_bottom,#1e293b25_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-5xl text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold text-emerald-400 mb-6 shadow-lg shadow-emerald-950/50 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Chương Trình Đối Tác Tiếp Thị 2026 • Hoa Hồng 20% Trọn Đời</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] mb-6">
            Kiếm <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">20% Hoa Hồng</span> Trên Mọi Đơn Hàng Cùng Ads Spy Tool
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Chia sẻ công cụ phân tích video quảng cáo YouTube & Facebook số 1 Việt Nam tới cộng đồng marketers, dropshippers và media buyers. Nhận hoa hồng chuyển khoản tự động vào tài khoản ngân hàng.
          </p>

          {/* Quick Value Props Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-300 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400 shadow-2xs">
              <Zap className="h-3.5 w-3.5" /> 20% mỗi đơn thanh toán
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-indigo-400 shadow-2xs">
              <Clock className="h-3.5 w-3.5" /> Cookie tracking 30 ngày
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-teal-400 shadow-2xs">
              <Wallet className="h-3.5 w-3.5" /> Rút tiền từ 200.000₫
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-amber-400 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5" /> Minh bạch & Tự động 100%
            </span>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            {user ? (
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/60 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <a href="#partner-hub">
                  <Share2 className="mr-2 h-4 w-4 text-slate-950" />
                  Lấy Link Tiếp Thị Của Bạn
                </a>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/60 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/register">
                  <Sparkles className="mr-2 h-4 w-4 text-slate-950" />
                  Đăng Ký Làm Đối Tác Ngay
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 rounded-2xl border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm cursor-pointer shadow-2xs hover:text-white"
            >
              <a href="#calculator">
                <Calculator className="mr-2 h-4 w-4 text-emerald-400" />
                Ước tính hoa hồng
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 💼 PARTNER HUB SECTION (DASHBOARD FOR AFFILIATES) */}
      <section id="partner-hub" className="py-12 md:py-16 border-b border-slate-850 bg-slate-900/40 relative">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <Zap className="h-3.5 w-3.5" /> Bảng Điều Khiển Đối Tác
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Không Gian Quản Lý Tiếp Thị & Doanh Thu
              </h2>
            </div>

            {user && stats && (
              <div className="flex items-center gap-3">
                <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950 cursor-pointer"
                    >
                      <Wallet className="mr-1.5 h-4 w-4" />
                      Rút tiền ({formatVND(stats.partner.balance)})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100 rounded-2xl p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
                        <Wallet className="h-5 w-5 text-emerald-400" />
                        Yêu Cầu Rút Tiền Hoa Hồng
                      </DialogTitle>
                      <DialogDescription className="text-slate-400 text-xs">
                        Số dư khả dụng: <strong className="text-emerald-400 font-bold">{formatVND(stats.partner.balance)}</strong>. Hạn mức rút tối thiểu {formatVND(MIN_PAYOUT_AMOUNT)}.
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitPayout} className="space-y-4 mt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Số tiền muốn rút (VNĐ)</label>
                        <Input
                          type="number"
                          min={MIN_PAYOUT_AMOUNT}
                          max={stats.partner.balance}
                          step={10000}
                          value={payoutAmount}
                          onChange={(e) => setPayoutAmount(e.target.value)}
                          className="bg-slate-950 border-slate-700 text-white rounded-xl"
                          placeholder="200000"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Tên ngân hàng (VD: Vietcombank, MB Bank...)</label>
                        <Input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="bg-slate-950 border-slate-700 text-white rounded-xl"
                          placeholder="Vietcombank"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Số tài khoản ngân hàng</label>
                        <Input
                          type="text"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="bg-slate-950 border-slate-700 text-white rounded-xl"
                          placeholder="1012345678"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Họ và tên chủ tài khoản (Không dấu)</label>
                        <Input
                          type="text"
                          value={bankHolder}
                          onChange={(e) => setBankHolder(e.target.value)}
                          className="bg-slate-950 border-slate-700 text-white uppercase rounded-xl"
                          placeholder="NGUYEN VAN A"
                          required
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline" className="border-slate-700 text-slate-300 rounded-xl cursor-pointer">
                            Hủy
                          </Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          disabled={isSubmittingPayout || stats.partner.balance < MIN_PAYOUT_AMOUNT}
                          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl cursor-pointer"
                        >
                          {isSubmittingPayout ? (
                            <>
                              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                              Đang gửi...
                            </>
                          ) : (
                            "Xác nhận rút tiền"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Not logged in banner */}
          {!user && (
            <Card className="mb-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-indigo-950/40 p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold text-xs px-3 py-1">
                    Bắt đầu trong 30 giây
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Đăng nhập hoặc Đăng ký để nhận Link Tiếp Thị riêng của bạn
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Hệ thống sẽ tự động đồng bộ tài khoản và tạo mã giới thiệu độc quyền cho bạn. Bắt đầu chia sẻ và nhận hoa hồng 20% mỗi khi khách mua gói.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
                  <Button asChild className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer">
                    <Link href="/register">Đăng ký đối tác</Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 px-6 rounded-xl border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-xs cursor-pointer">
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Referral Link & Code Quick Copy Box */}
          <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-7 shadow-xl shadow-slate-950/40">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 flex-1 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Liên kết tiếp thị độc quyền của bạn (Cookie 30 ngày)
                  </span>
                  {stats?.partner?.referralCode && (
                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-xs">
                      Mã: {stats.partner.referralCode}
                    </Badge>
                  )}
                </div>

                {/* Input with Copy Button */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full max-w-3xl">
                  <div className="relative flex-1">
                    <Input
                      readOnly
                      value={currentReferralUrl}
                      className="h-12 bg-slate-950 border-slate-800 text-emerald-400 font-mono text-xs sm:text-sm rounded-xl pl-4 pr-12 focus-visible:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1 cursor-pointer transition-colors"
                      title="Sao chép"
                    >
                      {isCopiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleCopyLink}
                      className="h-12 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-emerald-950"
                    >
                      {isCopiedLink ? (
                        <>
                          <Check className="mr-1.5 h-4 w-4 text-slate-950" /> Đã sao chép
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 h-4 w-4 text-slate-950" /> Sao chép link
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyCode}
                      className="h-12 px-4 rounded-xl border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer"
                      title="Sao chép chỉ mã giới thiệu"
                    >
                      {isCopiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : "Mã"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Fast Social Share Buttons */}
              <div className="flex flex-col items-start lg:items-end gap-2 w-full lg:w-auto">
                <span className="text-xs font-semibold text-slate-400">Chia sẻ nhanh qua:</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleShareFacebook}
                    className="h-9 px-3 rounded-xl border-slate-850 bg-slate-950 hover:bg-blue-950/40 hover:border-blue-700 text-blue-400 text-xs font-semibold cursor-pointer"
                  >
                    Facebook
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleShareTelegram}
                    className="h-9 px-3 rounded-xl border-slate-850 bg-slate-950 hover:bg-sky-950/40 hover:border-sky-700 text-sky-400 text-xs font-semibold cursor-pointer"
                  >
                    Telegram
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleShareZalo}
                    className="h-9 px-3 rounded-xl border-slate-850 bg-slate-950 hover:bg-indigo-950/40 hover:border-indigo-700 text-indigo-400 text-xs font-semibold cursor-pointer"
                  >
                    Zalo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Bento Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Card 1: Clicks */}
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 hover:border-slate-700 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lượt click</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <MousePointerClick className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {(stats?.partner?.totalClicks || 0).toLocaleString()}
                </div>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Số lần người xem bấm link</p>
              </div>
            </div>

            {/* Card 2: Signups */}
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 hover:border-slate-700 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã đăng ký</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <UserCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {(stats?.partner?.totalSignups || 0).toLocaleString()}
                </div>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Tạo tài khoản qua link</p>
              </div>
            </div>

            {/* Card 3: Paid Conversions */}
            <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 hover:border-slate-700 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đơn thành công</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {(stats?.partner?.totalConversions || 0).toLocaleString()}
                </div>
                <p className="text-[11px] font-medium text-purple-400 mt-0.5">Nâng cấp gói trả phí</p>
              </div>
            </div>

            {/* Card 4: Total Earned */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-900/90 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Hoa hồng 20%</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                  {formatVND(stats?.partner?.totalEarned || 0)}
                </div>
                <p className="text-[11px] font-medium text-slate-300 mt-0.5">
                  Số dư rút: <span className="font-bold text-white">{formatVND(stats?.partner?.balance || 0)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Tabbed Tables */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-xl">
            <Tabs defaultValue="commissions" className="w-full">
              <TabsList className="bg-slate-950 border border-slate-800 rounded-2xl p-1 mb-6 flex-wrap h-auto gap-1">
                <TabsTrigger
                  value="commissions"
                  className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-slate-950 cursor-pointer"
                >
                  <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                  Lịch sử hoa hồng ({stats?.commissions?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="payouts"
                  className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-slate-950 cursor-pointer"
                >
                  <Wallet className="mr-1.5 h-3.5 w-3.5" />
                  Lịch sử rút tiền ({stats?.payouts?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="swipes"
                  className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-slate-950 cursor-pointer"
                >
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  Kịch bản bài viết mẫu (Swipe Files)
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: Commissions Table */}
              <TabsContent value="commissions" className="space-y-4">
                {loadingStats ? (
                  <div className="py-12 flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                  </div>
                ) : !stats || stats.commissions.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 mx-auto">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-bold text-white">Chưa có đơn hàng hoa hồng nào</h4>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                      Hãy chia sẻ liên kết tiếp thị của bạn trên các hội nhóm, bạn bè hoặc mạng xã hội. Khi ai đó nâng cấp gói, hoa hồng 20% sẽ hiển thị tức thì tại đây!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                          <th className="py-3 px-3">Mã đơn</th>
                          <th className="py-3 px-3">Gói dịch vụ</th>
                          <th className="py-3 px-3">Khách hàng</th>
                          <th className="py-3 px-3 text-right">Giá trị đơn</th>
                          <th className="py-3 px-3 text-right">Hoa hồng (20%)</th>
                          <th className="py-3 px-3 text-center">Trạng thái</th>
                          <th className="py-3 px-3 text-right">Thời gian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {stats.commissions.map((comm) => (
                          <tr key={comm.id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="py-3.5 px-3 font-mono font-bold text-slate-300">
                              #{comm.orderCode}
                            </td>
                            <td className="py-3.5 px-3 font-semibold text-white">
                              {comm.planName}
                            </td>
                            <td className="py-3.5 px-3 text-slate-400 font-mono">
                              {comm.referredEmail ? comm.referredEmail.replace(/(.{3})(.*)(@.*)/, "$1***$3") : "Khách hàng"}
                            </td>
                            <td className="py-3.5 px-3 text-right font-medium text-slate-300">
                              {formatVND(comm.orderAmount)}
                            </td>
                            <td className="py-3.5 px-3 text-right font-black text-emerald-400">
                              +{formatVND(comm.commissionAmount)}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                                Đã cộng ví
                              </Badge>
                            </td>
                            <td className="py-3.5 px-3 text-right text-slate-400 text-xs">
                              {new Date(comm.createdAt).toLocaleDateString("vi-VN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              {/* TAB 2: Payouts History */}
              <TabsContent value="payouts" className="space-y-4">
                {!stats || stats.payouts.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 mx-auto">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-bold text-white">Chưa có yêu cầu rút tiền nào</h4>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                      Khi số dư hoa hồng của bạn đạt tối thiểu {formatVND(MIN_PAYOUT_AMOUNT)}, bấm nút <strong>Rút tiền</strong> ở trên để nhận tiền trực tiếp về tài khoản ngân hàng.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                          <th className="py-3 px-3">Ngày yêu cầu</th>
                          <th className="py-3 px-3">Số tiền rút</th>
                          <th className="py-3 px-3">Ngân hàng</th>
                          <th className="py-3 px-3">Số tài khoản</th>
                          <th className="py-3 px-3">Chủ tài khoản</th>
                          <th className="py-3 px-3 text-center">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {stats.payouts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                            <td className="py-3.5 px-3 text-slate-400">
                              {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="py-3.5 px-3 font-black text-white">
                              {formatVND(p.amount)}
                            </td>
                            <td className="py-3.5 px-3 text-slate-300 font-medium">
                              {p.bankName}
                            </td>
                            <td className="py-3.5 px-3 font-mono text-slate-300">
                              {p.bankAccount}
                            </td>
                            <td className="py-3.5 px-3 font-bold uppercase text-slate-200">
                              {p.bankHolder}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              {p.status === "completed" ? (
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                                  Đã chuyển khoản
                                </Badge>
                              ) : p.status === "rejected" ? (
                                <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]">
                                  Bị từ chối
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                                  Đang xử lý (24h)
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              {/* TAB 3: Swipe Files */}
              <TabsContent value="swipes" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {swipeFiles.map((swipe, idx) => (
                    <Card key={idx} className="bg-slate-950 border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-white text-sm line-clamp-1">{swipe.title}</h4>
                          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 shrink-0">
                            {swipe.badge}
                          </Badge>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {swipe.content.replace(/{{LINK}}/g, currentReferralUrl)}
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleCopySwipe(swipe.content, idx)}
                        className="mt-4 w-full h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        {copiedSwipeIdx === idx ? (
                          <>
                            <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> Đã sao chép kịch bản
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1.5 h-3.5 w-3.5" /> Sao chép bài viết
                          </>
                        )}
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* 📊 INTERACTIVE 20% COMMISSION CALCULATOR */}
      <section id="calculator" className="py-16 md:py-24 border-b border-slate-850 relative">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <Calculator className="h-4 w-4" /> Bảng Tính Thu Nhập
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              Ước Tính Hoa Hồng 20% Bạn Sẽ Nhận
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Kéo thanh trượt để xem thu nhập thụ động mỗi tháng và cả năm khi giới thiệu người dùng cho Ads Spy Tool.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl">
            {/* Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Plan Choice Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. Chọn gói người dùng đăng ký
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["monthly", "quarterly", "yearly"] as BillingCycle[]).map((cycleKey) => {
                    const c = BILLING_CYCLES[cycleKey]
                    const isSelected = calcCycle === cycleKey
                    return (
                      <button
                        key={cycleKey}
                        type="button"
                        onClick={() => setCalcCycle(cycleKey)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-950/40 text-white shadow-lg shadow-emerald-950/40"
                            : "border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <p className="text-xs font-bold">{c.name}</p>
                        <p className="text-sm sm:text-base font-black text-emerald-400 mt-1">
                          {formatVND(c.totalPrice)}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Slider Controls */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="ref-count-slider" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    2. Số lượng khách hàng bạn giới thiệu / tháng:
                  </label>
                  <span className="text-2xl font-black text-emerald-400 bg-slate-950 px-3.5 py-1 rounded-xl border border-slate-800">
                    {referralCount} người
                  </span>
                </div>

                <input
                  id="ref-count-slider"
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={referralCount}
                  onChange={(e) => setReferralCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                  aria-label="Số lượng khách hàng bạn giới thiệu mỗi tháng"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                  <span>1 người</span>
                  <span>25 người</span>
                  <span>50 người</span>
                  <span>100 người</span>
                </div>
              </div>
            </div>

            {/* Calculations Output Card (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/50 via-slate-950 to-slate-950 p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tỷ lệ hoa hồng
                </span>
                <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                  20% TRỌN ĐỜI
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-400">Doanh số bạn tạo ra:</span>
                <div className="text-lg font-bold text-slate-200">
                  {formatVND(calculatedEarnings.totalRevenue)}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Hoa hồng 20% bạn thực nhận / tháng:
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                  {formatVND(calculatedEarnings.totalCommission)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Thu nhập ước tính 1 năm:</span>
                <p className="text-base font-black text-white">
                  ~ {formatVND(calculatedEarnings.annualEst)} / năm
                </p>
              </div>

              <Button
                asChild
                className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
              >
                <a href="#partner-hub">Bắt đầu kiếm hoa hồng ngay</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 3 BƯỚC ĐƠN GIẢN ĐỂ KIẾM HOA HỒNG */}
      <section className="py-16 md:py-24 border-b border-slate-850 bg-slate-900/30">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <TrendingUp className="h-4 w-4" /> Quy Trình Đơn Giản
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              3 Bước Bắt Đầu Tạo Thu Nhập Thụ Động
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Không cần vốn, không cần kinh nghiệm, kích hoạt link tiếp thị chỉ trong 30 giây.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-7 shadow-lg space-y-4 hover:border-slate-700 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xl">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Lấy Link Tiếp Thị</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Đăng ký tài khoản miễn phí trên Ads Spy Tool. Hệ thống sẽ tự động cấp một liên kết giới thiệu độc quyền và mã code riêng cho bạn.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-7 shadow-lg space-y-4 hover:border-slate-700 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-xl">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Chia Sẻ & Quảng Bá</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Chia sẻ liên kết của bạn trên Facebook, TikTok, YouTube, Zalo, diễn đàn hoặc bạn bè đang có nhu cầu nghiên cứu video quảng cáo đối thủ.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-7 shadow-lg space-y-4 hover:border-slate-700 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-black text-xl">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Nhận 20% Hoa Hồng</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Mỗi khi có khách hàng đăng ký gói trả phí, 20% giá trị đơn hàng được tự động cộng vào ví của bạn. Rút tiền về ngân hàng nhanh chóng 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ CÂU HỎI THƯỜNG GẶP (FAQ) */}
      <section className="py-16 md:py-24 border-b border-slate-850">
        <div className="container px-4 md:px-6 mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <HelpCircle className="h-4 w-4" /> Giải Đáp Thắc Mắc
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Câu Hỏi Thường Gặp Về Chương Trình Tiếp Thị
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-100">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 🎁 BOTTOM CTA BANNER */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-950 to-indigo-950">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Sẵn Sàng Gia Tăng Thu Nhập Cùng Ads Spy Tool?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Hàng nghìn marketers và dropshippers đang tìm kiếm công cụ soi video ads đối thủ mỗi ngày. Hãy trở thành đối tác tiếp thị của chúng tôi ngay hôm nay!
          </p>
          <div className="pt-2">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950 cursor-pointer"
            >
              <Link href={user ? "#partner-hub" : "/register"}>
                {user ? "Vào Bảng Điều Khiển Tiếp Thị" : "Đăng Ký Làm Đối Tác Ngay"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-850 py-8 text-center text-xs text-slate-500">
        <div className="container px-4 mx-auto">
          <p>© 2026 Ads Spy Tool Affiliate Program. Hoa hồng 20% trọn đời trên mọi đơn hàng trả phí.</p>
        </div>
      </footer>
    </div>
  )
}
