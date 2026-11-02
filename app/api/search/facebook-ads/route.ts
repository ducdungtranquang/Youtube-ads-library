import { NextRequest, NextResponse } from "next/server";
import { facebookAdsCache } from "@/lib/cache/facebook-ads-cache";
import { serverRateLimiter } from "@/lib/server-rate-limiter";

const SEARCH_API_URL = (process.env.SEARCH_API_URL || "http://192.168.0.125:80").replace(/\/+$/, "");
const INTERNAL_SECRET_HEADER = "x-fb-internal-token";
const INTERNAL_SECRET_VALUE = process.env.INTERNAL_API_TOKEN || "fb-analyzer-secret-2026";

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URLSearchParams(request.nextUrl.searchParams);

    // 🛡️ Rate limit: Giới hạn tối đa 35 lượt tìm kiếm / phút / IP để chống crawl
    const rateLimitResult = serverRateLimiter.check(request, {
      prefix: "fb-ads-search",
      windowMs: 60 * 1000,
      maxRequests: 35,
    });
    if (!rateLimitResult.allowed) {
      return serverRateLimiter.createTooManyRequestsResponse(rateLimitResult);
    }

    // 🔒 Bắt buộc giới hạn tối đa 20 items / trang (limit <= 20)
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10);
    const safeLimit = Math.min(Math.max(rawLimit || 20, 1), 20);
    searchParams.set("limit", String(safeLimit));

    // 🔒 Chống crawl: Giới hạn số trang duyệt tối đa 50 trang
    const MAX_SEARCH_PAGES = 50;
    const rawPage = parseInt(searchParams.get("page") || "1", 10) || 1;
    if (rawPage > MAX_SEARCH_PAGES) {
      return NextResponse.json(
        {
          success: false,
          message: `Hệ thống giới hạn tối đa ${MAX_SEARCH_PAGES} trang để ngăn chặn crawl tự động. Vui lòng kết hợp thêm bộ lọc để xem kết quả chi tiết hơn.`,
          error: "Max page limit exceeded",
        },
        { status: 400 }
      );
    }
    searchParams.set("page", String(Math.max(rawPage, 1)));

    // ⚡ Mở rộng phạm vi Ads mới lên: Chạy <= 5 ngày (khoảng 3 - 5 ngày)
    if (searchParams.get("filter") === "new_ads" && !searchParams.has("new_max_days")) {
      searchParams.set("new_max_days", "5");
    }

    // ⚡ Weekly Winner: Chỉ ads chạy 7 - 9 ngày
    if (searchParams.get("filter") === "weekly_winner") {
      if (!searchParams.has("winner_min_days")) searchParams.set("winner_min_days", "7");
      if (!searchParams.has("winner_max_days")) searchParams.set("winner_max_days", "9");
    }

    // ⚡ Ưu tiên sắp xếp theo mới nhất thay vì score
    if (!searchParams.has("sort_by") || searchParams.get("sort_by") === "score") {
      searchParams.set("sort_by", "start_date");
    }

    // ⚡ Kiểm tra Cache 10 giờ tại tầng Next.js
    const cacheKey = facebookAdsCache.createSearchKey(searchParams);
    const cachedEntry = await facebookAdsCache.get<any>(cacheKey);

    if (cachedEntry) {
      const response = NextResponse.json(
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
      return serverRateLimiter.applyHeaders(response, rateLimitResult);
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

    const response = NextResponse.json(data, {
      status: res.status,
      headers: {
        "X-Cache": "MISS",
      },
    });
    return serverRateLimiter.applyHeaders(response, rateLimitResult);
  } catch (error: any) {
    const isTimeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    const errorMessage = isTimeout
      ? `Không thể kết nối tới Backend Search (${SEARCH_API_URL}): Hết thời gian chờ phản hồi từ máy chủ phân tích (Timeout > 60s). Vui lòng thử lại hoặc thu hẹp bộ lọc.`
      : `Lỗi kết nối Backend Search (${SEARCH_API_URL}): ${error?.message || "Proxy request failed"}`;

    console.error("Facebook ads proxy error:", error);
    return NextResponse.json({ success: false, message: errorMessage, error: errorMessage }, { status: 500 });
  }
}
