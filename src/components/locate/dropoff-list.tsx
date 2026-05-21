"use client";

import { Badge, Card } from "@/components/ui/card";
import { FadeUp } from "@/components/motion-primitives";
import { ExternalLink, MapPin } from "lucide-react";
import type { Dropoff } from "@/lib/api";

interface Props {
  dropoffs: Dropoff[];
  loading: boolean;
}

export function DropoffList({ dropoffs, loading }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-organic border border-sage-200/60 bg-cream-100/60"
          />
        ))}
      </div>
    );
  }

  if (dropoffs.length === 0) {
    return (
      <Card className="text-center">
        <p className="font-display text-xl text-ink">Nothing within range.</p>
        <p className="mt-2 text-ink-soft text-sm">
          Try widening the search, picking a different material, or entering another ZIP.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {dropoffs.map((d, i) => (
        <FadeUp key={d.id} delay={i * 0.04}>
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-lg text-ink leading-tight">{d.name}</h3>
                <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-soft">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-sage-600" />
                  <span className="truncate">{d.address}</span>
                </p>
              </div>
              {typeof d.distanceKm === "number" ? (
                <span className="shrink-0 rounded-full bg-clay-100 px-3 py-1 text-xs font-medium text-clay-800">
                  {d.distanceKm < 1
                    ? `${Math.round(d.distanceKm * 1000)} m`
                    : `${d.distanceKm.toFixed(1)} km`}
                </span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.materials.slice(0, 8).map((m) => (
                <Badge key={m} className="text-[0.7rem] px-2 py-0.5 capitalize">
                  {m}
                </Badge>
              ))}
            </div>
            {d.url ? (
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-sage-700 hover:text-sage-900 underline-offset-2 hover:underline"
              >
                More info <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </Card>
        </FadeUp>
      ))}
    </div>
  );
}
