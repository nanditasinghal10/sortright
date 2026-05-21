import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { BinsOverview } from "@/components/landing/bins-overview";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { StatsStrip } from "@/components/landing/stats-strip";
import { Mistakes } from "@/components/landing/mistakes";
import { Quote, CtaStrip } from "@/components/landing/cta-strip";

export const metadata: Metadata = {
  title: "SortRight: Sort right. Live light.",
  description:
    "A friendly, gamified guide to sorting waste and living sustainably. Play the sort game, learn the surprises, find drop-off points, and build small habits that add up."
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <BinsOverview />
      <FeatureGrid />
      <StatsStrip />
      <Mistakes />
      <Quote />
      <CtaStrip />
    </>
  );
}
