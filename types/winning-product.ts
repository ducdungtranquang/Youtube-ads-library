export type ProductPlatformType = "LANDING" | "MESSENGER" | "WHATSAPP" | "OTHER";
export type ProductPlatformFilter = "ALL" | "LANDING" | "MESSENGER" | "WHATSAPP";

export interface WinningProduct {
  id: string;
  _id?: string;
  title: string;              // Tên Hàng
  library_url?: string;       // Link Library
  landing_url?: string;       // Link Landing
  thumbnail?: string;         // Ảnh Sản Phẩm
  thumbnail_r2?: string;
  price?: string;             // Giá Sản Phẩm
  ads_running_count?: number; // Bao Nhiêu ADS Chạy
  duration_days?: string;     // Tổng Số Ngày Chạy
  scan_date?: string;         // Ngày quét
  market?: string;            // Thị trường chạy
  market_type?: "VN" | "GLOBAL";
  country_code?: string | null; // Mã cờ ISO 2 chữ số (vd: 'vn', 'us', 'de') hoặc null nếu không rõ nước
  country_name?: string;
  country_flag?: string | null; // Emoji cờ hoặc null nếu không rõ nước
  ads_spy_url?: string;       // Link Đến ADS SPY TOOL (nếu có)
  page_name?: string;         // Tên PAGE
  win_reason?: string;        // Lý do WIN
  platform_raw?: string;      // Dạng chạy gốc từ Sheet (vd: "Mess tin nhắn", "Landing", "Mess tin nhắn (WhatsApp)")
  platform_type?: ProductPlatformType; // Chuẩn hóa phân loại nền tảng
  platform_label?: string;    // Nhãn hiển thị giao diện ("Landing Page", "Messenger", "WhatsApp")

  // Legacy fields for backwards compatibility
  domain?: string;
  product_score?: number;
  winning_ads?: number;
  total_ads?: number;
  created_at?: string;
  updated_at?: string;
  category?: string;
  platform?: string;
  product_key?: string;
}

export interface ProductAd {
  ad_archive_id: string;
  ad_library_url: string;
  text: string;
  score: number;
  level?: number | string;
  estimated_spend_usd?: number;
  thumbnail_r2?: string;
  start_date?: string | number;
  last_seen?: string | number;
  product_key?: string;
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
  top_ads?: ProductAd[];
}

export interface MonthlyWinnerItem {
  product_key?: string;
  domain: string;
  title: string;
  days_won: number;
  total_product_score: number;
  total_winning_ads: number;
  best_rank: number;
  latest_score: number;
}

export interface DailyTopItem {
  product_key?: string;
  domain: string;
  title: string;
  product_score: number;
}

export interface ProductSearchParams {
  q?: string;
  domain?: string;
  market?: "ALL" | "VN" | "GLOBAL";
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
  stats?: {
    total: number;
    vn_count: number;
    global_count: number;
  };
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
  data: WinningProduct | null;
  message?: string;
  error?: string;
  cached?: boolean;
}
