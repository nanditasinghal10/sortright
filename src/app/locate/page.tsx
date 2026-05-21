"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGeolocation, fetchDropoffs, type Coords, type Dropoff } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { FadeUp } from "@/components/motion-primitives";
import { GeoPrompt } from "@/components/locate/geo-prompt";
import { MaterialFilter, type MaterialId } from "@/components/locate/material-filter";
import { DropoffList } from "@/components/locate/dropoff-list";
import { Search } from "lucide-react";

const DropoffMap = dynamic(() => import("@/components/locate/dropoff-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] md:h-[560px] w-full rounded-organic border border-sage-200/70 bg-cream-100 animate-pulse" />
  )
});

const ZIP_PREFIX_TABLE: Record<string, { city: string; lat: number; lng: number }> = {
  "100": { city: "New York, NY", lat: 40.7128, lng: -74.006 },
  "101": { city: "New York, NY", lat: 40.7484, lng: -73.9857 },
  "112": { city: "Brooklyn, NY", lat: 40.6782, lng: -73.9442 },
  "113": { city: "Queens, NY", lat: 40.7282, lng: -73.7949 },
  "021": { city: "Boston, MA", lat: 42.3601, lng: -71.0589 },
  "022": { city: "Boston, MA", lat: 42.3398, lng: -71.0892 },
  "200": { city: "Washington, DC", lat: 38.9072, lng: -77.0369 },
  "300": { city: "Atlanta, GA", lat: 33.749, lng: -84.388 },
  "303": { city: "Atlanta, GA", lat: 33.7756, lng: -84.3963 },
  "331": { city: "Miami, FL", lat: 25.7617, lng: -80.1918 },
  "606": { city: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  "481": { city: "Detroit, MI", lat: 42.3314, lng: -83.0458 },
  "631": { city: "St. Louis, MO", lat: 38.627, lng: -90.1994 },
  "750": { city: "Dallas, TX", lat: 32.7767, lng: -96.797 },
  "770": { city: "Houston, TX", lat: 29.7604, lng: -95.3698 },
  "787": { city: "Austin, TX", lat: 30.2672, lng: -97.7431 },
  "802": { city: "Denver, CO", lat: 39.7392, lng: -104.9903 },
  "841": { city: "Salt Lake City, UT", lat: 40.7608, lng: -111.891 },
  "850": { city: "Phoenix, AZ", lat: 33.4484, lng: -112.074 },
  "870": { city: "Albuquerque, NM", lat: 35.0844, lng: -106.6504 },
  "891": { city: "Las Vegas, NV", lat: 36.1699, lng: -115.1398 },
  "900": { city: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  "902": { city: "Beverly Hills, CA", lat: 34.0736, lng: -118.4004 },
  "920": { city: "San Diego, CA", lat: 32.7157, lng: -117.1611 },
  "941": { city: "San Francisco, CA", lat: 37.7749, lng: -122.4194 },
  "946": { city: "Oakland, CA", lat: 37.8044, lng: -122.2712 },
  "950": { city: "San Jose, CA", lat: 37.3382, lng: -121.8863 },
  "972": { city: "Portland, OR", lat: 45.5152, lng: -122.6784 },
  "981": { city: "Seattle, WA", lat: 47.6062, lng: -122.3321 },
  "995": { city: "Anchorage, AK", lat: 61.2181, lng: -149.9003 }
};

function lookupZip(input: string): { coords: Coords; city: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 3) {
    const prefix = digits.slice(0, 3);
    const hit = ZIP_PREFIX_TABLE[prefix];
    if (hit) return { coords: { lat: hit.lat, lng: hit.lng }, city: hit.city };
  }
  const lower = trimmed.toLowerCase();
  for (const v of Object.values(ZIP_PREFIX_TABLE)) {
    if (v.city.toLowerCase().includes(lower)) {
      return { coords: { lat: v.lat, lng: v.lng }, city: v.city };
    }
  }
  return null;
}

export default function LocatePage() {
  const { status, coords, error, request, setCoords } = useGeolocation();
  const [material, setMaterial] = useState<MaterialId>("all");
  const [dropoffs, setDropoffs] = useState<Dropoff[]>([]);
  const [loading, setLoading] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [zipMessage, setZipMessage] = useState<string | null>(null);
  const [manualLabel, setManualLabel] = useState<string | null>(null);
  const reqIdRef = useRef(0);

  const activeCenter = coords;

  useEffect(() => {
    if (!activeCenter) return;
    const myReq = ++reqIdRef.current;
    setLoading(true);
    fetchDropoffs({
      lat: activeCenter.lat,
      lng: activeCenter.lng,
      material: material === "all" ? undefined : material,
      radiusKm: 32
    })
      .then((list) => {
        if (reqIdRef.current === myReq) setDropoffs(list);
      })
      .catch(() => {
        if (reqIdRef.current === myReq) setDropoffs([]);
      })
      .finally(() => {
        if (reqIdRef.current === myReq) setLoading(false);
      });
  }, [activeCenter, material]);

  const onZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hit = lookupZip(zipInput);
    if (!hit) {
      setZipMessage(
        "We don't have that area in our quick lookup yet. Try a major US ZIP (e.g. 94110, 10001, 60601)."
      );
      return;
    }
    setZipMessage(null);
    setManualLabel(hit.city);
    setCoords(hit.coords);
  };

  const showPrompt = status === "idle" || status === "denied" || status === "unavailable" || status === "error";

  const subtitle = useMemo(() => {
    if (manualLabel) return `Drop-offs near ${manualLabel}`;
    if (coords) return "Drop-offs near you";
    return "Find drop-off near you";
  }, [coords, manualLabel]);

  return (
    <main className="min-h-screen bg-cream bg-paper">
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 md:pt-24">
        <FadeUp>
          <p className="text-sage-700 font-medium tracking-wide uppercase text-xs">Locate</p>
          <h1 className="mt-2 font-display text-4xl md:text-6xl text-ink leading-[1.05]">
            {subtitle}
          </h1>
          <p className="mt-4 max-w-2xl text-ink-soft text-lg leading-relaxed">
            The hard-to-recycle stuff (paint, batteries, electronics, lightbulbs, textiles)
            usually has a home. Let&apos;s find the closest one.
          </p>
        </FadeUp>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8 flex flex-col gap-5">
        {showPrompt ? <GeoPrompt status={status} error={error} onRequest={request} /> : null}

        <FadeUp delay={0.05}>
          <Card className="p-5">
            <form onSubmit={onZipSubmit} className="flex flex-col md:flex-row md:items-center gap-3">
              <label htmlFor="zip" className="font-display text-lg text-ink shrink-0">
                Or enter a ZIP / city
              </label>
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                  <input
                    id="zip"
                    type="text"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    placeholder="94110, Seattle, Brooklyn…"
                    className="w-full rounded-organic border border-sage-200 bg-cream-50 pl-9 pr-3 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-400"
                  />
                </div>
                <Button type="submit" variant="secondary" size="md">
                  Search
                </Button>
              </div>
            </form>
            {zipMessage ? (
              <CardDescription className="mt-3 text-berry">{zipMessage}</CardDescription>
            ) : null}
          </Card>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-muted font-medium">
              Filter by material
            </span>
            <MaterialFilter active={material} onChange={setMaterial} />
          </div>
        </FadeUp>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="order-2 md:order-1">
            <FadeUp>
              <h2 className="font-display text-2xl text-ink mb-3">
                {loading ? "Looking…" : `${dropoffs.length} nearby`}
              </h2>
            </FadeUp>
            <DropoffList dropoffs={dropoffs} loading={loading} />
          </div>
          <div className="order-1 md:order-2 md:sticky md:top-6 md:self-start">
            <DropoffMap center={activeCenter} dropoffs={dropoffs} />
            <p className="mt-2 text-xs text-ink-muted">
              Tiles &copy; OpenStreetMap contributors. Data shown is curated demo content unless an
              Earth911 key is configured.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
