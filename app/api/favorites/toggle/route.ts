import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FavoritesService } from '@/lib/favorites'

// POST /api/favorites/toggle - Toggle favorite status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { item_type, item_id, item_data } = body
    
    if (!item_type || !item_id || !item_data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

    const result = await FavoritesService.toggleFavorite(
      user.id,
      item_type,
      item_id,
      item_data
    )

    return NextResponse.json({
      success: true,
      isFavorited: result.isFavorited,
      message: result.isFavorited 
        ? 'Đã thêm vào danh sách yêu thích' 
        : 'Đã xóa khỏi danh sách yêu thích'
    })

  } catch (error: any) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 400 }
    )
  }
}