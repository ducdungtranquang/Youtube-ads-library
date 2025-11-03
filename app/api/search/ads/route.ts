import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'
import { cacheManager } from '@/lib/cache-manager'

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Extract search parameters
    const query = searchParams.get('query')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'
    const country = searchParams.get('country')
    const dateRange = searchParams.get('dateRange')
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'relevance'

    if (!query) {
      return withCORS(NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      ))
    }

    // Extract additional parameters
    const countryId = searchParams.get('countryId')
    const language = searchParams.get('language')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const isAffiliate = searchParams.get('isAffiliate') === 'true'

    // Prepare parameters for VidTao QuickSearch API
    const quickSearchParams = {
      searchTerm: query,
      page: parseInt(page),
      sortProp: sortBy === 'relevance' ? 'totalSpend' : sortBy,
      affiliateCountryId: country ? parseInt(country) : 0,
      countryId: countryId ? parseInt(countryId) : 0,
      categoryIds: category ? [parseInt(category)] : [],
      language: language || "",
      dateFrom: dateFrom || "",
      dateTo: dateTo || "",
      isAffiliate: isAffiliate,
      videoType: 'all',
      showVideos: 'unlisted',
      orderAsc: false,
      limit: parseInt(limit)
    }

    console.log('Searching ads with quickSearch params:', quickSearchParams)

    // Check cache first
    const cachedResult = cacheManager.get('ads', quickSearchParams)
    if (cachedResult) {
      console.log('Returning cached ads result')
      return withCORS(NextResponse.json(cachedResult))
    }

    // Make request through VidTao manager
    const result = await vidTaoManager.quickSearch(quickSearchParams)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Transform data to match expected format (VidTao returns data.results array)
    const videos = result.data?.data?.results || result.data?.results || []
    const totalCount = result.data?.totalCount || result.data?.total || result.data?.count || videos.length
    const currentPage = parseInt(page)
    const itemsPerPage = parseInt(limit)
    
    // If no explicit total from API, estimate based on returned results
    const estimatedTotal = videos.length < itemsPerPage ? 
      ((currentPage - 1) * itemsPerPage) + videos.length : 
      Math.max(totalCount, currentPage * itemsPerPage)

    const transformedData = {
      success: true,
      data: {
        ads: videos,
        videos: videos, // Keep both for compatibility
        pagination: {
          page: currentPage,
          limit: itemsPerPage,
          total: estimatedTotal,
          totalPages: Math.ceil(estimatedTotal / itemsPerPage),
          hasNextPage: videos.length === itemsPerPage,
          hasPrevPage: currentPage > 1
        }
      },
      meta: {
        account: result.account,
        timestamp: Date.now(),
        source: 'YouTube Ads Library API'
      }
    }

    // Cache the result for 8 hours (tối ưu VidTao requests)
    cacheManager.set('ads', quickSearchParams, transformedData, 8 * 60 * 60 * 1000)

    return withCORS(NextResponse.json(transformedData))

  } catch (error) {
    console.error('Search ads API error:', error)
    return withCORS(NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ))
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { query, filters = {}, pagination = {} } = body

    if (!query) {
      return withCORS(NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      ))
    }

    // Prepare parameters for VidTao QuickSearch
    const quickSearchParams = {
      searchTerm: query,
      page: pagination.page || 1,
      sortProp: filters.sortBy || 'totalSpend',
      affiliateCountryId: filters.country ? parseInt(filters.country) : 0,
      countryId: filters.countryId ? parseInt(filters.countryId) : 0,
      categoryIds: filters.category ? [parseInt(filters.category)] : [],
      language: filters.language || "",
      dateFrom: filters.dateFrom || "",
      dateTo: filters.dateTo || "",
      isAffiliate: filters.isAffiliate || false,
      videoType: filters.videoType || 'all',
      showVideos: 'unlisted',
      orderAsc: false,
      limit: pagination.limit || 4
    }

    console.log('Searching ads with quickSearch params (POST):', quickSearchParams)

    // Check cache first
    const cachedResult = cacheManager.get('ads', quickSearchParams)
    if (cachedResult) {
      console.log('Returning cached ads result (POST)')
      return withCORS(NextResponse.json(cachedResult))
    }

    const result = await vidTaoManager.quickSearch(quickSearchParams)

    if (!result.success) {
      return withCORS(NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      ))
    }

    const videos = result.data?.data?.results || result.data?.results || []
    const totalCount = result.data?.totalCount || result.data?.total || result.data?.count || videos.length
    const currentPage = quickSearchParams.page
    const itemsPerPage = quickSearchParams.limit || 4
    
    // If no explicit total from API, estimate based on returned results
    const estimatedTotal = videos.length < itemsPerPage ? 
      ((currentPage - 1) * itemsPerPage) + videos.length : 
      Math.max(totalCount, currentPage * itemsPerPage)

    const responseData = {
      success: true,
      data: {
        ads: videos,
        videos: videos,
        pagination: {
          page: currentPage,
          limit: itemsPerPage,
          total: estimatedTotal,
          totalPages: Math.ceil(estimatedTotal / itemsPerPage),
          hasNextPage: videos.length === itemsPerPage,
          hasPrevPage: currentPage > 1
        }
      },
      meta: {
        account: result.account,
        timestamp: Date.now(),
        source: 'YouTube Ads Library API'
      }
    }

    // Cache the result for 8 hours (tối ưu VidTao requests)
    cacheManager.set('ads', quickSearchParams, responseData, 8 * 60 * 60 * 1000)

    return withCORS(NextResponse.json(responseData))

  } catch (error) {
    console.error('Search ads API error:', error)
    return withCORS(NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    ))
  }
}