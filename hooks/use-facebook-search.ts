import { supabase } from "@/lib/supabase";
import { useState, useCallback, useRef } from "react";

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
  filter?: string; //  preset: new_ads | ready_to_scale | weekly_winner
  is_active?: boolean | string;
  page_name?: string;
  domain?: string;
  sort_by?: string;
  sort_order?: number | string;

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

  // Tham chiếu lưu AbortController và ID của request tìm kiếm gần nhất (chống race condition khi đổi filter liên tục)
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  /**
   * Hàm gọi API tìm kiếm Ads qua NextJS wrapper route
   */
  const searchFacebookAds = useCallback(
    async ({ queryString }: { queryString: string }): Promise<FacebookSearchResult> => {
      // 1. Huỷ bỏ request tìm kiếm trước đó nếu vẫn còn đang xử lý dở
      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }
      const controller = new AbortController();
      activeAbortControllerRef.current = controller;

      // 2. Tăng số thứ tự request
      const currentRequestId = ++latestRequestIdRef.current;

      setLoading(true);
      setError(null);

      // Timeout 25 giây phía client để tránh giao diện bị treo vĩnh viễn khi mạng hoặc backend chậm
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 25000);

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        // Nếu không có session hoặc token của user đã hết hạn, chặn ngay lập tức tại Client
        if (sessionError || !session?.access_token) {
          clearTimeout(timeoutId);
          const authErrMsg = "Yêu cầu đăng nhập. Vui lòng đăng nhập lại để tìm kiếm.";
          if (currentRequestId === latestRequestIdRef.current) {
            setError(authErrMsg);
          }
          return { success: false, error: authErrMsg };
        }

        // Gọi route NextJS nội bộ để ẩn endpoint thật và kèm xác thực server-side
        const res = await fetch(`/api/search/facebook-ads?${queryString}`, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Nếu đã có request mới hơn được gửi trong lúc chờ, bỏ qua request này
        if (currentRequestId !== latestRequestIdRef.current) {
          return { success: false, error: "Stale request cancelled" };
        }

        // Xử lý chặn lỗi hệ thống (Ví dụ: 403 Forbidden do thiếu hoặc sai token)
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData?.message || `Tìm kiếm thất bại (Status: ${res.status})`;
          if (currentRequestId === latestRequestIdRef.current) {
            setError(errMsg);
          }
          return { success: false, error: errMsg };
        }

        const result = await res.json();
        if (currentRequestId !== latestRequestIdRef.current) {
          return { success: false, error: "Stale request cancelled" };
        }

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

        if (currentRequestId === latestRequestIdRef.current) {
          if (!normalized.success) {
            setError(normalized.error);
          } else {
            setData(normalized.data);
          }
        }

        return normalized;

      } catch (err: any) {
        clearTimeout(timeoutId);

        // Nếu có request mới hơn đang chạy, bỏ qua request cũ đã huỷ
        if (currentRequestId !== latestRequestIdRef.current) {
          return { success: false, error: "Stale request cancelled" };
        }

        const isTimeout = err?.name === "AbortError" && controller.signal.aborted;
        const errorString = isTimeout
          ? "Hết thời gian chờ phản hồi tìm kiếm (timeout). Vui lòng thử lại với từ khóa hoặc bộ lọc ngắn hơn."
          : err?.message || "Không thể kết nối tới API Search Server";

        setError(errorString);
        return { success: false, error: errorString };
      } finally {
        if (currentRequestId === latestRequestIdRef.current) {
          setLoading(false);
        }
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