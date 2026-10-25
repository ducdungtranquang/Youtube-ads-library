export const AFFILIATE_COMMISSION_RATE = 0.20 // 20% hoa hồng trên mỗi đơn hàng
export const MIN_PAYOUT_AMOUNT = 200000 // Tối thiểu 200.000 VNĐ để rút tiền
export const REFERRAL_COOKIE_NAME = 'ads_spy_ref'
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 ngày cookie tracking

export interface AffiliatePartner {
  id: string
  referralCode: string
  userEmail: string
  fullName: string | null
  balance: number
  totalEarned: number
  totalWithdrawn: number
  totalClicks: number
  totalSignups: number
  totalConversions: number
  bankName: string | null
  bankAccount: string | null
  bankHolder: string | null
  status: 'active' | 'paused' | 'banned'
  createdAt: string
}

export interface AffiliateCommission {
  id: string
  affiliateId: string
  referredEmail: string
  orderCode: number
  planName: string
  orderAmount: number
  commissionRate: number
  commissionAmount: number
  status: 'pending' | 'completed' | 'refunded'
  createdAt: string
}

export interface AffiliatePayout {
  id: string
  affiliateId: string
  amount: number
  bankName: string
  bankAccount: string
  bankHolder: string
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  adminNote?: string | null
  createdAt: string
}

export interface AffiliateStatsData {
  partner: AffiliatePartner
  commissions: AffiliateCommission[]
  payouts: AffiliatePayout[]
  referralUrl: string
}

/**
 * Sinh mã giới thiệu ngẫu nhiên theo format ADS + 6 ký tự viết hoa
 */
export function generateReferralCode(seed?: string): string {
  if (seed && seed.trim().length >= 3) {
    const cleaned = seed.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5)
    const random = Math.floor(100 + Math.random() * 900)
    return `ADS${cleaned}${random}`
  }
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ADS${randomChars}`
}

/**
 * Tính hoa hồng 20% làm tròn
 */
export function calculateCommission(orderAmount: number): number {
  return Math.round(orderAmount * AFFILIATE_COMMISSION_RATE)
}

/**
 * Định dạng tiền tệ VNĐ
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}
