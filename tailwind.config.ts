import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#F4F7F0",
          100: "#E5ECDA",
          200: "#CDDABA",
          300: "#B5C79B",
          400: "#9CB380",
          500: "#7E9863",
          600: "#647A4D",
          700: "#4D5D3D",
          800: "#3A4730",
          900: "#283021"
        },
        clay: {
          50: "#FBF5EE",
          100: "#F4E6D3",
          200: "#EBD0AF",
          300: "#E0B987",
          400: "#D4A574",
          500: "#C18957",
          600: "#A16E42",
          700: "#7E5634",
          800: "#5D4027",
          900: "#3F2C1B"
        },
        cream: {
          DEFAULT: "#F4EFE6",
          50: "#FCFBF7",
          100: "#F8F5EE",
          200: "#F4EFE6",
          300: "#EAE2D0",
          400: "#DACEB6"
        },
        ink: {
          DEFAULT: "#2A2A24",
          soft: "#4A4A40",
          muted: "#7A7A6E"
        },
        moss: "#5C7A4A",
        bark: "#5D4027",
        leaf: "#7E9863",
        berry: "#B85C5C",
        sun: "#E8B964"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(58, 71, 48, 0.04), 0 8px 24px -12px rgba(58, 71, 48, 0.18)",
        leaf: "0 2px 0 rgba(58, 71, 48, 0.08), 0 12px 32px -16px rgba(58, 71, 48, 0.25)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(58,71,48,0.06)"
      },
      borderRadius: {
        organic: "1.25rem"
      },
      backgroundImage: {
        paper:
          "radial-gradient(1200px 600px at 10% -10%, rgba(180, 199, 155, 0.35), transparent 50%), radial-gradient(900px 500px at 110% 10%, rgba(212, 165, 116, 0.25), transparent 50%)"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(1.5deg)" }
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(1.5deg)" }
        }
      },
      animation: {
        drift: "drift 7s ease-in-out infinite",
        sway: "sway 5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
