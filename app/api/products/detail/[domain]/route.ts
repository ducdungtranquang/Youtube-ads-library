import { NextRequest, NextResponse } from "next/server";
import { getWinningProductDetail } from "@/lib/services/winning-products-sheet";

interface RouteParams {
  params: Promise<{
    domain: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { domain } = await params;
    const queryId = request.nextUrl.searchParams.get("id");
    const queryProductKey = request.nextUrl.searchParams.get("product_key");

    let rawTarget = queryId?.trim() || queryProductKey?.trim() || domain?.trim();
    if (!rawTarget) {
      return NextResponse.json(
        { success: false, message: "Missing product identifier (id or domain)." },
        { status: 400 }
      );
    }

    try {
      rawTarget = decodeURIComponent(rawTarget).trim();
    } catch {}

    const product = await getWinningProductDetail(rawTarget);

    if (!product) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy thông tin sản phẩm: ${rawTarget}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=14400",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi tải chi tiết sản phẩm";
    console.error("[WinningProductDetailAPI] Error:", error);
    return NextResponse.json(
      { success: false, message, error: message },
      { status: 500 }
    );
  }
}
