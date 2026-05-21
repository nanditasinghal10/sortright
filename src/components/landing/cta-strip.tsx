"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { easeOrganic } from "@/components/motion-primitives";

export function Quote() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:py-28">
      <motion.blockquote
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: easeOrganic }}
        className="text-center"
      >
        <span
          aria-hidden="true"
          className="font-display text-6xl text-sage-300 leading-none block"
        >
          &ldquo;
        </span>
        <p className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight text-ink leading-tight italic">
          We don&rsquo;t need a handful of people doing zero-waste perfectly. We
          need millions doing it imperfectly.
        </p>
        <footer className="mt-8 text-sm uppercase tracking-[0.2em] text-ink-muted not-italic">
          the quiet ethos of SortRight
        </footer>
      </motion.blockquote>
    </section>
  );
}

export function CtaStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: easeOrganic }}
        className="rounded-organic bg-sage-700 text-cream shadow-leaf overflow-hidden"
      >
        <div className="relative px-8 py-14 md:px-14 md:py-20 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div
            aria-hidden="true"
            className="absolute -top-12 -right-10 h-56 w-56 rounded-full bg-sage-600/60 blur-2xl"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-sage-600/60 px-3 py-1 text-xs font-medium">
              <Sprout className="h-3.5 w-3.5" />
              One small thing
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-4 leading-tight">
              Start with one habit this week.
            </h2>
            <p className="mt-4 text-cream/80 leading-relaxed max-w-xl">
              Compost coffee grounds. Refuse a plastic bag. Bring batteries to a
              drop-off. Pick whatever feels easiest. That&rsquo;s the point.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
            <Link href="/challenges" className="w-full md:w-auto">
              <Button
                size="lg"
                variant="clay"
                className="w-full md:w-auto min-h-[44px]"
              >
                See this week&rsquo;s challenges
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sustainable-living" className="w-full md:w-auto">
              <Button
                size="lg"
                variant="ghost"
                className="w-full md:w-auto min-h-[44px] text-cream hover:bg-sage-600/60"
              >
                Read the living guide
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
