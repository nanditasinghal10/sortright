import Link from "next/link";
import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="z-10 mt-24 border-t border-sage-200/60 bg-cream-50/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-sage-200 text-sage-800">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-xl">SortRight</span>
          </div>
          <p className="text-ink-soft text-sm leading-relaxed">
            A friendly nudge towards sorting waste, and living, better. One
            banana peel at a time.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">Learn</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link href="/learn" className="hover:text-ink">Item directory</Link></li>
            <li><Link href="/quiz" className="hover:text-ink">Take a quiz</Link></li>
            <li><Link href="/sustainable-living" className="hover:text-ink">Sustainable living</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">Do</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link href="/sort" className="hover:text-ink">Play the sort game</Link></li>
            <li><Link href="/challenges" className="hover:text-ink">Daily challenges</Link></li>
            <li><Link href="/locate" className="hover:text-ink">Find drop-off near me</Link></li>
            <li><Link href="/impact" className="hover:text-ink">Track your impact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg mb-3">About</h4>
          <p className="text-sm text-ink-soft leading-relaxed">
            Built with care. Open data from EPA, OpenStreetMap, and Earth911.
            Habits over perfection.
          </p>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed">
            Made by{" "}
            <a
              href="https://www.nanditasinghal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage-700 underline decoration-sage-400/60 underline-offset-4 hover:text-sage-900 hover:decoration-sage-700 transition"
            >
              Nandita Singhal
            </a>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-sage-200/60 py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} SortRight · made for the planet ·{" "}
        <a
          href="https://www.nanditasinghal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ink underline-offset-4 hover:underline"
        >
          by Nandita Singhal
        </a>
      </div>
    </footer>
  );
}
