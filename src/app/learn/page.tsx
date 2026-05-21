"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Search } from "lucide-react";
import { ITEMS, searchItems, type WasteItem } from "@/lib/items";
import { BIN_LIST, type BinId } from "@/lib/bins";
import { fadeUp, stagger } from "@/components/motion-primitives";
import { ItemCard } from "@/components/learn/item-card";
import { FilterChips, type ChipOption } from "@/components/learn/filter-chips";

type BinFilter = "all" | BinId;

const BIN_CHIPS: ChipOption[] = [
  { id: "all", label: "All" },
  ...BIN_LIST.map((b) => ({ id: b.id, label: b.short }))
];

const CATEGORY_LABELS: Record<WasteItem["category"], string> = {
  kitchen: "Kitchen",
  bath: "Bath",
  tech: "Tech",
  yard: "Yard",
  office: "Office",
  packaging: "Packaging",
  textile: "Textile",
  outdoors: "Outdoors"
};

const CATEGORY_CHIPS: ChipOption[] = [
  { id: "all", label: "All categories" },
  ...(Object.keys(CATEGORY_LABELS) as WasteItem["category"][]).map((c) => ({
    id: c,
    label: CATEGORY_LABELS[c]
  }))
];

function LearnInner() {
  const params = useSearchParams();
  const initialBin = params.get("bin");
  const [query, setQuery] = useState("");
  const [bin, setBin] = useState<BinFilter>("all");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    if (initialBin && BIN_LIST.some((b) => b.id === initialBin)) {
      setBin(initialBin as BinId);
    }
  }, [initialBin]);

  const results = useMemo(() => {
    let list = query.trim() ? searchItems(query) : ITEMS;
    if (bin !== "all") list = list.filter((i) => i.bin === bin);
    if (category !== "all") list = list.filter((i) => i.category === category);
    return list;
  }, [query, bin, category]);

  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24 md:pb-14">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm uppercase tracking-[0.18em] text-sage-700 font-medium"
          >
            The directory
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-3 font-display text-5xl md:text-6xl text-ink leading-[1.05] tracking-tight"
          >
            Know your waste.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-lg text-ink-soft leading-relaxed"
          >
            A growing field guide to the things we throw away. Search any
            item to learn where it really belongs and why it matters.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-10"
        >
          <label htmlFor="learn-search" className="sr-only">
            Search items
          </label>
          <div className="relative max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sage-600"
              aria-hidden
            />
            <input
              id="learn-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'pizza', 'battery', 'bottle'…"
              className="w-full rounded-organic border border-sage-200 bg-cream-50/80 py-4 pl-12 pr-5 text-base text-ink placeholder:text-ink-muted shadow-soft focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-300"
              autoComplete="off"
            />
          </div>
        </motion.div>

        <div className="mt-8 space-y-4">
          <FilterChips
            label="Filter by bin"
            options={BIN_CHIPS}
            active={bin}
            onChange={(id) => setBin(id as BinFilter)}
          />
          <FilterChips
            label="Filter by category"
            options={CATEGORY_CHIPS}
            active={category}
            onChange={setCategory}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 flex items-baseline justify-between">
          <p className="text-sm text-ink-muted">
            {results.length === 0
              ? "No matches"
              : `${results.length} ${results.length === 1 ? "item" : "items"}`}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="rounded-organic border border-sage-200/70 bg-cream-50/80 px-8 py-16 text-center shadow-soft">
            <Leaf className="mx-auto h-10 w-10 text-sage-500" aria-hidden />
            <h2 className="mt-4 font-display text-2xl text-ink">
              Nothing matches that combination.
            </h2>
            <p className="mt-2 text-ink-soft">
              Try a different word, or clear the filters and start fresh.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {results.map((item) => (
              <motion.div key={item.id} variants={fadeUp}>
                <ItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="h-8 w-40 animate-pulse rounded-full bg-sage-100" />
        </div>
      }
    >
      <LearnInner />
    </Suspense>
  );
}
