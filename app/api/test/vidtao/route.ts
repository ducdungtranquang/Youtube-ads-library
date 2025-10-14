import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'

export async function GET() {
  try {
    // Test VidTao manager status
    const status = vidTaoManager.getAccountsStatus()
    
    // Test a simple search
    const testSearch = await vidTaoManager.makeRequest('/ads/search', {
      q: 'test',
      page: 1,
      limit: 5
    })

    return NextResponse.json({
      success: true,
      data: {
        status: status,
        testSearch: testSearch,
        timestamp: Date.now()
      }
    })

  } catch (error) {
    console.error('VidTao test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'VidTao test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint = '/ads/search', params = { q: 'test', page: 1, limit: 5 } } = body

    console.log('Testing VidTao API:', { endpoint, params })

    const result = await vidTaoManager.makeRequest(endpoint, params)

    return NextResponse.json({
      success: true,
      data: {
        endpoint,
        params,
        result,
        timestamp: Date.now()
      }
    })

  } catch (error) {
    console.error('VidTao API test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'VidTao API test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}