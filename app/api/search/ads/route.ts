import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'
import { cacheManager } from '@/lib/cache-manager'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Extract search parameters
    const query = searchParams.get('query')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'
    const country = searchParams.get('country')
    const language = searchParams.get('language')
    const dateRange = searchParams.get('dateRange')
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'relevance'

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Prepare parameters for VidTao API
    const vidTaoParams: any = {
      q: query,
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortBy
    }

    // Add optional parameters
    if (country) vidTaoParams.country = country
    if (language) vidTaoParams.language = language
    if (dateRange) vidTaoParams.date_range = dateRange
    if (category) vidTaoParams.category = category

    console.log('Searching ads with params:', vidTaoParams)

    // Check cache first
    const cachedResult = cacheManager.get('ads', vidTaoParams)
    if (cachedResult) {
      console.log('Returning cached ads result')
      return NextResponse.json(cachedResult)
    }

    // Make request through VidTao manager
    const result = await vidTaoManager.makeRequest('/ads/search', vidTaoParams)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Transform data if needed
    const transformedData = {
      success: true,
      data: {
        ads: result.data?.ads || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.data?.total || 0,
          totalPages: Math.ceil((result.data?.total || 0) / parseInt(limit))
        }
      },
      meta: {
        account: result.account,
        timestamp: Date.now()
      }
    }

    // Cache the result for 8 hours (tối ưu VidTao requests)
    cacheManager.set('ads', vidTaoParams, transformedData, 8 * 60 * 60 * 1000)

    return NextResponse.json(transformedData)

  } catch (error) {
    console.error('Search ads API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { query, filters = {}, pagination = {} } = body

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    // Prepare parameters
    const vidTaoParams = {
      q: query,
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      ...filters
    }

    console.log('Searching ads with params:', vidTaoParams)

    // Check cache first
    const cachedResult = cacheManager.get('ads', vidTaoParams)
    if (cachedResult) {
      console.log('Returning cached ads result (POST)')
      return NextResponse.json(cachedResult)
    }

    const result = await vidTaoManager.makeRequest('/ads/search', vidTaoParams)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    const responseData = {
      success: true,
      data: result.data,
      meta: {
        account: result.account,
        timestamp: Date.now()
      }
    }

    // Cache the result for 8 hours (tối ưu VidTao requests)
    cacheManager.set('ads', vidTaoParams, responseData, 8 * 60 * 60 * 1000)

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Search ads API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}