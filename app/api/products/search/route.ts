import { NextRequest, NextResponse } from "next/server";
import { getWinningProductsList } from "@/lib/services/winning-products-sheet";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || searchParams.get("text") || "";
    const rawMarket = searchParams.get("market") || searchParams.get("country") || "ALL";
    const market = rawMarket.toUpperCase() as "ALL" | "VN" | "GLOBAL";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);

    const result = await getWinningProductsList({
      q,
      market: ["ALL", "VN", "GLOBAL"].includes(market) ? market : "ALL",
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 24 : limit,
    });

    return NextResponse.json(
      {
        success: true,
        data: result.items,
        pagination: result.pagination,
        stats: result.stats,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi tải danh sách Winning Products từ Google Sheets";
    console.error("[WinningProductsSearchAPI] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message,
        error: message,
        data: [],
        pagination: { total: 0, page: 1, limit: 24, pages: 1 },
      },
      { status: 500 }
    );
  }
}
