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
          background: "#4D5D3D",
          borderRadius: "9999px"
        }}
      >
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21V12c0-4 2.5-7 7-8-1 4.5-3.5 7.5-7 8z"
            fill="#F4EFE6"
            opacity="0.95"
          />
          <path
            d="M12 14c0-3-2-5.5-6-6.5C6.8 11.5 9 14 12 14z"
            fill="#F4EFE6"
            opacity="0.78"
          />
          <path
            d="M12 21v-5"
            stroke="#F4EFE6"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
