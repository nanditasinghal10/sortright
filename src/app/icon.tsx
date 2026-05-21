import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#CDDABA",
          borderRadius: "9999px"
        }}
      >
        <svg
          width="107"
          height="107"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3A4730"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: "rotate(-8deg)" }}
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.8.5c0 5.94-2.66 9.04-7 12.04-4.34 3-9.94 3.04-13 0-3.06-3.04-3-8.94 0-13 2.94-4 5.84-4 12-4" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
