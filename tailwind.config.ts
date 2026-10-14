import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        ink: "#0a0f1d",
        brand: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1d4ed8",
          subtle: "#1e3a8a",
        },
        electric: "#60a5fa",
        cyan: {
          glow: "#38bdf8",
        },
        mist: "#f8fafc",
        surface: {
          dark: "#0b1120",
          card: "#0f172a",
          border: "#1e293b",
        },
      },
      boxShadow: {
        "2xs": "0 1px 1px 0 rgba(0, 0, 0, 0.03)",
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        soft: "0 18px 55px rgba(16,24,40,.09)",
        glow: "0 0 35px -5px rgba(37,99,235,0.35)",
        "glow-cyan": "0 0 35px -5px rgba(56,189,248,0.35)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
