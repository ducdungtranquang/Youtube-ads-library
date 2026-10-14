import { NextRequest, NextResponse } from "next/server";

const SEARCH_API_URL = (process.env.SEARCH_API_URL || "http://192.168.100.7:5002").replace(/\/+$/, "");
const INTERNAL_SECRET_HEADER = "x-fb-internal-token";
const INTERNAL_SECRET_VALUE = process.env.INTERNAL_API_TOKEN || "fb-analyzer-secret-2026";

export async function GET(request: NextRequest) {
  try {
    const queryString = request.nextUrl.searchParams.toString();
    const targetUrl = `${SEARCH_API_URL}/api/ads/search${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        [INTERNAL_SECRET_HEADER]: INTERNAL_SECRET_VALUE,
      },
      signal: AbortSignal.timeout(10000), // 10 giây timeout tránh treo giao diện
    });

    const data = await res.json().catch(() => ({ success: false, error: "Invalid proxy response" }));

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    const isTimeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    const errorMessage = isTimeout
      ? `Không thể kết nối tới Backend Search (${SEARCH_API_URL}): Hết thời gian chờ (Timeout 10s). Vui lòng kiểm tra lại địa chỉ IP/Port.`
      : `Lỗi kết nối Backend Search (${SEARCH_API_URL}): ${error?.message || "Proxy request failed"}`;

    console.error("Facebook ads proxy error:", error);
    return NextResponse.json({ success: false, message: errorMessage, error: errorMessage }, { status: 500 });
  }
}

