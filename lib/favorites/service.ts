import { supabase } from '@/lib/supabase'
import { 
  FavoriteItem, 
  FavoriteType, 
  AddFavoriteRequest, 
  FavoriteCountsByType,
  FavoritesResponse,
  validateFavoriteData
} from './types'

export class FavoritesService {
  
  /**
   * Add an item to favorites
   */
  static async addFavorite(userId: string, request: AddFavoriteRequest): Promise<FavoriteItem> {
    // Validate data
    if (!validateFavoriteData(request.item_type, request.item_data)) {
      throw new Error('Invalid favorite data')
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        item_type: request.item_type,
        item_id: request.item_id,
        item_data: request.item_data
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Item đã có trong danh sách yêu thích')
      }
      throw new Error(`Không thể thêm vào yêu thích: ${error.message}`)
    }

    return data
  }

  /**
   * Remove an item from favorites
   */
  static async removeFavorite(userId: string, itemType: FavoriteType, itemId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_type', itemType)
      .eq('item_id', itemId)

    if (error) {
      throw new Error(`Không thể xóa khỏi yêu thích: ${error.message}`)
    }
  }

  /**
   * Check if an item is favorited
   */
  static async isFavorited(userId: string, itemType: FavoriteType, itemId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('is_item_favorited', {
        user_uuid: userId,
        item_type_param: itemType,
        item_id_param: itemId
      })

    if (error) {
      console.error('Error checking favorite status:', error)
      return false
    }

    return data || false
  }

  /**
   * Get user's favorites by type with pagination
   */
  static async getFavorites(
    userId: string, 
    itemType?: FavoriteType,
    page: number = 1,
    limit: number = 20
  ): Promise<FavoritesResponse> {
    let query = supabase
      .from('favorites')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (itemType) {
      query = query.eq('item_type', itemType)
    }

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Không thể tải danh sách yêu thích: ${error.message}`)
    }

    const total = count || 0
    const hasMore = total > page * limit

    return {
      favorites: data || [],
      total,
      page,
      limit,
      hasMore
    }
  }

  /**
   * Get favorites count by type
   */
  static async getFavoritesCountByType(userId: string): Promise<FavoriteCountsByType> {
    const { data, error } = await supabase
      .rpc('get_favorites_count_by_type', {
        user_uuid: userId
      })

    if (error) {
      console.error('Error getting favorites count:', error)
      return {
        video: 0,
        offer: 0,
        affiliate: 0,
        brand: 0,
        company: 0
      }
    }

    // Convert array response to object
    const counts: FavoriteCountsByType = {
      video: 0,
      offer: 0,
      affiliate: 0,
      brand: 0,
      company: 0
    }

    if (data && Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item.item_type && item.count) {
          counts[item.item_type as FavoriteType] = Number(item.count)
        }
      })
    }

    return counts
  }

  /**
   * Clear all favorites of a specific type
   */
  static async clearFavoritesByType(userId: string, itemType: FavoriteType): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_type', itemType)

    if (error) {
      throw new Error(`Không thể xóa danh sách yêu thích: ${error.message}`)
    }
  }

  /**
   * Clear all favorites
   */
  static async clearAllFavorites(userId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)

    if (error) {
      throw new Error(`Không thể xóa tất cả yêu thích: ${error.message}`)
    }
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(
    userId: string, 
    itemType: FavoriteType, 
    itemId: string, 
    itemData: any
  ): Promise<{ isFavorited: boolean }> {
    const isCurrentlyFavorited = await this.isFavorited(userId, itemType, itemId)

    if (isCurrentlyFavorited) {
      await this.removeFavorite(userId, itemType, itemId)
      return { isFavorited: false }
    } else {
      await this.addFavorite(userId, {
        item_type: itemType,
        item_id: itemId,
        item_data: itemData
      })
      return { isFavorited: true }
    }
  }
}