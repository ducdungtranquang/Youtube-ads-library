import { useState, useCallback } from 'react'
import { useQuickSearchWithCache } from './use-cache-polling'

interface SearchParams {
  query?: string
  searchTerm?: string
  page?: number
  limit?: number
  [key: string]: any
}

interface SearchResult {
  success: boolean
  data?: any
  error?: string
  pending?: boolean
  cacheId?: string
}

interface UseQuickSearchReturn {
  searchAds: (params: SearchParams) => Promise<SearchResult>
  loading: boolean
  error: string | null
  data: any
  status: string | null
}

export function useQuickSearchAds(): UseQuickSearchReturn {
  const { searchWithCache, loading, data, error, status } = useQuickSearchWithCache()
  const [searchError, setSearchError] = useState<string | null>(null)

  const searchAds = useCallback(async (params: SearchParams): Promise<SearchResult> => {
    setSearchError(null)

    try {
      const result = await searchWithCache(params)
      
      if (result.pending) {
        // Don't show "Found" toast when pending - just return pending status
        return { 
          success: true, 
          pending: true, 
          cacheId: result.cacheId 
        }
      } else {
        // Return cached result
        return { 
          success: true, 
          data: result.data 
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setSearchError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }, [searchWithCache])

  return {
    searchAds,
    loading,
    error: searchError || error,
    data,
    status
  }
}