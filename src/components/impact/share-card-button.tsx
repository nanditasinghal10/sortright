"use client";

import { useCallback, useState } from "react";
import { Check, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareCardButtonProps {
  co2Kg: number;
  items: number;
  streak: number;
  diverted: number;
}

type Status = "idle" | "loading" | "done";

function buildShareUrl(origin: string, props: ShareCardButtonProps) {
  const params = new URLSearchParams({
    co2Kg: props.co2Kg.toFixed(1),
    items: String(props.items),
    streak: String(props.streak),
    diverted: String(props.diverted)
  });
  return `${origin}/api/og/impact?${params.toString()}`;
}

export function ShareCardButton(props: ShareCardButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [doneLabel, setDoneLabel] = useState("Saved!");

  const onClick = useCallback(async () => {
    if (status === "loading") return;
    if (typeof window === "undefined") return;

    setStatus("loading");
    const url = buildShareUrl(window.location.origin, props);

    let shared = false;

    try {
      // Attempt the Web Share API with file payload first.
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };

      if (typeof nav.share === "function") {
        try {
          const res = await fetch(url, { cache: "no-store" });
          if (res.ok) {
            const blob = await res.blob();
            const file = new File([blob], "sortright-impact.png", {
              type: blob.type || "image/png"
            });

            const shareData: ShareData = {
              title: "My SortRight impact",
              text: `I diverted ${props.diverted} items from landfill with @sortright. sortright.today`,
              files: [file]
            };

            const canShareFiles =
              typeof nav.canShare === "function"
                ? nav.canShare({ files: [file] })
                : false;

            if (canShareFiles) {
              await nav.share(shareData);
              shared = true;
              setDoneLabel("Shared!");
            }
          }
        } catch (err) {
          // AbortError = user cancelled. Anything else falls through to download.
          const name = (err as { name?: string } | null)?.name;
          if (name === "AbortError") {
            setStatus("idle");
            return;
          }
        }
      }

      if (!shared) {
        // Download fallback: trigger an <a download> click.
        const a = document.createElement("a");
        a.href = url;
        a.download = "sortright-impact.png";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setDoneLabel("Saved!");
      }

      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  }, [props, status]);

  const isLoading = status === "loading";
  const isDone = status === "done";

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={onClick}
      disabled={isLoading}
      aria-label="Share your impact card"
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Generating...
        </>
      ) : isDone ? (
        <>
          <Check className="size-4" aria-hidden />
          {doneLabel}
        </>
      ) : (
        <>
          <Share2 className="size-4" aria-hidden />
          Share your impact
        </>
      )}
    </Button>
  );
}

export default ShareCardButton;
