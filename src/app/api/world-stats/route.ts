import { NextResponse } from "next/server";

interface Co2ApiResponse {
  co2?: Array<{
    year: string;
    month: string;
    day: string;
    cycle: string;
    trend: string;
  }>;
}

interface WorldStats {
  co2Ppm: number | null;
  co2AsOf: string | null;
  co2Source: "noaa-mauna-loa" | "fallback";
  // Anchors for client-side ticking counters (per-second rates).
  rates: {
    usMswTonsPerSec: number;
    usFoodWasteTonsPerSec: number;
    globalPlasticTonsPerSec: number;
    globalCo2EmissionsTonsPerSec: number;
    aluminumCansRecycledPerSec: number;
  };
  fetchedAt: number;
}

// Annual figures (most recent reasonably-sourced):
//  - US MSW: 292M tons/yr (EPA 2018 baseline)
//  - US food waste: 80M tons/yr (USDA / ReFED)
//  - Global plastic: 400M tons/yr (OECD 2022)
//  - Global CO2 emissions: 37.4 Gt/yr (Global Carbon Budget 2023)
//  - US aluminum cans recycled: ~55B cans/yr → ~1745/sec (Aluminum Association)
const SECONDS_PER_YEAR = 365.25 * 24 * 3600;
const RATES = {
  usMswTonsPerSec: 292_400_000 / SECONDS_PER_YEAR,
  usFoodWasteTonsPerSec: 80_000_000 / SECONDS_PER_YEAR,
  globalPlasticTonsPerSec: 400_000_000 / SECONDS_PER_YEAR,
  globalCo2EmissionsTonsPerSec: 37_400_000_000 / SECONDS_PER_YEAR,
  aluminumCansRecycledPerSec: 55_000_000_000 / SECONDS_PER_YEAR
};

async function fetchCo2(): Promise<{ ppm: number; asOf: string } | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch("https://global-warming.org/api/co2-api", {
      signal: ctrl.signal,
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Co2ApiResponse;
    const last = data.co2?.[data.co2.length - 1];
    if (!last) return null;
    const ppm = parseFloat(last.trend || last.cycle);
    if (!Number.isFinite(ppm)) return null;
    return { ppm, asOf: `${last.year}-${last.month.padStart(2, "0")}-${last.day.padStart(2, "0")}` };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const co2 = await fetchCo2();
  const payload: WorldStats = {
    co2Ppm: co2?.ppm ?? 424.5,
    co2AsOf: co2?.asOf ?? null,
    co2Source: co2 ? "noaa-mauna-loa" : "fallback",
    rates: RATES,
    fetchedAt: Date.now()
  };
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" }
  });
}
