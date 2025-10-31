import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface CompanyDetails {
  company: {
    companyId: number
    legalName: string
    countryId: number
    swiped: boolean
    categoryId: number
    revenue: string
    headquarters: string
    yearFounded: string
    numberOfEmployees: string
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
  ranks: {
    global: {
      rank: number
      change: number
    }
    country: {
      rank: number
      change: number
    }
    category: {
      rank: number
      change: number
    }
  }
  creativeCount: number
  top5Countries: Array<{
    countryId: number
    count: number
    percentage: number
  }>
}

interface UseCompanyDetailsResult {
  loading: boolean
  error: string | null
  companyDetails: CompanyDetails | null
  fetchCompanyDetails: (companyId: string) => Promise<void>
}

export function useCompanyDetails(): UseCompanyDetailsResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null)

  const fetchCompanyDetails = useCallback(async (companyId: string) => {
    if (!companyId) {
      setError('Company ID is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get access token from Supabase session
      let accessToken: string | undefined = undefined
      try {
        const { data: { session } } = await supabase.auth.getSession()
        accessToken = session?.access_token
      } catch {}

      const response = await fetch(`/api/companies/${companyId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch company details')
      }

      if (result.success && result.data) {
        setCompanyDetails(result.data.data)
      } else {
        throw new Error(result.error || 'Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching company details:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setCompanyDetails(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    companyDetails,
    fetchCompanyDetails
  }
}
