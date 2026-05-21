"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ImagePlus,
  Leaf,
  Loader2,
  RotateCcw,
  Sparkles,
  Trash2,
  AlertTriangle,
  Recycle,
  Sprout,
  HelpCircle,
  PackageOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { easeOrganic } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

type Bin = "recycle" | "compost" | "trash" | "hazardous" | "dropoff" | "unknown";
type Confidence = "high" | "medium" | "low";

interface IdentifyResult {
  item: string | null;
  confidence?: Confidence;
  bin: Bin | null;
  why: string;
  tip?: string;
  offline?: boolean;
  error?: boolean;
}

type Stage = "idle" | "loading" | "result";

const MAX_BYTES = 6 * 1024 * 1024;
const MAX_EDGE_PX = 1600;
const COMPRESS_THRESHOLD = 2 * 1024 * 1024;

const BIN_META: Record<
  Bin,
  { label: string; chip: string; ring: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  recycle: {
    label: "Recycle",
    chip: "bg-sage-700 text-cream",
    ring: "ring-sage-300",
    Icon: Recycle
  },
  compost: {
    label: "Compost",
    chip: "bg-clay-500 text-cream",
    ring: "ring-clay-300",
    Icon: Sprout
  },
  trash: {
    label: "Trash",
    chip: "bg-ink-soft text-cream",
    ring: "ring-ink-muted/50",
    Icon: Trash2
  },
  hazardous: {
    label: "Hazardous",
    chip: "bg-clay-700 text-cream",
    ring: "ring-clay-400",
    Icon: AlertTriangle
  },
  dropoff: {
    label: "Drop-off",
    chip: "bg-sage-500 text-cream",
    ring: "ring-sage-300",
    Icon: PackageOpen
  },
  unknown: {
    label: "Not sure",
    chip: "bg-ink-muted text-cream",
    ring: "ring-ink-muted/40",
    Icon: HelpCircle
  }
};

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "Confident",
  medium: "Pretty sure",
  low: "Best guess"
};

