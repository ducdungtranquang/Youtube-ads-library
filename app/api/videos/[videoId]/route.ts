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

    console.log('Video details fetched successfully:', {
      videoId,
      account: result.account,
      hasData: !!result.data
    })

    return NextResponse.json({
      success: true,
      data: result.data,
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