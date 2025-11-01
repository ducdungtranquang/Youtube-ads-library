import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'
import { supabaseCacheManager, SearchPayload } from '@/lib/supabase-cache'
import { supabase } from '@/lib/supabase'

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
    
    if (cacheEntry && cacheEntry.status === 'completed') {
      console.log('QuickSearch API: Cache entry found, returning cached result')
      return NextResponse.json(cacheEntry.result_data)
    }

    console.log('QuickSearch API: No valid cache found, calling VidTao directly')

    // Call VidTao directly without polling
    const searchParams = {
      query: query.trim(),
      page: 1, // Always use page 1 for better caching
      limit: 500, // Get more results for FE pagination
      ...otherParams
    }

    // Call VidTao directly
    const result = await vidTaoManager.quickSearch(searchParams)

    if (!result.success) {
      console.error('VidTao quick search error:', result.error)
      return NextResponse.json(
        { 
          error: 'Search failed',
          details: result.error || 'VidTao quick search failed'
        },
        { status: 500 }
      )
    }

    console.log('VidTao quick search completed:', {
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

    // Cache the result for future requests
    const newCacheEntry = await supabaseCacheManager.createPendingEntry(
      'quicksearch',
      searchPayload,
      60 // 1 hour TTL
    )

    if (newCacheEntry) {
      await supabaseCacheManager.updateCacheEntry(
        newCacheEntry.id,
        'completed',
        transformedResponse
      )
    }

    return NextResponse.json(transformedResponse)

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

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  )
}