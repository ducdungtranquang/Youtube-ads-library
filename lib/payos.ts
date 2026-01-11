import { PayOS } from "@payos/node"

// Initialize PayOS - SDK v2 reads from env vars automatically
// PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY
export const payos = new PayOS()

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  personal: {
    id: 'personal',
    name: 'Cá nhân',
    price: 229000,
    description: 'Gói dành cho người dùng cá nhân',
    features: [
      'Tìm kiếm tối đa 10 lần/ngày',
      'Xem chi tiết video',
      'Không giới hạn mục yêu thích',
      'Hỗ trợ qua email'
    ],
    searchLimit: 10,
    favoriteLimit: -1, // unlimited
  },
  business: {
    id: 'business',
    name: 'Doanh nghiệp',
    price: 999000,
    description: 'Gói dành cho tổ chức, doanh nghiệp',
    features: [
      'Tìm kiếm không giới hạn',
      'Hỗ trợ 24/7',
      'API riêng nếu cần',
      'Tư vấn triển khai'
    ],
    searchLimit: -1, // unlimited
    favoriteLimit: -1, // unlimited
  }
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
