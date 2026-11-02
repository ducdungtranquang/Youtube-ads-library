import { NextRequest, NextResponse } from "next/server";
import { serverRateLimiter } from "@/lib/server-rate-limiter";

const SEARCH_API_URL = (process.env.SEARCH_API_URL || "http://192.168.0.125:80").replace(/\/+$/, "");
const INTERNAL_SECRET_HEADER = "x-fb-internal-token";
const INTERNAL_SECRET_VALUE = process.env.INTERNAL_API_TOKEN || "fb-analyzer-secret-2026";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🛡️ Rate limit: Giới hạn tối đa 60 lượt xem chi tiết / phút / IP
    const rateLimitResult = serverRateLimiter.check(request, {
      prefix: "fb-ad-detail",
      windowMs: 60 * 1000,
      maxRequests: 60,
    });
    if (!rateLimitResult.allowed) {
      return serverRateLimiter.createTooManyRequestsResponse(rateLimitResult);
    }
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ad archive id parameters." },
        { status: 400 }
      );
    }

    const targetUrl = `${SEARCH_API_URL}/api/ads/detail/${encodeURIComponent(id)}`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        [INTERNAL_SECRET_HEADER]: INTERNAL_SECRET_VALUE,
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => ({ success: false, error: "Invalid proxy response" }));

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    const isTimeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    const errorMessage = isTimeout
      ? `Không thể kết nối tới Backend Search (${SEARCH_API_URL}): Hết thời gian chờ (Timeout 10s).`
      : `Lỗi kết nối Backend Search: ${error?.message || "Proxy request failed"}`;

    console.error("Facebook ad detail proxy error:", error);
    return NextResponse.json({ success: false, message: errorMessage, error: errorMessage }, { status: 500 });
  }
}

