"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion-primitives";
import { MapPin, Loader2, Compass } from "lucide-react";
import type { GeoStatus } from "@/lib/api";

interface Props {
  status: GeoStatus;
  error: string | null;
  onRequest: () => void;
}

const COPY: Record<GeoStatus, { title: string; body: string; cta: string }> = {
  idle: {
    title: "Show me what's nearby",
    body: "Share your location and we'll surface the closest places that take batteries, paint, electronics, and other tricky stuff.",
    cta: "Use my location"
  },
  requesting: {
    title: "Looking for you…",
    body: "Your browser is asking for permission. It's a one-time thing. We don't store anything.",
    cta: "Locating…"
  },
  granted: {
    title: "Got it.",
    body: "Pulling drop-offs within a comfortable radius.",
    cta: "Update location"
  },
  denied: {
    title: "Location access blocked",
    body: "No worries. Type a ZIP or city below and we'll work from there. Or change the permission in your browser and try again.",
    cta: "Try again"
  },
  unavailable: {
    title: "Geolocation isn't available",
    body: "Your browser doesn't support location services. Try the ZIP / city box below instead.",
    cta: "Try anyway"
  },
  error: {
    title: "Couldn't get your location",
    body: "Something went sideways. Use the manual entry below, or try once more.",
    cta: "Try again"
  }
};

export function GeoPrompt({ status, error, onRequest }: Props) {
  const copy = COPY[status];
  const busy = status === "requesting";
  return (
    <FadeUp>
      <Card className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
            {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <Compass className="h-6 w-6" />}
          </div>
          <div>
            <CardTitle className="text-xl">{copy.title}</CardTitle>
            <CardDescription className="max-w-prose">{copy.body}</CardDescription>
            {error && status === "error" ? (
              <p className="mt-2 text-sm text-berry">Browser said: {error}</p>
            ) : null}
          </div>
        </div>
        <Button
          onClick={onRequest}
          disabled={busy}
          variant="primary"
          size="md"
          className="self-start md:self-auto"
        >
          <MapPin className="h-4 w-4" />
          {copy.cta}
        </Button>
      </Card>
    </FadeUp>
  );
}
