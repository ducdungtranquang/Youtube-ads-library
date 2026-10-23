import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      )
    }

    console.log(`Fetching video details for: ${videoId}`)
    
    // Use VidTao Manager to get video details
    const result = await vidTaoManager.getVideoDetails(videoId)

    if (!result.success) {
      console.error('VidTao video details error:', result.error)
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to fetch video details',
          account: result.account || 'unknown'
        },
        { status: 500 }
      )
    }

    const rawPayload = result.data
    const innerData = (rawPayload && typeof rawPayload === 'object' && 'data' in rawPayload && rawPayload.data)
      ? rawPayload.data
      : (rawPayload || {})

    // Extract clickUrls & landingPage
    const clickUrls: string[] = Array.isArray(innerData.clickUrls)
      ? innerData.clickUrls.filter((url: unknown): url is string => typeof url === 'string' && url.trim().length > 0)
      : (typeof innerData.clickUrl === 'string' && innerData.clickUrl.trim() ? [innerData.clickUrl.trim()] : [])

    const landingPage: string | null = clickUrls.length > 0
      ? clickUrls[0]
      : (typeof innerData.landingPage === 'string' && innerData.landingPage.trim() ? innerData.landingPage.trim() : null)

    const transcript: string | null = typeof innerData.transcript === 'string' && innerData.transcript.trim()
      ? innerData.transcript.trim()
      : null

    // Check if ytVideoId is a masked VidTao token (starts with v_ or not 11-char)
    const tokenCandidate = (typeof innerData.ytVideoId === 'string' && innerData.ytVideoId)
      ? innerData.ytVideoId
      : videoId

    let realYtVideoId: string | null = null
    const isMaskedToken = tokenCandidate.startsWith('v_') || tokenCandidate.length > 11

    if (isMaskedToken) {
      try {
        console.log(`Auto-revealing real YouTube ID for token: ${tokenCandidate}`)
        const revealResult = await vidTaoManager.revealVideo(tokenCandidate)
        if (revealResult.success) {
          const revealed = revealResult.data?.data?.ytVideoId || revealResult.data?.ytVideoId
          if (typeof revealed === 'string' && revealed.trim()) {
            realYtVideoId = revealed.trim()
            console.log(`Auto-reveal success: ${tokenCandidate} -> ${realYtVideoId}`)
          }
        } else {
          console.warn('Auto-reveal returned unsuccessful:', revealResult.error)
        }
      } catch (revealErr) {
        console.warn('Auto-reveal failed gracefully:', revealErr)
      }
    } else {
      realYtVideoId = tokenCandidate
    }

    const finalYtVideoId = realYtVideoId || innerData.ytVideoId || videoId
    const finalUrl = realYtVideoId
      ? `https://youtube.com/watch?v=${realYtVideoId}`
      : (innerData.url || (innerData.ytVideoId ? `https://youtube.com/watch?v=${innerData.ytVideoId}` : ''))

    const enrichedVideo = {
      ...innerData,
      ytVideoId: finalYtVideoId,
      realYtVideoId: realYtVideoId || undefined,
      token: tokenCandidate,
      url: finalUrl,
      isRevealed: Boolean(realYtVideoId),
      clickUrls,
      landingPage,
      landingPages: clickUrls,
      transcript,
    }

    console.log('Video details fetched successfully:', {
      videoId,
      account: result.account,
      hasData: !!result.data,
      hasLandingPage: !!landingPage,
      hasTranscript: !!transcript,
    })

    return NextResponse.json({
      success: true,
      data: {
        ...enrichedVideo,
        // Preserve nested data structure for backward compatibility
        data: enrichedVideo,
      },
      landingPage,
      clickUrls,
      transcript,
      account: result.account,
      cached: false
    })

  } catch (error) {
    console.error('Video details API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}