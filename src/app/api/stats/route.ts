import { NextResponse } from "next/server";
import { STATS_DATA } from "@/lib/stats-data";

export async function GET() {
  return NextResponse.json(STATS_DATA, {
    headers: { "Cache-Control": "s-maxage=86400" }
  });
}
