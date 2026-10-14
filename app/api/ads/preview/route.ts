import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-cache'

export const dynamic = 'force-dynamic'

interface CachedPreview {
  data: PreviewAd[]
  total: number
  timestamp: number
}

interface RawAdItem {
  ytVideoId?: string
  videoId?: string
  title?: string
  description?: string
  thumbnail?: string
  imageUrl?: string
  duration?: number | string
  publishedAt?: string
  firstSeen?: string
  lastSeen?: string
  totalSpend?: number
  is_unlisted?: boolean
  language?: string
  category?: number | string | null
  last30Days?: number
  last90Days?: number
  brandName?: string
  brandId?: number | string
  similarity_score?: number | null
  views?: number | string
  channel?: string
  url?: string
  companyName?: string
}

export interface PreviewAd {
  ytVideoId: string
  title: string
  description: string
  thumbnail: string
  duration: string
  publishedAt: string
  date: string
  totalSpend: number
  is_unlisted: boolean
  language: string
  category: string
  last30Days: number | undefined
  last90Days: number | undefined
  brandName: string
  brandId: number | string | undefined
  similarity_score: number | null | undefined
  firstSeen: string
  lastSeen: string
  views: string
  ctr: string
  channel: string
  url: string
  companyName: string
}

// In-memory cache to avoid repeated heavy Supabase payload downloads (TTL: 60s)
let memoryCache: CachedPreview | null = null
const CACHE_TTL_MS = 60 * 1000

function formatDuration(val?: number | string): string {
  if (typeof val === 'number') {
    const mins = Math.floor(val / 60)
    const secs = val % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }
  return String(val || '')
}

function formatViews(val?: number | string): string {
  if (typeof val === 'number') {
    return val >= 1000 ? `${(val / 1000).toFixed(1)}K` : String(val)
  }
  return String(val || '0')
}

// GET /api/ads/preview?limit=60
// Returns high-quality unique ads from completed search_cache entries.
// No auth required — used for the initial landing / discover state on the MKT page.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '60', 10), 10), 200)

    const now = Date.now()
    if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS && memoryCache.data.length >= limit) {
      const sliced = memoryCache.data.slice(0, limit)
      return NextResponse.json({
        success: true,
        ads: sliced,
        total: memoryCache.total,
        cached: true
      }, { status: 200 })
    }

    // 1. Fetch completed 'mkt' cache rows (5 rows is ~1,500 ads, plenty for preview and much faster than 20 rows)
    let { data: cacheRows, error } = await supabaseAdmin
      .from('search_cache')
      .select('result_data, created_at, cache_key, search_type')
      .eq('status', 'completed')
      .eq('search_type', 'mkt')
      .not('result_data', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5)

    // Fallback: if no 'mkt' rows found, try any completed rows
    if ((!cacheRows || cacheRows.length === 0) && !error) {
      const fallbackResult = await supabaseAdmin
        .from('search_cache')
        .select('result_data, created_at, cache_key, search_type')
        .eq('status', 'completed')
        .not('result_data', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5)
      cacheRows = fallbackResult.data
      error = fallbackResult.error
    }

    if (error) {
      console.error('[Preview API] Supabase error:', error)
      return NextResponse.json({ success: false, ads: [], total: 0 }, { status: 200 })
    }

    if (!cacheRows || cacheRows.length === 0) {
      return NextResponse.json({ success: true, ads: [], total: 0 }, { status: 200 })
    }

    // 2. Extract and format ads
    const allAds: PreviewAd[] = []

    for (const row of cacheRows) {
      const data = row.result_data
      const rawResults = (data?.data?.results || data?.results || (Array.isArray(data) ? data : null)) as RawAdItem[] | null

      if (Array.isArray(rawResults)) {
        for (const ad of rawResults) {
          const videoId = ad.ytVideoId || ad.videoId || ''
          const thumb = ad.thumbnail || ad.imageUrl || ''
          const title = ad.title || 'Quảng cáo'

          if (thumb && (title || videoId)) {
            const dateStr = ad.publishedAt || ad.firstSeen || ad.lastSeen || ''
            allAds.push({
              ytVideoId: videoId,
              title,
              description: ad.description || '',
              thumbnail: thumb,
              duration: formatDuration(ad.duration),
              publishedAt: ad.publishedAt || '',
              date: dateStr,
              totalSpend: ad.totalSpend || 0,
              is_unlisted: ad.is_unlisted ?? false,
              language: ad.language || '',
              category: String(ad.category || ''),
              last30Days: ad.last30Days,
              last90Days: ad.last90Days,
              brandName: ad.brandName || ad.channel || '',
              brandId: ad.brandId,
              similarity_score: ad.similarity_score,
              firstSeen: ad.firstSeen || dateStr,
              lastSeen: ad.lastSeen || dateStr,
              views: formatViews(ad.views || ad.totalSpend),
              ctr: '—',
              channel: ad.channel || ad.brandName || '',
              url: ad.url || (videoId ? `https://youtube.com/watch?v=${videoId}` : ''),
              companyName: ad.companyName || ad.brandName || ''
            })
          }
        }
      }
    }

    if (allAds.length === 0) {
      return NextResponse.json({ success: true, ads: [], total: 0 }, { status: 200 })
    }

    // 3. Deduplicate by ytVideoId or title
    const seen = new Set<string>()
    const unique: PreviewAd[] = []
    for (const ad of allAds) {
      const key = ad.ytVideoId || ad.title
      if (key && !seen.has(key)) {
        seen.add(key)
        unique.push(ad)
      }
    }

    // Save full deduplicated dataset to memory cache
    memoryCache = {
      data: unique,
      total: unique.length,
      timestamp: now
    }

    const resultAds = unique.slice(0, limit)
    return NextResponse.json({
      success: true,
      ads: resultAds,
      total: unique.length
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (err) {
    console.error('[Preview API] Unexpected error:', err)
    return NextResponse.json({ success: false, ads: [], total: 0 }, { status: 200 })
  }
}
