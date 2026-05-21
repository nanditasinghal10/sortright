"use client";

import { motion } from "framer-motion";
import {
  ChefHat,
  Bath,
  Shirt,
  Cpu,
  Bike,
  Users,
  type LucideIcon
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { FadeUp, easeOrganic } from "@/components/motion-primitives";

interface AreaTip {
  title: string;
  body: string;
}

interface Area {
  id: string;
  icon: LucideIcon;
  kicker: string;
  title: string;
  intro: string;
  tips: AreaTip[];
}

const AREAS: Area[] = [
  {
    id: "kitchen",
    icon: ChefHat,
    kicker: "01 / Kitchen",
    title: "Where most of your waste hides.",
    intro:
      "Roughly a quarter of household trash starts here. Small shifts pay off fast.",
    tips: [
      {
        title: "Set up a freezer scrap jar.",
        body: "Onion skins, carrot tops, parmesan rinds. Freeze them, then simmer into stock. Free flavor, fewer scraps."
      },
      {
        title: "Compost the obvious stuff first.",
        body: "Coffee grounds, eggshells, peels, tea bags. Even a countertop bin shipped to the curb makes a real dent."
      },
      {
        title: "Shop the fridge before the store.",
        body: "Cook one meal each week from what's already wilting. The cheapest, lowest-carbon ingredient is the one you already own."
      },
      {
        title: "Swap cling wrap for a lid or beeswax wrap.",
        body: "Soft plastic film is one of the few things actually banned from most curbside recycling."
      },
      {
        title: "Keep a reusable bag by the door.",
        body: "Not in the car, not in the closet. By the door. Friction is what breaks the habit."
      }
    ]
  },
  {
    id: "bath",
    icon: Bath,
    kicker: "02 / Bath",
    title: "Refill before you replace.",
    intro:
      "The bathroom is small but mighty. Most products are single-use plastic by default.",
    tips: [
      {
        title: "Try one bar version this month.",
        body: "Shampoo bar, conditioner bar, dish bar. Pick one. If it works, keep going. If not, no harm done."
      },
      {
        title: "Switch to a safety razor.",
        body: "One handle, replaceable blades. Skip a few hundred plastic-handle disposables over a lifetime."
      },
      {
        title: "Buy refill pouches when offered.",
        body: "Hand soap, body wash, lotion. Refills typically use 70 to 80% less plastic than a new bottle."
      },
      {
        title: "Hold onto the toothbrush a little longer.",
        body: "Three to four months is fine for most adults. The 'replace every six weeks' line is marketing."
      }
    ]
  },
  {
    id: "wardrobe",
    icon: Shirt,
    kicker: "03 / Wardrobe",
    title: "Mend, swap, then buy.",
    intro:
      "Textiles are one of the fastest-growing waste streams. Slowing down here is one of the highest-leverage moves.",
    tips: [
      {
        title: "Learn one mend.",
        body: "A button. A small hole. A loose hem. YouTube it once and you've added years to half your closet."
      },
      {
        title: "Set a 30-wear test before buying.",
        body: "Will you wear this thirty times? If not, it's a costume, not a wardrobe piece."
      },
      {
        title: "Shop secondhand first for trends.",
        body: "Trend pieces are the most likely to be donated within a year. Buy them where they already are."
      },
      {
        title: "Wash less, wash cooler.",
        body: "Most clothes don't need a hot wash after one wear. Cold cycles use up to 90% less energy."
      },
      {
        title: "Don't trash worn-out clothes. Drop them off.",
        body: "Most cities have textile-recycling bins. Even ripped or stained items can be downcycled into rags or insulation."
      }
    ]
  },
  {
    id: "tech",
    icon: Cpu,
    kicker: "04 / Tech",
    title: "Repair beats replace.",
    intro:
      "E-waste is the fastest-growing waste stream globally, and the one most likely to be mishandled.",
    tips: [
      {
        title: "Try a repair before retiring a device.",
        body: "Battery swaps and screen replacements often cost a fraction of a new phone. iFixit has a guide for almost everything."
      },
      {
        title: "Use a takeback program for old electronics.",
        body: "Best Buy, Apple, Staples, and most municipalities accept e-waste free. Never trash a device, even a dead one."
      },
      {
        title: "Buy refurbished for tablets and phones.",
        body: "Manufacturer-refurb units typically come with a one-year warranty and avoid the heaviest-impact part of the lifecycle."
      },
      {
        title: "Consolidate your charging cables.",
        body: "USB-C is now standard for most devices. Donate the drawer of mystery cables to an e-waste bin."
      }
    ]
  },
  {
    id: "transport",
    icon: Bike,
    kicker: "05 / Transport & Energy",
    title: "Small wins, daily.",
    intro:
      "These are the levers most people overestimate the cost of and underestimate the payoff.",
    tips: [
      {
        title: "Combine errands into one trip.",
        body: "A cold engine pollutes more than a warm one. One thoughtful loop beats four short hops."
      },
      {
        title: "Walk or bike anything under a mile.",
        body: "Half of U.S. car trips are under three miles. The shortest ones are the easiest to swap."
      },
      {
        title: "Set the thermostat 1 to 2 degrees further from comfort.",
        body: "Cooler in winter, warmer in summer. A sweater is cheaper than a kilowatt-hour."
      },
      {
        title: "Air-dry one load a week.",
        body: "Dryers are the second-thirstiest appliance after the fridge. A drying rack and a window go far."
      }
    ]
  },
  {
    id: "community",
    icon: Users,
    kicker: "06 / Community",
    title: "You are not the only system.",
    intro:
      "Personal habits matter. Shared infrastructure matters more. Plug into both.",
    tips: [
      {
        title: "Find your municipal sustainability page.",
        body: "Almost every city publishes a free guide to compost pickup, hazardous waste days, and bulk-item programs. Bookmark it."
      },
      {
        title: "Join or start a local Buy Nothing group.",
        body: "Furniture, tools, leftover paint, kid clothes. The second-best use of an item is someone else using it."
      },
      {
        title: "Ask one neighbor about their setup.",
        body: "The best composters and bulk-buyers usually live within a block. People love to share what's working."
      },
      {
        title: "Speak up at the grocery and restaurant.",
        body: "Skip the bag. Decline the straw. Ask if they compost. Polite, repeated requests change defaults."
      }
    ]
  }
];

function SectionDivider({ delay = 0 }: { delay?: number }) {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease: easeOrganic, delay }}
        style={{ originX: 0 }}
        className="h-px bg-gradient-to-r from-sage-400/70 via-sage-300/50 to-transparent"
      />
    </div>
  );
}

