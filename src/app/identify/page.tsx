import type { Metadata } from "next";
import { CameraCard } from "@/components/identify/camera-card";

export const metadata: Metadata = {
  title: "Snap and sort | SortRight",
  description:
    "Point your camera at anything you're not sure about. Sprout's vision will tell you which bin it goes in."
};

export default function IdentifyPage() {
  return (
    <main className="min-h-screen bg-cream bg-paper">
      <section className="mx-auto max-w-5xl px-5 pt-14 md:pt-20 pb-8">
        <p className="text-sage-700 font-medium tracking-wide uppercase text-xs">
          Identify
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-6xl text-ink leading-[1.05]">
          Snap and sort.
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft text-lg leading-relaxed">
          Point your camera at anything you&apos;re not sure about. Sprout&apos;s vision will tell
          you where it goes, and why.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-10">
        <CameraCard />
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="rounded-organic border border-sage-200/60 bg-cream-50/70 px-5 py-4 text-sm text-ink-soft flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="font-medium text-sage-800">Privacy.</span>
          <span>
            Photos are processed momentarily to recognize the item, and never stored on our side.
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <Pointer
            label="Best results"
            text="Fill the frame with the item. Plain background helps."
          />
          <Pointer
            label="Local rules vary"
            text="If your city handles things differently, trust the local guidance."
          />
          <Pointer
            label="Not a guarantee"
            text="Sprout can guess wrong. When in doubt, check the drop-off finder."
          />
        </div>
      </section>
    </main>
  );
}

function Pointer({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-organic border border-sage-200/60 bg-cream-50/60 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-sage-700 font-medium">{label}</p>
      <p className="mt-1 text-ink-soft leading-relaxed">{text}</p>
    </div>
  );
}
