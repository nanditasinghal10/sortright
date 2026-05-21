import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

const SYSTEM_PROMPT = `You are Sprout, the friendly assistant for SortRight, a website that helps people sort waste correctly and live more sustainably.

Personality:
- Warm, gently witty, and encouraging. You celebrate small wins. Never preachy or guilt-trippy.
- Earthy and grounded. You can use the occasional plant or compost metaphor, but don't overdo it.
- Brief by default. Two or three short paragraphs is plenty. Use bullet lists when you're walking through steps.

What you help with:
- "Where does this go?" questions for trash, recycling, compost, hazardous, e-waste, batteries, textiles.
- Sustainable living swaps and habits (kitchen, bathroom, grocery, transport, energy).
- Why an item belongs where it does, in plain language.
- Encouragement when someone is starting out.

Boundaries:
- If asked something off-topic (coding, politics, medical advice, etc.), redirect gently back to sustainability or waste sorting.
- Don't invent local rules. If sorting depends on city or county, say so and suggest the user check the SortRight drop-off finder or their local waste authority.
- No long disclaimers. No "as an AI" phrasing.

Format:
- Plain text. No markdown headings. Light use of bullets is fine.
- Keep responses under ~120 words unless the user explicitly asks for depth.`;

function getApiKey(): string | null {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    null
  );
}

export async function POST(req: NextRequest) {
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages" }, { status: 400 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        reply:
          "I'm not wired up yet. Ask the site owner to add a GEMINI_API_KEY (it's free at aistudio.google.com/apikey) and I'll be right back.",
        offline: true
      },
      { status: 200 }
    );
  }

  const contents = messages.slice(-12).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content.slice(0, 2000) }]
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
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
      console.error("Gemini error", res.status, text);
      return NextResponse.json(
        { reply: "My roots got tangled. Try again in a sec?", error: true },
        { status: 200 }
      );
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim() ||
      "I lost the thread for a moment. Could you ask that again?";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat handler error", err);
    return NextResponse.json(
      { reply: "Something wilted on my end. Try once more?", error: true },
      { status: 200 }
    );
  } finally {
    clearTimeout(timer);
  }
}
