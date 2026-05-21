import { ITEMS, type WasteItem } from "./items";

export interface PickRoundOpts {
  count: number;
  difficulty?: 1 | 2 | 3;
}

function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickRound(opts: PickRoundOpts): WasteItem[] {
  const { count, difficulty } = opts;
  const pool = difficulty
    ? ITEMS.filter((i) => i.difficulty <= difficulty)
    : ITEMS;

  const byCategory = new Map<string, WasteItem[]>();
  for (const item of shuffle(pool)) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  const picked: WasteItem[] = [];
  const seen = new Set<string>();
  const queues = shuffle(Array.from(byCategory.values()));

  let active = queues.filter((q) => q.length > 0);
  while (picked.length < count && active.length > 0) {
    for (const q of active) {
      if (picked.length >= count) break;
      const next = q.shift();
      if (next && !seen.has(next.id)) {
        picked.push(next);
        seen.add(next.id);
      }
    }
    active = active.filter((q) => q.length > 0);
  }

  if (picked.length < count) {
    for (const item of shuffle(pool)) {
      if (picked.length >= count) break;
      if (!seen.has(item.id)) {
        picked.push(item);
        seen.add(item.id);
      }
    }
  }

  return picked.slice(0, count);
}

export function scoreFor(item: WasteItem, correct: boolean, streak: number): number {
  const base = 10 + item.difficulty * 5;
  if (!correct) {
    return -Math.round(base / 3);
  }
  const multiplier = Math.min(3, 1 + streak * 0.25);
  return Math.round(base * multiplier);
}

export function shouldAwardBadge(streak: number, accuracy: number): string | null {
  if (accuracy >= 1 && streak >= 10) return "perfect-sorter";
  if (accuracy >= 0.8) return "master-sorter";
  if (streak >= 5) return "streak-keeper";
  return null;
}
