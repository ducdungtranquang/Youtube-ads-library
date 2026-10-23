import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'

export const dynamic = 'force-dynamic'

// In-memory cache for revealed tokens (token -> ytVideoId)
const revealCache = new Map<string, string>()

/**
 * Check if the provided ID is an actual 11-char YouTube Video ID
 */
function isRealYouTubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id) && !id.startsWith('v_')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = typeof body?.token === 'string' ? body.token.trim() : ''

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Video token is required' },
        { status: 400 }
      )
    }

    // If it's already a real YouTube ID, return directly
    if (isRealYouTubeId(token)) {
      return NextResponse.json({
        success: true,
        ytVideoId: token,
        url: `https://youtube.com/watch?v=${token}`,
        isRevealed: true,
        cached: true
      })
    }

    // Check in-memory cache
    if (revealCache.has(token)) {
      const cachedYtId = revealCache.get(token)!
      return NextResponse.json({
        success: true,
        ytVideoId: cachedYtId,
        url: `https://youtube.com/watch?v=${cachedYtId}`,
        token,
        isRevealed: true,
        cached: true
      })
    }

    // Call VidTao reveal API
    console.log(`[API /api/videos/reveal] Revealing YouTube ID for token: ${token}`)
    const result = await vidTaoManager.revealVideo(token)

    if (!result.success) {
      console.error('[API /api/videos/reveal] Reveal failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to reveal video ID',
          token
        },
        { status: 502 }
      )
    }

    const realYtVideoId: string | undefined =
      result.data?.data?.ytVideoId || result.data?.ytVideoId

    if (!realYtVideoId) {
      console.error('[API /api/videos/reveal] No ytVideoId in reveal response:', result.data)
      return NextResponse.json(
        {
          success: false,
          error: 'No YouTube Video ID returned from VidTao reveal',
          token
        },
        { status: 502 }
      )
    }

    // Cache the result
    revealCache.set(token, realYtVideoId)

    console.log(`[API /api/videos/reveal] Successfully revealed ${token} -> ${realYtVideoId}`)

    return NextResponse.json({
      success: true,
      ytVideoId: realYtVideoId,
      url: `https://youtube.com/watch?v=${realYtVideoId}`,
      token,
      isRevealed: true,
      cached: false
    })
  } catch (error) {
    console.error('[API /api/videos/reveal] Exception:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during video reveal'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')?.trim() || ''

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Video token parameter is required' },
        { status: 400 }
      )
    }

    if (isRealYouTubeId(token)) {
      return NextResponse.json({
        success: true,
        ytVideoId: token,
        url: `https://youtube.com/watch?v=${token}`,
        isRevealed: true,
        cached: true
      })
    }

    if (revealCache.has(token)) {
      const cachedYtId = revealCache.get(token)!
      return NextResponse.json({
        success: true,
        ytVideoId: cachedYtId,
        url: `https://youtube.com/watch?v=${cachedYtId}`,
        token,
        isRevealed: true,
        cached: true
      })
    }

    const result = await vidTaoManager.revealVideo(token)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to reveal video ID',
          token
        },
        { status: 502 }
      )
    }

    const realYtVideoId: string | undefined =
      result.data?.data?.ytVideoId || result.data?.ytVideoId

    if (!realYtVideoId) {
      return NextResponse.json(
        {
          success: false,
          error: 'No YouTube Video ID returned from VidTao reveal',
          token
        },
        { status: 502 }
      )
    }

    revealCache.set(token, realYtVideoId)

    return NextResponse.json({
      success: true,
      ytVideoId: realYtVideoId,
      url: `https://youtube.com/watch?v=${realYtVideoId}`,
      token,
      isRevealed: true,
      cached: false
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during video reveal'
      },
      { status: 500 }
    )
  }
}
