import { ImageResponse } from "next/og";

export const runtime = "edge";

interface BadgeDef {
  id: string;
  emoji: string;
  label: string;
}

const BADGES: BadgeDef[] = [
  { id: "recycler-bronze", emoji: "♻️", label: "Recycler" },
  { id: "composter-silver", emoji: "🌱", label: "Composter" },
  { id: "master-sorter", emoji: "🏆", label: "Master Sorter" },
  { id: "daily-trio", emoji: "🌼", label: "Daily Trio" },
  { id: "streak-7", emoji: "🔥", label: "7-day Streak" },
  { id: "streak-30", emoji: "🌟", label: "30-day Streak" },
  { id: "quiz-greenhorn", emoji: "📗", label: "Quiz Greenhorn" },
  { id: "quiz-sorter", emoji: "📘", label: "Quiz Sorter" },
  { id: "quiz-master", emoji: "📕", label: "Quiz Master" }
];
const BADGE_BY_ID = new Map(BADGES.map((b) => [b.id, b]));

function safeNumber(input: string | null, fallback = 0): number {
  if (input === null) return fallback;
  const n = Number(input);
  return Number.isFinite(n) ? n : fallback;
}

function equivalent(co2Kg: number): string | null {
  if (co2Kg <= 0) return null;
  if (co2Kg >= 1) {
    const km = Math.max(1, Math.round(co2Kg * 4));
    return `≈ ${km.toLocaleString()} km not driven`;
  }
  const charges = Math.max(1, Math.round(co2Kg * 100));
  return `≈ ${charges.toLocaleString()} phone charges`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const co2KgRaw = safeNumber(searchParams.get("co2Kg"), 0);
  const items = Math.max(0, Math.floor(safeNumber(searchParams.get("items"), 0)));
  const streak = Math.max(0, Math.floor(safeNumber(searchParams.get("streak"), 0)));
  const diverted = Math.max(0, Math.floor(safeNumber(searchParams.get("diverted"), 0)));
  const co2Kg = co2KgRaw.toFixed(1);
  const equiv = equivalent(co2KgRaw);

  const badgeIds = (searchParams.get("badges") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  const badges = badgeIds
    .map((id) => BADGE_BY_ID.get(id))
    .filter((b): b is BadgeDef => Boolean(b));

  // Theme palette.
  const cream = "#F4EFE6";
  const creamSoft = "#EDE5D6";
  const sage50 = "#EEF3E7";
  const sage200 = "#CFDDC9";
  const sage700 = "#4A6B4F";
  const sage800 = "#3B5740";
  const clay500 = "#C77A4A";
  const clay700 = "#8C4F2A";
  const ink = "#2C2A26";
  const inkSoft = "#5C5851";
  const inkMuted = "#8A857C";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: cream,
          padding: "56px 72px 48px",
          fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "300px",
            background: `radial-gradient(circle at top right, ${clay500}26, transparent 70%)`,
            display: "flex"
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "360px",
            height: "360px",
            background: `radial-gradient(circle at bottom left, ${sage200}66, transparent 70%)`,
            display: "flex"
          }}
        />

        {/* Top row: wordmark + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                background: sage200,
                borderRadius: "12px"
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                style={{ transform: "rotate(-8deg)" }}
              >
                <path
                  d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.8.5c0 5.94-2.66 9.04-7 12.04-4.34 3-9.94 3.04-13 0-3.06-3.04-3-8.94 0-13 2.94-4 5.84-4 12-4"
                  stroke={sage800}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M2 21c0-3 1.85-5.36 5.08-6"
                  stroke={sage800}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <div
              style={{
                fontSize: "32px",
                color: sage800,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                display: "flex"
              }}
            >
              SortRight
            </div>
          </div>
          <div
            style={{
              fontSize: "22px",
              color: inkMuted,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              display: "flex"
            }}
          >
            sortright.today
          </div>
        </div>

        {/* Hero block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "44px"
          }}
        >
          <div
            style={{
              fontSize: "26px",
              color: inkSoft,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              display: "flex"
            }}
          >
            I diverted
          </div>
          <div
            style={{
              fontSize: "168px",
              lineHeight: 1,
              color: sage800,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              marginTop: "4px",
              display: "flex"
            }}
          >
            {diverted.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: "40px",
              color: ink,
              marginTop: "8px",
              letterSpacing: "-0.01em",
              display: "flex"
            }}
          >
            items from landfill.
          </div>
          {co2KgRaw > 0 && (
            <div
              style={{
                fontSize: "24px",
                color: inkSoft,
                marginTop: "14px",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                fontStyle: "italic",
                display: "flex"
              }}
            >
              {co2Kg} kg of CO₂ kept out of the air{equiv ? ` · ${equiv}` : ""}.
            </div>
          )}
        </div>

        {/* Badge row */}
        {badges.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "32px",
              flexWrap: "wrap"
            }}
          >
            {badges.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: sage50,
                  border: `1px solid ${sage200}`,
                  borderRadius: "999px",
                  padding: "10px 18px"
                }}
              >
                <div style={{ fontSize: "26px", display: "flex" }}>{b.emoji}</div>
                <div
                  style={{
                    fontSize: "20px",
                    color: sage800,
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    fontWeight: 500,
                    display: "flex"
                  }}
                >
                  {b.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Streak chip floats top-right of hero area */}
        {streak > 0 && (
          <div
            style={{
              position: "absolute",
              top: "180px",
              right: "72px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: creamSoft,
              border: `1px solid ${clay500}44`,
              borderRadius: "24px",
              padding: "18px 26px"
            }}
          >
            <div style={{ fontSize: "32px", display: "flex" }}>🔥</div>
            <div
              style={{
                fontSize: "44px",
                color: clay700,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginTop: "4px",
                display: "flex"
              }}
            >
              {streak.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: "16px",
                color: inkSoft,
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                display: "flex"
              }}
            >
              day streak
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: "24px"
          }}
        >
          <div
            style={{
              fontSize: "26px",
              color: sage800,
              fontStyle: "italic",
              display: "flex"
            }}
          >
            Sort waste. Live light. — {items.toLocaleString()} sorts &amp; counting.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: sage700,
              color: cream,
              borderRadius: "999px",
              padding: "14px 24px",
              fontSize: "22px",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontWeight: 600
            }}
          >
            Try it → sortright.today
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