function AreaSection({ area, index }: { area: Area; index: number }) {
  const Icon = area.icon;
  const reversed = index % 2 === 1;
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
      <div
        className={`grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-14 ${
          reversed ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <FadeUp className="md:sticky md:top-24 md:self-start">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center h-12 w-12 rounded-2xl bg-sage-100 text-sage-800 border border-sage-300 shadow-soft">
              <Icon className="h-6 w-6" />
            </span>
            <span className="text-xs uppercase tracking-[0.22em] text-sage-700 font-medium">
              {area.kicker}
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-6 leading-tight">
            {area.title}
          </h2>
          <p className="mt-4 text-ink-soft leading-relaxed">{area.intro}</p>
        </FadeUp>

        <div className="space-y-4">
          {area.tips.map((tip, i) => (
            <FadeUp key={tip.title} delay={i * 0.05}>
              <Card className="hover:shadow-leaf transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl text-sage-400 leading-none shrink-0 w-10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <CardTitle className="text-xl">{tip.title}</CardTitle>
                    <p className="mt-2 text-ink-soft leading-relaxed">
                      {tip.body}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SustainableLivingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOrganic }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-clay-300 bg-clay-100/70 px-4 py-1.5 text-xs font-medium text-clay-800">
              The living guide
            </span>
            <h1 className="font-display text-5xl md:text-7xl tracking-tight mt-6 leading-[1] text-ink">
              Habits over <span className="italic text-sage-700">perfection</span>.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed max-w-2xl mx-auto">
              Sustainable living isn&rsquo;t a moral test. It&rsquo;s a stack of
              tiny defaults: the bag by the door, the freezer jar, the repaired
              hem. Pick one room and start.
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {AREAS.map((area, i) => (
        <div key={area.id}>
          <AreaSection area={area} index={i} />
          {i < AREAS.length - 1 && <SectionDivider delay={0.1} />}
        </div>
      ))}

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <FadeUp>
          <p className="font-display text-2xl md:text-3xl italic text-ink-soft leading-relaxed">
            Pick one tip. Try it for a week. The rest will follow if it wants to.
          </p>
        </FadeUp>
      </section>
    </>
  );
}
