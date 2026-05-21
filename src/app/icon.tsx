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
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 20.2C3.9 13.5 10.7 4.7 19.5 3.5c.6 7.6-7 16.6-14.5 16.7Z"
            fill="#3A4730"
          />
          <path
            d="M6 18.5C9 14.5 13.5 9.5 18 6"
            stroke="#CDDABA"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M2.2 21.8 5 19"
            stroke="#C77A4A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
