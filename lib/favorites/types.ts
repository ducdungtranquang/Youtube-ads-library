// Favorites system types and utilities

export type FavoriteType = 'video' | 'offer' | 'affiliate' | 'brand' | 'company' | 'facebook_ad'

export interface FavoriteItem {
  id: string
  user_id: string
  item_type: FavoriteType
  item_id: string
  item_data: any
  created_at: string
  updated_at: string
}

// Video favorite data structure
export interface VideoFavoriteData {
  title: string
  channel: string
  views: string
  ctr: string
  date: string
  thumbnail: string
  url?: string
  ytVideoId?: string
  description?: string
  duration?: string
  companyName?: string
}

// Offer favorite data structure
export interface OfferFavoriteData {
  name: string
  network: string
  vertical: string
  payout: string
  epc: string
  countries: string[]
  totalVideos: number
  description?: string
  landingPageUrl?: string
}

// Affiliate favorite data structure
export interface AffiliateFavoriteData {
  name: string
  channelUrl: string
  totalVideos: number
  totalViews: string
  successRate: string
  topOffers: string[]
  avatar: string
  description?: string
}

// Brand favorite data structure
export interface BrandFavoriteData {
  name: string
  thumbnail: string
  description: string
  categoryId: number
  totalCreatives: number
  totalViews: number
  totalSpend?: number
}

// Company favorite data structure
export interface CompanyFavoriteData {
  name: string
  description: string
  legalName?: string
  companyId: string
  isAffiliate: boolean
  totalVideos?: number
  totalSpend?: number
  thumbnail?: string
}

// Request/Response types
export interface AddFavoriteRequest {
  item_type: FavoriteType
  item_id: string
  item_data: VideoFavoriteData | OfferFavoriteData | AffiliateFavoriteData | BrandFavoriteData | CompanyFavoriteData
}

export interface FavoriteCountsByType {
  video: number
  offer: number
  affiliate: number
  brand: number
  company: number
}

export interface FavoritesResponse {
  favorites: FavoriteItem[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Utility functions
export const getFavoriteDisplayName = (type: FavoriteType): string => {
  switch (type) {
    case 'video':
      return 'Video yêu thích'
    case 'offer':
      return 'Offer yêu thích'
    case 'affiliate':
      return 'Affiliate yêu thích'
    case 'brand':
      return 'Thương hiệu yêu thích'
    case 'company':
      return 'Doanh nghiệp yêu thích'
    default:
      return 'Yêu thích'
  }
}

export const getFavoriteIcon = (type: FavoriteType): string => {
  switch (type) {
    case 'video':
      return 'Video'
    case 'offer':
      return 'DollarSign'
    case 'affiliate':
      return 'Users'
    case 'brand':
      return 'Building2'
    case 'company':
      return 'Building'
    default:
      return 'Heart'
  }
}

export const validateFavoriteData = (type: FavoriteType, data: any): boolean => {
  switch (type) {
    case 'video':
      return !!(data.title && data.channel && data.thumbnail)
    case 'offer':
      return !!(data.name && data.network && data.vertical)
    case 'affiliate':
      return !!(data.name && data.channelUrl)
    case 'brand':
      return !!(data.name && data.thumbnail)
    case 'company':
      return !!(data.name && data.companyId)
    case 'facebook_ad':
      // Minimal validation: require id and page_name
      return !!(data.id && data.page_name)
    default:
      return false
  }
}