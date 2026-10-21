import { PayOS } from "@payos/node"

// Initialize PayOS - SDK v2 reads from env vars automatically
// PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY
export const payos = new PayOS()

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Miễn phí',
    price: 0,
    description: 'Gói trải nghiệm cơ bản',
    features: [
      'Tìm kiếm 5 lượt/ngày (YouTube & Facebook Ads)',
      'Xem thông tin quảng cáo cơ bản',
      'Giới hạn 20 mục yêu thích',
    ],
    searchLimit: 5,
    favoriteLimit: 20,
  },
  personal: {
    id: 'personal',
    name: 'Cá nhân',
    price: 99000,
    description: 'Gói dành cho người dùng cá nhân & Marketer',
    features: [
      'Tìm kiếm tối đa 25 lần/ngày (YouTube & Facebook Ads)',
      'Xem chi tiết video & kịch bản Hook 3s',
      'Không giới hạn mục yêu thích',
      'Bóc tách video Unlisted & tải MP4',
      'Hỗ trợ qua email',
    ],
    searchLimit: 25,
    favoriteLimit: -1, // unlimited
  },
  business: {
    id: 'business',
    name: 'Doanh nghiệp',
    price: 199000,
    description: 'Gói dành cho tổ chức, agency & doanh nghiệp',
    features: [
      'Tìm kiếm KHÔNG GIỚI HẠN (Unlimited searches)',
      'Đầy đủ dữ liệu bóc tách Spend, Reach, Duplicates',
      'Hỗ trợ 24/7 ưu tiên',
      'API riêng nếu cần & Tư vấn triển khai',
    ],
    searchLimit: -1, // unlimited
    favoriteLimit: -1, // unlimited
  },
} as const

export type PlanId = keyof typeof SUBSCRIPTION_PLANS

// Subscription Status
export type SubscriptionStatus = 'free' | 'personal' | 'business' | 'expired'

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
