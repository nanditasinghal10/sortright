"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "sortright:onboarded:v1";

type Step = {
  title: string;
  body: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel: string;
};

const STEPS: Step[] = [
  {
    title: "Welcome to SortRight 🌱",
    body: "Quick tour, four things SortRight can do for you.",
    secondaryLabel: "Next"
  },
  {
    title: "Sort with confidence.",
    body: "Play the sort game to learn what goes where, fast.",
    primaryLabel: "Try the sort game",
    primaryHref: "/sort",
    secondaryLabel: "Next"
  },
  {
    title: "Find a drop-off.",
    body: "When in doubt, locate a real place near you for batteries, e-waste, textiles.",
    primaryLabel: "Open the map",
    primaryHref: "/locate",
    secondaryLabel: "Next"
  },
  {
    title: "Stuck? Ask Sprout.",
    body: "The little sprout in the bottom-right is a chatbot. Tap it any time for sorting questions or sustainability swaps — it answers in plain language.",
    secondaryLabel: "Done"
  }
];

const easeOrganic = [0.22, 1, 0.36, 1] as const;

export function OnboardingTour() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => setVisible(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function handleNext() {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      dismiss();
    }
  }

  function handlePrimary(href?: string) {
    dismiss();
    if (href) router.push(href);
  }

  if (!visible) return null;

  const step = STEPS[stepIndex];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onboarding-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <motion.div
            key="onboarding-card"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.45, ease: easeOrganic }}
            className="w-full max-w-md rounded-organic border border-sage-200 bg-cream shadow-leaf p-7 sm:p-8 relative"
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-3 right-4 text-ink-muted hover:text-ink text-sm transition-colors"
              aria-label="Close onboarding"
            >
              Skip
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: easeOrganic }}
              >
                <h2
                  id="onboarding-title"
                  className="font-display text-2xl sm:text-3xl text-ink leading-tight"
                >
                  {step.title}
                </h2>
                <p className="mt-3 text-ink-soft text-base leading-relaxed">
                  {step.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2" aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`}>
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === stepIndex
                        ? "w-6 bg-sage-700"
                        : i < stepIndex
                          ? "w-2 bg-sage-400"
                          : "w-2 bg-sage-200"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {step.primaryLabel && (
                  <button
                    type="button"
                    onClick={() => handlePrimary(step.primaryHref)}
                    className="rounded-full bg-sage-700 hover:bg-sage-800 text-cream-50 px-4 py-2 text-sm font-medium transition-colors shadow-soft"
                  >
                    {step.primaryLabel}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink hover:bg-sage-100 transition-colors"
                >
                  {step.secondaryLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OnboardingTour;
