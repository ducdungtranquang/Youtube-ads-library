import { NextRequest, NextResponse } from 'next/server'
import { vidTaoManager } from '@/lib/vidtao-manager'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { videoId } = params;
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      );
    }
    console.log(`Fetching video details for: ${videoId}`);
    const result = await vidTaoManager.getVideoDetails(videoId);
    if (!result.success) {
      console.error('VidTao video details error:', result.error);
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to fetch video details', account: result.account || 'unknown' },
        { status: 500 }
      );
    }
    console.log('Video details fetched successfully:', {
      videoId,
      account: result.account,
      hasData: !!result.data
    });
    return NextResponse.json({
      success: true,
      data: result.data,
      account: result.account,
      cached: false
    });
  } catch (error) {
    console.error('Video details API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}