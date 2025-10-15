import { NextRequest, NextResponse } from 'next/server'
import { 
  MKTSearchParams, 
  VidTaoSearchResponse, 
  MKTSearchResponse,
  TransformedVideoResult,
  VidTaoVideoResult 
} from '@/types/mkt-search'
import { vidTaoManager } from '@/lib/vidtao-manager'

export async function POST(request: NextRequest) {
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
      limit = 20,
      page = 1
    } = body

    // Validate required parameters
    if (!searchTerm || searchTerm.trim() === '') {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      )
    }

    console.log('MKT API: Using VidTao Manager MKT Search')

    // Use VidTao Manager's new mktSearch function
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
      limit: limit,
      page: page
    }

    const result = await vidTaoManager.mktSearch(searchParams)

    if (!result.success) {
      console.error('VidTao Manager MKT Search error:', result.error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch search results',
          details: result.error || 'Unknown error from VidTao Manager'
        },
        { status: 500 }
      )
    }

    const data = result.data
    console.log('MKT API: VidTao Manager MKT Search response received:', {
      success: result.success,
      account: result.account,
      search_type: data?.search_type,
      total_results: data?.total_results,
      total_available: data?.total_available,
      results_count: data?.data?.results?.length || 0
    })

    // Transform VidTao Enhanced Search response to our expected format
    const transformedResponse: MKTSearchResponse = {
      success: data.success,
      search_type: data.search_type,
      keyword: data.keyword,
      total_results: data.total_results,
      total_available: data.total_available,
      qdrant_matches: data.qdrant_matches,
      external_matches: data.external_matches,
      external_matches_used: data.external_matches_used,
      external_service_used: data.external_service_used,
      clickhouse_matches: data.clickhouse_matches,
      swiped_matches: data.swiped_matches,
      parameters: data.parameters,
      timing: data.timing,
      data: {
        hasMore: data.data?.hasMore || false,
        results: data.data?.results?.map((video: any) => transformVidTaoVideo(video)) || [],
        pagination: {
          page: page,
          limit: limit,
          total: data.total_available || 0,
          totalPages: Math.ceil((data.total_available || 0) / limit),
          hasNextPage: data.data?.hasMore || false
        }
      }
    }

    return NextResponse.json(transformedResponse)

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