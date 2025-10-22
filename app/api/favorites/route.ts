import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { FavoritesService, AddFavoriteRequest } from '@/lib/favorites'

// GET /api/favorites - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
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

    const result = await FavoritesService.getFavorites(
      user.id,
      type as any,
      page,
      limit
    )

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AddFavoriteRequest
    
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

    const favorite = await FavoritesService.addFavorite(user.id, body)

    return NextResponse.json({ 
      success: true, 
      favorite,
      message: 'Đã thêm vào danh sách yêu thích' 
    })

  } catch (error: any) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 400 }
    )
  }
}

// DELETE /api/favorites - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const itemId = searchParams.get('itemId')

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

    await FavoritesService.removeFavorite(user.id, type as any, itemId)

    return NextResponse.json({ 
      success: true,
      message: 'Đã xóa khỏi danh sách yêu thích' 
    })

  } catch (error: any) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 400 }
    )
  }
}