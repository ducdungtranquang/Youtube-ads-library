import { useState, useCallback } from 'react'

interface BrandDetails {
  brand: {
    brandId: number
    name: string
    swiped: boolean
    averageVideoDuration: number | null
    description: string | null
    categoryId: number
    thumbnail: string
    views: {
      today: number
      last7Days: number
      last14Days: number
      last21Days: number
      last30Days: number
      last60Days: number
      last90Days: number
      last180Days: number
      last365Days: number
      last720Days: number
      collected_on: string
    }
    spend: {
      today: number
      last7Days: number
      last14Days: number
      last21Days: number
      last30Days: number
      last60Days: number
      last90Days: number
      last180Days: number
      last365Days: number
      last720Days: number
      collected_on: string
    }
  }
  ranks: any
  creativeCount: number
  top5Countries: Array<{
    countryId: number
    count: number
    percentage: number
  }>
}

interface UseBrandDetailsResult {
  loading: boolean
  error: string | null
  brandDetails: BrandDetails | null
  fetchBrandDetails: (brandId: string) => Promise<void>
}

export function useBrandDetails(): UseBrandDetailsResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [brandDetails, setBrandDetails] = useState<BrandDetails | null>(null)

  const fetchBrandDetails = useCallback(async (brandId: string) => {
    if (!brandId) {
      setError('Brand ID is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/brands/${brandId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch brand details')
      }

      if (result.success && result.data) {
        setBrandDetails(result.data.data)
      } else {
        throw new Error(result.error || 'Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching brand details:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setBrandDetails(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    brandDetails,
    fetchBrandDetails
  }
}