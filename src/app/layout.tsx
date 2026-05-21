import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SproutAssistant } from "@/components/sprout-assistant";
import { OnboardingTour } from "@/components/onboarding-tour";
import { Analytics } from "@vercel/analytics/next";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "SortRight: Sort waste. Sort the planet.",
    template: "%s · SortRight"
  },
  description:
    "Learn how to sort, recycle, and compost the right way. Play the sort-it game, take quizzes, find drop-off points near you, and build sustainable habits.",
  metadataBase: new URL("https://sortright.today"),
  openGraph: {
    title: "SortRight",
    description:
      "A friendly, gamified guide to sorting waste and living sustainably.",
    type: "website"
  }
};

export const viewport = {
  themeColor: "#F4EFE6"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased text-ink min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 z-10">{children}</main>
        <SiteFooter />
        <OnboardingTour />
        <SproutAssistant />
        <Analytics />
      </body>
    </html>
  );
}
