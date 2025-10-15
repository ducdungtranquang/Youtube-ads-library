import { useState, useEffect, useCallback, useMemo } from 'react'

interface UseAsyncSelectOptions {
  searchDelay?: number
  pageSize?: number
  minSearchLength?: number
}

interface AsyncSelectData {
  code?: string
  id?: string
  name: string
  [key: string]: any
}

interface UseAsyncSelectResult {
  data: AsyncSelectData[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  search: (term: string) => void
  searchTerm: string
}

export function useAsyncSelect(
  type: 'countries' | 'languages',
  options: UseAsyncSelectOptions = {}
): UseAsyncSelectResult {
  const {
    searchDelay = 300,
    pageSize = 50,
    minSearchLength = 0
  } = options

  const [data, setData] = useState<AsyncSelectData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [offset, setOffset] = useState(0)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.length >= minSearchLength) {
        fetchData(term, 0, true)
      } else if (term.length === 0) {
        fetchData('', 0, true)
      }
    }, searchDelay),
    [minSearchLength, searchDelay]
  )

  const fetchData = useCallback(async (
    search: string = '',
    currentOffset: number = 0,
    reset: boolean = false
  ) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        type,
        limit: pageSize.toString(),
        offset: currentOffset.toString()
      })

      if (search.trim()) {
        params.set('search', search.trim())
      }

      const response = await fetch(`/api/countries?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        if (reset) {
          setData(result.data)
          setOffset(pageSize)
        } else {
          setData(prev => [...prev, ...result.data])
          setOffset(prev => prev + pageSize)
        }
        setHasMore(result.pagination.hasMore)
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [type, pageSize])

  // Initial load
  useEffect(() => {
    fetchData('', 0, true)
  }, [fetchData])

  const search = useCallback((term: string) => {
    setSearchTerm(term)
    debouncedSearch(term)
  }, [debouncedSearch])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(searchTerm, offset, false)
    }
  }, [loading, hasMore, searchTerm, offset, fetchData])

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    search,
    searchTerm
  }
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}