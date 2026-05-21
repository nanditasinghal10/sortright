import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface IdentifyRequestBody {
  imageBase64?: string;
  mimeType?: string;
}

export type IdentifyBin =
  | "recycle"
  | "compost"
  | "trash"
  | "hazardous"
  | "dropoff"
  | "unknown";

export type IdentifyConfidence = "high" | "medium" | "low";

export interface IdentifyResult {
  item: string | null;
  confidence?: IdentifyConfidence;
  bin: IdentifyBin | null;
  why: string;
  tip?: string;
  offline?: boolean;
  error?: boolean;
}

const SYSTEM_PROMPT = `You are SortRight's vision identifier. You receive a single photo and must figure out what the main item is, then which household disposal bin it should go in. You speak as the calm, plain-spoken voice of the SortRight site. Never preachy.

Return ONLY a JSON object with this exact shape, no prose, no markdown, no code fences:
{
  "item": "<short common name, lowercase, e.g. 'pizza box', 'banana peel', 'aaa battery'>",
  "confidence": "high" | "medium" | "low",
  "bin": "recycle" | "compost" | "trash" | "hazardous" | "dropoff" | "unknown",
  "why": "<one short sentence, under 25 words, explaining why this bin>",
  "tip": "<one optional short sentence with a swap or habit suggestion, or empty string>"
}

Rules of thumb for "bin":
- "recycle": clean rigid plastics (bottles, tubs), aluminum and steel cans, paper, flattened cardboard, glass bottles and jars.
- "compost": food scraps, fruit and veg peels, coffee grounds, eggshells, soiled paper napkins, certified compostable items.
- "trash": items that cannot be recycled or composted curbside. Greasy pizza boxes (the soiled half), styrofoam, used personal hygiene items, broken ceramics.
- "hazardous": batteries, paint, motor oil, pesticides, fluorescent bulbs, propane canisters. These need special handling.
- "dropoff": soft plastic film and bags, electronics, textiles, large items, and anything that the curbside cart will not take but a take-back location will.
- "unknown": when you genuinely cannot tell, or the photo is too blurry, or there are several conflicting items.

Nuance:
- Pizza boxes: clean top half can be recycle, greasy bottom is trash. If unclear, say so in why.
- Plastic bags and bubble mailers: dropoff at a store film bin, not curbside.
- Batteries, electronics, paint, fluorescent bulbs: hazardous or dropoff. Mention "do not put in regular trash" in why.
- Coffee cups: usually trash because of the plastic lining, unless clearly marked compostable.
- If the photo shows people, faces, or no obvious waste item, return item:"that thing", bin:"unknown", confidence:"low", with a friendly why asking for a clearer shot.

Style:
- "why" must be one sentence, under 25 words.
- No em-dashes anywhere. Use periods, commas, or colons.
- "tip" is optional and at most one short sentence. Empty string is fine.
- Be decisive when you can, honest when you can't.`;

function getApiKey(): string | null {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    null
  );
}

const ALLOWED_BINS: IdentifyBin[] = [
  "recycle",
  "compost",
  "trash",
  "hazardous",
  "dropoff",
  "unknown"
];

const ALLOWED_CONFIDENCE: IdentifyConfidence[] = ["high", "medium", "low"];

function stripDataUrl(input: string): string {
  const idx = input.indexOf("base64,");
  if (idx >= 0) return input.slice(idx + "base64,".length);
  return input;
}

function safeMime(mime: string | undefined): string {
  if (!mime) return "image/jpeg";
  const lower = mime.toLowerCase();
  if (
    lower === "image/jpeg" ||
    lower === "image/jpg" ||
    lower === "image/png" ||
    lower === "image/webp" ||
    lower === "image/heic" ||
    lower === "image/heif"
  ) {
    return lower === "image/jpg" ? "image/jpeg" : lower;
  }
  return "image/jpeg";
}

function coerceResult(raw: unknown): IdentifyResult {
  const fallback: IdentifyResult = {
    item: "that thing",
    confidence: "low",
    bin: "unknown",
    why: "I couldn't quite tell. Try a clearer or closer photo?",
    tip: ""
  };
  if (!raw || typeof raw !== "object") return fallback;
  const r = raw as Record<string, unknown>;
  const item =
    typeof r.item === "string" && r.item.trim().length > 0 ? r.item.trim().slice(0, 80) : "that thing";
  const binCandidate = typeof r.bin === "string" ? r.bin.toLowerCase().trim() : "unknown";
  const bin: IdentifyBin = (ALLOWED_BINS as string[]).includes(binCandidate)
    ? (binCandidate as IdentifyBin)
    : "unknown";
  const confCandidate =
    typeof r.confidence === "string" ? r.confidence.toLowerCase().trim() : "low";
  const confidence: IdentifyConfidence = (ALLOWED_CONFIDENCE as string[]).includes(confCandidate)
    ? (confCandidate as IdentifyConfidence)
    : "low";
  const why =
    typeof r.why === "string" && r.why.trim().length > 0
      ? r.why.trim().replace(/—/g, ",").slice(0, 240)
      : "Best guess based on what I can see.";
  const tip =
    typeof r.tip === "string" ? r.tip.trim().replace(/—/g, ",").slice(0, 200) : "";
  return { item, confidence, bin, why, tip };
}

function tryParseJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Try to extract a JSON object from within fences or extra prose.
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: IdentifyRequestBody;
  try {
    body = (await req.json()) as IdentifyRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawImage = body.imageBase64;
  if (!rawImage || typeof rawImage !== "string") {
    return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
  }

  const imageData = stripDataUrl(rawImage);
  // ~6MB base64 cap (about 4.5MB raw).
  if (imageData.length > 6 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image too large. Please use a photo under 4MB." },
      { status: 413 }
    );
  }

  const mimeType = safeMime(body.mimeType);

  const apiKey = getApiKey();
  if (!apiKey) {
    const offline: IdentifyResult = {
      offline: true,
      item: null,
      bin: null,
      why: "Vision is offline. Ask the site owner to add a GEMINI_API_KEY."
    };
    return NextResponse.json(offline, { status: 200 });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [
              { text: "What is this item, and which bin does it go in? Return JSON." },
              { inlineData: { mimeType, data: imageData } }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
          maxOutputTokens: 400
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
        ]
      })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Identify Gemini error", res.status, text);
      const result: IdentifyResult = {
        item: "that thing",
        confidence: "low",
        bin: "unknown",
        why: "My vision blinked. Try once more in a moment.",
        tip: "",
        error: true
      };
      return NextResponse.json(result, { status: 200 });
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim() || "";

    const parsed = tryParseJson(text);
    if (!parsed) {
      const result: IdentifyResult = {
        item: "that thing",
        confidence: "low",
        bin: "unknown",
        why: "I couldn't quite tell. Try a clearer or closer photo?",
        tip: ""
      };
      return NextResponse.json(result, { status: 200 });
    }

    const result = coerceResult(parsed);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Identify handler error", err);
    const aborted =
      err instanceof Error && (err.name === "AbortError" || err.message.includes("abort"));
    const result: IdentifyResult = {
      item: "that thing",
      confidence: "low",
      bin: "unknown",
      why: aborted
        ? "That took longer than expected. Try a smaller or clearer photo."
        : "Something wilted on my end. Try once more?",
      tip: "",
      error: true
    };
    return NextResponse.json(result, { status: 200 });
  } finally {
    clearTimeout(timer);
  }
}
