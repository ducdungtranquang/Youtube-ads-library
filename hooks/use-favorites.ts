import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { 
  FavoriteType, 
  FavoritesResponse, 
  FavoriteCountsByType,
  VideoFavoriteData,
  OfferFavoriteData,
  AffiliateFavoriteData,
  BrandFavoriteData,
  CompanyFavoriteData,
  FavoriteItem,
  validateFavoriteData
} from '@/lib/favorites'

// --- Module-level batch/cache for favorite checks ---
// Map key -> boolean cached value
const favoritesCache: Record<string, boolean> = {}

// Event system for notifying favorite status changes
type FavoriteChangeListener = (itemType: FavoriteType, itemId: string, isFavorited: boolean) => void
const favoriteChangeListeners = new Set<FavoriteChangeListener>()

// Single-user id used for batch queries (kept in sync from hook)
let batchUserId: string | null = null
export function setBatchUserId(id: string | null) {
  batchUserId = id
  // clear cache when user changes
  for (const k of Object.keys(favoritesCache)) delete favoritesCache[k]
}

// In-flight batch promise keyed by batchKey (sorted comma-separated keys)
const inFlightBatches: Record<string, Promise<Record<string, boolean>>> = {}

function makeKey(type: FavoriteType, id: string) {
  return `${type}:${id}`
}

// Helper functions to manage favorite change listeners
function addFavoriteChangeListener(listener: FavoriteChangeListener) {
  favoriteChangeListeners.add(listener)
}

function removeFavoriteChangeListener(listener: FavoriteChangeListener) {
  favoriteChangeListeners.delete(listener)
}

function notifyFavoriteChange(itemType: FavoriteType, itemId: string, isFavorited: boolean) {
  favoriteChangeListeners.forEach(listener => {
    try {
      listener(itemType, itemId, isFavorited)
    } catch (error) {
      console.error('Error in favorite change listener:', error)
    }
  })
}

/**
 * Batch check function: accepts multiple items, returns a map key->boolean.
 * It will dedupe simultaneous calls that request the same batch.
 */
async function batchCheckFavorites(items: Array<{ type: FavoriteType; id: string }>) {
  const keys = items.map(i => makeKey(i.type, i.id))
  const batchKey = keys.slice().sort().join(',')

  // If already cached, return directly
  const uncached = items.filter(i => favoritesCache[makeKey(i.type, i.id)] === undefined)
  if (uncached.length === 0) {
    const res: Record<string, boolean> = {}
    keys.forEach(k => res[k] = !!favoritesCache[k])
    return res
  }

  // If there's an in-flight identical batch, return it
  if (batchKey in inFlightBatches) return inFlightBatches[batchKey]

  // Create new in-flight promise
  const p = (async () => {
    try {
      if (!batchUserId) {
        // No user -> none favorited
        const emptyRes: Record<string, boolean> = {}
        keys.forEach(k => emptyRes[k] = false)
        return emptyRes
      }

      // Group ids by type
      const grouped = items.reduce((acc: Record<string, string[]>, it) => {
        acc[it.type] = acc[it.type] || []
        acc[it.type].push(it.id)
        return acc
      }, {})

      // Run parallel queries by type
      const promises = Object.entries(grouped).map(async ([type, ids]) => {
        const { data, error } = await supabase
          .from('favorites')
          .select('item_id')
          .eq('user_id', batchUserId)
          .eq('item_type', type)
          .in('item_id', ids)

        if (error) return []
        return data?.map((r: any) => `${type}:${r.item_id}`) || []
      })

      const found = (await Promise.all(promises)).flat()
      // Update cache
      keys.forEach(k => favoritesCache[k] = found.includes(k))

      const res: Record<string, boolean> = {}
      keys.forEach(k => res[k] = !!favoritesCache[k])
      return res
    } finally {
      delete inFlightBatches[batchKey]
    }
  })()

  inFlightBatches[batchKey] = p
  return p
}

// --- micro-batcher: schedule multiple single-item checks in one tick ---
let pendingQueue: Array<{ type: FavoriteType; id: string }> = []
const pendingResolvers: Record<string, Array<(v: boolean) => void>> = {}
let flushScheduled = false

