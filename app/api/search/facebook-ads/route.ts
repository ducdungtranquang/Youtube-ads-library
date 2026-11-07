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

    // 🔒 Chống crawl: Giới hạn số trang duyệt tối đa 50 trang - an toàn fallback về trang 1 thay vì chặn lỗi
    const MAX_SEARCH_PAGES = 50;
    const rawPage = parseInt(searchParams.get("page") || "1", 10);
    const safePage = isNaN(rawPage) || rawPage < 1 || rawPage > MAX_SEARCH_PAGES ? 1 : rawPage;
    searchParams.set("page", String(safePage));

    // 🔒 Giới hạn độ dài từ khóa tối đa 100 ký tự để chống DoS và lỗi regex
    const rawText = searchParams.get("text");
    if (rawText) {
      const safeText = rawText.trim().slice(0, 100);
      if (safeText) {
        searchParams.set("text", safeText);
      } else {
        searchParams.delete("text");
      }
    }

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

    const timeoutMs = Number(process.env.BACKEND_TIMEOUT_MS) || 25000; // 25 giây timeout
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

    // Nếu Backend trả về lỗi (404/500 do từ khóa không tồn tại hoặc lỗi Mongo), fallback an toàn về empty results (total: 0)
    if (!res.ok) {
      const emptyFallback = {
        success: true,
        data: [],
        pagination: { total: 0, page: safePage, limit: safeLimit, pages: 1 },
        message: data?.message || "Không tìm thấy quảng cáo nào phù hợp",
      };
      return NextResponse.json(emptyFallback, { status: 200 });
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
      ? `Hết thời gian chờ phản hồi từ máy chủ phân tích (> 25s). Vui lòng thử lại với từ khóa ngắn hơn.`
      : `Lỗi kết nối Backend Search: ${error?.message || "Proxy request failed"}`;

    console.warn("Facebook ads proxy fallback on error:", errorMessage);
    // Trả về empty result khi lỗi kết nối để đảm bảo Empty State hiển thị thay vì sập giao diện
    return NextResponse.json(
      {
        success: true,
        data: [],
        pagination: { total: 0, page: 1, limit: 20, pages: 1 },
        error: errorMessage,
        message: errorMessage,
      },
      { status: 200 }
    );
  }
}
