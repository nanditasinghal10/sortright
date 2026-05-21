"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, easeOrganic } from "@/components/motion-primitives";
import { pickFacts, renderFact, type WorldStatsPayload } from "@/lib/world-facts";

const TICK_MS = 200;

export function StatsStrip() {
  const [world, setWorld] = useState<WorldStatsPayload | null>(null);
  const [now, setNow] = useState<number | null>(null); // null until client mounts → no SSR mismatch
  const factDefsRef = useRef<ReturnType<typeof pickFacts> | null>(null);

  if (factDefsRef.current === null) {
    factDefsRef.current = pickFacts(3);
  }

  useEffect(() => {
    setNow(Date.now());
    let mounted = true;
    fetch("/api/world-stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (mounted && data) setWorld(data as WorldStatsPayload);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (now === null) return;
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, [now]);

  const views = useMemo(() => {
    if (now === null || !factDefsRef.current) return null;
    return factDefsRef.current.map((d) => renderFact(d, now, world));
  }, [now, world]);

  return (
    <section className="bg-sage-50/60 border-y border-sage-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-24">
        <FadeUp className="max-w-2xl mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-sage-700 font-medium">
            Did you know?
          </span>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-3">
            The numbers are bigger than the bin in your kitchen.
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            Three facts pulled from the world right now. Refresh for a different cut.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {views ? (
            views.map((v, i) => (
              <FadeUp key={v.id} delay={i * 0.1}>
                <div className="border-l-2 border-sage-400 pl-5 md:pl-6">
                  <div className="flex items-baseline gap-2">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={v.figure}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8, position: "absolute" }}
                        transition={{ duration: 0.35, ease: easeOrganic }}
                        className="font-display text-5xl md:text-6xl text-sage-800 tracking-tight leading-none tabular-nums"
                      >
                        {v.figure}
                      </motion.span>
                    </AnimatePresence>
                    {v.live && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sage-700 text-cream px-2 py-0.5 text-[10px] uppercase tracking-wider">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-200 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-200" />
                        </span>
                        Live
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium text-sage-700 uppercase tracking-wider">
                    {v.unit}
                  </div>
                  <p className="mt-4 text-ink leading-relaxed">{v.label}</p>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">{v.note}</p>
                </div>
              </FadeUp>
            ))
          ) : (
            <StatsSkeleton />
          )}
        </div>

        <FadeUp delay={0.3} className="mt-10">
          <p className="text-xs text-ink-muted">
            Live CO₂ from NOAA Mauna Loa via global-warming.org. Year-to-date counters
            project from EPA, USDA, OECD, and Global Carbon Budget annual figures. Static
            facts cited inline.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function StatsSkeleton() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} className="border-l-2 border-sage-200 pl-5 md:pl-6 animate-pulse">
          <div className="h-12 w-32 bg-sage-100 rounded" />
          <div className="mt-3 h-3 w-24 bg-sage-100/70 rounded" />
          <div className="mt-5 h-4 w-full bg-sage-100/70 rounded" />
          <div className="mt-2 h-3 w-3/4 bg-sage-100/50 rounded" />
        </div>
      ))}
    </>
  );
}
