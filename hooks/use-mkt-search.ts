import { useState, useCallback } from 'react'
import { useMKTSearchWithCache } from './use-cache-polling'
import { 
  MKTSearchParams, 
  MKTSearchResponse, 
  MKTSearchFilters,
  TransformedVideoResult 
} from '@/types/mkt-search'

interface MKTSearchResult {
  success: boolean
  data?: MKTSearchResponse
  error?: string
  pending?: boolean
  cacheId?: string
}

export function useMKTSearch() {
  const { searchWithCache, loading, data, error, status } = useMKTSearchWithCache()
  const [searchError, setSearchError] = useState<string | null>(null)

  const searchMKTAds = useCallback(async (params: MKTSearchParams): Promise<MKTSearchResult> => {
    setSearchError(null)

    try {
      const payload = {
        searchTerm: params.searchTerm,
        page: params.page || 1,
        limit: params.limit || 1000, // Use 1000 for better FE pagination
        countryId: params.filters?.countryId || 0,
        language: params.filters?.language || '',
        categoryIds: params.filters?.categoryIds || [],
        dateFrom: params.filters?.dateFrom || '',
        dateTo: params.filters?.dateTo || '',
        showVideos: params.filters?.showVideos || 'unlisted',
        sortProp: params.filters?.sortProp || 'date',
        orderAsc: params.filters?.orderAsc || false
      }

      console.log('MKT Search Hook: Sending request with payload:', payload)

      const result = await searchWithCache(payload)
      
      if (result.pending) {
        // Don't show "Found" toast when pending - just return pending status
        console.log('MKT Search Hook: Request is pending, polling will start automatically')
        return { 
          success: true, 
          pending: true, 
          cacheId: result.cacheId 
        }
      } else {
        // Return cached result
        console.log('MKT Search Hook: Received cached result:', {
          success: result?.data?.success,
          total_results: result?.data?.total_results,
          total_available: result?.data?.total_available,
          results_count: result?.data?.data?.results?.length || 0
        })
        
        return { 
          success: true, 
          data: result.data 
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      console.error('MKT Search Hook: Error:', errorMessage)
      setSearchError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }, [searchWithCache])

  return {
    searchMKTAds,
    loading,
    error: searchError || error,
    data, // Cache polling data
    status, // Cache polling status
    clearError: () => setSearchError(null)
  }
}