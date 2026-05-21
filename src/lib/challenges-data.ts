export type ChallengeArea =
  | "kitchen"
  | "bath"
  | "shopping"
  | "transport"
  | "home"
  | "social";

export type ChallengeDifficulty = 1 | 2 | 3;

export interface Challenge {
  id: string;
  title: string;
  blurb: string;
  area: ChallengeArea;
  difficulty: ChallengeDifficulty;
  estMinutes: number;
  reward: number;
  emoji: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: "compost-coffee",
    title: "Compost today's coffee grounds",
    blurb: "Tip the morning grounds straight into your compost. They're nitrogen gold for soil.",
    area: "kitchen",
    difficulty: 1,
    estMinutes: 2,
    reward: 10,
    emoji: "☕"
  },
  {
    id: "refuse-plastic",
    title: "Refuse one single-use plastic",
    blurb: "Say no thanks to a straw, lid, or cutlery you don't actually need today.",
    area: "shopping",
    difficulty: 1,
    estMinutes: 1,
    reward: 10,
    emoji: "🚫"
  },
  {
    id: "refill-bottle",
    title: "Refill instead of buying new",
    blurb: "Carry your bottle and fill up at a tap or fountain. Skip the plastic entirely.",
    area: "shopping",
    difficulty: 1,
    estMinutes: 1,
    reward: 10,
    emoji: "🚰"
  },
  {
    id: "five-minute-shower",
    title: "Take a 5-minute shower",
    blurb: "Set a timer or play one song. Saves roughly 12 gallons over a longer rinse.",
    area: "bath",
    difficulty: 2,
    estMinutes: 5,
    reward: 15,
    emoji: "🚿"
  },
  {
    id: "full-load-laundry",
    title: "Wash a full load only",
    blurb: "Wait until the basket is full. Half-loads use the same water and energy.",
    area: "home",
    difficulty: 1,
    estMinutes: 2,
    reward: 10,
    emoji: "🧺"
  },
  {
    id: "bring-tote",
    title: "Bring your bag to the store",
    blurb: "Stash a tote near your keys so you never grab plastic at checkout again.",
    area: "shopping",
    difficulty: 1,
    estMinutes: 1,
    reward: 10,
    emoji: "🛍️"
  },
  {
    id: "walk-or-bike",
    title: "Walk or bike one trip",
    blurb: "Swap one short drive for legs or wheels. Under two miles is the sweet spot.",
    area: "transport",
    difficulty: 2,
    estMinutes: 20,
    reward: 20,
    emoji: "🚲"
  },
  {
    id: "repair-not-replace",
    title: "Repair instead of replace",
    blurb: "Fix the loose button, glue the chair, patch the jeans. Keep one thing alive.",
    area: "home",
    difficulty: 2,
    estMinutes: 15,
    reward: 20,
    emoji: "🧵"
  },
  {
    id: "meatless-meal",
    title: "Try a meatless meal",
    blurb: "Beans, lentils, or a veggie bowl. One swap shrinks today's footprint noticeably.",
    area: "kitchen",
    difficulty: 1,
    estMinutes: 25,
    reward: 15,
    emoji: "🥗"
  },
  {
    id: "donate-clothing",
    title: "Donate one piece of clothing",
    blurb: "Pull one item you haven't worn in a year and bag it for donation today.",
    area: "social",
    difficulty: 1,
    estMinutes: 5,
    reward: 15,
    emoji: "👚"
  },
  {
    id: "battery-dropoff",
    title: "Drop off one dead battery",
    blurb: "Most hardware stores take them free. Heavy metals never belong in the trash.",
    area: "home",
    difficulty: 2,
    estMinutes: 10,
    reward: 20,
    emoji: "🔋"
  },
  {
    id: "switch-led",
    title: "Switch one bulb to LED",
    blurb: "LEDs use about 75% less energy and outlast incandescents by a decade.",
    area: "home",
    difficulty: 1,
    estMinutes: 3,
    reward: 15,
    emoji: "💡"
  },
  {
    id: "cancel-paper",
    title: "Cancel one paper subscription",
    blurb: "Catalog, junk mailer, magazine: go digital or unsubscribe in five minutes.",
    area: "home",
    difficulty: 1,
    estMinutes: 5,
    reward: 10,
    emoji: "📬"
  },
  {
    id: "air-dry-laundry",
    title: "Air-dry your laundry",
    blurb: "Skip the dryer for one load. Saves about 4 lbs of CO₂ and softens fabrics.",
    area: "home",
    difficulty: 2,
    estMinutes: 10,
    reward: 20,
    emoji: "🌬️"
  },
  {
    id: "meal-plan-week",
    title: "Plan three meals from what's home",
    blurb: "Shop your fridge first. Less food waste, fewer impulse buys, more creativity.",
    area: "kitchen",
    difficulty: 2,
    estMinutes: 15,
    reward: 15,
    emoji: "📋"
  },
  {
    id: "freeze-leftovers",
    title: "Freeze tonight's leftovers",
    blurb: "Portion and label them. Future you gets a free meal; nothing rots forgotten.",
    area: "kitchen",
    difficulty: 1,
    estMinutes: 5,
    reward: 10,
    emoji: "🧊"
  },
  {
    id: "shorter-shower-temp",
    title: "Wash one load in cold water",
    blurb: "About 90% of a wash's energy heats the water. Cold cleans most things fine.",
    area: "home",
    difficulty: 1,
    estMinutes: 1,
    reward: 10,
    emoji: "❄️"
  },
  {
    id: "bring-lunch",
    title: "Bring lunch from home",
    blurb: "Reusable container, no takeout packaging. Bonus: it's almost always cheaper.",
    area: "kitchen",
    difficulty: 1,
    estMinutes: 10,
    reward: 15,
    emoji: "🥪"
  },
  {
    id: "shampoo-bar",
    title: "Try a shampoo or soap bar",
    blurb: "One bar replaces two or three plastic bottles. Slimmer shower, slimmer trash.",
    area: "bath",
    difficulty: 2,
    estMinutes: 5,
    reward: 15,
    emoji: "🧼"
  },
  {
    id: "tap-water-only",
    title: "Drink only tap water today",
    blurb: "Skip every bottled or boxed beverage. A small streak that saves real plastic.",
    area: "kitchen",
    difficulty: 2,
    estMinutes: 1,
    reward: 15,
    emoji: "💧"
  },
  {
    id: "carpool-once",
    title: "Carpool one ride today",
    blurb: "Coordinate with someone heading the same way. Halve the fuel, halve the cost.",
    area: "transport",
    difficulty: 2,
    estMinutes: 5,
    reward: 20,
    emoji: "🚗"
  },
  {
    id: "share-tip",
    title: "Share one sorting tip with a friend",
    blurb: "Text a friend something you learned. Habits stick when they spread.",
    area: "social",
    difficulty: 1,
    estMinutes: 2,
    reward: 10,
    emoji: "💬"
  },
  {
    id: "audit-fridge",
    title: "Audit the back of the fridge",
    blurb: "Pull out anything past prime. Compost what's gone, eat what's still good tonight.",
    area: "kitchen",
    difficulty: 2,
    estMinutes: 10,
    reward: 15,
    emoji: "🧊"
  },
  {
    id: "rinse-recyclables",
    title: "Rinse three recyclables right",
    blurb: "A quick swirl prevents whole loads from getting rejected at the facility.",
    area: "home",
    difficulty: 1,
    estMinutes: 3,
    reward: 10,
    emoji: "🫙"
  },
  {
    id: "reusable-coffee-cup",
    title: "Bring your own coffee cup",
    blurb: "Most cafés will fill it gladly, and many give a discount for skipping the paper cup.",
    area: "shopping",
    difficulty: 1,
    estMinutes: 1,
    reward: 10,
    emoji: "🥤"
  }
];

