import { ImageResponse } from "next/og";

export const runtime = "edge";

function safeNumber(input: string | null, fallback = 0): number {
  if (input === null) return fallback;
  const n = Number(input);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const co2KgRaw = safeNumber(searchParams.get("co2Kg"), 0);
  const items = Math.max(0, Math.floor(safeNumber(searchParams.get("items"), 0)));
  const streak = Math.max(0, Math.floor(safeNumber(searchParams.get("streak"), 0)));
  const diverted = Math.max(0, Math.floor(safeNumber(searchParams.get("diverted"), 0)));
  const co2Kg = co2KgRaw.toFixed(1);

  // Palette tuned to match the cream/sage/clay theme.
  const cream = "#F4EFE6";
  const creamSoft = "#EDE5D6";
  const sage700 = "#4A6B4F";
  const sage800 = "#3B5740";
  const sage200 = "#CFDDC9";
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
          padding: "64px 72px",
          fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
          position: "relative"
        }}
      >
        {/* Subtle clay corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "260px",
            height: "260px",
            background: `radial-gradient(circle at top right, ${clay500}22, transparent 70%)`,
            display: "flex"
          }}
        />
        {/* Subtle sage bottom-left wash */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "320px",
            height: "320px",
            background: `radial-gradient(circle at bottom left, ${sage200}66, transparent 70%)`,
            display: "flex"
          }}
        />

        {/* Wordmark row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8 6 4 9 4 14a8 8 0 0 0 16 0c0-5-4-8-8-12z"
              fill={sage700}
            />
            <path
              d="M12 6c-2 3-4 5-4 8a4 4 0 0 0 4 4"
              stroke={cream}
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
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

        {/* Hero number */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "56px",
            maxWidth: "980px"
          }}
        >
          <div
            style={{
              fontSize: "28px",
              color: inkSoft,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              display: "flex"
            }}
          >
            I diverted
          </div>
          <div
            style={{
              fontSize: "150px",
              lineHeight: 1,
              color: sage800,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              marginTop: "8px",
              display: "flex"
            }}
          >
            {diverted.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: "44px",
              color: ink,
              marginTop: "12px",
              letterSpacing: "-0.01em",
              display: "flex"
            }}
          >
            items from landfill.
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "44px"
          }}
        >
          <StatPill label="kg CO₂ saved" value={co2Kg} accent={sage700} bg={creamSoft} ink={ink} inkSoft={inkSoft} />
          <StatPill label="items sorted" value={items.toLocaleString()} accent={sage700} bg={creamSoft} ink={ink} inkSoft={inkSoft} />
          <StatPill label="day streak" value={streak.toLocaleString()} accent={clay700} bg={creamSoft} ink={ink} inkSoft={inkSoft} />
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "auto",
            paddingTop: "32px"
          }}
        >
          <div
            style={{
              fontSize: "30px",
              color: sage800,
              fontStyle: "italic",
              display: "flex"
            }}
          >
            Sort waste. Live light.
          </div>
          <div
            style={{
              fontSize: "20px",
              color: inkMuted,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              display: "flex"
            }}
          >
            sortright.today
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

function StatPill({
  label,
  value,
  accent,
  bg,
  ink,
  inkSoft
}: {
  label: string;
  value: string;
  accent: string;
  bg: string;
  ink: string;
  inkSoft: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: bg,
        borderRadius: "28px",
        padding: "20px 28px",
        minWidth: "260px",
        border: `1px solid ${accent}33`
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "10px"
        }}
      >
        <div
          style={{
            fontSize: "56px",
            color: accent,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            display: "flex"
          }}
        >
          {value}
        </div>
      </div>
      <div
        style={{
          fontSize: "20px",
          color: inkSoft,
          marginTop: "2px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          display: "flex"
        }}
      >
        {label}
      </div>
    </div>
  );
}
