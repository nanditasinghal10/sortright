import { NextResponse } from "next/server";
import { MOCK_DROPOFFS, type MockDropoff } from "@/lib/dropoff-mock";
import type { Dropoff } from "@/lib/api";

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

interface Earth911Result {
  id?: string | number;
  name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  materials?: string[];
  url?: string;
}

async function tryEarth911(
  lat: number,
  lng: number,
  material: string | null,
  radiusKm: number,
  apiKey: string
): Promise<Dropoff[] | null> {
  try {
    const radiusMiles = radiusKm * 0.621371;
    const params = new URLSearchParams({
      api_key: apiKey,
      latitude: String(lat),
      longitude: String(lng),
      max_distance: String(radiusMiles)
    });
    if (material) params.set("material", material);
    const res = await fetch(
      `https://api.earth911.com/earth911.searchLocations?${params.toString()}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: Earth911Result[] };
    const list = Array.isArray(json.result) ? json.result : [];
    if (!list.length) return null;
    return list
      .filter((r) => typeof r.latitude === "number" && typeof r.longitude === "number")
      .map<Dropoff>((r, i) => ({
        id: String(r.id ?? `e911-${i}`),
        name: r.name ?? "Drop-off location",
        lat: r.latitude as number,
        lng: r.longitude as number,
        address: r.address ?? "",
        materials: Array.isArray(r.materials) ? r.materials : [],
        source: "earth911",
        url: r.url,
        distanceKm: haversineKm(lat, lng, r.latitude as number, r.longitude as number)
      }))
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  } catch {
    return null;
  }
}

function fromStub(
  lat: number,
  lng: number,
  material: string | null,
  radiusKm: number
): Dropoff[] {
  return MOCK_DROPOFFS
    .map((m: MockDropoff): Dropoff => ({
      id: m.id,
      name: m.name,
      lat: m.lat,
      lng: m.lng,
      address: m.address,
      materials: m.materials,
      url: m.url,
      source: "stub",
      distanceKm: haversineKm(lat, lng, m.lat, m.lng)
    }))
    .filter((d) => (d.distanceKm ?? Infinity) <= radiusKm)
    .filter((d) => (material ? d.materials.includes(material) : true))
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const latStr = url.searchParams.get("lat");
  const lngStr = url.searchParams.get("lng");
  const material = url.searchParams.get("material");
  const radiusStr = url.searchParams.get("radius");

  const lat = latStr ? Number(latStr) : NaN;
  const lng = lngStr ? Number(lngStr) : NaN;
  const radiusKm = radiusStr ? Number(radiusStr) : 16;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: "lat and lng query parameters are required and must be numbers." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const apiKey = process.env.EARTH911_API_KEY;
  const cleanMaterial = material && material !== "all" ? material : null;

  let dropoffs: Dropoff[] | null = null;
  let source: "earth911" | "stub" = "stub";

  if (apiKey && apiKey.trim().length > 0) {
    dropoffs = await tryEarth911(lat, lng, cleanMaterial, radiusKm, apiKey);
    if (dropoffs && dropoffs.length > 0) source = "earth911";
  }

  if (!dropoffs || dropoffs.length === 0) {
    dropoffs = fromStub(lat, lng, cleanMaterial, radiusKm);
    source = "stub";
  }

  return NextResponse.json(
    { dropoffs, source, queriedAt: Date.now() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
