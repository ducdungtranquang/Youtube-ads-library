import { NextRequest, NextResponse } from 'next/server'
import { cacheManager } from '@/lib/cache-manager'

export async function GET() {
  try {
    const stats = cacheManager.getStats()
    
    return NextResponse.json({
      success: true,
      data: {
        cache: stats,
        info: {
          description: 'Cache statistics for VidTao API requests',
          cacheTypes: ['ads', 'offers'],
          defaultTTL: '5 minutes',
          autoCleanup: '10 minutes'
        }
      },
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Cache status error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as 'ads' | 'offers' | 'all'

    if (type === 'all') {
      cacheManager.clear()
      return NextResponse.json({
        success: true,
        message: 'All cache cleared'
      })
    } else if (type === 'ads' || type === 'offers') {
      cacheManager.clearByType(type)
      return NextResponse.json({
        success: true,
        message: `${type} cache cleared`
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Use: all, ads, or offers' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Clear cache error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}