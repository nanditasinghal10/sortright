// Bin definitions: the canonical 4-way classification used across the app.

import type { LucideIcon } from "lucide-react";
import { Trash2, Recycle, Leaf, AlertTriangle } from "lucide-react";

export type BinId = "trash" | "recycle" | "compost" | "hazardous";

export interface BinDef {
  id: BinId;
  label: string;
  short: string;
  color: string;        // hex used for accents
  bg: string;           // tailwind bg class
  border: string;       // tailwind border class
  text: string;         // tailwind text class
  icon: LucideIcon;
  blurb: string;
}

export const BINS: Record<BinId, BinDef> = {
  trash: {
    id: "trash",
    label: "Landfill / Trash",
    short: "Trash",
    color: "#5D4027",
    bg: "bg-clay-100",
    border: "border-clay-300",
    text: "text-clay-800",
    icon: Trash2,
    blurb: "Items that aren't recyclable, compostable, or hazardous. The last resort."
  },
  recycle: {
    id: "recycle",
    label: "Recycling",
    short: "Recycle",
    color: "#647A4D",
    bg: "bg-sage-100",
    border: "border-sage-300",
    text: "text-sage-800",
    icon: Recycle,
    blurb: "Clean paper, cardboard, glass, metal, and rigid plastics #1, #2, #5."
  },
  compost: {
    id: "compost",
    label: "Compost / Organics",
    short: "Compost",
    color: "#5C7A4A",
    bg: "bg-[#E8EFD8]",
    border: "border-[#B5C79B]",
    text: "text-[#3A4730]",
    icon: Leaf,
    blurb: "Food scraps, yard trimmings, soiled paper. Becomes soil."
  },
  hazardous: {
    id: "hazardous",
    label: "Hazardous / Special",
    short: "Hazardous",
    color: "#B85C5C",
    bg: "bg-[#FBE4E4]",
    border: "border-[#E8B6B6]",
    text: "text-[#7A2C2C]",
    icon: AlertTriangle,
    blurb: "Batteries, electronics, paint, pills. Never in the regular bins."
  }
};

export const BIN_LIST: BinDef[] = [BINS.recycle, BINS.compost, BINS.trash, BINS.hazardous];
