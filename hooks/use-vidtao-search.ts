import { useState } from 'react'

interface SearchParams {
  query: string
  page?: number
  limit?: number
  [key: string]: any
}

interface SearchResult {
  success: boolean
  data?: any
  error?: string
  meta?: {
    account: string
    timestamp: number
  }
}

interface UseSearchReturn {
  searchAds: (params: SearchParams) => Promise<SearchResult>
  searchOffers: (params: SearchParams) => Promise<SearchResult>
  getVidTaoStatus: () => Promise<any>
  loading: boolean
  error: string | null
}

export function useVidTaoSearch(): UseSearchReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchAds = async (params: SearchParams): Promise<SearchResult> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/search/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Search failed')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const searchOffers = async (params: SearchParams): Promise<SearchResult> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/search/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Search failed')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const getVidTaoStatus = async () => {
    try {
      const response = await fetch('/api/vidtao/status')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get status')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  return {
    searchAds,
    searchOffers,
    getVidTaoStatus,
    loading,
    error
  }
}

// Hook for GET requests with URL parameters
export function useVidTaoSearchGet(): UseSearchReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchAds = async (params: SearchParams): Promise<SearchResult> => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key].toString())
        }
      })

      const response = await fetch(`/api/search/ads?${searchParams.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Search failed')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const searchOffers = async (params: SearchParams): Promise<SearchResult> => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key].toString())
        }
      })

      const response = await fetch(`/api/search/offers?${searchParams.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Search failed')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const getVidTaoStatus = async () => {
    try {
      const response = await fetch('/api/vidtao/status')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get status')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  return {
    searchAds,
    searchOffers,
    getVidTaoStatus,
    loading,
    error
  }
}