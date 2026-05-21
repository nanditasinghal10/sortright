"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareCardButtonProps {
  co2Kg: number;
  items: number;
  streak: number;
  diverted: number;
  badges: string[];
}

const SITE_URL = "https://sortright.today";

const BADGE_LABELS: Record<string, string> = {
  "recycler-bronze": "Recycler",
  "composter-silver": "Composter",
  "master-sorter": "Master Sorter",
  "daily-trio": "Daily Trio",
  "streak-7": "7-day Streak",
  "streak-30": "30-day Streak",
  "quiz-greenhorn": "Quiz Greenhorn",
  "quiz-sorter": "Quiz Sorter",
  "quiz-master": "Quiz Master"
};

function buildShareUrl(origin: string, props: ShareCardButtonProps) {
  const params = new URLSearchParams({
    co2Kg: props.co2Kg.toFixed(1),
    items: String(props.items),
    streak: String(props.streak),
    diverted: String(props.diverted)
  });
  if (props.badges.length) {
    params.set("badges", props.badges.slice(0, 4).join(","));
  }
  return `${origin}/api/og/impact?${params.toString()}`;
}

function buildShareText(props: ShareCardButtonProps): string {
  const lines: string[] = [];
  const itemWord = props.diverted === 1 ? "item" : "items";
  lines.push(`I diverted ${props.diverted} ${itemWord} from landfill with SortRight 🌱`);

  const stats: string[] = [];
  if (props.co2Kg > 0) stats.push(`${props.co2Kg.toFixed(1)} kg CO₂ saved`);
  if (props.streak > 0) stats.push(`${props.streak}-day streak`);
  if (props.badges.length) {
    const labels = props.badges
      .slice(0, 3)
      .map((id) => BADGE_LABELS[id])
      .filter(Boolean);
    if (labels.length) stats.push(`badges: ${labels.join(", ")}`);
  }
  if (stats.length) lines.push(stats.join(" · "));

  lines.push("");
  lines.push(`Sort with me → ${SITE_URL}`);
  return lines.join("\n");
}

type ActionId = "native" | "copy" | "x" | "image";

export function ShareCardButton(props: ShareCardButtonProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ActionId | null>(null);
  const [doneLabel, setDoneLabel] = useState<string | null>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const text = useMemo(() => buildShareText(props), [props]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const flash = useCallback((label: string) => {
    setDoneLabel(label);
    window.setTimeout(() => setDoneLabel(null), 2200);
  }, []);

  const handleNative = useCallback(async () => {
    if (typeof window === "undefined") return;
    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean;
    };
    if (typeof nav.share !== "function") return;
    setBusy("native");
    try {
      const url = buildShareUrl(window.location.origin, props);
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const blob = await res.blob();
          const file = new File([blob], "sortright-impact.png", {
            type: blob.type || "image/png"
          });
          if (nav.canShare?.({ files: [file] })) {
            await nav.share({
              title: "My SortRight impact",
              text,
              url: SITE_URL,
              files: [file]
            });
            flash("Shared!");
            setOpen(false);
            return;
          }
        }
      } catch {
        // fall through to text-only share
      }
      await nav.share({ title: "My SortRight impact", text, url: SITE_URL });
      flash("Shared!");
      setOpen(false);
    } catch (err) {
      const name = (err as { name?: string } | null)?.name;
      if (name !== "AbortError") flash("Couldn't share");
    } finally {
      setBusy(null);
    }
  }, [props, text, flash]);

  const handleCopy = useCallback(async () => {
    setBusy("copy");
    try {
      await navigator.clipboard.writeText(text);
      flash("Copied!");
      setOpen(false);
    } catch {
      flash("Copy failed");
    } finally {
      setBusy(null);
    }
  }, [text, flash]);

  const handleX = useCallback(() => {
    setBusy("x");
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
    setBusy(null);
    setOpen(false);
  }, [text]);

  const handleImage = useCallback(() => {
    if (typeof window === "undefined") return;
    setBusy("image");
    const url = buildShareUrl(window.location.origin, props);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sortright-impact.png";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setBusy(null);
    flash("Saved!");
    setOpen(false);
  }, [props, flash]);

  const supportsNative =
    typeof navigator !== "undefined" &&
    typeof (navigator as Navigator & { share?: unknown }).share === "function";

  const showCheck = !!doneLabel && !open;

  return (
    <div className="relative inline-block">
      <Button
        ref={buttonRef}
        variant="secondary"
        size="md"
        onClick={() => setOpen((o) => !o)}
        aria-label="Share your impact"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {showCheck ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Share2 className="size-4" aria-hidden />
        )}
        {doneLabel ?? "Share your impact"}
      </Button>

      {open && (
        <div
          ref={popRef}
          role="menu"
          className="absolute z-30 mt-2 left-0 w-[20rem] rounded-organic border border-sage-200 bg-cream shadow-leaf p-2 origin-top-left"
        >
          <div className="px-3 pt-2 pb-3 mb-1 border-b border-sage-200/70">
            <p className="text-[11px] uppercase tracking-wider text-ink-muted mb-1.5">
              Caption preview
            </p>
            <p className="text-[12.5px] leading-snug text-ink-soft whitespace-pre-line">
              {text}
            </p>
          </div>

          {supportsNative && (
            <MenuItem
              icon={<Share2 className="size-4" />}
              label="Share via…"
              hint="System share sheet"
              onClick={handleNative}
              busy={busy === "native"}
            />
          )}
          <MenuItem
            icon={<Copy className="size-4" />}
            label="Copy text + link"
            hint="Paste anywhere"
            onClick={handleCopy}
            busy={busy === "copy"}
          />
          <MenuItem
            icon={<XLogo />}
            label="Post to X"
            hint="Opens twitter.com/intent"
            onClick={handleX}
            busy={busy === "x"}
          />
          <MenuItem
            icon={<Download className="size-4" />}
            label="Save image"
            hint="Download the card"
            onClick={handleImage}
            busy={busy === "image"}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  hint,
  onClick,
  busy
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={busy}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-ink hover:bg-sage-100/70 transition-colors disabled:opacity-50"
    >
      <span className="grid place-items-center size-8 rounded-full bg-sage-100/70 text-sage-800 shrink-0">
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-medium">{label}</span>
        <span className="text-[11px] text-ink-muted">{hint}</span>
      </span>
    </button>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default ShareCardButton;
