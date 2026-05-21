import type { BinId } from "./bins";

export interface WasteItem {
  id: string;            // url-safe slug
  name: string;
  emoji: string;         // visual stand-in (replace with illustrations later)
  bin: BinId;
  category: "kitchen" | "bath" | "tech" | "yard" | "office" | "packaging" | "textile" | "outdoors";
  why: string;           // 1-2 sentences
  alternatives?: string; // sustainable swap, optional
  difficulty: 1 | 2 | 3; // for quiz / sort game scoring
  /** rough CO2-eq saved (kg) per item kept out of landfill (tunable) */
  co2Saved?: number;
  /** rough landfill weight saved (g) when properly diverted */
  landfillSavedG?: number;
}

export const ITEMS: WasteItem[] = [
  // KITCHEN
  { id: "banana-peel", name: "Banana peel", emoji: "🍌", bin: "compost", category: "kitchen", why: "Food scraps break down into nutrient-rich soil in compost.", difficulty: 1, co2Saved: 0.15, landfillSavedG: 120 },
  { id: "coffee-grounds", name: "Coffee grounds", emoji: "☕", bin: "compost", category: "kitchen", why: "Excellent nitrogen source for compost. Filter goes in too.", difficulty: 1, co2Saved: 0.05, landfillSavedG: 30 },
  { id: "eggshells", name: "Eggshells", emoji: "🥚", bin: "compost", category: "kitchen", why: "Add calcium to compost. Crush for faster breakdown.", difficulty: 1, co2Saved: 0.02, landfillSavedG: 12 },
  { id: "pizza-box-greasy", name: "Greasy pizza box", emoji: "🍕", bin: "compost", category: "packaging", why: "Grease contaminates paper recycling. Compost the soiled parts; recycle clean lid.", difficulty: 3 },
  { id: "tea-bag", name: "Tea bag", emoji: "🍵", bin: "compost", category: "kitchen", why: "Mostly compostable, but some bags use plastic mesh. Tear open if unsure.", alternatives: "Loose-leaf tea avoids the issue entirely.", difficulty: 3 },
  { id: "yogurt-cup", name: "Yogurt cup (#5)", emoji: "🥛", bin: "recycle", category: "packaging", why: "PP plastic #5 is widely recyclable when rinsed.", difficulty: 2, co2Saved: 0.08, landfillSavedG: 18 },
  { id: "glass-jar", name: "Glass jar", emoji: "🫙", bin: "recycle", category: "packaging", why: "Glass is endlessly recyclable. Rinse, leave the lid on or off per local rules.", difficulty: 1, co2Saved: 0.3, landfillSavedG: 250 },
  { id: "aluminum-can", name: "Aluminum can", emoji: "🥫", bin: "recycle", category: "packaging", why: "Recycling aluminum saves 95% of the energy vs. new metal.", difficulty: 1, co2Saved: 0.5, landfillSavedG: 15 },
  { id: "plastic-bag", name: "Plastic grocery bag", emoji: "🛍️", bin: "trash", category: "packaging", why: "Tangles recycling machinery. Take to a store drop-off instead.", alternatives: "Use a reusable tote.", difficulty: 3 },
  { id: "styrofoam", name: "Styrofoam takeout", emoji: "🍱", bin: "trash", category: "packaging", why: "Polystyrene #6 is rarely accepted curbside.", alternatives: "Ask for paper or bring your own container.", difficulty: 2 },
  { id: "plastic-straw", name: "Plastic straw", emoji: "🥤", bin: "trash", category: "packaging", why: "Too small to sort; falls through recycling sorters.", alternatives: "Reusable metal or silicone straws.", difficulty: 2 },
  { id: "cling-wrap", name: "Cling wrap", emoji: "🥡", bin: "trash", category: "kitchen", why: "Soft plastic film isn't curbside-recyclable in most places.", alternatives: "Beeswax wraps or silicone covers.", difficulty: 2 },

  // BATH
  { id: "toothpaste-tube", name: "Toothpaste tube", emoji: "🪥", bin: "trash", category: "bath", why: "Mixed-material laminate tubes aren't curbside-recyclable.", alternatives: "Toothpaste tabs or recyclable mono-material tubes.", difficulty: 3 },
  { id: "shampoo-bottle", name: "Shampoo bottle (HDPE #2)", emoji: "🧴", bin: "recycle", category: "bath", why: "HDPE #2 is widely accepted. Rinse and recap.", difficulty: 1, co2Saved: 0.12 },
  { id: "razor-blade", name: "Disposable razor", emoji: "🪒", bin: "hazardous", category: "bath", why: "Mixed metal + plastic; blade is sharp. Take to a TerraCycle drop-off.", alternatives: "Safety razor with replaceable blades.", difficulty: 3 },
  { id: "cotton-swab", name: "Cotton swab", emoji: "🦠", bin: "trash", category: "bath", why: "Too small + soiled. Plastic-stick versions are the worst offenders.", alternatives: "Reusable silicone or paper-stick swabs.", difficulty: 2 },

  // TECH / HAZARDOUS
  { id: "aa-battery", name: "AA battery", emoji: "🔋", bin: "hazardous", category: "tech", why: "Heavy metals leach in landfill. Most hardware stores have a free drop-off.", difficulty: 1, co2Saved: 0.05 },
  { id: "phone-old", name: "Old smartphone", emoji: "📱", bin: "hazardous", category: "tech", why: "E-waste contains valuable + toxic materials. Manufacturer or municipal drop-off.", difficulty: 1, co2Saved: 5 },
  { id: "usb-cable", name: "USB cable / charger", emoji: "🔌", bin: "hazardous", category: "tech", why: "E-waste, recyclable through municipal e-waste programs.", difficulty: 2 },
  { id: "lightbulb-cfl", name: "CFL bulb", emoji: "💡", bin: "hazardous", category: "tech", why: "Contains mercury. Home Depot, IKEA, and many cities take them.", alternatives: "LED bulbs last longer and have no mercury.", difficulty: 2 },
  { id: "paint-can", name: "Paint can (latex)", emoji: "🎨", bin: "hazardous", category: "tech", why: "Liquid paint can't go in trash. Solidify or take to HHW facility.", difficulty: 3 },
  { id: "medication", name: "Old medication", emoji: "💊", bin: "hazardous", category: "tech", why: "Don't flush. It contaminates water. Use a pharmacy take-back box.", difficulty: 2 },

  // YARD / OUTDOORS
  { id: "leaves", name: "Leaves & yard trim", emoji: "🍂", bin: "compost", category: "yard", why: "Excellent 'browns' for compost. Many cities pick up curbside in fall.", difficulty: 1, co2Saved: 0.1 },
  { id: "grass-clippings", name: "Grass clippings", emoji: "🌱", bin: "compost", category: "yard", why: "High nitrogen. Best left on lawn ('grasscycle') or composted.", difficulty: 1 },
  { id: "pet-poop", name: "Pet poop", emoji: "💩", bin: "trash", category: "yard", why: "Pathogens survive home compost. Some cities have pet-waste programs.", difficulty: 2 },

  // OFFICE / PAPER
  { id: "office-paper", name: "Office paper", emoji: "📄", bin: "recycle", category: "office", why: "Clean white/printed paper recycles up to 7 times.", difficulty: 1, co2Saved: 0.02 },
  { id: "cardboard", name: "Cardboard box", emoji: "📦", bin: "recycle", category: "office", why: "Flatten it. Remove heavy tape if you can.", difficulty: 1, co2Saved: 0.4, landfillSavedG: 600 },
  { id: "receipt", name: "Receipt (thermal)", emoji: "🧾", bin: "trash", category: "office", why: "Thermal paper is coated with BPA/BPS, which contaminates paper recycling.", alternatives: "Ask for digital receipts.", difficulty: 3 },
  { id: "envelope-window", name: "Envelope w/ plastic window", emoji: "✉️", bin: "recycle", category: "office", why: "Most recyclers handle the window. Tear it out if your city says so.", difficulty: 2 },
  { id: "sticky-note", name: "Sticky note", emoji: "🗒️", bin: "recycle", category: "office", why: "The adhesive is removed at pulping. Recycle freely.", difficulty: 2 },

  // TEXTILE
  { id: "tshirt-worn", name: "Worn-out t-shirt", emoji: "👕", bin: "hazardous", category: "textile", why: "Don't trash textiles. Donate or use textile drop-offs even if torn.", alternatives: "Cut into rags first.", difficulty: 2 },
  { id: "shoes", name: "Old shoes", emoji: "👟", bin: "hazardous", category: "textile", why: "Many brands run takeback (e.g., Nike Reuse-A-Shoe). Don't bin.", difficulty: 2 },

  // OUTDOORS / MISC
  { id: "cigarette-butt", name: "Cigarette butt", emoji: "🚬", bin: "trash", category: "outdoors", why: "Filters are plastic. Never ground-litter them; they leach toxins into water.", difficulty: 2 },
  { id: "chewing-gum", name: "Chewing gum", emoji: "🍬", bin: "trash", category: "kitchen", why: "Most gum bases are synthetic plastic. Wrap in paper before binning.", difficulty: 3 }
];

export function getItem(id: string) {
  return ITEMS.find((i) => i.id === id);
}

export function searchItems(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return ITEMS;
  return ITEMS.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.category.includes(q) ||
      i.bin.includes(q)
  );
}
