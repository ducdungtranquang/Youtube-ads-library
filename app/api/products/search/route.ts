import { NextRequest, NextResponse } from "next/server";
import { getWinningProductsList, getAllSheetWinningProducts, clearWinningProductsCache } from "@/lib/services/winning-products-sheet";
import { WinningProductSortOption } from "@/types/winning-product";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isRefresh =
      searchParams.get("refresh") === "1" ||
      searchParams.get("refresh") === "true" ||
      searchParams.get("clear") === "1" ||
      searchParams.get("clear") === "true";
    if (isRefresh) {
      clearWinningProductsCache();
      await getAllSheetWinningProducts({ forceRefresh: true });
    }

    const q = searchParams.get("q") || searchParams.get("text") || "";
    const rawMarket = searchParams.get("market") || searchParams.get("country") || "ALL";
    const market = rawMarket.toUpperCase() as "ALL" | "VN" | "GLOBAL";
    const rawPlatform = searchParams.get("platform") || "ALL";
    const platform = rawPlatform.toUpperCase() as "ALL" | "LANDING" | "MESSENGER" | "WHATSAPP";
    const rawSort = searchParams.get("sort") || "date_desc";
    const sort: WinningProductSortOption = [
      "date_desc",
      "date_asc",
      "price_desc",
      "price_asc",
      "ads_desc",
    ].includes(rawSort)
      ? (rawSort as WinningProductSortOption)
      : "date_desc";

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);

    const result = await getWinningProductsList({
      q,
      market: ["ALL", "VN", "GLOBAL"].includes(market) ? market : "ALL",
      platform: ["ALL", "LANDING", "MESSENGER", "WHATSAPP"].includes(platform) ? platform : "ALL",
      sort,
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
          "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=1800",
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
