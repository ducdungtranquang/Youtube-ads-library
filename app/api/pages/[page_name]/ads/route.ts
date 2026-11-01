import { NextRequest, NextResponse } from "next/server";
import { facebookAdsCache } from "@/lib/cache/facebook-ads-cache";

const SEARCH_API_URL = (process.env.SEARCH_API_URL || "http://192.168.0.125:80").replace(/\/+$/, "");
const INTERNAL_SECRET_HEADER = "x-fb-internal-token";
const INTERNAL_SECRET_VALUE = process.env.INTERNAL_API_TOKEN || "fb-analyzer-secret-2026";

interface RouteParams {
  params: Promise<{
    page_name: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const rawPageName = resolvedParams.page_name;

    if (!rawPageName) {
      return NextResponse.json(
        { success: false, message: "Thiếu tên Fanpage (page_name)" },
        { status: 400 }
      );
    }

    const decodedPageName = decodeURIComponent(rawPageName);
    const searchParams = request.nextUrl.searchParams;

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);
    // 🔒 Bắt buộc giới hạn tối đa 20 items / page (limit <= 20)
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10) || 20;
    const limit = Math.min(Math.max(rawLimit, 1), 20);

    // ⚡ Kiểm tra Cache 10 giờ tại tầng Next.js
    const cacheKey = facebookAdsCache.createPageAdsKey(decodedPageName, page, limit);
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

    const timeoutMs = Number(process.env.BACKEND_TIMEOUT_MS) || 60000;
    const headers = { [INTERNAL_SECRET_HEADER]: INTERNAL_SECRET_VALUE };

    // 🌐 Bước 1: Thử gọi endpoint chuyên biệt của Page
    let targetUrl = `${SEARCH_API_URL}/api/pages/${encodeURIComponent(decodedPageName)}/ads?page=${page}&limit=${limit}`;
    let res = await fetch(targetUrl, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    }).catch(() => null);

    let data = res ? await res.json().catch(() => null) : null;

    // 🔄 Bước 2: Graceful Fallback sang endpoint search theo page_name nếu endpoint trên chưa deploy trên remote
    if (!res || !res.ok || !data?.success) {
      const fallbackUrl = `${SEARCH_API_URL}/api/ads/search?page_name=${encodeURIComponent(decodedPageName)}&page=${page}&limit=${limit}`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      }).catch(() => null);

      if (fallbackRes) {
        const fallbackData = await fallbackRes.json().catch(() => null);
        if (fallbackRes.ok && fallbackData?.success) {
          res = fallbackRes;
          data = fallbackData;
        }
      }
    }

    if (!data) {
      data = { success: false, error: "Không nhận được phản hồi hợp lệ từ backend search" };
    }

    // Lưu vào Cache 10 giờ nếu thành công
    if (res?.ok && data?.success) {
      await facebookAdsCache.set(cacheKey, data);
    }

    return NextResponse.json(data, {
      status: res?.status || 500,
      headers: {
        "X-Cache": "MISS",
      },
    });
  } catch (error: any) {
    const isTimeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    const errorMessage = isTimeout
      ? `Hết thời gian chờ phản hồi từ máy chủ khi lấy danh sách ads của page (Timeout > 60s).`
      : `Lỗi kết nối Backend Search: ${error?.message || "Proxy request failed"}`;

    console.error("Facebook page ads proxy error:", error);
    return NextResponse.json({ success: false, message: errorMessage, error: errorMessage }, { status: 500 });
  }
}
