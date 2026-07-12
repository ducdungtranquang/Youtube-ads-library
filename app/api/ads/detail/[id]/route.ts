import { NextRequest, NextResponse } from "next/server";

const SEARCH_API_URL = process.env.SEARCH_API_URL || "http://localhost:5002";
const INTERNAL_SECRET_HEADER = "x-fb-internal-token";
const INTERNAL_SECRET_VALUE = process.env.INTERNAL_API_TOKEN || "fb-analyzer-secret-2026";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    });

    const data = await res.json().catch(() => ({ success: false, error: "Invalid proxy response" }));

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Facebook ad detail proxy error:", error);
    return NextResponse.json({ success: false, error: "Proxy request failed" }, { status: 500 });
  }
}
