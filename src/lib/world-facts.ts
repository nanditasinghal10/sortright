"use client";

import { formatNumber } from "./utils";

export interface WorldStatsPayload {
  co2Ppm: number | null;
  co2AsOf: string | null;
  co2Source: "noaa-mauna-loa" | "fallback";
  rates: {
    usMswTonsPerSec: number;
    usFoodWasteTonsPerSec: number;
    globalPlasticTonsPerSec: number;
    globalCo2EmissionsTonsPerSec: number;
    aluminumCansRecycledPerSec: number;
  };
  fetchedAt: number;
}

export interface FactView {
  id: string;
  /** Visible big number (already formatted, can include unit suffix). */
  figure: string;
  /** Small unit / qualifier line above the figure. */
  unit: string;
  /** Main descriptive sentence. */
  label: string;
  /** Smaller secondary line. */
  note: string;
  /** "live" badge if true. */
  live: boolean;
}

type Kind = "static" | "live-co2" | "ytd-counter";

interface FactDef {
  id: string;
  kind: Kind;
  /** Per-second rate (for ytd-counter). */
  ratePerSec?: keyof WorldStatsPayload["rates"];
  /** Renderer producing a `FactView` given context. */
  render: (ctx: { now: number; world: WorldStatsPayload | null; rate?: number }) => FactView;
}

function secondsSinceJan1(now: number): number {
  const d = new Date(now);
  const jan1 = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.max(0, (now - jan1) / 1000);
}

function fmtBig(n: number): string {
  if (n >= 1e9) return `${formatNumber(n / 1e9, { maximumFractionDigits: 2 })}B`;
  if (n >= 1e6) return `${formatNumber(n / 1e6, { maximumFractionDigits: 2 })}M`;
  if (n >= 1e3) return `${formatNumber(n / 1e3, { maximumFractionDigits: 1 })}K`;
  return formatNumber(n, { maximumFractionDigits: 0 });
}

const FACTS: FactDef[] = [
  {
    id: "co2-ppm",
    kind: "live-co2",
    render: ({ world }) => ({
      id: "co2-ppm",
      figure: world?.co2Ppm ? formatNumber(world.co2Ppm, { maximumFractionDigits: 2 }) : "...",
      unit: "ppm CO₂",
      label:
        "Atmospheric CO₂ at Mauna Loa, the highest in 3 million years and still climbing.",
      note: world?.co2AsOf
        ? `Live · NOAA reading from ${new Date(world.co2AsOf).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}.`
        : "Live · pulled from NOAA Mauna Loa.",
      live: true
    })
  },
  {
    id: "ytd-us-msw",
    kind: "ytd-counter",
    ratePerSec: "usMswTonsPerSec",
    render: ({ now, rate = 0 }) => {
      const tons = secondsSinceJan1(now) * rate;
      return {
        id: "ytd-us-msw",
        figure: `${fmtBig(tons)}`,
        unit: "tons of US trash this year",
        label: "Generated since January 1, and counting every second you read this.",
        note: "Annualized from EPA's 292M tons/year baseline.",
        live: true
      };
    }
  },
  {
    id: "ytd-food-waste",
    kind: "ytd-counter",
    ratePerSec: "usFoodWasteTonsPerSec",
    render: ({ now, rate = 0 }) => {
      const tons = secondsSinceJan1(now) * rate;
      return {
        id: "ytd-food-waste",
        figure: `${fmtBig(tons)}`,
        unit: "tons of US food wasted YTD",
        label: "Most of it could have composted. The single biggest easy win.",
        note: "Live counter · USDA / ReFED 80M ton/yr estimate.",
        live: true
      };
    }
  },
  {
    id: "ytd-plastic",
    kind: "ytd-counter",
    ratePerSec: "globalPlasticTonsPerSec",
    render: ({ now, rate = 0 }) => {
      const tons = secondsSinceJan1(now) * rate;
      return {
        id: "ytd-plastic",
        figure: `${fmtBig(tons)}`,
        unit: "tons of plastic produced globally",
        label: "Less than 10% of it will ever be recycled.",
        note: "Live counter · OECD 400M ton/yr global production.",
        live: true
      };
    }
  },
  {
    id: "ytd-co2",
    kind: "ytd-counter",
    ratePerSec: "globalCo2EmissionsTonsPerSec",
    render: ({ now, rate = 0 }) => {
      const tons = secondsSinceJan1(now) * rate;
      return {
        id: "ytd-co2",
        figure: `${fmtBig(tons)}`,
        unit: "tons of CO₂ emitted YTD",
        label: "Globally, since the start of the year.",
        note: "Live counter · Global Carbon Budget 37.4 Gt/yr.",
        live: true
      };
    }
  },
  {
    id: "ytd-aluminum",
    kind: "ytd-counter",
    ratePerSec: "aluminumCansRecycledPerSec",
    render: ({ now, rate = 0 }) => {
      const cans = secondsSinceJan1(now) * rate;
      return {
        id: "ytd-aluminum",
        figure: `${fmtBig(cans)}`,
        unit: "aluminum cans recycled (US)",
        label: "Each one saves ~95% of the energy of a fresh can.",
        note: "Live counter · Aluminum Association.",
        live: true
      };
    }
  },
  {
    id: "us-recycling-rate",
    kind: "static",
    render: () => ({
      id: "us-recycling-rate",
      figure: "32%",
      unit: "diversion rate",
      label: "Of US municipal waste, only about a third is recycled or composted.",
      note: "EPA Advancing Sustainable Materials Management.",
      live: false
    })
  },
  {
    id: "msw-per-person",
    kind: "static",
    render: () => ({
      id: "msw-per-person",
      figure: "4.9",
      unit: "lbs / person / day",
      label: "What the average American throws away every single day.",
      note: "EPA · roughly twice the global average.",
      live: false
    })
  },
  {
    id: "food-share",
    kind: "static",
    render: () => ({
      id: "food-share",
      figure: "24%",
      unit: "of landfill is food",
      label: "Wasted food is the largest single category in US landfills.",
      note: "EPA · methane emissions follow.",
      live: false
    })
  },
  {
    id: "ocean-plastic",
    kind: "static",
    render: () => ({
      id: "ocean-plastic",
      figure: "11M",
      unit: "tons / year",
      label: "Plastic that flows into the ocean each year. About a garbage-truck per minute.",
      note: "Pew Charitable Trusts · Breaking the Plastic Wave.",
      live: false
    })
  },
  {
    id: "ewaste",
    kind: "static",
    render: () => ({
      id: "ewaste",
      figure: "62M",
      unit: "tons of e-waste",
      label: "Generated globally in 2022. Less than a quarter is properly collected.",
      note: "UN Global E-waste Monitor.",
      live: false
    })
  },
  {
    id: "compost-impact",
    kind: "static",
    render: () => ({
      id: "compost-impact",
      figure: "50%",
      unit: "less methane",
      label: "What composting your food scraps avoids vs. landfilling them.",
      note: "EPA · methane is 80× more potent than CO₂ over 20 years.",
      live: false
    })
  }
];

export function pickFacts(n: number): FactDef[] {
  const pool = FACTS.slice();
  const out: FactDef[] = [];
  while (out.length < n && pool.length > 0) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

export function renderFact(def: FactDef, now: number, world: WorldStatsPayload | null): FactView {
  const rate = def.ratePerSec && world ? world.rates[def.ratePerSec] : undefined;
  return def.render({ now, world, rate });
}
