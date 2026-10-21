import { supabase } from "@/lib/supabase"

export type SearchFeature = 'yt' | 'fb'
export type PlanType = 'free' | 'personal' | 'business' | 'company'

export interface QuotaStatus {
  plan: PlanType
  planName: string
  limit: number // -1 for unlimited
  used: number
  remaining: number // -1 for unlimited
  isUnlimited: boolean
  canSearch: boolean
  feature: SearchFeature
  date: string
  message?: string
}

// Helper to get today's date in YYYY-MM-DD (local time)
export function getTodayKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export class SearchQuotaManager {
  private static isClient = typeof window !== 'undefined'

  private static getStorageKey(feature: SearchFeature, date: string, userId?: string | null): string {
    const userPrefix = userId ? `u_${userId}` : 'anon'
    return `ads_quota_${userPrefix}_${feature}_${date}`
  }

  private static getTotalStorageKey(date: string, userId?: string | null): string {
    const userPrefix = userId ? `u_${userId}` : 'anon'
    return `ads_quota_${userPrefix}_total_${date}`
  }

  /**
   * Determine the normalized plan from user or profile data
   */
  static getPlan(user?: any, profile?: any): PlanType {
    const rawPlan = (
      profile?.subscription_plan ||
      profile?.subscription_status ||
      user?.user_metadata?.subscription_plan ||
      'free'
    ).toLowerCase()

    if (rawPlan === 'business' || rawPlan === 'company') {
      return 'business'
    }
    if (rawPlan === 'personal') {
      return 'personal'
    }
    return 'free'
  }

  /**
   * Get plan display name
   */
  static getPlanName(plan: PlanType): string {
    switch (plan) {
      case 'business':
      case 'company':
        return 'Doanh nghiệp / Max'
      case 'personal':
        return 'Cá nhân'
      default:
        return 'Miễn phí'
    }
  }

  /**
   * Get search limit for a plan
   * Free: 5 searches/day (for YT and FB)
   * Personal: 25 searches/day
   * Business: Unlimited (-1)
   */
  static getLimit(plan: PlanType): number {
    switch (plan) {
      case 'business':
      case 'company':
        return -1
      case 'personal':
        return 25
      default:
        return 5
    }
  }

  /**
   * Get current usage from local storage
   */
  static getLocalUsage(feature: SearchFeature, userId?: string | null): { featureUsed: number; totalUsed: number } {
    if (!this.isClient) return { featureUsed: 0, totalUsed: 0 }

    try {
      const today = getTodayKey()
      const featureKey = this.getStorageKey(feature, today, userId)
      const totalKey = this.getTotalStorageKey(today, userId)

      const featureVal = parseInt(localStorage.getItem(featureKey) || '0', 10)
      const totalVal = parseInt(localStorage.getItem(totalKey) || '0', 10)

      return {
        featureUsed: isNaN(featureVal) ? 0 : featureVal,
        totalUsed: isNaN(totalVal) ? 0 : totalVal,
      }
    } catch {
      return { featureUsed: 0, totalUsed: 0 }
    }
  }

  /**
   * Check quota for a given feature and user
   */
  static getQuotaStatus(
    feature: SearchFeature,
    user?: any,
    profile?: any
  ): QuotaStatus {
    const plan = this.getPlan(user, profile)
    const limit = this.getLimit(plan)
    const isUnlimited = limit === -1
    const today = getTodayKey()
    const { featureUsed, totalUsed } = this.getLocalUsage(feature, user?.id)

    // For personal plan (25/day limit), limit applies to total platform searches
    // For free plan, 5 searches/day applies per feature
    const used = plan === 'personal' ? totalUsed : featureUsed
    const remaining = isUnlimited ? -1 : Math.max(0, limit - used)
    const canSearch = isUnlimited || remaining > 0

    let message: string | undefined
    if (!canSearch) {
      if (plan === 'free') {
        message = `Bạn đã sử dụng hết 5 lượt tìm kiếm miễn phí ${feature === 'yt' ? 'YouTube Ads' : 'Facebook Ads'} hôm nay. Nâng cấp gói Cá nhân (25 lượt/ngày) để tiếp tục!`
      } else if (plan === 'personal') {
        message = 'Bạn đã sử dụng hết 25 lượt tìm kiếm hôm nay. Nâng cấp gói Doanh nghiệp để tìm kiếm không giới hạn!'
      }
    }

    return {
      plan,
      planName: this.getPlanName(plan),
      limit,
      used,
      remaining,
      isUnlimited,
      canSearch,
      feature,
      date: today,
      message,
    }
  }

  /**
   * Record a search action, updating localStorage and syncing with server if logged in
   */
  static async recordSearch(feature: SearchFeature, user?: any): Promise<void> {
    if (!this.isClient) return

    const today = getTodayKey()
    const userId = user?.id || null
    const featureKey = this.getStorageKey(feature, today, userId)
    const totalKey = this.getTotalStorageKey(today, userId)

    try {
      const currentFeature = parseInt(localStorage.getItem(featureKey) || '0', 10) || 0
      const currentTotal = parseInt(localStorage.getItem(totalKey) || '0', 10) || 0

      localStorage.setItem(featureKey, String(currentFeature + 1))
      localStorage.setItem(totalKey, String(currentTotal + 1))

      // Dispatch event so UI components can re-render immediately
      window.dispatchEvent(
        new CustomEvent('search_quota_updated', {
          detail: { feature, today, userId },
        })
      )
    } catch (e) {
      console.warn('Could not record search to localStorage:', e)
    }

    // If user is authenticated, sync with Supabase / API route
    if (user?.id) {
      try {
        fetch('/api/user/search-quota', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            feature,
            date: today,
          }),
        }).catch((err) => {
          console.warn('Search quota background sync failed:', err)
        })
      } catch {
        // Silently handle offline or network error
      }
    }
  }
}
