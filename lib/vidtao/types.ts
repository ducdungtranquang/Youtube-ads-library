// VidTao Types and Interfaces

export interface VidTaoAccount {
  id: string
  email: string
  password: string
  token?: string
  refreshToken?: string
  tokenExpiry?: number
  lastUsed: number
  requestCount: number
  isBlocked: boolean
  blockUntil?: number
}

export interface VidTaoResponse {
  success: boolean
  data?: any
  error?: string
  account?: string
}

export interface QuickSearchParams {
  affiliateCountryId?: number
  affiliateNetworkIds?: number[]
  categoryIds?: number[]
  countryId?: number
  dateFrom?: string
  dateTo?: string
  isAffiliate?: boolean
  language?: string
  searchTerm?: string
  page?: number
  sortBy?: string
  videoType?: string
  ytVideoId?: string
  limit?: number
  showVideos?: string
  orderAsc?: boolean
  sortProp?: string
  offerIds?: number[]
  softwareIds?: number[]
}

export interface MKTSearchParams {
  searchTerm: string
  countryId?: number
  language?: string
  categoryIds?: number[]
  dateFrom?: string
  dateTo?: string
  showVideos?: string
  sortProp?: string
  orderAsc?: boolean
  limit?: number
  page?: number
}

export interface VidTaoConfig {
  TOKEN_EXPIRY_TIME: number
  REQUEST_LIMIT: number
  BLOCK_TIME: number
  VIDTAO_BASE_URL: string
  FIREBASE_AUTH_URL: string
  API_KEY: string
}