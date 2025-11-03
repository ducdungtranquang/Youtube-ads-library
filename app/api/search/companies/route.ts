export const runtime = "nodejs"
export const maxDuration = 300

import { NextRequest, NextResponse } from 'next/server'
import { supabaseCacheManager, SearchPayload } from '@/lib/supabase-cache'
import { vidTaoManager } from '@/lib/vidtao/manager'
import { supabase } from '@/lib/supabase'

// Hàm thêm CORS headers
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return response
}

// OPTIONS handler cho preflight request
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 })
  return withCORS(res)
}

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
    return withCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
  }

  try {
    const body: CompaniesSearchParams = await request.json()
    const { searchTerm, page = 1, limit = 50, filters = {} } = body

    // if (!searchTerm || searchTerm.trim().length === 0) {
    //   return withCORS(NextResponse.json(
    //     { success: false, error: 'Search term is required' },
    //     { status: 400 }
    //   ))
    // }

    console.log(`[Companies API] Search request:`, {
      searchTerm,
      page,
      limit,
      filters
    })

    // Create search payload for cache
    const searchPayload: SearchPayload = {
      type: 'companies',
      searchTerm,
      page,
      limit,
      filters
    }

    // Check cache first
    const cacheEntry = await supabaseCacheManager.getCacheEntry('companies', searchPayload)
    
    if (cacheEntry) {
      console.log(`[Companies API] Cache entry found:`, { 
        status: cacheEntry.status, 
        created_at: cacheEntry.created_at 
      })

      if (cacheEntry.status === 'completed') {
        // Return cached result immediately
        console.log(`[Companies API] Returning cached result`)
        return withCORS(NextResponse.json(cacheEntry.result_data))
      } else if (cacheEntry.status === 'pending') {
        // Return pending status for client polling
        console.log(`[Companies API] Request is pending, returning polling response`)
        return withCORS(NextResponse.json({
          status: 'pending',
          message: 'Companies search is being processed. Please poll again.',
          cacheId: cacheEntry.id,
          createdAt: cacheEntry.created_at
        }))
      } else if (cacheEntry.status === 'error') {
        // Return error from cache
        console.log(`[Companies API] Cached error found`)
        return withCORS(NextResponse.json(
          { 
            error: 'Search failed',
            details: cacheEntry.error_message || 'Cached error'
          },
          { status: 500 }
        ))
      }
    }

    console.log(`[Companies API] No valid cache found, creating pending entry`)

    // Create pending cache entry
    const pendingEntry = await supabaseCacheManager.createPendingEntry(
      'companies', 
      searchPayload, 
      120 // 2 hour TTL
    )

    if (!pendingEntry) {
      console.error(`[Companies API] Failed to create pending cache entry`)
      return withCORS(NextResponse.json(
        { error: 'Failed to initialize search request' },
        { status: 500 }
      ))
    }

    console.log(`[Companies API] Created pending entry:`, pendingEntry.id)

    // Start background VidTao search (don't await)
    const searchParams = {
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

    // Background VidTao search with AbortController
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minute timeout

    // Don't await this - run in background
    performBackgroundSearch(pendingEntry.id, searchParams, controller.signal)
      .finally(() => clearTimeout(timeoutId))

    // Return pending response immediately
    return withCORS(NextResponse.json({
      status: 'pending',
      message: 'Companies search initiated. Please poll for results.',
      cacheId: pendingEntry.id,
      createdAt: pendingEntry.created_at
    }))

  } catch (error) {
    console.error('[Companies API] Error:', error)
    
    return withCORS(NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    ))
  }
}

// Background search function
async function performBackgroundSearch(
  cacheId: string, 
  searchParams: any, 
  signal: AbortSignal
) {
  try {
    console.log('Background companies search started for cache ID:', cacheId)

    if (signal.aborted) {
      throw new Error('Request aborted before starting')
    }

    const result = await vidTaoManager.searchCompanies(searchParams)

    if (signal.aborted) {
      console.log('Background companies search aborted for cache ID:', cacheId)
      return
    }

    if (!result.success) {
      console.error('Background VidTao companies search error:', result.error)
      await supabaseCacheManager.updateCacheEntry(
        cacheId,
        'error',
        null,
        result.error || 'Companies search failed'
      )
      return
    }

    const data = result.data
    console.log('Background companies search completed for cache ID:', cacheId, {
      success: result.success,
      account: result.account,
      results_count: data?.data?.results?.length || 0
    })

    // Transform response for frontend
    const transformedResponse = {
      success: true,
      data: data?.data || {},
      total_available: data?.total_available || 0,
      total_results: data?.total_results || 0,
      account: result.account,
      search_type: 'companies',
      cached: false
    }

    // Update cache with completed result
    await supabaseCacheManager.updateCacheEntry(
      cacheId,
      'completed',
      transformedResponse
    )

    console.log('Background companies search result cached for ID:', cacheId)

  } catch (error) {
    console.error('Background companies search error for cache ID:', cacheId, error)
    
    if (!signal.aborted) {
      await supabaseCacheManager.updateCacheEntry(
        cacheId,
        'error',
        null,
        error instanceof Error ? error.message : 'Background companies search failed'
      )
    }
  }
}

export async function GET(request: NextRequest) {
  const res = NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  )
  return withCORS(res)
}