import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ITEMS, getItem, type WasteItem } from "@/lib/items";
import { BINS, type BinId } from "@/lib/bins";
import { BinPill } from "@/components/learn/bin-pill";
import { ItemCard } from "@/components/learn/item-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

const PREP_BY_BIN: Record<BinId, string[]> = {
  recycle: [
    "Empty and rinse. No liquids, no food residue.",
    "Leave the lid on or off depending on your local program.",
    "Keep it loose. Bagged recyclables often get sorted as trash."
  ],
  compost: [
    "Smaller pieces break down faster, so chop bulky scraps.",
    "Mix wet 'greens' with dry 'browns' (paper, leaves) for balance.",
    "Skip the produce stickers and twist-ties; they're plastic."
  ],
  hazardous: [
    "Never bin it. Never flush it.",
    "Find a drop-off: hardware store, pharmacy, or municipal HHW facility.",
    "Tape battery terminals before transport to prevent shorts."
  ],
  trash: [
    "Bag it cleanly so it doesn't contaminate other streams.",
    "Consider the alternatives next time. Small swaps add up.",
    "If unsure, check your city's site before defaulting to trash."
  ]
};

export async function generateStaticParams() {
  return ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getItem(id);
  if (!item) return { title: "Item not found" };
  return {
    title: item.name,
    description: item.why
  };
}

function pickRelated(item: WasteItem, count = 3): WasteItem[] {
  const pool = ITEMS.filter(
    (i) => i.category === item.category && i.id !== item.id
  );
  const out: WasteItem[] = [];
  const seen = new Set<number>();
  while (out.length < count && seen.size < pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    if (seen.has(idx)) continue;
    seen.add(idx);
    out.push(pool[idx]);
  }
  return out;
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = getItem(id);
  if (!item) notFound();

  const bin = BINS[item.bin];
  const related = pickRelated(item);
  const prep = PREP_BY_BIN[item.bin];

  return (
    <div className="bg-paper">
      <article className="mx-auto max-w-4xl px-6 pt-12 pb-24 md:pt-16">
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm font-medium text-sage-700 hover:text-sage-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to directory
        </Link>

        <header className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[14rem_1fr] md:items-center">
          <div className="flex h-56 items-center justify-center rounded-organic border border-sage-200/70 bg-cream-50/80 shadow-soft">
            <span className="text-8xl" aria-hidden>
              {item.emoji}
            </span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-sage-700 font-medium">
              {item.category}
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl text-ink tracking-tight leading-[1.05]">
              {item.name}
            </h1>
            <div className="mt-5">
              <BinPill bin={item.bin} size="md" />
            </div>
            <p className="mt-4 text-sm text-ink-muted">{bin.blurb}</p>
          </div>
        </header>

        <section className="mt-14">
          <h2 className="font-display text-2xl text-ink">Why it matters</h2>
          <p className="mt-3 text-lg text-ink-soft leading-relaxed">{item.why}</p>
        </section>

        {item.alternatives && (
          <section className="mt-10">
            <div className="rounded-organic border border-clay-300 bg-clay-50 px-6 py-5 shadow-soft">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-clay-700" aria-hidden />
                <div>
                  <h3 className="font-display text-xl text-clay-800">
                    Try this instead
                  </h3>
                  <p className="mt-1.5 text-ink-soft leading-relaxed">
                    {item.alternatives}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">How to prepare it</h2>
          <ul className="mt-4 space-y-3">
            {prep.map((tip, i) => (
              <li key={i} className="flex gap-3 text-ink-soft leading-relaxed">
                <span
                  className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-sage-500"
                  aria-hidden
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl text-ink">More from {item.category}</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ItemCard key={r.id} item={r} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
