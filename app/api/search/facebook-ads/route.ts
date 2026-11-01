import { NextRequest, NextResponse } from "next/server";
import { facebookAdsCache } from "@/lib/cache/facebook-ads-cache";

const SEARCH_API_URL = (process.env.SEARCH_API_URL || "http://192.168.0.125:80").replace(/\/+$/, "");
const INTERNAL_SECRET_HEADER = "x-fb-internal-token";
const INTERNAL_SECRET_VALUE = process.env.INTERNAL_API_TOKEN || "fb-analyzer-secret-2026";

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams);

    // 🔒 Bắt buộc giới hạn tối đa 20 items / trang (limit <= 20)
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10);
    const safeLimit = Math.min(Math.max(rawLimit || 20, 1), 20);
    searchParams.set("limit", String(safeLimit));

    // ⚡ Kiểm tra Cache 10 giờ tại tầng Next.js
    const cacheKey = facebookAdsCache.createSearchKey(searchParams);
    const cachedEntry = await facebookAdsCache.get<any>(cacheKey);

    if (cachedEntry) {
      return NextResponse.json(
        {
          ...cachedEntry.data,
          cached: true,
          cached_at: cachedEntry.cachedAt,
          expires_at: cachedEntry.expiresAt,
        },
        {
          status: 200,
          headers: {
            "X-Cache": "HIT",
            "X-Cache-Expires-At": new Date(cachedEntry.expiresAt).toISOString(),
          },
        }
      );
    }

    // 🌐 Cache MISS -> Chuyển tiếp request sang Backend Search API
    const queryString = searchParams.toString();
    const targetUrl = `${SEARCH_API_URL}/api/ads/search${queryString ? `?${queryString}` : ""}`;

    const timeoutMs = Number(process.env.BACKEND_TIMEOUT_MS) || 60000; // 60 giây timeout
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        [INTERNAL_SECRET_HEADER]: INTERNAL_SECRET_VALUE,
      },
      signal: AbortSignal.timeout(timeoutMs),
    });

    const data = await res.json().catch(() => ({ success: false, error: "Invalid proxy response" }));

    // Chỉ lưu vào Cache khi Backend trả về thành công 200 và success === true
    if (res.status === 200 && data?.success) {
      await facebookAdsCache.set(cacheKey, data);
    }

    return NextResponse.json(data, {
      status: res.status,
      headers: {
        "X-Cache": "MISS",
      },
    });
  } catch (error: any) {
    const isTimeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    const errorMessage = isTimeout
      ? `Không thể kết nối tới Backend Search (${SEARCH_API_URL}): Hết thời gian chờ phản hồi từ máy chủ phân tích (Timeout > 60s). Vui lòng thử lại hoặc thu hẹp bộ lọc.`
      : `Lỗi kết nối Backend Search (${SEARCH_API_URL}): ${error?.message || "Proxy request failed"}`;

    console.error("Facebook ads proxy error:", error);
    return NextResponse.json({ success: false, message: errorMessage, error: errorMessage }, { status: 500 });
  }
}
