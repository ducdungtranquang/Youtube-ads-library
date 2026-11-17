import { NextRequest, NextResponse } from "next/server";
import { facebookAdsCache } from "@/lib/cache/facebook-ads-cache";
import { serverRateLimiter } from "@/lib/server-rate-limiter";

const SEARCH_API_URL = (process.env.SEARCH_API_URL || "http://192.168.0.125:80").replace(/\/+$/, "");
const INTERNAL_SECRET_HEADER = "x-fb-internal-token";
const INTERNAL_SECRET_VALUE = process.env.INTERNAL_API_TOKEN || "fb-analyzer-secret-2026";

interface RouteParams {
  params: Promise<{
    domain: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 🛡️ Rate limit: Giới hạn tối đa 60 requests / phút / IP
    const rateLimitResult = serverRateLimiter.check(request, {
      prefix: "fb-product-detail",
      windowMs: 60 * 1000,
      maxRequests: 60,
    });
    if (!rateLimitResult.allowed) {
      return serverRateLimiter.createTooManyRequestsResponse(rateLimitResult);
    }

    const { domain } = await params;
    const queryProductKey = request.nextUrl.searchParams.get("product_key");
    const rawTarget = queryProductKey?.trim() || domain?.trim();
    if (!rawTarget) {
      return NextResponse.json(
        { success: false, message: "Missing product domain or product_key parameter." },
        { status: 400 }
      );
    }

    let decodedTarget = rawTarget;
    try {
      decodedTarget = decodeURIComponent(rawTarget).trim();
    } catch {}

    // ⚡ Kiểm tra Cache 10 giờ tại tầng Next.js theo unique product_key hoặc domain
    const cacheKey = facebookAdsCache.createProductDetailKey(decodedTarget);
    const cachedEntry = await facebookAdsCache.get<unknown>(cacheKey);

    if (cachedEntry) {
      const response = NextResponse.json(
        {
          ...(cachedEntry.data as Record<string, unknown>),
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

    // Backend Express giải mã URL path 1 lần tự động trong router, sau đó lại gọi decodeURIComponent(req.params.domain) lần 2
    // Vì vậy nếu targetKey là URL chứa các ký tự mã hóa (như %7B, query params), cần encode 2 lần để khi backend giải mã 2 lần sẽ khớp chính xác product_key trong DB
    const encodedForBackend = encodeURIComponent(encodeURIComponent(decodedTarget));
    const targetUrl = `${SEARCH_API_URL}/api/products/detail/${encodedForBackend}`;

    let res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        [INTERNAL_SECRET_HEADER]: INTERNAL_SECRET_VALUE,
      },
      signal: AbortSignal.timeout(15000),
    });

    let data = await res.json().catch(() => ({
      success: false,
      error: "Không nhận được phản hồi JSON hợp lệ từ máy chủ backend",
    }));

    // Fallback: Nếu double encode không tìm thấy, thử single encode (phòng trường hợp domain thường hoặc backend khác)
    if (!res.ok || !data?.success) {
      const singleEncoded = encodeURIComponent(decodedTarget);
      if (singleEncoded !== encodedForBackend) {
        const fallbackRes = await fetch(`${SEARCH_API_URL}/api/products/detail/${singleEncoded}`, {
          method: "GET",
          headers: {
            [INTERNAL_SECRET_HEADER]: INTERNAL_SECRET_VALUE,
          },
          signal: AbortSignal.timeout(15000),
        });
        const fallbackData = await fallbackRes.json().catch(() => null);
        if (fallbackRes.ok && fallbackData?.success) {
          res = fallbackRes;
          data = fallbackData;
        }
      }
    }

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

    console.error("Facebook product detail proxy error:", error);
    return NextResponse.json(
      { success: false, message: errorMessage, error: errorMessage },
      { status: 500 }
    );
  }
}

