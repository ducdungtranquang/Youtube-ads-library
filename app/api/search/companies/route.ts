export const runtime = "nodejs"
export const maxDuration = 300
import { NextRequest, NextResponse } from 'next/server'
import { supabaseCacheManager } from '@/lib/supabase-cache'
import { vidTaoManager } from '@/lib/vidtao/manager'
import { supabase } from '@/lib/supabase'

interface CompaniesSearchParams {
  type: 'companies'
  searchTerm: string
  page?: number
  limit?: number
  filters?: {
    countryId?: number
    categoryIds?: number[]
    language?: string
    dateFrom?: string
    dateTo?: string
    sortProp?: 'date' | 'totalSpend' | 'views' | 'relevance'
    orderAsc?: boolean
  }
}

async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { user: null, error: true };
  }
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { user: null, error: true };
  }
  return { user, error: false };
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body: CompaniesSearchParams = await request.json()
    const { searchTerm, page = 1, limit = 50, filters = {} } = body

    if (!searchTerm || searchTerm.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search term is required' },
        { status: 400 }
      )
    }

    console.log(`[Companies API] Search request:`, {
      searchTerm,
      page,
      limit,
      filters
    })

    // Create search payload for cache
    const searchPayload = {
      type: 'companies',
      searchTerm,
      page,
      limit,
      filters
    }

    // Check cache first
    const cachedResult = await supabaseCacheManager.getCachedResult('mkt', searchPayload)
    if (cachedResult) {
      console.log(`[Companies API] Cache hit for search:`, searchTerm)
      return NextResponse.json({
        ...cachedResult,
        cached: true
      })
    }

    // Cache miss - check if there's a pending entry
    const existingEntry = await supabaseCacheManager.getCacheEntry('mkt', searchPayload)
    if (existingEntry && existingEntry.status === 'pending') {
      console.log(`[Companies API] Found pending search:`, searchTerm)
      return NextResponse.json({
        status: 'pending',
        cacheId: existingEntry.id,
        message: 'Companies search in progress...'
      })
    }

    // Create new pending cache entry
    const pendingEntry = await supabaseCacheManager.createPendingEntry('mkt', searchPayload, 60) // 1 hour TTL
    if (!pendingEntry) {
      return NextResponse.json(
        { success: false, error: 'Failed to create cache entry' },
        { status: 500 }
      )
    }

    console.log(`[Companies API] Created pending search entry:`, pendingEntry.id)

    // Start background search process
    setImmediate(async () => {
      try {
        console.log(`[Companies API] Starting background search for:`, searchTerm)

        // Prepare VidTao search parameters
        const vidTaoParams = {
          searchTerm,
          page,
          limit,
          countryId: filters.countryId,
          categoryIds: filters.categoryIds,
          language: filters.language,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          sortProp: filters.sortProp || 'date',
          orderAsc: filters.orderAsc || false
        }

        const result = await vidTaoManager.searchCompanies(vidTaoParams)

        if (result.success && result.data) {
          console.log(`[Companies API] Background search completed:`, {
            searchTerm,
            resultsCount: result.data?.data?.results?.length || 0,
            account: result.account
          })

          // Transform response for frontend
          const transformedResponse = {
            success: true,
            data: result.data?.data || {},
            total_available: result.data?.total_available || 0,
            total_results: result.data?.total_results || 0,
            account: result.account,
            search_type: 'companies',
            cached: false
          }

          // Update cache with results
          await supabaseCacheManager.updateCacheEntry(
            pendingEntry.id,
            'completed',
            transformedResponse
          )
        } else {
          console.error(`[Companies API] Background search failed:`, result.error)
          
          // Update cache with error
          await supabaseCacheManager.updateCacheEntry(
            pendingEntry.id,
            'error',
            null,
            result.error || 'Companies search failed'
          )
        }
      } catch (error) {
        console.error(`[Companies API] Background search error:`, error)
        
        // Update cache with error
        await supabaseCacheManager.updateCacheEntry(
          pendingEntry.id,
          'error',
          null,
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    })

    // Return pending response immediately
    return NextResponse.json({
      status: 'pending',
      cacheId: pendingEntry.id,
      message: 'Companies search started...'
    })

  } catch (error) {
    console.error('[Companies API] Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    )
  }
}