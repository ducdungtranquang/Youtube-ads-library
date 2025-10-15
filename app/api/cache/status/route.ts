import { NextRequest, NextResponse } from 'next/server'
import { cacheManager } from '@/lib/cache-manager'
import { supabaseCacheManager, supabaseAdmin } from '@/lib/supabase-cache'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cacheId = searchParams.get('cacheId')

    // If cacheId is provided, check specific cache entry status
    if (cacheId) {
      const { data, error } = await supabaseAdmin
        .from('search_cache')
        .select('*')
        .eq('id', cacheId)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: 'Cache entry not found' },
          { status: 404 }
        )
      }

      // Check if expired
      const now = new Date()
      const expiresAt = new Date(data.expires_at)
      
      if (now > expiresAt) {
        return NextResponse.json(
          { error: 'Cache entry expired' },
          { status: 410 }
        )
      }

      // Return status and data based on current state
      if (data.status === 'completed') {
        return NextResponse.json({
          status: 'completed',
          data: data.result_data,
          updatedAt: data.updated_at
        })
      } else if (data.status === 'pending') {
        return NextResponse.json({
          status: 'pending',
          message: 'Search is still processing',
          createdAt: data.created_at,
          updatedAt: data.updated_at
        })
      } else if (data.status === 'error') {
        return NextResponse.json({
          status: 'error',
          error: data.error_message || 'Search failed',
          updatedAt: data.updated_at
        }, { status: 500 })
      }

      return NextResponse.json({
        status: data.status,
        updatedAt: data.updated_at
      })
    }

    // If no cacheId, return general cache statistics
    const [memoryStats, supabaseStats] = await Promise.all([
      cacheManager.getStats(),
      supabaseCacheManager.getCacheStats()
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        memory_cache: memoryStats,
        supabase_cache: supabaseStats,
        info: {
          description: 'Cache statistics for VidTao API requests',
          memoryTypes: ['ads', 'offers'],
          supabaseTypes: ['mkt', 'quicksearch', 'brands', 'companies'],
          memoryTTL: '5 minutes',
          supabaseTTL: '1-2 hours',
          autoCleanup: '10 minutes (memory), periodic (supabase)'
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
    const cacheType = searchParams.get('cache') as 'memory' | 'supabase' | 'all'
    const type = searchParams.get('type') as 'ads' | 'offers' | 'mkt' | 'quicksearch' | 'brands' | 'companies' | 'all'

    if (cacheType === 'memory' || cacheType === 'all') {
      if (type === 'all') {
        cacheManager.clear()
      } else if (type === 'ads' || type === 'offers') {
        cacheManager.clearByType(type)
      }
    }

    if (cacheType === 'supabase' || cacheType === 'all') {
      if (type === 'all') {
        // Clear all supabase cache types
        const deletePromises = ['mkt', 'quicksearch', 'brands', 'companies'].map(
          t => supabaseCacheManager.clearCacheByType(t as any)
        )
        await Promise.all(deletePromises)
      } else if (['mkt', 'quicksearch', 'brands', 'companies'].includes(type)) {
        await supabaseCacheManager.clearCacheByType(type as any)
      }
    }

    // Also clean up expired entries
    await supabaseCacheManager.cleanupExpiredEntries()

    return NextResponse.json({
      success: true,
      message: `Cache cleared: ${cacheType || 'all'} cache, ${type || 'all'} types`
    })

  } catch (error) {
    console.error('Clear cache error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}