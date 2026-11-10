import { NextRequest, NextResponse } from "next/server";
import { facebookAdsCache } from "@/lib/cache/facebook-ads-cache";
import { serverRateLimiter } from "@/lib/server-rate-limiter";

const SEARCH_API_URL = (process.env.SEARCH_API_URL || "http://192.168.0.125:80").replace(/\/+$/, "");
const INTERNAL_SECRET_HEADER = "x-fb-internal-token";
const INTERNAL_SECRET_VALUE = process.env.INTERNAL_API_TOKEN || "fb-analyzer-secret-2026";

export async function GET(request: NextRequest) {
  try {
    // 🛡️ Rate limit: Giới hạn tối đa 60 requests / phút / IP
    const rateLimitResult = serverRateLimiter.check(request, {
      prefix: "fb-monthly-winners",
      windowMs: 60 * 1000,
      maxRequests: 60,
    });
    if (!rateLimitResult.allowed) {
      return serverRateLimiter.createTooManyRequestsResponse(rateLimitResult);
    }

    const searchParams = request.nextUrl.searchParams;
    const day = searchParams.get("day")?.trim() || "";
    const month = searchParams.get("month")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const limit = parseInt(searchParams.get("limit") || "50", 10) || 50;

    const cacheIdentifier = day ? day : (month || "current");
    const mode = day ? "day" : "month";

    // ⚡ Kiểm tra Cache 10 giờ tại tầng Next.js
    const cacheKey = facebookAdsCache.createMonthlyWinnersKey(cacheIdentifier, mode, page, limit);
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

    const targetUrl = `${SEARCH_API_URL}/api/products/monthly-winners?${searchParams.toString()}`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        [INTERNAL_SECRET_HEADER]: INTERNAL_SECRET_VALUE,
      },
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json().catch(() => ({
      success: false,
      error: "Không nhận được phản hồi JSON hợp lệ từ máy chủ backend",
    }));

    // Lưu vào Cache 10 giờ nếu thành công
    if (res.ok && data?.success) {
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
      ? `Không thể kết nối tới Backend Search (${SEARCH_API_URL}): Hết thời gian chờ (Timeout 15s).`
      : `Lỗi kết nối Backend Search: ${error?.message || "Proxy request failed"}`;

    console.error("Facebook monthly winners proxy error:", error);
    return NextResponse.json(
      { success: false, message: errorMessage, error: errorMessage },
      { status: 500 }
    );
  }
}

