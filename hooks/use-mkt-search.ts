import { useState, useCallback } from 'react'
import { 
  MKTSearchParams, 
  MKTSearchResponse, 
  MKTSearchFilters,
  TransformedVideoResult 
} from '@/types/mkt-search'

export function useMKTSearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchMKTAds = useCallback(async (params: MKTSearchParams): Promise<MKTSearchResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const payload = {
        searchTerm: params.searchTerm,
        page: params.page || 1,
        limit: params.limit || 20,
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

      const response = await fetch('/api/search/mkt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data: MKTSearchResponse = await response.json()
      
      console.log('MKT Search Hook: Received response:', {
        success: data.success,
        total_results: data.total_results,
        total_available: data.total_available,
        results_count: data.data?.results?.length || 0
      })

      return data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('MKT Search Hook: Error:', errorMessage)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    searchMKTAds,
    loading,
    error,
    clearError: () => setError(null)
  }
}