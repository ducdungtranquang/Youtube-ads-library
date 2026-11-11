export interface WinningProduct {
  _id?: string;
  domain: string;
  title: string;
  product_score: number;
  winning_ads: number;
  total_ads: number;
  created_at?: string;
  updated_at?: string;
  category?: string;
  thumbnail_r2?: string;
  landing_url?: string;
  platform?: string;
  product_key?: string;
}

export interface ProductAd {
  ad_archive_id: string;
  ad_library_url: string;
  text: string;
  score: number;
  level?: number;
  estimated_spend_usd?: number;
  thumbnail_r2?: string;
  start_date?: string;
  last_seen?: string | number;
  images?: Array<{
    resized_image_url?: string;
    original_image_url?: string;
  }>;
  videos?: Array<{
    video_hd_url?: string;
    video_sd_url?: string;
    thumbnail_url?: string;
  }>;
}

export interface ProductDetail extends WinningProduct {
  top_ads: ProductAd[];
}

export interface MonthlyWinnerItem {
  domain: string;
  title: string;
  days_won: number;
  total_product_score: number;
  total_winning_ads: number;
  best_rank: number;
  latest_score: number;
}

export interface DailyTopItem {
  domain: string;
  title: string;
  product_score: number;
}

export interface ProductSearchParams {
  q?: string;
  domain?: string;
  min_product_score?: number | string;
  min_winning_ads?: number | string;
  min_total_ads?: number | string;
  sort_by?: "product_score" | "winning_ads" | "total_ads";
  sort_order?: "1" | "-1" | 1 | -1;
  page?: number;
  limit?: number;
}

export interface ProductPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductsSearchResponse {
  success: boolean;
  pagination: ProductPagination;
  data: WinningProduct[];
  message?: string;
  cached?: boolean;
}

export interface MonthlyWinnersResponse {
  success: boolean;
  mode: "month" | "day";
  month?: string;
  day?: string;
  pagination: ProductPagination;
  data: MonthlyWinnerItem[];
  daily_top?: Record<string, DailyTopItem>;
  message?: string;
  cached?: boolean;
}

export interface ProductDetailResponse {
  success: boolean;
  data?: ProductDetail;
  message?: string;
  cached?: boolean;
}

