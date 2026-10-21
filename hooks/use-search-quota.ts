'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import {
  SearchQuotaManager,
  SearchFeature,
  QuotaStatus,
} from '@/lib/search-quota'

export function useSearchQuota(feature: SearchFeature = 'yt') {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [quota, setQuota] = useState<QuotaStatus>(() =>
    SearchQuotaManager.getQuotaStatus(feature, user, profile)
  )

  // Fetch db profile once when user changes
  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      if (!user) {
        if (isMounted) {
          setProfile(null)
          setQuota(SearchQuotaManager.getQuotaStatus(feature, null, null))
        }
        return
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('subscription_plan, subscription_status, daily_search_count, last_search_date')
          .eq('id', user.id)
          .maybeSingle()

        if (!error && data && isMounted) {
          setProfile(data)
          setQuota(SearchQuotaManager.getQuotaStatus(feature, user, data))
        }
      } catch (err) {
        console.warn('Failed to load profile for search quota:', err)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [user, feature])

  // Recalculate quota when user or profile changes
  const refreshQuota = useCallback(() => {
    const updated = SearchQuotaManager.getQuotaStatus(feature, user, profile)
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
   * If not, automatically opens the upgrade modal and returns false.
   */
  const checkCanSearch = useCallback((): boolean => {
    const currentStatus = SearchQuotaManager.getQuotaStatus(feature, user, profile)
    setQuota(currentStatus)

    if (!currentStatus.canSearch) {
      setIsUpgradeModalOpen(true)
      return false
    }
    return true
  }, [feature, user, profile])

  /**
   * Record a search attempt and consume 1 quota
   */
  const consumeSearch = useCallback(async (): Promise<boolean> => {
    const currentStatus = SearchQuotaManager.getQuotaStatus(feature, user, profile)
    if (!currentStatus.canSearch) {
      setIsUpgradeModalOpen(true)
      return false
    }

    await SearchQuotaManager.recordSearch(feature, user)
    refreshQuota()
    return true
  }, [feature, user, profile, refreshQuota])

  return {
    quota,
    refreshQuota,
    checkCanSearch,
    consumeSearch,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    openUpgradeModal: () => setIsUpgradeModalOpen(true),
    closeUpgradeModal: () => setIsUpgradeModalOpen(false),
  }
}
