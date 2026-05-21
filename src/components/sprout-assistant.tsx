"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationControls, useReducedMotion } from "framer-motion";
import { Send, X, Sparkles, Volume2, VolumeX } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  id: "greet",
  role: "assistant",
  content:
    "Hi, I'm Sprout. Ask me where something goes, or how to swap a habit. I'm happiest with small, real questions like 'is pizza box recyclable?' or 'how do I start composting in an apartment?'"
};

const QUICK_PROMPTS = [
  "Pizza box: recycle or trash?",
  "How do I start composting in an apartment?",
  "What's the easiest swap for plastic wrap?",
  "Where do old batteries go?"
];

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

const SPROUT_SEEN_KEY = "sortright:sproutSeen:v1";

export function SproutAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonControls = useAnimationControls();
  const interactedRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prefersReducedMotion = useReducedMotion();

  function playReplySound() {
    if (muted || typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const t0 = ctx.currentTime;
      const playNote = (freq: number, start: number, duration: number, peak: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t0 + start);
        gain.gain.linearRampToValueAtTime(peak, t0 + start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + start + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t0 + start);
        osc.stop(t0 + start + duration + 0.05);
      };

      // Soft two-note rising chime: E5 -> A5 (a friendly fourth).
      playNote(659.25, 0, 0.28, 0.07);
      playNote(880.0, 0.1, 0.45, 0.07);
    } catch {
      // ignore audio errors
    }
  }

  useEffect(() => {
    if (open) interactedRef.current = true;
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (open) {
      // Chat is open: snap the button to a clean resting state and keep it there.
      buttonControls.stop();
      buttonControls.set({ scale: 1, rotate: 0 });
      return () => {
        cancelled = true;
      };
    }

    // Chat is closed: do the entrance settle, then idle-wiggle on a timer.
    (async () => {
      try {
        await buttonControls.start({
          scale: 1,
          rotate: 0,
          transition: { type: "spring", stiffness: 220, damping: 18 }
        });
      } catch {
        // interrupted
      }
    })();

    // Honor reduced-motion preference: skip the idle-wiggle scheduling entirely.
    if (prefersReducedMotion) {
      return () => {
        cancelled = true;
      };
    }

    const wiggle = async () => {
      if (cancelled) return;
      try {
        await buttonControls.start({
          scale: [1, 1.18, 0.94, 1.12, 0.98, 1.06, 1],
          rotate: [0, -14, 12, -8, 6, -3, 0],
          transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], times: [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1] }
        });
      } catch {
        // animation interrupted, ignore
      }
    };

    const schedule = () => {
      const delay = interactedRef.current ? 14000 + Math.random() * 6000 : 4000 + Math.random() * 4000;
      timeout = setTimeout(async () => {
        if (cancelled) return;
        await wiggle();
        if (!cancelled) schedule();
      }, delay);
    };

    schedule();

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [open, buttonControls, prefersReducedMotion]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // First-visit hint: show a small bubble pointing at Sprout after ~3s.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (open || hintDismissed) return;
    let seen: string | null = null;
    try {
      seen = window.localStorage.getItem(SPROUT_SEEN_KEY);
    } catch {
      // localStorage unavailable; treat as unseen
    }
    if (seen === "1") return;
    const t = setTimeout(() => {
      setShowHint(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [open, hintDismissed]);

  // Auto-hide the hint after 12 seconds.
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => {
      dismissHint();
    }, 12000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showHint]);

  function dismissHint() {
    setShowHint(false);
    setHintDismissed(true);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(SPROUT_SEEN_KEY, "1");
      } catch {
        // ignore
      }
    }
  }

  function handleButtonClick() {
    setOpen((o) => !o);
    if (showHint || !hintDismissed) {
      dismissHint();
    }
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content }))
        })
      });
      const data = (await res.json()) as { reply?: string };
      const reply = data.reply || "I'm a bit tangled. Try again?";
      setMessages((m) => [...m, { id: uid(), role: "assistant", content: reply }]);
      playReplySound();
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          content: "I couldn't reach the network. Try again in a moment?"
        }
      ]);
      playReplySound();
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        aria-label={open ? "Close Sprout assistant" : "Chat with Sprout"}
        onClick={handleButtonClick}
        className="fixed bottom-5 right-5 z-50 grid place-items-center h-14 w-14 rounded-full bg-sage-700 text-cream shadow-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        initial={{ scale: 0, rotate: -20 }}
        animate={buttonControls}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="relative grid place-items-center">
          <motion.span
            aria-hidden={!open}
            animate={{ opacity: open ? 1 : 0, rotate: open ? 0 : -90, scale: open ? 1 : 0.6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-0 grid place-items-center"
          >
            <X className="h-6 w-6" />
          </motion.span>
          <motion.span
            aria-hidden={open}
            animate={{ opacity: open ? 0 : 1, rotate: open ? 90 : 0, scale: open ? 0.6 : 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-0 grid place-items-center"
          >
            <SproutLeafIcon className="h-7 w-7" />
            <motion.span
              className="absolute top-1.5 right-2.5 h-2.5 w-2.5 rounded-full bg-clay-400 border border-cream"
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.3, 1] }}
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </motion.span>
        </span>
      </motion.button>

      <AnimatePresence>
        {showHint && !open && !hintDismissed && (
          <motion.div
            key="sprout-hint"
            role="button"
            tabIndex={0}
            aria-label="Open Sprout chat"
            onClick={() => {
              setOpen(true);
              dismissHint();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(true);
                dismissHint();
              }
            }}
            initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
            animate={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-7 right-24 z-50 max-w-[260px] cursor-pointer select-none rounded-2xl rounded-br-sm border border-sage-200 bg-cream px-3.5 py-2.5 text-sm text-ink shadow-leaf"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-display text-sm leading-tight text-sage-800">
                  Sprout
                </div>
                <p className="mt-0.5 text-[13px] leading-snug text-ink">
                  Hi, I&apos;m Sprout. Got a sorting question?
                </p>
              </div>
              <button
                type="button"
                aria-label="Dismiss Sprout hint"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissHint();
                }}
                className="-mr-1 -mt-1 grid place-items-center h-6 w-6 rounded-full text-ink-muted hover:bg-sage-100/70 hover:text-ink transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Sprout chat"
            initial={{ opacity: 0, scale: 0.2, y: 60, x: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.2, y: 60, x: 60 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-24 right-5 z-50 w-[min(92vw,380px)] h-[min(70vh,560px)] flex flex-col rounded-3xl border border-sage-200/80 bg-cream shadow-leaf overflow-hidden"
          >
            <header className="flex items-center gap-3 px-4 py-3 border-b border-sage-200/70 bg-sage-50/70">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-sage-700 text-cream">
                <SproutLeafIcon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-lg leading-none">Sprout</span>
                  <Sparkles className="h-3.5 w-3.5 text-clay-500" />
                </div>
                <p className="text-[11px] text-ink-muted leading-tight">
                  Your friendly sorting + sustainability guide
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute reply sound" : "Mute reply sound"}
                aria-pressed={muted}
                className="grid place-items-center h-8 w-8 rounded-full text-ink-muted hover:bg-sage-100/70 hover:text-ink transition"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role}>
                  {m.content}
                </Bubble>
              ))}
              {sending && (
                <Bubble role="assistant">
                  <TypingDots />
                </Bubble>
              )}
              {messages.length <= 1 && !sending && (
                <div className="pt-1 flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => send(p)}
                      className="text-xs px-3 py-1.5 rounded-full border border-sage-300/70 bg-white text-sage-800 hover:bg-sage-100/70 transition"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              className="border-t border-sage-200/70 p-3 flex items-end gap-2 bg-cream-50/70"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask Sprout anything green..."
                className="flex-1 resize-none max-h-32 rounded-2xl border border-sage-200 bg-white px-3 py-2 text-sm placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-sage-500/40"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || sending}
                className="grid place-items-center h-10 w-10 rounded-full bg-sage-700 text-cream disabled:opacity-40 disabled:pointer-events-none hover:bg-sage-800 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={
          isUser
            ? "max-w-[82%] rounded-2xl rounded-br-md bg-sage-700 text-cream px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap"
            : "max-w-[82%] rounded-2xl rounded-bl-md bg-white border border-sage-200/70 text-ink px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap"
        }
      >
        {children}
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-sage-500"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function SproutLeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21V12c0-4 2.5-7 7-8-1 4.5-3.5 7.5-7 8z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M12 14c0-3-2-5.5-6-6.5C6.8 11.5 9 14 12 14z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M12 21v-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
