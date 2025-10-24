import { useState, useEffect, useCallback } from 'react'

interface CategoryData {
  categoryId: number
  name: string
}

interface UseCategoryResult {
  category: CategoryData | null
  loading: boolean
  error: string | null
  fetchCategory: (categoryId: number) => Promise<void>
}

// Cache for category data to avoid repeated API calls
const categoryCache = new Map<number, CategoryData>()
// Cache for non-existent categories to avoid repeated 404 calls
const nonExistentCategories = new Set<number>()

export function useCategory(): UseCategoryResult {
  const [category, setCategory] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategory = useCallback(async (categoryId: number) => {
    // Treat 0 as "All Categories" and avoid network call
    if (categoryId === 0) {
      const allCat = { categoryId: 0, name: 'All Categories' }
      categoryCache.set(0, allCat)
      setCategory(allCat)
      setLoading(false)
      setError(null)
      return
    }

    // Check if we already know this category doesn't exist
    if (nonExistentCategories.has(categoryId)) {
      setCategory(null)
      setError(null)
      setLoading(false)
      return
    }

    // Check cache first
    if (categoryCache.has(categoryId)) {
      setCategory(categoryCache.get(categoryId)!)
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/categories/${categoryId}`)

      if (!response.ok) {
        // If category not found, don't throw — treat as missing and let caller fallback
        if (response.status === 404) {
          // Cache this as non-existent to avoid future API calls
          nonExistentCategories.add(categoryId)
          setCategory(null)
          setError(null)
          setLoading(false)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        const categoryData = result.data as CategoryData
        // Cache the result
        categoryCache.set(categoryId, categoryData)
        setCategory(categoryData)
      } else {
        // If API returned no data, set null but don't throw to avoid noisy errors
        setCategory(null)
        setError(result?.error || null)
      }
    } catch (err) {
      // Completely suppress 404 errors in console
      if (err instanceof Error && err.message.includes('404')) {
        setCategory(null)
        setError(null)
        setLoading(false)
        return
      }
      
      // Only log actual network/server errors
      console.error('Error fetching category:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setCategory(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    category,
    loading,
    error,
    fetchCategory
  }
}

// Hook to get multiple categories at once
export function useCategories() {
  const [categories, setCategories] = useState<Map<number, CategoryData>>(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async (categoryIds: number[]) => {
    setLoading(true)
    setError(null)

    try {
      const results = new Map<number, CategoryData>()
      
      // Process in parallel
      await Promise.all(
        categoryIds.map(async (categoryId) => {
          // Treat 0 as "All Categories" and avoid network call
          if (categoryId === 0) {
            const allCat = { categoryId: 0, name: 'All Categories' }
            categoryCache.set(0, allCat)
            results.set(0, allCat)
            return
          }

          // Check if we already know this category doesn't exist
          if (nonExistentCategories.has(categoryId)) {
            return
          }

          // Check cache first
          if (categoryCache.has(categoryId)) {
            results.set(categoryId, categoryCache.get(categoryId)!)
            return
          }

          try {
            const response = await fetch(`/api/categories/${categoryId}`)
            if (response.ok) {
              const result = await response.json()
              if (result.success && result.data) {
                const categoryData = result.data as CategoryData
                categoryCache.set(categoryId, categoryData)
                results.set(categoryId, categoryData)
              }
            } else if (response.status === 404) {
              // Cache this as non-existent to avoid future API calls
              nonExistentCategories.add(categoryId)
            }
            // Silently ignore all errors for missing categories
          } catch (err) {
            // Completely suppress any errors for categories - they're optional
            // Categories might not exist and that's perfectly fine
          }
        })
      )

      setCategories(results)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const getCategoryName = useCallback((categoryId: number): string => {
    const category = categories.get(categoryId)
    return category ? category.name : `Category ${categoryId}`
  }, [categories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryName
  }
}

// Helper function to get category name directly (sync)
export function getCategoryNameSync(categoryId: number): string {
  const cached = categoryCache.get(categoryId)
  return cached ? cached.name : `Category ${categoryId}`
}