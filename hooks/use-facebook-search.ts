import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface FacebookSearchFilters {
  page?: number;
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
}

interface FacebookSearchResult {
  success: boolean;
  data?: any;
  error?: string;
  pending?: boolean;
  cacheId?: string;
}

export function useFacebookAdsSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);

  const searchFacebookAds = useCallback(
    async (filters: FacebookSearchFilters): Promise<FacebookSearchResult> => {
      setLoading(true);
      setError(null);
      setStatus(null);
      setData(null);
      try {
        // Get current session for authentication
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.access_token) {
          setError("Authentication required. Please log in again.");
          setLoading(false);
          return { success: false, error: "Authentication required. Please log in again." };
        }
        const res = await fetch("/api/search/facebook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(filters),
        });
        if (!res.ok) {
          const errData = await res.json();
          setError(errData?.error || "Search failed");
          setLoading(false);
          return { success: false, error: errData?.error || "Search failed" };
        }
        const result = await res.json();
        // If Minea returns pending, handle polling (not implemented here)
        if (result.status === "pending") {
          setStatus("pending");
          setLoading(false);
          return { success: true, pending: true, cacheId: result.cacheId };
        }
        setData(result);
        setLoading(false);
        return { success: true, data: result };
      } catch (err) {
        setError("Search failed");
        setLoading(false);
        return { success: false, error: "Search failed" };
      }
    },
    []
  );

  return {
    searchFacebookAds,
    loading,
    error,
    data,
    status,
    clearError: () => setError(null),
  };
}
