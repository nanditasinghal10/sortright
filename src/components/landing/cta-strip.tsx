"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { easeOrganic } from "@/components/motion-primitives";

const QUOTES: { text: string; attribution: string }[] = [
  {
    text: "We don’t need a handful of people doing zero-waste perfectly. We need millions doing it imperfectly.",
    attribution: "Anne-Marie Bonneau"
  },
  {
    text: "There is no such thing as ‘away.’ When we throw anything away, it must go somewhere.",
    attribution: "Annie Leonard"
  },
  {
    text: "What you do makes a difference, and you have to decide what kind of difference you want to make.",
    attribution: "Jane Goodall"
  },
  {
    text: "The Earth is what we all have in common.",
    attribution: "Wendell Berry"
  },
  {
    text: "We do not inherit the Earth from our ancestors. We borrow it from our children.",
    attribution: "Native American proverb"
  },
  {
    text: "Small acts, when multiplied by millions of people, can transform the world.",
    attribution: "Howard Zinn"
  },
  {
    text: "The world has enough for everyone’s needs, but not everyone’s greed.",
    attribution: "Mahatma Gandhi"
  }
];

const ROTATE_MS = 7000;

export function Quote() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const current = QUOTES[index];

  return (
    <section
      className="mx-auto max-w-4xl px-6 py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="text-center">
        <span
          aria-hidden="true"
          className="font-display text-6xl text-sage-300 leading-none block"
        >
          &ldquo;
        </span>

        <div className="relative min-h-[12rem] md:min-h-[14rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
              transition={{ duration: 0.9, ease: easeOrganic }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight text-ink leading-tight italic">
                {current.text}
              </p>
              <footer className="mt-6 md:mt-8 text-sm uppercase tracking-[0.2em] text-ink-muted not-italic">
                {current.attribution}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div
          className="mt-6 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Choose quote"
        >
          {QUOTES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Quote ${i + 1} of ${QUOTES.length}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-sage-700"
                  : "w-1.5 bg-sage-300 hover:bg-sage-500"
              }`}
            />
          ))}
        </div>
      </div>
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