function hashDate(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickDaily(date: Date = new Date()): Challenge[] {
  const key = date.toISOString().slice(0, 10);
  const seed = hashDate(key);
  const byArea = new Map<ChallengeArea, Challenge[]>();
  for (const c of CHALLENGES) {
    const list = byArea.get(c.area) ?? [];
    list.push(c);
    byArea.set(c.area, list);
  }
  const areas = Array.from(byArea.keys());
  const rotated = areas.slice(seed % areas.length).concat(areas.slice(0, seed % areas.length));
  const picks: Challenge[] = [];
  const used = new Set<string>();
  for (let i = 0; i < rotated.length && picks.length < 3; i++) {
    const list = byArea.get(rotated[i]) ?? [];
    if (!list.length) continue;
    const idx = (seed + i * 7919) % list.length;
    const choice = list[idx];
    if (!used.has(choice.id)) {
      picks.push(choice);
      used.add(choice.id);
    }
  }
  let extra = 0;
  while (picks.length < 3 && extra < CHALLENGES.length) {
    const c = CHALLENGES[(seed + extra) % CHALLENGES.length];
    if (!used.has(c.id)) {
      picks.push(c);
      used.add(c.id);
    }
    extra++;
  }
  return picks;
}

export function todayKey(date: Date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getChallenge(id: string) {
  return CHALLENGES.find((c) => c.id === id);
}

export const AREA_LABEL: Record<ChallengeArea, string> = {
  kitchen: "Kitchen",
  bath: "Bath",
  shopping: "Shopping",
  transport: "Transport",
  home: "Home",
  social: "Social"
};

export const AREA_EMOJI: Record<ChallengeArea, string> = {
  kitchen: "🍳",
  bath: "🛁",
  shopping: "🛒",
  transport: "🚲",
  home: "🏡",
  social: "🤝"
};
