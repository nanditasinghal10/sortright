import Link from "next/link";
import type { WasteItem } from "@/lib/items";
import { BinPill } from "./bin-pill";

interface ItemCardProps {
  item: WasteItem;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link
      href={`/learn/${item.id}`}
      className="group flex h-full flex-col rounded-organic border border-sage-200/70 bg-cream-50/80 p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-sage-300 hover:shadow-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-5xl leading-none" aria-hidden>
          {item.emoji}
        </span>
        <BinPill bin={item.bin} />
      </div>
      <h3 className="mt-4 font-display text-xl text-ink tracking-tight">
        {item.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-ink-soft leading-relaxed">
        {item.why}
      </p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-sage-700 group-hover:text-sage-800">
        Learn more
        <span className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}
