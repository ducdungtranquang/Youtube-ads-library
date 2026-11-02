import { NextResponse } from "next/server";
import { INDUSTRIES } from "@/lib/constants/industries";

export async function GET() {
  return NextResponse.json(
    { success: true, data: INDUSTRIES },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    }
  );
}
