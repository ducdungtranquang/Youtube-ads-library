export const runtime = "nodejs"
export const maxDuration = 300
import { NextRequest, NextResponse } from 'next/server'
import { 
  MKTSearchParams, 
  VidTaoSearchResponse, 
  MKTSearchResponse,
  TransformedVideoResult,
  VidTaoVideoResult 
} from '@/types/mkt-search'
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
      searchTerm,
      countryId = 0,
      language = '',
      categoryIds = [],
      dateFrom = '',
      dateTo = '',
      showVideos = 'unlisted',
      sortProp = 'date',
      orderAsc = false,
      limit = 500, // Set to 1000 for better FE pagination
      page = 1
    } = body

    // Validate required parameters
    if (!searchTerm || searchTerm.trim() === '') {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      )
    }

    // Create search payload for caching
    const searchPayload: SearchPayload = {
      searchTerm: searchTerm.trim(),
      countryId,
      language: language || '',
      categoryIds: categoryIds.length > 0 ? categoryIds : [],
      dateFrom: dateFrom || '',
      dateTo: dateTo || '',
      showVideos,
      sortProp,
      orderAsc,
      limit,
      page
    }

    console.log('MKT API: Checking cache for payload:', searchPayload)

    // Check cache first
    const cacheEntry = await supabaseCacheManager.getCacheEntry('mkt', searchPayload)
    
    if (cacheEntry) {
      console.log('MKT API: Cache entry found:', { 
        status: cacheEntry.status, 
        created_at: cacheEntry.created_at 
      })

      if (cacheEntry.status === 'completed') {
        // Return cached result immediately
        console.log('MKT API: Returning cached result')
        return NextResponse.json(cacheEntry.result_data)
      } else if (cacheEntry.status === 'pending') {
        // Return pending status for client polling
        console.log('MKT API: Request is pending, returning polling response')
        return NextResponse.json({
          status: 'pending',
          message: 'Search request is being processed. Please poll again.',
          cacheId: cacheEntry.id,
          createdAt: cacheEntry.created_at
        })
      } else if (cacheEntry.status === 'error') {
        // Return error from cache
        console.log('MKT API: Cached error found')
        return NextResponse.json(
          { 
            error: 'Search failed',
            details: cacheEntry.error_message || 'Cached error'
          },
          { status: 500 }
        )
      }
    }

    console.log('MKT API: No valid cache found, creating pending entry')

    // Create pending cache entry
    const pendingEntry = await supabaseCacheManager.createPendingEntry(
      'mkt', 
      searchPayload, 
      120 // 2 hour TTL
    )

    if (!pendingEntry) {
      console.error('MKT API: Failed to create pending cache entry')
      return NextResponse.json(
        { error: 'Failed to initialize search request' },
        { status: 500 }
      )
    }

    console.log('MKT API: Created pending search entry:', pendingEntry.id)

    // Perform search directly with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 180000) // 2 minute timeout

    try {
      console.log('MKT API: Starting search for:', searchTerm)

      // Prepare search parameters
      const searchParams = {
        searchTerm: searchTerm.trim(),
        countryId: countryId,
        language: language || '',
        categoryIds: categoryIds.length > 0 ? categoryIds : [],
        dateFrom: dateFrom || '',
        dateTo: dateTo || '',
        showVideos: showVideos,
        sortProp: sortProp,
        orderAsc: orderAsc,
        limit: 500, // Get more results for FE pagination
        page: 1 // Always use page 1 for better caching
      }

      const result = await vidTaoManager.mktSearch(searchParams, controller.signal)
      clearTimeout(timeoutId)

      if (result.success && result.data) {
        console.log('MKT API: Search completed:', {
          searchTerm,
          resultsCount: result.data?.data?.results?.length || 0,
          account: result.account
        })

        // Transform VidTao Enhanced Search response
        const transformedResponse: MKTSearchResponse = {
          success: result.data.success,
          search_type: result.data.search_type,
          keyword: result.data.keyword,
          total_results: result.data.total_results,
          total_available: result.data.total_available,
          qdrant_matches: result.data.qdrant_matches,
          external_matches: result.data.external_matches,
          external_matches_used: result.data.external_matches_used,
          external_service_used: result.data.external_service_used,
          clickhouse_matches: result.data.clickhouse_matches,
          swiped_matches: result.data.swiped_matches,
          parameters: result.data.parameters,
          timing: result.data.timing,
          data: {
            hasMore: result.data.data?.hasMore || false,
            results: result.data.data?.results?.map((video: any) => transformVidTaoVideo(video)) || [],
            pagination: {
              page: searchParams.page,
              limit: searchParams.limit,
              total: result.data.total_available || 0,
              totalPages: Math.ceil((result.data.total_available || 0) / searchParams.limit),
              hasNextPage: result.data.data?.hasMore || false
            }
          }
        }

        // Update cache with results
        await supabaseCacheManager.updateCacheEntry(
          pendingEntry.id,
          'completed',
          transformedResponse
        )

        return NextResponse.json(transformedResponse)
      } else {
        console.error('MKT API: Search failed:', result.error)

        // Update cache with error
        await supabaseCacheManager.updateCacheEntry(
          pendingEntry.id,
          'error',
          null,
          result.error || 'MKT search failed'
        )

        return NextResponse.json(
          { error: result.error || 'MKT search failed' },
          { status: 500 }
        )
      }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('MKT API: Search error:', error)

      // Update cache with error
      await supabaseCacheManager.updateCacheEntry(
        pendingEntry.id,
        'error',
        null,
        error instanceof Error ? error.message : 'Unknown error'
      )

      return NextResponse.json(
        {
          error: 'Search execution failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('MKT API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Helper function to transform VidTao Enhanced Search video result to our expected format
function transformVidTaoVideo(video: any): TransformedVideoResult {
  return {
    ytVideoId: video.ytVideoId,
    title: video.title,
    description: video.description,
    thumbnail: video.thumbnail,
    duration: video.duration,
    publishedAt: video.publishedAt,
    totalSpend: video.totalSpend,
    is_unlisted: video.is_unlisted,
    language: video.language,
    category: video.category,
    last30Days: video.last30Days,
    last90Days: video.last90Days,
    brandName: video.brandName,
    brandId: video.brandId,
    similarity_score: video.similarity_score,
    // Additional metadata for UI compatibility
    firstSeen: video.publishedAt,
    lastSeen: video.summary_data?.updated_at || video.publishedAt,
    views: video.totalSpend, // Use totalSpend as proxy for views
    channel: video.brandName,
    url: `https://youtube.com/watch?v=${video.ytVideoId}`,
    companyName: video.brandName
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  )
}