"use client";

import { useEffect, useState } from "react";

export interface Coords {
  lat: number;
  lng: number;
  accuracy?: number;
}

export type GeoStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable" | "error";

export function useGeolocation(opts: PositionOptions = { enableHighAccuracy: false, timeout: 10000 }) {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = () => {
    if (typeof window === "undefined") return;
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      return;
    }
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setStatus("granted");
      },
      (err) => {
        setError(err.message);
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      opts
    );
  };

  return { status, coords, error, request, setCoords };
}

/** Minimal client for /api/dropoffs */
export interface Dropoff {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  materials: string[];
  source: "earth911" | "stub" | "osm";
  distanceKm?: number;
  url?: string;
}

export async function fetchDropoffs(params: {
  lat: number;
  lng: number;
  material?: string;
  radiusKm?: number;
}): Promise<Dropoff[]> {
  const q = new URLSearchParams({
    lat: String(params.lat),
    lng: String(params.lng),
    ...(params.material ? { material: params.material } : {}),
    ...(params.radiusKm ? { radius: String(params.radiusKm) } : {})
  });
  const res = await fetch(`/api/dropoffs?${q}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`dropoffs ${res.status}`);
  const data = (await res.json()) as { dropoffs: Dropoff[] };
  return data.dropoffs;
}

export interface WasteStats {
  msw: { generatedMTons: number; recycledMTons: number; compostedMTons: number; landfilledMTons: number; year: number };
  recyclingRate: number;
  perCapitaLbsPerDay: number;
  topRecycled: { material: string; mTons: number }[];
  source: string;
}

export async function fetchStats(): Promise<WasteStats> {
  const res = await fetch("/api/stats", { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`stats ${res.status}`);
  return res.json();
}

/** Haversine distance in km. */
export function distanceKm(a: Coords, b: Coords) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** Hydration-safe wrapper for useSortStore. Returns null on first server render. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