function readFileAsDataURL(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

async function compressIfNeeded(
  file: File
): Promise<{ dataUrl: string; mimeType: string }> {
  const original = await readFileAsDataURL(file);
  if (file.size <= COMPRESS_THRESHOLD) {
    return { dataUrl: original, mimeType: file.type || "image/jpeg" };
  }
  // Try canvas downscale. If it fails (e.g. HEIC), fall back to original.
  try {
    const img = await loadImage(original);
    const longEdge = Math.max(img.width, img.height);
    const scale = longEdge > MAX_EDGE_PX ? MAX_EDGE_PX / longEdge : 1;
    const targetW = Math.round(img.width * scale);
    const targetH = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { dataUrl: original, mimeType: file.type || "image/jpeg" };
    ctx.drawImage(img, 0, 0, targetW, targetH);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    return { dataUrl, mimeType: "image/jpeg" };
  } catch {
    return { dataUrl: original, mimeType: file.type || "image/jpeg" };
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

function stripDataUrl(dataUrl: string): string {
  const idx = dataUrl.indexOf("base64,");
  if (idx >= 0) return dataUrl.slice(idx + "base64,".length);
  return dataUrl;
}

export function CameraCard() {
  const [stage, setStage] = useState<Stage>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStage("idle");
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("That doesn't look like an image. Try a JPG, PNG, or HEIC.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That photo is over 6MB. Try a smaller one or take a fresh shot.");
      return;
    }

    try {
      const { dataUrl, mimeType } = await compressIfNeeded(file);
      setPreviewUrl(dataUrl);
      setStage("loading");

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const res = await fetch("/api/identify", {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: stripDataUrl(dataUrl),
          mimeType
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = (await res.json()) as IdentifyResult;
      setResult(data);
      setStage("result");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      console.error(err);
      setError("Something snagged. Try once more in a moment.");
      setStage("idle");
      setPreviewUrl(null);
    } finally {
      abortRef.current = null;
    }
  }, []);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <div className="w-full">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={onPick}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onPick}
      />

      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: easeOrganic }}
          >
            <label
              htmlFor="identify-camera"
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={cn(
                "relative block cursor-pointer rounded-organic border-2 border-dashed bg-cream-50/70 p-10 sm:p-14 text-center transition-colors",
                dragActive
                  ? "border-sage-500 bg-sage-50"
                  : "border-sage-300 hover:border-sage-500 hover:bg-cream-100/80"
              )}
              onClick={(e) => {
                // Prevent label default from triggering hidden input twice when clicking buttons
                const target = e.target as HTMLElement;
                if (target.closest("button")) e.preventDefault();
              }}
            >
              <input
                id="identify-camera"
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={onPick}
              />
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-200 text-sage-800 shadow-soft"
              >
                <Leaf className="h-7 w-7" />
              </motion.div>
              <h2 className="mt-5 font-display text-2xl text-ink">
                Drop a photo here, or pick one below
              </h2>
              <p className="mx-auto mt-2 max-w-md text-ink-soft">
                JPG, PNG, or HEIC up to 6MB. Sprout looks at it and tells you which bin it belongs in.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={(e) => {
                    e.preventDefault();
                    cameraInputRef.current?.click();
                  }}
                >
                  <Camera className="h-4 w-4" />
                  Take a photo
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={(e) => {
                    e.preventDefault();
                    galleryInputRef.current?.click();
                  }}
                >
                  <ImagePlus className="h-4 w-4" />
                  Upload from gallery
                </Button>
              </div>
              {error && (
                <p className="mt-5 text-sm text-berry">{error}</p>
              )}
            </label>
          </motion.div>
        )}

        {stage === "loading" && previewUrl && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: easeOrganic }}
          >
            <Card className="p-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div className="relative aspect-square w-full overflow-hidden rounded-organic border border-sage-200 bg-cream-100">
                  <Image
                    src={previewUrl}
                    alt="Selected item"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                </div>
                <div className="flex flex-col justify-center gap-4">
                  <div className="flex items-center gap-3">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                      className="grid h-10 w-10 place-items-center rounded-full bg-sage-100 text-sage-700"
                    >
                      <Leaf className="h-5 w-5" />
                    </motion.span>
                    <div>
                      <p className="font-display text-xl text-ink">Looking at your photo</p>
                      <p className="text-sm text-ink-soft">
                        Sprout is checking the bin. This usually takes a few seconds.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-sage-100 overflow-hidden">
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        className="h-full w-1/2 bg-sage-400/80"
                      />
                    </div>
                    <div className="h-3 w-1/2 rounded-full bg-sage-100 overflow-hidden">
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2
                        }}
                        className="h-full w-1/3 bg-clay-300"
                      />
                    </div>
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={reset}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {stage === "result" && result && previewUrl && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: easeOrganic }}
          >
            <ResultPanel result={result} previewUrl={previewUrl} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultPanel({
  result,
  previewUrl,
  onReset
}: {
  result: IdentifyResult;
  previewUrl: string;
  onReset: () => void;
}) {
  if (result.offline) {
    return (
      <Card className="p-6 sm:p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-clay-100 text-clay-700">
          <Loader2 className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-2xl text-ink">Vision is offline</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          {result.why ||
            "The site owner needs to add a GEMINI_API_KEY before Sprout can look at photos."}
        </p>
        <div className="mt-5">
          <Button variant="secondary" size="md" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Try another
          </Button>
        </div>
      </Card>
    );
  }

  const bin: Bin = (result.bin as Bin) || "unknown";
  const meta = BIN_META[bin] || BIN_META.unknown;
  const Icon = meta.Icon;
  const confidence = result.confidence || "low";
  const item =
    result.item && result.item.trim().length > 0 ? result.item : "that thing";

  return (
    <Card className={cn("p-5 sm:p-6 ring-1 ring-inset", meta.ring)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="relative aspect-square w-full overflow-hidden rounded-organic border border-sage-200 bg-cream-100">
          <Image
            src={previewUrl}
            alt={item}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium shadow-soft",
                meta.chip
              )}
            >
              <Icon className="h-4 w-4" />
              {meta.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-sage-200 bg-cream-50 px-2.5 py-1 text-xs text-ink-soft">
              <Sparkles className="h-3 w-3 text-clay-500" />
              {CONFIDENCE_LABEL[confidence]}
            </span>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted">It looks like</p>
            <h2 className="font-display text-3xl text-ink leading-tight first-letter:uppercase">
              {item}
            </h2>
          </div>

          <p className="text-ink-soft leading-relaxed">{result.why}</p>

          {result.tip && result.tip.trim().length > 0 && (
            <p className="rounded-organic border border-sage-200/70 bg-sage-50/80 px-4 py-3 text-sm italic text-sage-800">
              <span className="not-italic font-medium text-sage-700">Sprout&apos;s tip. </span>
              {result.tip}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="primary" size="md" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              Try another
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
