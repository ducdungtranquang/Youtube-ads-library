import { useState, useMemo } from 'react'

interface UseFrontendPaginationOptions {
  itemsPerPage?: number
}

interface UseFrontendPaginationReturn<T> {
  currentItems: T[]
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  totalItems: number
}

export function useFrontendPagination<T>(
  items: T[] = [],
  options: UseFrontendPaginationOptions = {}
): UseFrontendPaginationReturn<T> {
  const { itemsPerPage = 20 } = options
  const [currentPage, setCurrentPage] = useState(1)

  const paginationData = useMemo(() => {
    const totalItems = items.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const currentItems = items.slice(startIndex, endIndex)

    return {
      currentItems,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    }
  }, [items, currentPage, itemsPerPage])

  const nextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (paginationData.hasPrevPage) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page)
    }
  }

  // Reset to page 1 when items change
  useMemo(() => {
    setCurrentPage(1)
  }, [items.length])

  return {
    currentItems: paginationData.currentItems,
    currentPage,
    totalPages: paginationData.totalPages,
    hasNextPage: paginationData.hasNextPage,
    hasPrevPage: paginationData.hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    totalItems: paginationData.totalItems
  }
}