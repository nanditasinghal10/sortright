import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SortRight",
    short_name: "SortRight",
    description: "Sort waste. Live light.",
    start_url: "/",
    display: "standalone",
    theme_color: "#F4EFE6",
    background_color: "#F4EFE6",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}
