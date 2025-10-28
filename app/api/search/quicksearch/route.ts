import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'
import { supabaseCacheManager, SearchPayload } from '@/lib/supabase-cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract search parameters from request
    const {
      query,
      page = 1,
      limit = 500, // Set to 1000 for better FE pagination
      ...otherParams
    } = body

    // Validate required parameters
    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Create search payload for caching
    const searchPayload: SearchPayload = {
      query: query.trim(),
      page,
      limit,
      ...otherParams
    }

    console.log('QuickSearch API: Checking cache for payload:', searchPayload)

    // Check cache first
    const cacheEntry = await supabaseCacheManager.getCacheEntry('quicksearch', searchPayload)
    
    if (cacheEntry) {
      console.log('QuickSearch API: Cache entry found:', { 
        status: cacheEntry.status, 
        created_at: cacheEntry.created_at 
      })

      if (cacheEntry.status === 'completed') {
        // Return cached result immediately
        console.log('QuickSearch API: Returning cached result')
        return NextResponse.json(cacheEntry.result_data)
      } else if (cacheEntry.status === 'pending') {
        // Return pending status for client polling
        console.log('QuickSearch API: Request is pending, returning polling response')
        return NextResponse.json({
          status: 'pending',
          message: 'Search request is being processed. Please poll again.',
          cacheId: cacheEntry.id,
          createdAt: cacheEntry.created_at
        })
      } else if (cacheEntry.status === 'error') {
        // Return error from cache
        console.log('QuickSearch API: Cached error found')
        return NextResponse.json(
          { 
            error: 'Search failed',
            details: cacheEntry.error_message || 'Cached error'
          },
          { status: 500 }
        )
      }
    }

    console.log('QuickSearch API: No valid cache found, creating pending entry')

    // Create pending cache entry
    const pendingEntry = await supabaseCacheManager.createPendingEntry(
      'quicksearch', 
      searchPayload, 
      60 // 1 hour TTL
    )

    if (!pendingEntry) {
      console.error('QuickSearch API: Failed to create pending cache entry')
      return NextResponse.json(
        { error: 'Failed to initialize search request' },
        { status: 500 }
      )
    }

    console.log('QuickSearch API: Created pending entry:', pendingEntry.id)

    // Start background VidTao search (don't await)
    const searchParams = {
      query: query.trim(),
      page: 1, // Always use page 1 for better caching
      limit: 500, // Get more results for FE pagination
      ...otherParams
    }

    // Background VidTao search with AbortController
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 1 minute timeout for quick search

    // Don't await this - run in background
    performBackgroundQuickSearch(pendingEntry.id, searchParams, controller.signal)
      .finally(() => clearTimeout(timeoutId))

    // Return pending response immediately
    return NextResponse.json({
      status: 'pending',
      message: 'Search request initiated. Please poll for results.',
      cacheId: pendingEntry.id,
      createdAt: pendingEntry.created_at
    })

  } catch (error) {
    console.error('QuickSearch API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Background search function for QuickSearch
async function performBackgroundQuickSearch(
  cacheId: string, 
  searchParams: any, 
  signal: AbortSignal
) {
  try {
    console.log('Background quick search started for cache ID:', cacheId)

    if (signal.aborted) {
      throw new Error('Request aborted before starting')
    }

    // Use the QuickSearch from VidTao Manager
    const result = await vidTaoManager.quickSearch(searchParams)

    if (signal.aborted) {
      console.log('Background quick search aborted for cache ID:', cacheId)
      return
    }

    if (!result.success) {
      console.error('Background VidTao quick search error:', result.error)
      await supabaseCacheManager.updateCacheEntry(
        cacheId,
        'error',
        null,
        result.error || 'VidTao quick search failed'
      )
      return
    }

    console.log('Background quick search completed for cache ID:', cacheId, {
      success: result.success,
      account: result.account,
      data_length: Array.isArray(result.data) ? result.data.length : 'not array'
    })

    // Transform the result to match expected format
    const transformedResponse = {
      success: true,
      data: result.data,
      account: result.account
    }

    // Update cache with completed result
    await supabaseCacheManager.updateCacheEntry(
      cacheId,
      'completed',
      transformedResponse
    )

    console.log('Background quick search result cached for ID:', cacheId)

  } catch (error) {
    console.error('Background quick search error for cache ID:', cacheId, error)
    
    if (!signal.aborted) {
      await supabaseCacheManager.updateCacheEntry(
        cacheId,
        'error',
        null,
        error instanceof Error ? error.message : 'Background quick search failed'
      )
    }
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  )
}