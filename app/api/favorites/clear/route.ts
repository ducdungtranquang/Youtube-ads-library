import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FavoritesService } from '@/lib/favorites'

// DELETE /api/favorites/clear - Clear favorites by type or all
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // Optional - if not provided, clear all
    
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

    if (type) {
      await FavoritesService.clearFavoritesByType(user.id, type as any)
    } else {
      await FavoritesService.clearAllFavorites(user.id)
    }

    return NextResponse.json({ 
      success: true,
      message: type 
        ? `Đã xóa tất cả ${type} yêu thích`
        : 'Đã xóa tất cả yêu thích' 
    })

  } catch (error: any) {
    console.error('Error clearing favorites:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 400 }
    )
  }
}