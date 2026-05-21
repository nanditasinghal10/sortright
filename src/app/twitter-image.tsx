import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SortRight — Sort waste. Live light.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#F4EFE6",
          position: "relative",
          fontFamily: "Georgia, serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-160px",
            right: "-160px",
            width: "520px",
            height: "520px",
            borderRadius: "9999px",
            background: "#CDDABA",
            opacity: 0.55,
            display: "flex"
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            left: "-120px",
            width: "440px",
            height: "440px",
            borderRadius: "9999px",
            background: "#E5ECDA",
            opacity: 0.7,
            display: "flex"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "60%",
            width: "120px",
            height: "120px",
            borderRadius: "9999px",
            background: "#CDDABA",
            opacity: 0.45,
            display: "flex"
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "20px", zIndex: 1 }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 4C12 4 6 8 4 16C4 18 5 20 7 20C15 20 20 12 20 4Z"
              fill="#4D5D3D"
            />
            <path
              d="M4 20C6 14 10 10 16 8"
              stroke="#F4EFE6"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontSize: "28px",
              color: "#4A4A40",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "ui-monospace, Menlo, monospace"
            }}
          >
            sortright
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: "220px",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontWeight: 600
            }}
          >
            <span style={{ color: "#2A2A24" }}>Sort</span>
            <span style={{ color: "#3F5A3A" }}>Right</span>
          </div>
          <div
            style={{
              fontSize: "44px",
              color: "#4A4A40",
              fontStyle: "italic",
              letterSpacing: "-0.01em"
            }}
          >
            Sort waste. Live light.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            zIndex: 1
          }}
        >
          <div
            style={{
              fontSize: "26px",
              color: "#647A4D",
              fontFamily: "Georgia, serif"
            }}
          >
            A friendly, gamified guide to sorting waste.
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#7A7A6E",
              fontFamily: "ui-monospace, Menlo, monospace"
            }}
          >
            sortright.today
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
