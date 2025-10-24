import { useState, useEffect, useCallback } from 'react'

interface CountryData {
  countryId: number
  alpha2Code: string
  name: string
  googleId: number
}

interface UseCountryResult {
  country: CountryData | null
  loading: boolean
  error: string | null
  fetchCountry: (countryId: number) => Promise<void>
}

// Cache for country data to avoid repeated API calls
const countryCache = new Map<number, CountryData>()

export function useCountry(): UseCountryResult {
  const [country, setCountry] = useState<CountryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCountry = useCallback(async (countryId: number) => {
    // Check cache first
    if (countryCache.has(countryId)) {
      setCountry(countryCache.get(countryId)!)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/countries/${countryId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        const countryData = result.data as CountryData
        // Cache the result
        countryCache.set(countryId, countryData)
        setCountry(countryData)
      } else {
        throw new Error(result.error || 'Failed to fetch country data')
      }
    } catch (err) {
      console.error('Error fetching country:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setCountry(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    country,
    loading,
    error,
    fetchCountry
  }
}

// Hook to get multiple countries at once
export function useCountries() {
  const [countries, setCountries] = useState<Map<number, CountryData>>(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCountries = useCallback(async (countryIds: number[]) => {
    setLoading(true)
    setError(null)

    try {
      const results = new Map<number, CountryData>()
      
      // Process in parallel
      await Promise.all(
        countryIds.map(async (countryId) => {
          // Handle special case: countryId = 0 means "Worldwide"
          if (countryId === 0) {
            const worldwideData = { countryId: 0, alpha2Code: 'WW', name: 'Worldwide', googleId: 0 }
            results.set(0, worldwideData)
            return
          }

          // Check cache first
          if (countryCache.has(countryId)) {
            results.set(countryId, countryCache.get(countryId)!)
            return
          }

          try {
            const response = await fetch(`/api/countries/${countryId}`)
            if (response.ok) {
              const result = await response.json()
              if (result.success && result.data) {
                const countryData = result.data as CountryData
                countryCache.set(countryId, countryData)
                results.set(countryId, countryData)
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch country ${countryId}:`, err)
          }
        })
      )

      setCountries(results)
    } catch (err) {
      console.error('Error fetching countries:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const getCountryName = useCallback((countryId: number): string => {
    // Handle special case: countryId = 0 means "Worldwide"
    if (countryId === 0) {
      return 'Worldwide 🌍'
    }
    
    const country = countries.get(countryId)
    return country ? `${country.name} ${getFlagEmoji(country.alpha2Code)}` : `Country ${countryId} 🌍`
  }, [countries])

  return {
    countries,
    loading,
    error,
    fetchCountries,
    getCountryName
  }
}

// Helper function to get flag emoji from country code
function getFlagEmoji(countryCode: string): string {
  const flagMap: Record<string, string> = {
    'US': '🇺🇸',
    'GB': '🇬🇧',
    'DE': '🇩🇪',
    'CA': '🇨🇦',
    'FR': '🇫🇷',
    'IT': '🇮🇹',
    'JP': '🇯🇵',
    'AU': '🇦🇺',
    'ES': '🇪🇸',
    'NL': '🇳🇱',
    'SE': '🇸🇪',
    'DK': '🇩🇰',
    'NO': '🇳🇴',
    'FI': '🇫🇮',
    'CH': '🇨🇭',
    'AT': '🇦🇹',
    'BE': '🇧🇪',
    'IE': '🇮🇪',
    'PT': '🇵🇹',
    'CY': '🇨🇾',
  }
  
  return flagMap[countryCode] || '🌍'
}