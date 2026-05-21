"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Recycle, Brain, Map, Sparkles } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { fadeUp, stagger, easeOrganic } from "@/components/motion-primitives";

const FEATURES = [
  {
    href: "/sort",
    icon: Recycle,
    title: "Play the sort game",
    body: "Drag everyday items into the right bin. Score points, learn the surprises (yes, the greasy pizza box composts), beat your streak.",
    cta: "Start sorting",
    accent: "bg-sage-100/80 text-sage-800 border-sage-300"
  },
  {
    href: "/quiz",
    icon: Brain,
    title: "Take a quick quiz",
    body: "Five questions, three minutes. See where your instincts are sharp, and where you've been wishcycling for years.",
    cta: "Test yourself",
    accent: "bg-clay-100/80 text-clay-800 border-clay-300"
  },
  {
    href: "/locate",
    icon: Map,
    title: "Find a drop-off",
    body: "Batteries, electronics, paint, textiles. Items that don't belong curbside. We'll point you to the closest place that takes them.",
    cta: "Open the map",
    accent: "bg-[#E8EFD8] text-[#3A4730] border-[#B5C79B]"
  },
  {
    href: "/challenges",
    icon: Sparkles,
    title: "Build a habit",
    body: "Tiny daily challenges: a swap, a sort, a refill. Stack a few weeks and you'll feel the change in your trash bin.",
    cta: "Pick a challenge",
    accent: "bg-[#FBE4E4] text-[#7A2C2C] border-[#E8B6B6]"
  }
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: easeOrganic }}
        className="max-w-2xl mb-12"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-sage-700 font-medium">
          What you can do here
        </span>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-3">
          Four small ways to start.
        </h2>
        <p className="mt-4 text-ink-soft leading-relaxed">
          You don't have to overhaul your life. Pick one. Come back tomorrow.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
      >
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <motion.div key={f.href} variants={fadeUp}>
              <Link href={f.href} className="group block h-full">
                <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-leaf">
                  <div className="flex items-start gap-5">
                    <span
                      className={`grid place-items-center h-12 w-12 rounded-2xl border shadow-soft shrink-0 ${f.accent}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="flex-1">
                      <CardTitle>{f.title}</CardTitle>
                      <CardDescription>{f.body}</CardDescription>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sage-800">
                        {f.cta}
                        <span className="transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
