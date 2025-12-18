import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FavoritesService } from '@/lib/favorites'

interface CheckParams {
  type: string
  itemId: string
}

// GET /api/favorites/check/[type]/[itemId] - Check if item is favorited
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<CheckParams> }
) {
  const { type, itemId } = await params;

  try {
    
    if (!type || !itemId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Get user from session
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isFavorited = await FavoritesService.isFavorited(
      user.id,
      type as any,
      itemId
    )

    return NextResponse.json({ isFavorited })

  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}