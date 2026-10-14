import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-cache'

export const dynamic = 'force-dynamic'

// GET /api/ads/preview
// Returns up to 20 random ads from completed search_cache entries.
// No auth required — used as a "trending / discover" section on the MKT page.
export async function GET() {
  try {
    // 1. Fetch completed cache rows (prioritize mkt, fallback to any)
    let { data: cacheRows, error } = await supabaseAdmin
      .from('search_cache')
      .select('result_data, created_at, cache_key, search_type')
      .eq('status', 'completed')
      .not('result_data', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('[Preview API] Supabase error:', error)
      return NextResponse.json({ ads: [] }, { status: 200 })
    }

    if (!cacheRows || cacheRows.length === 0) {
      return NextResponse.json({ ads: [] }, { status: 200 })
    }

    // Extract ads from result_data
    const allAds: any[] = []

    for (const row of cacheRows) {
      const data = row.result_data
      const rawResults = data?.data?.results || data?.results || (Array.isArray(data) ? data : null)
      
      if (Array.isArray(rawResults)) {
        for (const ad of rawResults) {
          if (ad && (ad.thumbnail || ad.imageUrl) && (ad.title || ad.ytVideoId)) {
            allAds.push({
              ytVideoId: ad.ytVideoId || ad.videoId || '',
              title: ad.title || 'Quảng cáo',
              description: ad.description || '',
              thumbnail: ad.thumbnail || ad.imageUrl || '',
              duration: ad.duration || '',
              publishedAt: ad.publishedAt || '',
              totalSpend: ad.totalSpend || 0,
              is_unlisted: ad.is_unlisted ?? false,
              language: ad.language || '',
              category: ad.category || '',
              last30Days: ad.last30Days,
              last90Days: ad.last90Days,
              brandName: ad.brandName || ad.channel || '',
              brandId: ad.brandId,
              similarity_score: ad.similarity_score,
              firstSeen: ad.firstSeen || ad.publishedAt || '',
              lastSeen: ad.lastSeen || ad.publishedAt || '',
              views: ad.views || ad.totalSpend || 0,
              channel: ad.channel || ad.brandName || '',
              url: ad.url || (ad.ytVideoId ? `https://youtube.com/watch?v=${ad.ytVideoId}` : undefined),
              companyName: ad.companyName || ad.brandName || ''
            })
          }
        }
      }
    }

    if (allAds.length === 0) {
      return NextResponse.json({ ads: [] }, { status: 200 })
    }

    // Deduplicate by ytVideoId or title
    const seen = new Set<string>()
    const unique = allAds.filter(ad => {
      const key = ad.ytVideoId || ad.title
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Shuffle and cap at 20
    const shuffled = unique.sort(() => Math.random() - 0.5).slice(0, 20)

    return NextResponse.json({ ads: shuffled, total: unique.length }, { status: 200 })
  } catch (err) {
    console.error('[Preview API] Unexpected error:', err)
    return NextResponse.json({ ads: [] }, { status: 200 })
  }
}
