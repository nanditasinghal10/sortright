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
  // KITCHEN — food scraps (compost)
  { id: "banana-peel", name: "Banana peel", emoji: "🍌", bin: "compost", category: "kitchen", why: "Food scraps break down into nutrient-rich soil in compost.", difficulty: 1, co2Saved: 0.15, landfillSavedG: 120 },
  { id: "coffee-grounds", name: "Coffee grounds", emoji: "☕", bin: "compost", category: "kitchen", why: "Excellent nitrogen source for compost. Filter goes in too.", difficulty: 1, co2Saved: 0.05, landfillSavedG: 30 },
  { id: "eggshells", name: "Eggshells", emoji: "🥚", bin: "compost", category: "kitchen", why: "Add calcium to compost. Crush for faster breakdown.", difficulty: 1, co2Saved: 0.02, landfillSavedG: 12 },
  { id: "tea-bag", name: "Tea bag", emoji: "🍵", bin: "compost", category: "kitchen", why: "Mostly compostable, but some bags use plastic mesh. Tear open if unsure.", alternatives: "Loose-leaf tea avoids the issue entirely.", difficulty: 3 },
  { id: "apple-core", name: "Apple core", emoji: "🍎", bin: "compost", category: "kitchen", why: "Core, seeds, and stem all break down quickly in compost.", difficulty: 1, co2Saved: 0.08, landfillSavedG: 80 },
  { id: "bread-stale", name: "Stale bread", emoji: "🍞", bin: "compost", category: "kitchen", why: "Compost it in small pieces. Avoid heavily oiled or moldy loaves in worm bins.", difficulty: 1, co2Saved: 0.06, landfillSavedG: 60 },
  { id: "corn-cob", name: "Corn cob", emoji: "🌽", bin: "compost", category: "kitchen", why: "Slow but steady compost input. Cut into chunks to speed it up.", difficulty: 2, co2Saved: 0.1, landfillSavedG: 90 },
  { id: "potato-peels", name: "Potato peels", emoji: "🥔", bin: "compost", category: "kitchen", why: "Compost freely. Bury under browns to deter critters.", difficulty: 1, co2Saved: 0.06, landfillSavedG: 50 },
  { id: "orange-peel", name: "Orange peel", emoji: "🍊", bin: "compost", category: "kitchen", why: "Citrus peels compost fine in moderation. Chop them up first.", difficulty: 1, co2Saved: 0.05, landfillSavedG: 40 },
  { id: "avocado-pit", name: "Avocado pit", emoji: "🥑", bin: "compost", category: "kitchen", why: "Compostable but slow. Smash it first or accept a long ride.", difficulty: 3 },
  { id: "watermelon-rind", name: "Watermelon rind", emoji: "🍉", bin: "compost", category: "kitchen", why: "High water content; mix with browns so the pile doesn't get soggy.", difficulty: 1, co2Saved: 0.07, landfillSavedG: 200 },
  { id: "cheese-rind", name: "Cheese rind", emoji: "🧀", bin: "compost", category: "kitchen", why: "Industrial compost takes dairy. Many home piles don't, due to pests.", difficulty: 3 },
  { id: "popcorn-stale", name: "Stale popcorn", emoji: "🍿", bin: "compost", category: "kitchen", why: "Plain popcorn composts fast. Buttery or salted bowls best go to industrial compost.", difficulty: 2 },

  // KITCHEN — packaging
  { id: "pizza-box-greasy", name: "Greasy pizza box", emoji: "🍕", bin: "compost", category: "packaging", why: "Grease contaminates paper recycling. Compost the soiled parts; recycle clean lid.", difficulty: 3 },
  { id: "yogurt-cup", name: "Yogurt cup (#5)", emoji: "🥛", bin: "recycle", category: "packaging", why: "PP plastic #5 is widely recyclable when rinsed.", difficulty: 2, co2Saved: 0.08, landfillSavedG: 18 },
  { id: "glass-jar", name: "Glass jar", emoji: "🫙", bin: "recycle", category: "packaging", why: "Glass is endlessly recyclable. Rinse, leave the lid on or off per local rules.", difficulty: 1, co2Saved: 0.3, landfillSavedG: 250 },
  { id: "aluminum-can", name: "Aluminum can", emoji: "🥫", bin: "recycle", category: "packaging", why: "Recycling aluminum saves 95% of the energy vs. new metal.", difficulty: 1, co2Saved: 0.5, landfillSavedG: 15 },
  { id: "wine-bottle", name: "Wine bottle", emoji: "🍾", bin: "recycle", category: "packaging", why: "Glass recycles endlessly. Cork goes in compost or trash.", difficulty: 1, co2Saved: 0.35, landfillSavedG: 400 },
  { id: "water-bottle-pet", name: "Plastic water bottle", emoji: "💧", bin: "recycle", category: "packaging", why: "PET #1 is the most-recycled plastic. Empty, cap on, into the bin.", difficulty: 1, co2Saved: 0.1, landfillSavedG: 25 },
  { id: "juice-box", name: "Juice box (carton)", emoji: "🧃", bin: "recycle", category: "packaging", why: "Aseptic cartons are accepted by most curbside programs now. Check your city.", difficulty: 3 },
  { id: "plastic-bag", name: "Plastic grocery bag", emoji: "🛍️", bin: "trash", category: "packaging", why: "Tangles recycling machinery. Take to a store drop-off instead.", alternatives: "Use a reusable tote.", difficulty: 3 },
  { id: "styrofoam", name: "Styrofoam takeout", emoji: "🍱", bin: "trash", category: "packaging", why: "Polystyrene #6 is rarely accepted curbside.", alternatives: "Ask for paper or bring your own container.", difficulty: 2 },
  { id: "plastic-straw", name: "Plastic straw", emoji: "🥤", bin: "trash", category: "packaging", why: "Too small to sort; falls through recycling sorters.", alternatives: "Reusable metal or silicone straws.", difficulty: 2 },
  { id: "cling-wrap", name: "Cling wrap", emoji: "🎞️", bin: "trash", category: "kitchen", why: "Soft plastic film isn't curbside-recyclable in most places.", alternatives: "Beeswax wraps or silicone covers.", difficulty: 2 },
  { id: "takeout-box", name: "Plastic takeout container", emoji: "🥡", bin: "trash", category: "packaging", why: "Mixed plastic + food residue. Rinse and recycle if your city accepts the resin code.", difficulty: 3 },
  { id: "chip-bag", name: "Chip bag", emoji: "🥨", bin: "trash", category: "packaging", why: "Metallized film can't be sorted curbside. TerraCycle drop-off is the best route.", difficulty: 2 },
  { id: "plastic-cutlery", name: "Plastic cutlery", emoji: "🍴", bin: "trash", category: "packaging", why: "Too small + mixed resins. Skip them and bring your own.", alternatives: "Refuse single-use cutlery when ordering out.", difficulty: 2 },
  { id: "balloon", name: "Latex balloon", emoji: "🎈", bin: "trash", category: "outdoors", why: "Even 'biodegradable' balloons take years and choke wildlife. Never release them.", difficulty: 2 },

  // BATH
  { id: "toothpaste-tube", name: "Toothpaste tube", emoji: "🦷", bin: "trash", category: "bath", why: "Mixed-material laminate tubes aren't curbside-recyclable.", alternatives: "Toothpaste tabs or recyclable mono-material tubes.", difficulty: 3 },
  { id: "toothbrush", name: "Toothbrush", emoji: "🪥", bin: "trash", category: "bath", why: "Mixed plastic + nylon bristles. Some brands run mail-back programs.", alternatives: "Bamboo brushes with replaceable heads.", difficulty: 2 },
  { id: "shampoo-bottle", name: "Shampoo bottle (HDPE #2)", emoji: "🧴", bin: "recycle", category: "bath", why: "HDPE #2 is widely accepted. Rinse and recap.", difficulty: 1, co2Saved: 0.12 },
  { id: "razor-blade", name: "Disposable razor", emoji: "🪒", bin: "hazardous", category: "bath", why: "Mixed metal + plastic; blade is sharp. Take to a TerraCycle drop-off.", alternatives: "Safety razor with replaceable blades.", difficulty: 3 },
  { id: "cotton-swab", name: "Cotton swab", emoji: "🦠", bin: "trash", category: "bath", why: "Too small + soiled. Plastic-stick versions are the worst offenders.", alternatives: "Reusable silicone or paper-stick swabs.", difficulty: 2 },
  { id: "toilet-paper-roll", name: "Toilet paper roll", emoji: "🧻", bin: "recycle", category: "bath", why: "Plain cardboard tube; recycle with paper.", difficulty: 1, co2Saved: 0.02, landfillSavedG: 8 },
  { id: "band-aid", name: "Used band-aid", emoji: "🩹", bin: "trash", category: "bath", why: "Medical waste. Even paper-backed adhesives don't recycle.", difficulty: 1 },

  // TECH / HAZARDOUS
  { id: "aa-battery", name: "AA battery", emoji: "🔋", bin: "hazardous", category: "tech", why: "Heavy metals leach in landfill. Most hardware stores have a free drop-off.", difficulty: 1, co2Saved: 0.05 },
  { id: "phone-old", name: "Old smartphone", emoji: "📱", bin: "hazardous", category: "tech", why: "E-waste contains valuable + toxic materials. Manufacturer or municipal drop-off.", difficulty: 1, co2Saved: 5 },
  { id: "usb-cable", name: "USB cable / charger", emoji: "🔌", bin: "hazardous", category: "tech", why: "E-waste, recyclable through municipal e-waste programs.", difficulty: 2 },
  { id: "lightbulb-cfl", name: "CFL bulb", emoji: "💡", bin: "hazardous", category: "tech", why: "Contains mercury. Home Depot, IKEA, and many cities take them.", alternatives: "LED bulbs last longer and have no mercury.", difficulty: 2 },
  { id: "paint-can", name: "Paint can (latex)", emoji: "🎨", bin: "hazardous", category: "tech", why: "Liquid paint can't go in trash. Solidify or take to HHW facility.", difficulty: 3 },
  { id: "medication", name: "Old medication", emoji: "💊", bin: "hazardous", category: "tech", why: "Don't flush. It contaminates water. Use a pharmacy take-back box.", difficulty: 2 },
  { id: "cd-dvd", name: "Old CD or DVD", emoji: "💿", bin: "hazardous", category: "tech", why: "Polycarbonate + aluminum coating. Specialty e-waste drop-offs accept them.", difficulty: 2 },
  { id: "printer-cartridge", name: "Printer ink cartridge", emoji: "🖨️", bin: "hazardous", category: "tech", why: "Most office stores and manufacturers run free takeback programs.", difficulty: 2 },
  { id: "game-controller", name: "Game controller", emoji: "🎮", bin: "hazardous", category: "tech", why: "Embedded battery + circuit board makes it e-waste, not trash.", difficulty: 2 },
  { id: "thermometer-mercury", name: "Mercury thermometer", emoji: "🌡️", bin: "hazardous", category: "tech", why: "Mercury is highly toxic. Take to a household hazardous waste facility.", alternatives: "Digital thermometers are cheap and safe.", difficulty: 3 },
  { id: "nail-polish", name: "Nail polish bottle", emoji: "💅", bin: "hazardous", category: "bath", why: "Solvents and pigments are flammable + toxic. HHW only.", difficulty: 3 },
  { id: "aerosol-can", name: "Aerosol can", emoji: "💨", bin: "hazardous", category: "tech", why: "Pressurized; can explode in trash trucks. Empty cans go to HHW.", difficulty: 3 },
  { id: "propane-tank", name: "Propane tank (small)", emoji: "🛢️", bin: "hazardous", category: "tech", why: "Pressurized fuel cylinder. Many hardware stores swap or recycle them.", difficulty: 3 },
  { id: "smoke-detector", name: "Old smoke detector", emoji: "🚨", bin: "hazardous", category: "tech", why: "Most contain a tiny radioactive source. Manufacturer mail-back is the safe path.", difficulty: 3 },
  { id: "vape-pen", name: "Disposable vape pen", emoji: "💨", bin: "hazardous", category: "tech", why: "Lithium battery + nicotine residue. Never trash. E-waste drop-off.", difficulty: 3 },

  // YARD / OUTDOORS
  { id: "leaves", name: "Leaves & yard trim", emoji: "🍂", bin: "compost", category: "yard", why: "Excellent 'browns' for compost. Many cities pick up curbside in fall.", difficulty: 1, co2Saved: 0.1 },
  { id: "grass-clippings", name: "Grass clippings", emoji: "🌱", bin: "compost", category: "yard", why: "High nitrogen. Best left on lawn ('grasscycle') or composted.", difficulty: 1 },
  { id: "branches-small", name: "Small branches", emoji: "🪵", bin: "compost", category: "yard", why: "Chip them first. Many cities take woody yard waste curbside.", difficulty: 2 },
  { id: "wilted-bouquet", name: "Wilted bouquet", emoji: "💐", bin: "compost", category: "yard", why: "Cut flowers compost well. Skip the plastic wrap and ribbon.", difficulty: 1 },
  { id: "pet-poop", name: "Pet poop", emoji: "💩", bin: "trash", category: "yard", why: "Pathogens survive home compost. Some cities have pet-waste programs.", difficulty: 2 },

  // OFFICE / PAPER
  { id: "office-paper", name: "Office paper", emoji: "📄", bin: "recycle", category: "office", why: "Clean white/printed paper recycles up to 7 times.", difficulty: 1, co2Saved: 0.02 },
  { id: "cardboard", name: "Cardboard box", emoji: "📦", bin: "recycle", category: "office", why: "Flatten it. Remove heavy tape if you can.", difficulty: 1, co2Saved: 0.4, landfillSavedG: 600 },
  { id: "newspaper", name: "Newspaper", emoji: "📰", bin: "recycle", category: "office", why: "Pure newsprint is the easiest paper to recycle.", difficulty: 1, co2Saved: 0.04, landfillSavedG: 60 },
  { id: "magazine", name: "Old magazine", emoji: "📖", bin: "recycle", category: "office", why: "Glossy coatings are fine for modern paper mills.", difficulty: 2, co2Saved: 0.04, landfillSavedG: 80 },
  { id: "paperback-book", name: "Old paperback book", emoji: "📘", bin: "recycle", category: "office", why: "Donate first if it's readable. Otherwise paperbacks recycle with paper.", alternatives: "Drop at a Little Free Library.", difficulty: 2 },
  { id: "calendar-old", name: "Wall calendar", emoji: "📅", bin: "recycle", category: "office", why: "Paper recycles even with the small wire spine; many programs accept it.", difficulty: 2 },
  { id: "receipt", name: "Receipt (thermal)", emoji: "🧾", bin: "trash", category: "office", why: "Thermal paper is coated with BPA/BPS, which contaminates paper recycling.", alternatives: "Ask for digital receipts.", difficulty: 3 },
  { id: "envelope-window", name: "Envelope w/ plastic window", emoji: "✉️", bin: "recycle", category: "office", why: "Most recyclers handle the window. Tear it out if your city says so.", difficulty: 2 },
  { id: "sticky-note", name: "Sticky note", emoji: "🗒️", bin: "recycle", category: "office", why: "The adhesive is removed at pulping. Recycle freely.", difficulty: 2 },
  { id: "crayons", name: "Stub of crayons", emoji: "🖍️", bin: "trash", category: "office", why: "Wax + pigment. Crayola runs ColorCycle for schools; otherwise trash.", difficulty: 2 },

  // TEXTILE
  { id: "tshirt-worn", name: "Worn-out t-shirt", emoji: "👕", bin: "hazardous", category: "textile", why: "Don't trash textiles. Donate or use textile drop-offs even if torn.", alternatives: "Cut into rags first.", difficulty: 2 },
  { id: "shoes", name: "Old shoes", emoji: "👟", bin: "hazardous", category: "textile", why: "Many brands run takeback (e.g., Nike Reuse-A-Shoe). Don't bin.", difficulty: 2 },
  { id: "socks", name: "Holey socks", emoji: "🧦", bin: "hazardous", category: "textile", why: "Textile recyclers shred unwearable cotton + polyester for insulation.", difficulty: 2 },
  { id: "jeans", name: "Old jeans", emoji: "👖", bin: "hazardous", category: "textile", why: "Cotton denim is highly recyclable through programs like Blue Jeans Go Green.", difficulty: 2 },

  // OUTDOORS / MISC
  { id: "cigarette-butt", name: "Cigarette butt", emoji: "🚬", bin: "trash", category: "outdoors", why: "Filters are plastic. Never ground-litter them; they leach toxins into water.", difficulty: 2 },
  { id: "chewing-gum", name: "Chewing gum", emoji: "🍬", bin: "trash", category: "kitchen", why: "Most gum bases are synthetic plastic. Wrap in paper before binning.", difficulty: 3 },
  { id: "ceramic-mug", name: "Broken ceramic mug", emoji: "🏺", bin: "trash", category: "kitchen", why: "Fired ceramic isn't recyclable with glass. Wrap shards before tossing.", difficulty: 3 },
  { id: "diaper-used", name: "Used diaper", emoji: "🚼", bin: "trash", category: "bath", why: "Mixed plastic, gel, and biological waste. Trash only, despite the name 'biodegradable'.", alternatives: "Cloth diapers cut landfill weight dramatically.", difficulty: 2 },

  // ESOTERIC / TRICKY
  { id: "face-mask-disposable", name: "Disposable face mask", emoji: "😷", bin: "trash", category: "bath", why: "Layered nonwoven plus elastic + metal nose strip. Always trash.", alternatives: "Reusable cloth masks once airborne risk is low.", difficulty: 2 },
  { id: "vhs-tape", name: "VHS tape", emoji: "📼", bin: "hazardous", category: "tech", why: "Magnetic tape coated in metal oxide. Specialty e-waste recyclers handle them.", difficulty: 3 },
  { id: "floppy-disk", name: "Floppy disk", emoji: "💾", bin: "hazardous", category: "tech", why: "Magnetic media inside a plastic shell. E-waste, not curbside.", difficulty: 3 },
  { id: "old-laptop", name: "Old laptop", emoji: "💻", bin: "hazardous", category: "tech", why: "Lithium battery + heavy metals. Manufacturer takeback or municipal e-waste only.", difficulty: 1, co2Saved: 12 },
  { id: "keyboard-old", name: "Old keyboard", emoji: "⌨️", bin: "hazardous", category: "tech", why: "Mostly plastic but has a circuit board. E-waste drop-off.", difficulty: 2 },
  { id: "computer-mouse", name: "Old computer mouse", emoji: "🖱️", bin: "hazardous", category: "tech", why: "Tiny circuit board + battery on wireless ones. E-waste.", difficulty: 2 },
  { id: "old-camera", name: "Old digital camera", emoji: "📷", bin: "hazardous", category: "tech", why: "Battery + electronics. E-waste, never trash.", difficulty: 2 },
  { id: "christmas-tree-real", name: "Real Christmas tree", emoji: "🎄", bin: "compost", category: "yard", why: "Most cities run free curbside pickup in January and chip them into mulch.", difficulty: 1, co2Saved: 4 },
  { id: "stuffed-animal", name: "Old stuffed animal", emoji: "🧸", bin: "hazardous", category: "textile", why: "Donate if clean. Otherwise textile drop-offs accept them for recycling.", difficulty: 2 },
  { id: "picture-frame", name: "Broken picture frame", emoji: "🖼️", bin: "trash", category: "office", why: "Mixed wood, glass, and metal — typically too small to disassemble curbside.", difficulty: 3 },
  { id: "wood-pencil", name: "Wood pencil stub", emoji: "✏️", bin: "trash", category: "office", why: "Graphite + ferrule + eraser. Too small + mixed for paper recycling.", difficulty: 2 },
  { id: "lipstick-tube", name: "Lipstick tube", emoji: "💄", bin: "trash", category: "bath", why: "Mixed plastic + magnet + residue. Some brands run mail-back beauty programs.", difficulty: 3 },
  { id: "umbrella-broken", name: "Broken umbrella", emoji: "☂️", bin: "trash", category: "outdoors", why: "Mixed metal ribs, plastic handle, and fabric. Bulk waste in most cities.", difficulty: 3 },
  { id: "eyeglasses-old", name: "Old eyeglasses", emoji: "👓", bin: "hazardous", category: "tech", why: "Donate at LensCrafters, Lions Club, or many optometrists. Never landfill.", difficulty: 2 },
  { id: "backpack-worn", name: "Worn-out backpack", emoji: "🎒", bin: "hazardous", category: "textile", why: "Textile drop-offs accept even torn backpacks for shredding.", difficulty: 2 },
  { id: "tennis-ball", name: "Used tennis ball", emoji: "🎾", bin: "trash", category: "outdoors", why: "Pressurized rubber + felt. Some shelters love them as dog toys; otherwise trash.", difficulty: 3 },
  { id: "yoga-mat", name: "Old yoga mat", emoji: "🧘", bin: "hazardous", category: "textile", why: "PVC and TPE mats are not curbside-recyclable. Lululemon and others run takeback.", difficulty: 3 },
  { id: "chopsticks-disposable", name: "Disposable chopsticks", emoji: "🥢", bin: "compost", category: "kitchen", why: "Untreated bamboo composts well. Lacquered ones go in trash.", difficulty: 2 },
  { id: "cooking-oil", name: "Used cooking oil", emoji: "🍳", bin: "hazardous", category: "kitchen", why: "Never pour down the drain. Many cities collect it as HHW or for biodiesel.", difficulty: 3 },
  { id: "k-cup", name: "K-cup coffee pod", emoji: "🟫", bin: "trash", category: "kitchen", why: "Mixed foil, plastic, and grounds. Peel apart only if your brand is curbside-friendly.", alternatives: "Refillable steel pods or a French press.", difficulty: 3 },
  { id: "wine-cork-natural", name: "Natural wine cork", emoji: "🍷", bin: "compost", category: "kitchen", why: "Real cork composts. Synthetic 'corks' (plastic) go in trash.", difficulty: 3 },
  { id: "twist-tie", name: "Bread twist tie", emoji: "➰", bin: "trash", category: "kitchen", why: "Wire-and-paper combo too small to sort. Save them and reuse.", difficulty: 2 },
  { id: "glow-stick", name: "Used glow stick", emoji: "✨", bin: "hazardous", category: "tech", why: "Glass ampoule + chemical mix. HHW only.", difficulty: 3 },
  { id: "smoke-alarm-battery", name: "9V battery", emoji: "⚡", bin: "hazardous", category: "tech", why: "Tape the terminals before drop-off — 9V batteries can short and start fires.", difficulty: 2 },
  { id: "bicycle-tube", name: "Bicycle inner tube", emoji: "🚲", bin: "hazardous", category: "outdoors", why: "Many bike shops run rubber takeback programs. Don't trash.", difficulty: 3 },
  { id: "garden-hose", name: "Old garden hose", emoji: "🐍", bin: "trash", category: "yard", why: "Tangles recycling machinery the same as plastic bags. Cut, bag, and bin.", difficulty: 3 },
  { id: "broken-mirror", name: "Broken mirror", emoji: "🪞", bin: "hazardous", category: "tech", why: "Silvered glass isn't bottle-glass and shards are dangerous. HHW or wrap heavily for trash.", difficulty: 3 },
  { id: "fire-extinguisher", name: "Old fire extinguisher", emoji: "🧯", bin: "hazardous", category: "tech", why: "Pressurized vessel + chemicals. Fire stations and HHW take them.", difficulty: 3 },
  { id: "hair-clippings", name: "Hair clippings", emoji: "💇", bin: "compost", category: "bath", why: "Pure keratin composts slowly but does break down. Mix with browns.", difficulty: 3 },
  { id: "pencil-shavings", name: "Pencil shavings", emoji: "🪶", bin: "compost", category: "office", why: "Wood + graphite. Compost in moderation — graphite is inert.", difficulty: 3 },
  { id: "candle-stub", name: "Candle stub", emoji: "🕯️", bin: "trash", category: "kitchen", why: "Paraffin wax doesn't compost or recycle. Beeswax stubs can be re-melted.", difficulty: 3 },
  { id: "playing-cards", name: "Old playing cards", emoji: "🎴", bin: "recycle", category: "office", why: "Most decks are paperboard with a thin plastic coating; recycle with mixed paper.", difficulty: 2 },
  { id: "matchbook", name: "Used matchbook", emoji: "🔥", bin: "trash", category: "office", why: "Sulfur tips + paper. Make sure they're fully cool before binning.", difficulty: 2 }
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
