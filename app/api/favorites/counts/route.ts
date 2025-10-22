import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FavoritesService } from '@/lib/favorites'

// GET /api/favorites/counts - Get favorites counts by type
export async function GET(request: NextRequest) {
  try {
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

    const counts = await FavoritesService.getFavoritesCountByType(user.id)

    return NextResponse.json(counts)

  } catch (error) {
    console.error('Error fetching favorites counts:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}