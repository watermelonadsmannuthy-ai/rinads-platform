import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Watermelon-inspired palette: deep night background, rind greens, and watermelon pinks.
        "wm-bg": "#050814",
        "wm-surface": "#0b1220",
        "wm-accent": "#ff4f7a",
        "wm-accent-soft": "#ff9fbf",
        "wm-muted": "#a5b4cf"
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "soft-xl":
          "0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(148, 163, 184, 0.08)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;


