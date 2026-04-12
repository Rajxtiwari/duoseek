import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Rajdhani", "sans-serif"],
      },
      colors: {
        neon: {
          purple: "#a855f7",
          cyan: "#22d3ee",
        },
      },
      backdropBlur: {
        glass: "16px",
        xl: "24px",
      },
      lineHeight: {
        golden: "1.618",
      },
    },
  },
  plugins: [],
};
export default config;