export function scheduleFavoriteCheck(item: { type: FavoriteType; id: string }) {
  return new Promise<boolean>((resolve) => {
    const key = makeKey(item.type, item.id)

    // immediate return if cached
    if (favoritesCache[key] !== undefined) return resolve(favoritesCache[key])

    if (!pendingResolvers[key]) pendingResolvers[key] = []
    pendingResolvers[key].push(resolve)
    pendingQueue.push(item)

    if (!flushScheduled) {
      flushScheduled = true
      setTimeout(async () => {
        const toProcess = pendingQueue.splice(0)
        flushScheduled = false
        try {
          const res = await batchCheckFavorites(toProcess)
          Object.entries(res).forEach(([k, v]) => {
            const arr = pendingResolvers[k] || []
            arr.forEach(r => r(v))
            delete pendingResolvers[k]
          })
        } catch (err) {
          // on error resolve false
          Object.keys(pendingResolvers).forEach(k => {
            const arr = pendingResolvers[k] || []
            arr.forEach(r => r(false))
            delete pendingResolvers[k]
          })
        }
      }, 0)
    }
  })
}

// Hook for managing favorites with direct Supabase calls
export function useFavorites() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Keep batch user id in sync
  useEffect(() => {
    setBatchUserId(user?.id ?? null)
  }, [user])

  // NOTE: we no longer call supabase.auth.getUser repeatedly. `useAuth` provides
  // the current user and we wire that into the module-level batcher via effect above.

  // Get favorites list
  const getFavorites = useCallback(async (
    type?: FavoriteType,
    page: number = 1,
    limit: number = 20
  ): Promise<FavoritesResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('Bạn cần đăng nhập để sử dụng tính năng này')
      
      let query = supabase
        .from('favorites')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (type) {
        query = query.eq('item_type', type)
      }

      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)

  const { data, error: queryError, count } = await query

      if (queryError) {
        throw new Error(queryError.message)
      }

      const total = count || 0
      const hasMore = total > page * limit

      return {
        favorites: data || [],
        total,
        page,
        limit,
        hasMore
      }
    } catch (err: any) {
      setError(err.message)
      toast.error(`Không thể tải danh sách yêu thích: ${err.message}`)
      return null
    } finally {
      setLoading(false)
    }
  }, [user])



  // Get favorites counts
  const getFavoritesCounts = useCallback(async (): Promise<FavoriteCountsByType | null> => {
    try {
      if (!user) throw new Error('Bạn cần đăng nhập để sử dụng tính năng này')

      const { data, error } = await supabase
        .from('favorites')
        .select('item_type')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error getting favorites count:', error)
        return {
          video: 0,
          offer: 0,
          affiliate: 0,
          brand: 0,
          company: 0,
          facebook_ad: 0
        }
      }

      const counts: FavoriteCountsByType = {
        video: 0,
        offer: 0,
        affiliate: 0,
        brand: 0,
        company: 0,
        facebook_ad: 0
      }

      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          if (item.item_type) {
            const type = item.item_type as FavoriteType
            if (type in counts) {
              counts[type] = (counts[type] || 0) + 1
            }
          }
        })
      }

      return counts
    } catch (err: any) {
      console.error('Error fetching favorites counts:', err)
      return null
    }
  }, [user])

  // Add favorite
  const addFavorite = useCallback(async (
    itemType: FavoriteType,
    itemId: string,
    itemData: VideoFavoriteData | OfferFavoriteData | AffiliateFavoriteData | BrandFavoriteData | CompanyFavoriteData
  ): Promise<FavoriteItem | null> => {
    try {
      if (!user) throw new Error('Bạn cần đăng nhập để sử dụng tính năng này')
      
      // Validate data
      if (!validateFavoriteData(itemType, itemData)) {
        throw new Error('Dữ liệu yêu thích không hợp lệ')
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
          item_data: itemData
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error('Item đã có trong danh sách yêu thích')
        }
        throw new Error(error.message)
      }

      // Update cache
      const key = makeKey(itemType, itemId)
      favoritesCache[key] = true

      return data
    } catch (err: any) {
      throw new Error(err.message)
    }
  }, [user])

  // Remove favorite
  const removeFavorite = useCallback(async (
    itemType: FavoriteType,
    itemId: string
  ): Promise<void> => {
    try {
      if (!user) throw new Error('Bạn cần đăng nhập để sử dụng tính năng này')

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId)

      if (error) {
        throw new Error(error.message)
      }
      // Update cache
      const key = makeKey(itemType, itemId)
      favoritesCache[key] = false
    } catch (err: any) {
      throw new Error(err.message)
    }
  }, [user])

  // Toggle favorite status
  const toggleFavorite = useCallback(async (
    itemType: FavoriteType,
    itemId: string,
    itemData: VideoFavoriteData | OfferFavoriteData | AffiliateFavoriteData | BrandFavoriteData | CompanyFavoriteData
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const isCurrentlyFavorited = await checkIsFavorited(itemType, itemId)

      if (isCurrentlyFavorited) {
        await removeFavorite(itemType, itemId)
        notifyFavoriteChange(itemType, itemId, false)
        toast.success('Đã xóa khỏi danh sách yêu thích')
        return false
      } else {
        await addFavorite(itemType, itemId, itemData)
        notifyFavoriteChange(itemType, itemId, true)
        toast.success('Đã thêm vào danh sách yêu thích')
        return true
      }
    } catch (err: any) {
      setError(err.message)
      toast.error(`Lỗi: ${err.message}`)
      return false
    } finally {
      setLoading(false)
    }
  }, [addFavorite, removeFavorite])

  // Check if item is favorited
  const checkIsFavorited = useCallback(async (
    itemType: FavoriteType,
    itemId: string
  ): Promise<boolean> => {
    try {
      const key = makeKey(itemType, itemId)
      // Return cached value if available
      if (favoritesCache[key] !== undefined) return favoritesCache[key]

      // Use batcher to check and cache
      const res = await batchCheckFavorites([{ type: itemType, id: itemId }])
      return !!res[key]
    } catch (err) {
      console.error('Error checking favorite status:', err)
      return false
    }
  }, [])

  // Clear favorites by type
  const clearFavoritesByType = useCallback(async (type: FavoriteType): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('Bạn cần đăng nhập để sử dụng tính năng này')

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', type)

      if (error) {
        throw new Error(error.message)
      }

      // Invalidate cache entries of this type
      Object.keys(favoritesCache).forEach(k => {
        if (k.startsWith(`${type}:`)) favoritesCache[k] = false
      })

      toast.success(`Đã xóa tất cả ${type} yêu thích`)
      return true
    } catch (err: any) {
      setError(err.message)
      toast.error(`Lỗi: ${err.message}`)
      return false
    } finally {
      setLoading(false)
    }
  }, [user])

  // Clear all favorites
  const clearAllFavorites = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      if (!user) throw new Error('Bạn cần đăng nhập để sử dụng tính năng này')

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        throw new Error(error.message)
      }

      // Clear cache
      Object.keys(favoritesCache).forEach(k => delete favoritesCache[k])

      toast.success('Đã xóa tất cả yêu thích')
      return true
    } catch (err: any) {
      setError(err.message)
      toast.error(`Lỗi: ${err.message}`)
      return false
    } finally {
      setLoading(false)
    }
  }, [user])

  // Force refresh favorite status for specific item
  const refreshFavoriteStatus = useCallback(async (
    itemType: FavoriteType,
    itemId: string
  ): Promise<boolean> => {
    try {
      const key = makeKey(itemType, itemId)
      // Clear cached value
      delete favoritesCache[key]
      
      // Fetch fresh value
      const response = await fetch(`/api/favorites/check/${itemType}/${itemId}`)
      if (!response.ok) return false
      
      const result = await response.json()
      const isFavorited = result.success ? result.data.isFavorited : false
      
      // Update cache
      favoritesCache[key] = isFavorited
      
      return isFavorited
    } catch (err) {
      console.error('Error refreshing favorite status:', err)
      return false
    }
  }, [])

  return {
    loading,
    error,
    getFavorites,
    getFavoritesCounts,
    toggleFavorite,
    checkIsFavorited,
    refreshFavoriteStatus,
    clearFavoritesByType,
    clearAllFavorites
  }
}

// Export helper functions for event system
export { addFavoriteChangeListener, removeFavoriteChangeListener }