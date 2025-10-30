import { useState, useEffect, useCallback, useRef } from 'react'

export type CacheStatus = 'pending' | 'completed' | 'error'

export interface CachePollingResult<T = any> {
  status: CacheStatus | null
  data: T | null
  error: string | null
  isPolling: boolean
  startPolling: (cacheId: string, maxDuration?: number) => void
  stopPolling: () => void
}

export interface CacheStatusResponse {
  status: CacheStatus
  data?: any
  error?: string
  message?: string
  createdAt?: string
  updatedAt?: string
}

export function useCachePolling<T = any>(
  pollingInterval: number = 6000, // 6 seconds
  maxPollingDuration: number = 180000 // 3 minutes
): CachePollingResult<T> {
  const [status, setStatus] = useState<CacheStatus | null>(null)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const maxDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const cacheIdRef = useRef<string | null>(null)

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current)
      maxDurationTimeoutRef.current = null
    }
    
    setIsPolling(false)
    cacheIdRef.current = null
  }, [])

  const checkCacheStatus = useCallback(async (cacheId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cache/status?cacheId=${encodeURIComponent(cacheId)}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setStatus('error')
          setError('Cache entry not found')
          return true // Stop polling
        } else if (response.status === 410) {
          setStatus('error')
          setError('Cache entry expired')
          return true // Stop polling
        }
        throw new Error(`HTTP ${response.status}`)
      }

      const result: CacheStatusResponse = await response.json()
      
      setStatus(result.status)
      
      if (result.status === 'completed') {
        setData(result.data)
        setError(null)
        return true // Stop polling
      } else if (result.status === 'error') {
        setError(result.error || 'Search failed')
        setData(null)
        return true // Stop polling
      } else if (result.status === 'pending') {
        setError(null)
        return false // Continue polling
      }
      
      return false
    } catch (err) {
      console.error('Cache status check error:', err)
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to check cache status')
      return true // Stop polling on error
    }
  }, [])

  const startPolling = useCallback((cacheId: string, maxDuration?: number) => {
    // Stop any existing polling
    stopPolling()
    
    // Reset state
    setStatus('pending')
    setData(null)
    setError(null)
    setIsPolling(true)
    cacheIdRef.current = cacheId
    
    const actualMaxDuration = maxDuration || maxPollingDuration
    
    // Set max duration timeout
    maxDurationTimeoutRef.current = setTimeout(() => {
      setStatus('error')
      setError('Polling timeout - search took too long')
      stopPolling()
    }, actualMaxDuration)
    
    // Start polling
    const poll = async () => {
      if (!cacheIdRef.current) return
      
      const shouldStop = await checkCacheStatus(cacheIdRef.current)
      
      if (shouldStop) {
        stopPolling()
      }
    }
    
    // Initial check
    poll()
    
    // Set up interval
    pollingIntervalRef.current = setInterval(poll, pollingInterval)
  }, [checkCacheStatus, pollingInterval, maxPollingDuration, stopPolling])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  return {
    status,
    data,
    error,
    isPolling,
    startPolling,
    stopPolling
  }
}

// Generic hook for search with cache polling

import { supabase } from '@/lib/supabase'

function useSearchWithCache(apiEndpoint: string) {
  const cachePolling = useCachePolling(6000, 180000) // 6s interval, 3min max
  const [loading, setLoading] = useState(false)

  const searchWithCache = useCallback(async (searchParams: any) => {
    try {
      setLoading(true)
      // Lấy access token từ supabase
      let accessToken: string | undefined = undefined;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        accessToken = session?.access_token;
      } catch {}

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(searchParams),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      
      if (result.status === 'pending') {
        // Start polling for this cache entry
        cachePolling.startPolling(result.cacheId)
        return { success: true, pending: true, cacheId: result.cacheId }
      } else {
        // Direct result (from cache)
        setLoading(false)
        return { success: true, data: result }
      }
    } catch (error) {
      setLoading(false)
      console.error('Search error:', error)
      throw error
    }
  }, [cachePolling, apiEndpoint])

  // Update loading state based on polling
  useEffect(() => {
    if (cachePolling.status === 'completed' || cachePolling.status === 'error') {
      setLoading(false)
    }
  }, [cachePolling.status])

  return {
    searchWithCache,
    loading: loading || cachePolling.isPolling,
    data: cachePolling.data,
    error: cachePolling.error,
    status: cachePolling.status,
    stopPolling: cachePolling.stopPolling
  }
}

// Specialized hook for MKT search with cache polling
export function useMKTSearchWithCache() {
  return useSearchWithCache('/api/search/mkt')
}

// Specialized hook for Brands search with cache polling
export function useBrandsSearchWithCache() {
  return useSearchWithCache('/api/search/brands')
}

// Specialized hook for Companies search with cache polling
export function useCompaniesSearchWithCache() {
  return useSearchWithCache('/api/search/companies')
}

// Specialized hook for QuickSearch with cache polling
export function useQuickSearchWithCache() {
  const cachePolling = useCachePolling(2000, 180000) // 2s interval, 3min max (faster for quick search)
  const [loading, setLoading] = useState(false)

  const searchWithCache = useCallback(async (searchParams: any) => {
    try {
      setLoading(true)
      // Lấy access token từ supabase
      let accessToken: string | undefined = undefined;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        accessToken = session?.access_token;
      } catch {}

      const response = await fetch('/api/search/quicksearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(searchParams),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      
      if (result.status === 'pending') {
        // Start polling for this cache entry
        cachePolling.startPolling(result.cacheId)
        return { success: true, pending: true, cacheId: result.cacheId }
      } else {
        // Direct result (from cache)
        setLoading(false)
        return { success: true, data: result }
      }
    } catch (error) {
      setLoading(false)
      console.error('QuickSearch error:', error)
      throw error
    }
  }, [cachePolling])

  // Update loading state based on polling
  useEffect(() => {
    if (cachePolling.status === 'completed' || cachePolling.status === 'error') {
      setLoading(false)
    }
  }, [cachePolling.status])

  return {
    searchWithCache,
    loading: loading || cachePolling.isPolling,
    data: cachePolling.data,
    error: cachePolling.error,
    status: cachePolling.status,
    stopPolling: cachePolling.stopPolling
  }
}