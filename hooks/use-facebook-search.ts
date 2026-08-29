import { supabase } from "@/lib/supabase";
import { useState, useCallback } from "react";

// Định nghĩa Interface mới khớp với các Query Filters của searchApi (Express + MongoDB)
interface FacebookSearchFilters {
  text?: string;
  country?: string;
  date_from?: string;
  date_to?: string;
  min_score?: string;
  max_score?: string;
  level?: string;
  page?: number;
  limit?: number;
  // Các trường mới được thêm vào từ BE
  estimated_spend?: string; // Dạng chuỗi, ví dụ: "LOW,MEDIUM"
  min_trending_score?: string;
  funnel?: string; // Dạng chuỗi, ví dụ: "TOF,MOF"
  scaling_level?: string;

  /* --- CÁC FILTER CŨ TẠM KHÔNG DÙNG ĐẾN ---
  per_page?: number;
  show_total_count?: boolean;
  sort_by?: string;
  format?: string[];
  cta?: string[];
  ecom_platform?: string[];
  countries?: string[];
  creation_date?: string[];
  total_ads?: string[];
  age?: number[];
  is_active?: boolean;
  ----------------------------------------- */
}

interface FacebookSearchResult {
  success: boolean;
  data?: any[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  error?: string;
}

export function useFacebookAdsSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  /**
   * Hàm gọi API tìm kiếm Ads qua NextJS wrapper route
   */
  const searchFacebookAds = useCallback(
    async ({ queryString }: { queryString: string }): Promise<FacebookSearchResult> => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Nếu không có session hoặc token của user đã hết hạn, chặn ngay lập tức tại Client
        if (sessionError || !session?.access_token) {
          const authErrMsg = "Yêu cầu đăng nhập. Vui lòng đăng nhập lại để tìm kiếm.";
          setError(authErrMsg);
          setLoading(false);
          return { success: false, error: authErrMsg };
        }
        
        // Gọi route NextJS nội bộ để ẩn endpoint thật và kèm xác thực server-side
        const res = await fetch(`/api/search/facebook-ads?${queryString}`, {
          method: "GET",
        });

        // Xử lý chặn lỗi hệ thống (Ví dụ: 403 Forbidden do thiếu hoặc sai token)
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData?.message || `Tìm kiếm thất bại (Status: ${res.status})`;
          setError(errMsg);
          setLoading(false);
          return { success: false, error: errMsg };
        }

        const result = await res.json();

        const normalized = (() => {
          if (Array.isArray(result)) {
            return {
              success: true,
              data: result,
              pagination: { total: result.length, page: 1, limit: result.length, pages: 1 },
            };
          }

          if (result?.success) {
            const responseData = result.data ?? result.ads ?? result.videos ?? [];
            if (Array.isArray(responseData)) {
              return {
                success: true,
                data: responseData,
                pagination: result.pagination || result.data?.pagination,
              };
            }

            if (responseData?.ads && Array.isArray(responseData.ads)) {
              return {
                success: true,
                data: responseData.ads,
                pagination: responseData.pagination || result.pagination,
              };
            }

            if (responseData?.videos && Array.isArray(responseData.videos)) {
              return {
                success: true,
                data: responseData.videos,
                pagination: responseData.pagination || result.pagination,
              };
            }

            if (responseData?.results && Array.isArray(responseData.results)) {
              return {
                success: true,
                data: responseData.results,
                pagination: responseData.pagination || result.pagination,
              };
            }

            return {
              success: true,
              data: Array.isArray(result.data) ? result.data : [result.data],
              pagination: result.pagination || result.data?.pagination,
            };
          }

          if (Array.isArray(result?.data)) {
            return {
              success: true,
              data: result.data,
              pagination: result.pagination || result.data?.pagination,
            };
          }

          if (Array.isArray(result?.ads)) {
            return {
              success: true,
              data: result.ads,
              pagination: result.pagination || result.data?.pagination,
            };
          }

          if (Array.isArray(result?.videos)) {
            return {
              success: true,
              data: result.videos,
              pagination: result.pagination || result.data?.pagination,
            };
          }

          return {
            success: false,
            error: result?.message || "Dữ liệu trả về không hợp lệ",
          };
        })();

        if (!normalized.success) {
          setError(normalized.error);
          setLoading(false);
          return normalized;
        }

        setData(normalized.data);
        setLoading(false);
        return normalized;

      } catch (err: any) {
        const errorString = err?.message || "Không thể kết nối tới API Search Server";
        setError(errorString);
        setLoading(false);
        return { success: false, error: errorString };
      }
    },
    []
  );

  return {
    searchFacebookAds,
    loading,
    error,
    data,
    clearError: () => setError(null),
  };
}