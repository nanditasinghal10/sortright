import type { WasteStats } from "@/lib/api";

export const STATS_DATA: WasteStats = {
  msw: {
    generatedMTons: 292.4,
    recycledMTons: 69.0,
    compostedMTons: 25.0,
    landfilledMTons: 146.1,
    year: 2018
  },
  recyclingRate: 0.32,
  perCapitaLbsPerDay: 4.9,
  topRecycled: [
    { material: "Paper & paperboard", mTons: 46.0 },
    { material: "Metals", mTons: 8.7 },
    { material: "Rubber, leather & textiles", mTons: 4.3 },
    { material: "Wood", mTons: 3.1 },
    { material: "Glass", mTons: 3.1 },
    { material: "Plastics", mTons: 3.0 }
  ],
  source: "EPA Facts and Figures, 2018 baseline"
};
