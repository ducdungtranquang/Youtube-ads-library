// Types for MKT Search API integration with VidTao

export interface VidTaoVideoResult {
  ytVideoId: string
  isSwiped: boolean
  title: string
  duration: number
  description: string | null
  thumbnail: string
  publishedAt: string
  totalSpend: number
  is_unlisted: boolean
  language: string
  category: number | null
  last30Days: number
  last90Days: number
  affiliateOfferId: string | null
  brandName: string
  brandId: number
  similarity_score: number | null
  qdrant_data: {
    category_id: number | null
    language: string
    is_unlisted: boolean
    duration: number
  } | null
  summary_data: {
    yt_video_id: string
    last_30: number
    last_60: number
    last_90: number
    total: number
    category_id: number
    language: string
    listed: number
    duration: number
    title: string
    frame: string
    brand_name: string
    brand_id: number
    published_at: string
    updated_at: string
  }
  swiped_data: any | null
}

export interface VidTaoSearchResponse {
  success: boolean
  search_type: string
  keyword: string
  total_results: number
  total_available: number
  qdrant_matches: number
  external_matches: number
  external_matches_used: number
  external_service_used: boolean
  clickhouse_matches: number
  swiped_matches: number
  parameters: {
    search_filters: {
      category_id: number[]
      language: string
      is_unlisted: boolean | null
      duration_range: {
        min: number | null
        max: number | null
      }
      date_range: {
        from: string | null
        to: string | null
      }
    }
    search_term_analysis: {
      word_count: number
      total_length: number
      should_use_external: boolean
    }
    similarityThreshold: number
    clickhouse_ordering: {
      order_by: string
      order_direction: string
    }
    limit: number
    userId: string
    dateFrom?: string
    dateTo?: string
  }
  timing: {
    total_ms: number
    parallel_execution_ms: number
    embedding_ms: number
    qdrant_search_ms: number
    clickhouse_query_ms: number
    swiped_videos_query_ms: number
    external_service_ms: number
  }
  data: {
    hasMore: boolean
    results: VidTaoVideoResult[]
  }
}

export interface MKTSearchFilters {
  countryId?: number
  language?: string
  categoryIds?: number[]
  dateFrom?: string
  dateTo?: string
  showVideos?: 'unlisted' | 'all' | 'public'
  sortProp?: 'date' | 'totalSpend' | 'views' | 'relevance'
  orderAsc?: boolean
}

export interface MKTSearchParams {
  searchTerm: string
  page?: number
  limit?: number
  filters?: MKTSearchFilters
}

export interface MKTSearchResponse {
  success: boolean
  search_type: string
  keyword: string
  total_results: number
  total_available: number
  qdrant_matches?: number
  external_matches?: number
  external_matches_used?: number
  external_service_used?: boolean
  clickhouse_matches?: number
  swiped_matches?: number
  parameters?: any
  timing?: {
    total_ms: number
    parallel_execution_ms: number
    embedding_ms: number
    qdrant_search_ms: number
    clickhouse_query_ms: number
    swiped_videos_query_ms: number
    external_service_ms: number
  }
  data: {
    hasMore: boolean
    results: TransformedVideoResult[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNextPage: boolean
    }
  }
}

export interface TransformedVideoResult {
  ytVideoId: string
  title: string
  description: string | null
  thumbnail: string
  duration: number
  publishedAt: string
  totalSpend: number
  is_unlisted: boolean
  language: string
  category: number | null
  last30Days: number
  last90Days: number
  brandName: string
  brandId: number
  similarity_score: number | null
  // Additional transformed fields for UI compatibility
  firstSeen: string
  lastSeen: string
  views: number // Using totalSpend as proxy
  channel: string
  url: string
  companyName: string
}