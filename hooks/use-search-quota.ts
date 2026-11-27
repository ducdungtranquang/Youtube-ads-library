'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import {
  SearchQuotaManager,
  SearchFeature,
  QuotaStatus,
} from '@/lib/search-quota'

function getCachedProfile(userId?: string | null) {
  if (typeof window === 'undefined' || !userId) return null
  try {
    const raw = localStorage.getItem(`ads_spy_profile_${userId}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setCachedProfile(userId: string, profileData: any) {
  if (typeof window === 'undefined' || !userId || !profileData) return
  try {
    localStorage.setItem(`ads_spy_profile_${userId}`, JSON.stringify(profileData))
  } catch {
    // ignore storage quota errors
  }
}

export function useSearchQuota(feature: SearchFeature = 'yt') {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<any>(() => getCachedProfile(user?.id))
  const [loading, setLoading] = useState<boolean>(true)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [quota, setQuota] = useState<QuotaStatus>(() =>
    SearchQuotaManager.getQuotaStatus(feature, user, getCachedProfile(user?.id))
  )
  const profileRef = useRef<any>(profile)
  profileRef.current = profile
  const loadedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let retryTimer: ReturnType<typeof setTimeout> | null = null

    async function fetchServerProfile(userId: string) {
      const res = await fetch(`/api/user/search-quota?userId=${encodeURIComponent(userId)}`, {
        cache: 'no-store',
      })
      if (!res.ok) {
        throw new Error(`Server quota check failed: ${res.status}`)
      }
      const json = await res.json()
      if (!json || typeof json.plan !== 'string') {
        throw new Error('Invalid quota response')
      }
      return {
        subscription_plan: json.plan,
        subscription_status: json.plan,
        daily_search_count: json.used ?? 0,
      }
    }

    async function loadProfile(silent = false) {
      if (authLoading) {
        return
      }

      if (!user) {
        loadedUserIdRef.current = null
        if (isMounted) {
          setProfile(null)
          setQuota(SearchQuotaManager.getQuotaStatus(feature, null, null))
          setLoading(false)
        }
        return
      }

      // Immediately hydrate from per-user cache so known Unlimited users are never blocked while loading
      const cached = getCachedProfile(user.id)
      if (cached && !profileRef.current && isMounted) {
        setProfile(cached)
        setQuota(SearchQuotaManager.getQuotaStatus(feature, user, cached))
      }

      if (!silent) {
        setLoading(true)
      }

      try {
        let userProfileData: any = null

        const { data, error } = await supabase
          .from('user_profiles')
          .select('subscription_plan, subscription_status, daily_search_count, last_search_date')
          .eq('id', user.id)
          .maybeSingle()

        if (!error && data) {
          userProfileData = data
          const currentPlan = (data.subscription_plan || data.subscription_status || 'free').toLowerCase()

          // Nếu là free, kiểm tra thêm API server (dùng Service Role + auto-sync PayOS)
          if (currentPlan === 'free') {
            try {
              const serverProfile = await fetchServerProfile(user.id)
              if (serverProfile.subscription_plan === 'unlimited') {
                userProfileData = {
                  ...data,
                  subscription_plan: 'unlimited',
                  subscription_status: 'unlimited',
                }
              }
            } catch (syncErr) {
              console.warn('Auto-sync quota check failed:', syncErr)
            }
          }
        } else {
          // Client Supabase query lỗi (VD: JWT đang refresh hoặc rớt mạng) -> fallback sang Server API
          userProfileData = await fetchServerProfile(user.id)
        }

        if (isMounted && userProfileData) {
          loadedUserIdRef.current = user.id
          setCachedProfile(user.id, userProfileData)
          setProfile(userProfileData)
          const nextQuota = SearchQuotaManager.getQuotaStatus(feature, user, userProfileData)
          setQuota(nextQuota)
          if (nextQuota.isUnlimited) {
            setIsUpgradeModalOpen(false)
          }
        }
      } catch (err) {
        console.warn('Failed to load profile for search quota, keeping existing state:', err)
        // Không ghi đè quota về 'free' nếu trước đó đã có profile/cache hợp lệ; thử lại sau 2.5s
        if (isMounted) {
          const fallbackProfile = profileRef.current || getCachedProfile(user.id)
          if (fallbackProfile) {
            setQuota(SearchQuotaManager.getQuotaStatus(feature, user, fallbackProfile))
          }
          retryTimer = setTimeout(() => {
            if (isMounted) {
              loadProfile(true)
            }
          }, 2500)
        }
      } finally {
        if (isMounted && !silent) {
          setLoading(false)
        }
      }
    }

    loadProfile(false)

    // Tự động đồng bộ lại gói khi user quay lại tab (silent refresh)
    let lastCheck = 0
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState && document.visibilityState !== 'visible') return
      const now = Date.now()
      if (now - lastCheck < 5000) return
      lastCheck = now
      if (user?.id) {
        loadProfile(true)
      }
    }

    window.addEventListener('focus', handleVisibilityOrFocus)
    document.addEventListener('visibilitychange', handleVisibilityOrFocus)

    return () => {
      isMounted = false
      if (retryTimer) clearTimeout(retryTimer)
      window.removeEventListener('focus', handleVisibilityOrFocus)
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
    }
  }, [user?.id, feature, authLoading])

  // Recalculate quota when user or profile changes
  const refreshQuota = useCallback(() => {
    const activeProfile = profile || getCachedProfile(user?.id)
    const updated = SearchQuotaManager.getQuotaStatus(feature, user, activeProfile)
    setQuota(updated)
    return updated
  }, [feature, user, profile])

  // Listen for search quota events (e.g. when search performed in another component or tab)
  useEffect(() => {
    const handleQuotaUpdated = () => {
      refreshQuota()
    }

    window.addEventListener('search_quota_updated', handleQuotaUpdated)
    window.addEventListener('storage', handleQuotaUpdated)

    return () => {
      window.removeEventListener('search_quota_updated', handleQuotaUpdated)
      window.removeEventListener('storage', handleQuotaUpdated)
    }
  }, [refreshQuota])

  /**
   * Check if user can perform a search.
   * If loading or unlimited, allows search.
   * If not, automatically opens the upgrade modal and returns false.
   */
  const checkCanSearch = useCallback((): boolean => {
    const cached = getCachedProfile(user?.id)
    if (
      authLoading ||
      loading ||
      (user?.id && loadedUserIdRef.current !== user.id && !cached)
    ) {
      return true
    }

    const activeProfile = profile || cached
    const currentStatus = SearchQuotaManager.getQuotaStatus(feature, user, activeProfile)
    setQuota(currentStatus)

    if (!currentStatus.canSearch) {
      setIsUpgradeModalOpen(true)
      return false
    }
    return true
  }, [feature, user, profile, loading, authLoading])

  /**
   * Record a search attempt and consume 1 quota
   */
  const consumeSearch = useCallback(async (): Promise<boolean> => {
    const activeProfile = profile || getCachedProfile(user?.id)
    const currentStatus = SearchQuotaManager.getQuotaStatus(feature, user, activeProfile)
    if (!currentStatus.canSearch && !loading) {
      setIsUpgradeModalOpen(true)
      return false
    }

    await SearchQuotaManager.recordSearch(feature, user)
    refreshQuota()
    return true
  }, [feature, user, profile, loading, refreshQuota])

  return {
    quota,
    loading,
    refreshQuota,
    checkCanSearch,
    consumeSearch,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    openUpgradeModal: () => setIsUpgradeModalOpen(true),
    closeUpgradeModal: () => setIsUpgradeModalOpen(false),
  }
}
