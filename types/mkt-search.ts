// Types for MKT Search API integration with VidTao

export interface VideoEnrichment {
  production_style?: string
  similarweb_category?: string
  dr_niche?: string
  dr_niche_confidence?: string
  dr_niche_reasoning?: string
  ad_objective_type?: string
  funnel_stage?: string
  ad_objective_reasoning?: string
  target_awareness_level?: string
  hook_type?: string
  hook_verbatim_text?: string
  hook_visual_element?: string
  hook_technique?: string
  hook_confidence?: string
  primary_pain_point?: string
  primary_benefit?: string
  proof_type?: string
  emotional_appeal?: string
  cta_type?: string
  cta_verbatim_text?: string
  cta_urgency_language?: string
  cta_offer_details?: string
  presenter_type?: string
  presenter_gender?: string
  presenter_appearance?: string
  presenter_speaking_style?: string
  music_style?: string
  setting_primary_location?: string
  setting_details?: string
  target_demographic?: string
  target_psychographic?: string
  summary?: string
  secondary_pain_points?: string[]
  persuasion_techniques?: string[]
  dr_signals?: string[]
  brand_signals?: string[]
  has_text_overlays?: number
  has_face?: number
  has_product_shot?: number
  is_talking_head?: number
  has_before_after?: number
  has_screen_recording?: number
  has_b_roll?: number
  cta_urgency?: number
  has_voiceover?: number
  has_music?: number
  has_sound_effects?: number
  primary_language?: string
  orientation?: string
  orientation_ai?: string
  cta_offer_type?: string
  cta_types?: string[]
}

export interface BrandEnrichment {
  brand_id?: number
  dominant_similarweb_category?: string
  dominant_dr_niche?: string
  dominant_ad_objective?: string
  dominant_funnel_stage?: string
  dominant_awareness_level?: string
  brand_archetype?: string
  similarweb_category_confidence?: number
  dr_niche_confidence?: number
  pct_has_text_overlays?: number
  pct_has_face?: number
  pct_has_product_shot?: number
  pct_is_talking_head?: number
  pct_has_before_after?: number
  pct_has_voiceover?: number
  creative_consistency_score?: number
  ads_analyzed_count?: number
  ads_with_category?: number
  ads_with_niche?: number
  similarweb_category_distribution?: Record<string, number>
  dr_niche_distribution?: Record<string, number>
  dominant_hook_types?: Array<{ pct: number; type: string; count: number }>
  dominant_production_styles?: Array<{ pct: number; type: string; count: number }>
  dominant_cta_types?: Array<{ pct: number; type: string; count: number }>
  ad_objective_distribution?: Record<string, number>
  funnel_stage_distribution?: Record<string, number>
  awareness_level_distribution?: Record<string, number>
  dominant_presenter_types?: Array<{ pct: number; type: string; count: number }>
  common_pain_points?: Array<{ count: number; pain_point: string }>
  common_benefits?: Array<{ count: number; benefit: string }>
  common_persuasion_techniques?: Array<{ count: number; technique: string }>
  last_analyzed_at?: string
  source_created_at?: string
  source_updated_at?: string
}

export interface VidTaoBrandResult {
  brandId: number
  isSwiped: boolean
  enrichment?: BrandEnrichment | null
  adsLaunched30d?: number
  totalAds?: number
  advertising_since?: string
  name: string
  description?: string | null
  thumbnail?: string
  countryId?: number
  categoryId?: number
  totalSpend?: number
  averageVideoDuration?: number
  similarity_score?: number | null
  qdrant_data?: any | null
  summary_data?: any
  swiped_data?: any | null
}

export interface VidTaoVideoResult {
  ytVideoId: string
  isSwiped: boolean
  title: string
  duration: number
  orientation?: number
  description: string | null
  thumbnail?: string
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
  days_running?: number
  is_active?: boolean
  refreshed_at?: string
  similarity_score: number | null
  qdrant_data: {
    category_id: number | null
    language: string
    is_unlisted: boolean
    duration: number
  } | null
  summary_data: {
    yt_video_id?: string
    last_30: number
    last_60: number
    last_90: number
    total: number
    category_id: number
    language: string
    listed: number
    duration: number
    title: string
    frame?: string
    brand_name: string
    brand_id: number
    published_at: string
    updated_at: string
    orientation?: number
  }
  enrichment?: VideoEnrichment | null
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
  sortProp?: 'date' | 'totalSpend' | 'views' | 'relevance' | 'total' | string
  orderAsc?: boolean
  orientation?: number
  durationRanges?: Array<{ min?: number | null; max?: number | null }>
}

export interface MKTSearchParams {
  searchTerm: string
  page?: number
  limit?: number
  filters?: MKTSearchFilters
  orientation?: number
  durationRanges?: Array<{ min?: number | null; max?: number | null }>
  sortProp?: string
  orderAsc?: boolean
  countryId?: number
  language?: string
  categoryIds?: number[]
  dateFrom?: string
  dateTo?: string
  showVideos?: string
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
  // New Enriched & Extended Fields
  orientation?: number
  days_running?: number
  is_active?: boolean
  refreshed_at?: string | null
  enrichment?: VideoEnrichment | null
  summary_data?: any
  // Additional transformed fields for UI compatibility
  firstSeen: string
  lastSeen: string
  views: number // Using totalSpend as proxy
  channel: string
  url: string
  companyName: string
}