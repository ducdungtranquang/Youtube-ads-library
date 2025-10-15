import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Use service role key for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Types for search cache
export type SearchCacheStatus = 'pending' | 'completed' | 'error'

export type SearchCacheEntry = {
  id: string
  cache_key: string
  payload_hash: string
  search_type: 'mkt' | 'quicksearch' | 'brands' | 'companies'
  status: SearchCacheStatus
  result_data: any
  error_message?: string
  created_at: string
  updated_at: string
  expires_at: string
}

export type SearchPayload = {
  searchTerm?: string
  query?: string
  page?: number
  limit?: number
  filters?: any
  [key: string]: any
}

export class SupabaseCacheManager {
  private tableName = 'search_cache'
  
  /**
   * Create a consistent cache key from payload
   */
  private createCacheKey(searchType: SearchCacheEntry['search_type'], payload: SearchPayload): string {
    // Sort payload keys for consistency
    const sortedPayload = Object.keys(payload)
      .sort()
      .reduce((result, key) => {
        // Only include non-null, non-undefined values
        if (payload[key] !== null && payload[key] !== undefined) {
          result[key] = payload[key]
        }
        return result
      }, {} as SearchPayload)

    return `${searchType}:${JSON.stringify(sortedPayload)}`
  }

  /**
   * Create payload hash for efficient lookup
   */
  private createPayloadHash(cacheKey: string): string {
    return crypto.createHash('sha256').update(cacheKey).digest('hex')
  }

  /**
   * Get cache entry by payload
   */
  async getCacheEntry(
    searchType: SearchCacheEntry['search_type'], 
    payload: SearchPayload
  ): Promise<SearchCacheEntry | null> {
    try {
      const cacheKey = this.createCacheKey(searchType, payload)
      const payloadHash = this.createPayloadHash(cacheKey)

      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select('*')
        .eq('payload_hash', payloadHash)
        .eq('search_type', searchType)
        .gt('expires_at', new Date().toISOString()) // Only get non-expired entries
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching cache entry:', error)
        return null
      }

      return data || null
    } catch (error) {
      console.error('Error in getCacheEntry:', error)
      return null
    }
  }

  /**
   * Create a new pending cache entry
   */
  async createPendingEntry(
    searchType: SearchCacheEntry['search_type'],
    payload: SearchPayload,
    ttlMinutes: number = 60 // Default 1 hour TTL
  ): Promise<SearchCacheEntry | null> {
    try {
      const cacheKey = this.createCacheKey(searchType, payload)
      const payloadHash = this.createPayloadHash(cacheKey)
      const now = new Date()
      const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000)

      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .insert({
          cache_key: cacheKey,
          payload_hash: payloadHash,
          search_type: searchType,
          status: 'pending' as SearchCacheStatus,
          result_data: null,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating pending entry:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in createPendingEntry:', error)
      return null
    }
  }

  /**
   * Update cache entry with results
   */
  async updateCacheEntry(
    id: string,
    status: SearchCacheStatus,
    resultData?: any,
    errorMessage?: string
  ): Promise<SearchCacheEntry | null> {
    try {
      const updateData: Partial<SearchCacheEntry> = {
        status,
        updated_at: new Date().toISOString()
      }

      if (status === 'completed' && resultData) {
        updateData.result_data = resultData
      }

      if (status === 'error' && errorMessage) {
        updateData.error_message = errorMessage
      }

      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating cache entry:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in updateCacheEntry:', error)
      return null
    }
  }

  /**
   * Check if cache entry exists and is valid
   */
  async hasCacheEntry(
    searchType: SearchCacheEntry['search_type'],
    payload: SearchPayload
  ): Promise<boolean> {
    const entry = await this.getCacheEntry(searchType, payload)
    return entry !== null
  }

  /**
   * Get cached result data if available and completed
   */
  async getCachedResult(
    searchType: SearchCacheEntry['search_type'],
    payload: SearchPayload
  ): Promise<any | null> {
    const entry = await this.getCacheEntry(searchType, payload)
    
    if (!entry || entry.status !== 'completed') {
      return null
    }

    return entry.result_data
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredEntries(): Promise<number> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('id')

      if (error) {
        console.error('Error cleaning up expired entries:', error)
        return 0
      }

      const deletedCount = data?.length || 0
      console.log(`[Cache Cleanup] Removed ${deletedCount} expired entries`)
      
      return deletedCount
    } catch (error) {
      console.error('Error in cleanupExpiredEntries:', error)
      return 0
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalEntries: number
    pendingEntries: number
    completedEntries: number
    errorEntries: number
    expiredEntries: number
  }> {
    try {
      const now = new Date().toISOString()

      const [totalResult, pendingResult, completedResult, errorResult, expiredResult] = await Promise.all([
        supabaseAdmin.from(this.tableName).select('id', { count: 'exact', head: true }),
        supabaseAdmin.from(this.tableName).select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabaseAdmin.from(this.tableName).select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        supabaseAdmin.from(this.tableName).select('id', { count: 'exact', head: true }).eq('status', 'error'),
        supabaseAdmin.from(this.tableName).select('id', { count: 'exact', head: true }).lt('expires_at', now)
      ])

      return {
        totalEntries: totalResult.count || 0,
        pendingEntries: pendingResult.count || 0,
        completedEntries: completedResult.count || 0,
        errorEntries: errorResult.count || 0,
        expiredEntries: expiredResult.count || 0
      }
    } catch (error) {
      console.error('Error getting cache stats:', error)
      return {
        totalEntries: 0,
        pendingEntries: 0,
        completedEntries: 0,
        errorEntries: 0,
        expiredEntries: 0
      }
    }
  }

  /**
   * Clear all cache entries for a specific search type
   */
  async clearCacheByType(searchType: SearchCacheEntry['search_type']): Promise<number> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .delete()
        .eq('search_type', searchType)
        .select('id')

      if (error) {
        console.error('Error clearing cache by type:', error)
        return 0
      }

      const deletedCount = data?.length || 0
      console.log(`[Cache Clear] Removed ${deletedCount} ${searchType} entries`)
      
      return deletedCount
    } catch (error) {
      console.error('Error in clearCacheByType:', error)
      return 0
    }
  }
}

// Singleton instance
export const supabaseCacheManager = new SupabaseCacheManager()

// Helper function to create the cache table (for migration)
export const createCacheTable = async () => {
  const { error } = await supabaseAdmin.rpc('create_search_cache_table')
  if (error) {
    console.error('Error creating cache table:', error)
  }
}