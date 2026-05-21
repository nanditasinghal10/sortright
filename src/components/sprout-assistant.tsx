"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";

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

export function SproutAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: "assistant",
          content: "I couldn't reach the network. Try again in a moment?"
        }
      ]);
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
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 grid place-items-center h-14 w-14 rounded-full bg-sage-700 text-cream shadow-leaf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 18 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="leaf"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <SproutLeafIcon className="h-7 w-7" />
              <motion.span
                className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-clay-400 border border-cream"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Sprout chat"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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
