import { useState, useCallback } from 'react'

interface FeaturedContent {
  ads?: any[]
  offers?: any[]
  categories?: any[]
  networks?: any[]
  total: number
  filters?: any
}

interface FeaturedResponse {
  success: boolean
  data: FeaturedContent
  meta: {
    timestamp: number
    source: string
  }
}

export function useFeaturedContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedAds = useCallback(async (params?: {
    limit?: number
    category?: string
    sortBy?: 'views' | 'ctr' | 'recent'
  }) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.category) searchParams.append('category', params.category)
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy)

      const response = await fetch(`/api/featured/ads?${searchParams.toString()}`)
      const data: FeaturedResponse = await response.json()

      if (data.success) {
        return { success: true, data: data.data }
      } else {
        setError('Failed to fetch featured ads')
        return { success: false, error: 'Failed to fetch featured ads' }
      }
    } catch (err) {
      const errorMsg = 'Network error while fetching featured ads'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFeaturedOffers = useCallback(async (params?: {
    limit?: number
    category?: string
    network?: string
    minPayout?: number
    maxPayout?: number
    sortBy?: 'payout' | 'conversion' | 'epc'
  }) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      if (params?.limit) searchParams.append('limit', params.limit.toString())
      if (params?.category) searchParams.append('category', params.category)
      if (params?.network) searchParams.append('network', params.network)
      if (params?.minPayout) searchParams.append('minPayout', params.minPayout.toString())
      if (params?.maxPayout) searchParams.append('maxPayout', params.maxPayout.toString())
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy)

      const response = await fetch(`/api/featured/offers?${searchParams.toString()}`)
      const data: FeaturedResponse = await response.json()

      if (data.success) {
        return { success: true, data: data.data }
      } else {
        setError('Failed to fetch featured offers')
        return { success: false, error: 'Failed to fetch featured offers' }
      }
    } catch (err) {
      const errorMsg = 'Network error while fetching featured offers'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTrendingCategories = useCallback(async (type: 'ads' | 'offers') => {
    setLoading(true)
    setError(null)

    try {
      const endpoint = type === 'ads' ? '/api/featured/ads' : '/api/featured/offers'
      const response = await fetch(`${endpoint}?limit=1`) // Chỉ cần categories data
      const data: FeaturedResponse = await response.json()

      if (data.success) {
        const categories = type === 'ads' ? data.data.categories : data.data.networks
        return { success: true, data: categories }
      } else {
        setError(`Failed to fetch trending ${type} categories`)
        return { success: false, error: `Failed to fetch trending ${type} categories` }
      }
    } catch (err) {
      const errorMsg = `Network error while fetching trending ${type} categories`
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    fetchFeaturedAds,
    fetchFeaturedOffers,
    fetchTrendingCategories
  }
}