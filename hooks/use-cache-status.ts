import { useState, useCallback } from 'react'

interface CacheStats {
  totalRequests: number
  cacheHits: number
  cacheMisses: number
  hitRate: number
  cacheSize: number
}

interface CacheStatusResponse {
  success: boolean
  data: {
    cache: CacheStats
    info: {
      description: string
      cacheTypes: string[]
      defaultTTL: string
      autoCleanup: string
    }
  }
  timestamp: number
}

export function useCacheStatus() {
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/cache/status')
      const data: CacheStatusResponse = await response.json()

      if (data.success) {
        setStats(data.data.cache)
      } else {
        setError('Failed to fetch cache status')
      }
    } catch (err) {
      setError('Network error while fetching cache status')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearCache = useCallback(async (type: 'all' | 'ads' | 'offers' = 'all') => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/cache/status?type=${type}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()

      if (data.success) {
        // Refresh stats after clearing
        await fetchStats()
        return { success: true, message: data.message }
      } else {
        setError(data.error || 'Failed to clear cache')
        return { success: false, error: data.error }
      }
    } catch (err) {
      const errorMsg = 'Network error while clearing cache'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    fetchStats,
    clearCache
  }
}