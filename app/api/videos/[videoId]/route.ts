import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao/manager'

// CORS helper
function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return response
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 })
  return withCORS(res)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> | { videoId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const { videoId } = resolvedParams

    if (!videoId) {
      return withCORS(NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      ))
    }

    console.log(`Fetching video details for: ${videoId}`)
    
    // Use VidTao Manager to get video details
    const result = await vidTaoManager.getVideoDetails(videoId)

    if (!result.success) {
      console.error('VidTao video details error:', result.error)
      return withCORS(NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to fetch video details',
          account: result.account || 'unknown'
        },
        { status: 500 }
      ))
    }

    console.log('Video details fetched successfully:', {
      videoId,
      account: result.account,
      hasData: !!result.data
    })

    // Ensure thumbnail and url are present in the response
    const videoData = result.data?.data || result.data
    const cleanYtId = videoId.replace(/^v_/, '')
    if (videoData && typeof videoData === 'object') {
      if (!videoData.thumbnail) {
        videoData.thumbnail = `https://i.ytimg.com/vi/${cleanYtId}/hqdefault.jpg`
      }
      if (!videoData.url) {
        videoData.url = `https://youtube.com/watch?v=${cleanYtId}`
      }
    }

    return withCORS(NextResponse.json({
      success: true,
      data: result.data,
      account: result.account,
      cached: false
    }))

  } catch (error) {
    console.error('Video details API error:', error)
    return withCORS(NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    ))
  }
}