export type BillingCycle = 'monthly' | 'quarterly' | 'yearly'

export interface BillingCycleDetail {
  id: BillingCycle
  name: string
  months: number
  monthlyPrice: number
  totalPrice: number
  monthlyPriceFormatted: string
  totalPriceFormatted: string
  label: string
  savings?: string
  popular?: boolean
}

export const BILLING_CYCLES: Record<BillingCycle, BillingCycleDetail> = {
  monthly: {
    id: 'monthly',
    name: '1 Tháng',
    months: 1,
    monthlyPrice: 99000,
    totalPrice: 99000,
    monthlyPriceFormatted: '99.000₫',
    totalPriceFormatted: '99.000₫',
    label: '99k/tháng',
  },
  quarterly: {
    id: 'quarterly',
    name: 'Theo Quý (3 Tháng)',
    months: 3,
    monthlyPrice: 89000,
    totalPrice: 267000, // 89k * 3
    monthlyPriceFormatted: '89.000₫',
    totalPriceFormatted: '267.000₫',
    label: '89k/tháng (267k/quý)',
    savings: 'Tiết kiệm 10%',
  },
  yearly: {
    id: 'yearly',
    name: 'Theo Năm (12 Tháng)',
    months: 12,
    monthlyPrice: 79000,
    totalPrice: 948000, // 79k * 12
    monthlyPriceFormatted: '79.000₫',
    totalPriceFormatted: '948.000₫',
    label: '79k/tháng (948k/năm)',
    savings: 'Tiết kiệm 20% - Tối ưu nhất',
    popular: true,
  },
}

// Subscription Plans (2 Plans: Free & Unlimited)
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Miễn phí',
    price: 0,
    description: 'Xem đầy đủ chi tiết quảng cáo, giới hạn lượt tìm kiếm và không xem được Winning Products',
    features: [
      'Xem Full thông tin quảng cáo chi tiết (YouTube & Facebook Ads)',
      'Xem video quảng cáo, kịch bản Hook 3s & Landing Page đối thủ',
      'Tra cứu dữ liệu Spend, Reach, Duplicates & Scaling score',
      'Giới hạn 5 lượt tìm kiếm/ngày',
      'Lưu tối đa 20 mục yêu thích',
      'Không xem được Kho Sản Phẩm Chiến Thắng (Winning Products)',
      'Không nhận giới thiệu 3–5 sản phẩm tiềm năng mỗi tuần',
    ],
    searchLimit: 5,
    favoriteLimit: 20,
  },
  unlimited: {
    id: 'unlimited',
    name: 'Không Giới Hạn',
    price: 99000,
    description: 'Tìm kiếm không giới hạn, xem Winning Products & nhận 3–5 sản phẩm tiềm năng mỗi tuần',
    features: [
      'Tìm kiếm KHÔNG GIỚI HẠN (Unlimited searches)',
      'Xem Full toàn bộ dữ liệu quảng cáo YouTube & Facebook Ads',
      'Độc quyền: Xem trọn bộ Kho Sản Phẩm Chiến Thắng (Winning Products) & Bảng vàng tháng',
      'ĐẶC QUYỀN: Được giới thiệu 3–5 sản phẩm tiềm năng mỗi tuần',
      'Phân tích Product Score AI, Winning Ads & Top Creatives theo Domain',
      'Nghiên cứu video Unlisted & tải video MP4',
      'Xem chi tiết video, kịch bản Hook 3s & Landing Page đối thủ',
      'Không giới hạn mục yêu thích lưu trữ',
      'Nghiên cứu Spend, Reach, Duplicates, Scaling score chuyên sâu',
      'Phân tích phễu chuyển đổi TOF / MOF / BOF',
      'Dữ liệu phân bổ thị trường Quốc gia (Geo Tier)',
      'Hỗ trợ kỹ thuật 24/7 & Cập nhật tính năng liên tục',
    ],
    searchLimit: -1, // unlimited
    favoriteLimit: -1, // unlimited
  },
  // Backward compatibility aliases
  personal: {
    id: 'personal',
    name: 'Không Giới Hạn',
    price: 99000,
    description: 'Gói Không Giới Hạn',
    features: [],
    searchLimit: -1,
    favoriteLimit: -1,
  },
  business: {
    id: 'business',
    name: 'Không Giới Hạn',
    price: 99000,
    description: 'Gói Không Giới Hạn',
    features: [],
    searchLimit: -1,
    favoriteLimit: -1,
  },
} as const

export type PlanId = keyof typeof SUBSCRIPTION_PLANS

// Subscription Status
export type SubscriptionStatus = 'free' | 'unlimited' | 'personal' | 'business' | 'expired'

export interface CreatePaymentParams {
  userId: string
  userEmail: string
  planId: PlanId
  returnUrl: string
  cancelUrl: string
}

export interface PaymentResult {
  success: boolean
  checkoutUrl?: string
  orderCode?: number
  error?: string
}

// Generate unique order code (must be positive integer, max 9007199254740991)
export function generateOrderCode(): number {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return Number(`${timestamp}${random}`.slice(-13))
}
