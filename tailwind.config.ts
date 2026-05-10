import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
      },
      colors: {
        ink: "#17201d",
        graphite: "#45514c",
        moss: "#315744",
        sage: "#829187",
        linen: "#f8f4ec",
        stonewarm: "#e5ded1",
        clay: "#b88368",
        mist: "#eef3ed",
      },
      boxShadow: {
        quiet: "0 24px 70px rgba(23, 32, 29, 0.10)",
        lift: "0 18px 45px rgba(23, 32, 29, 0.14)",
      },
      backgroundImage: {
        "soft-grid":
          "linear-gradient(rgba(49, 87, 68, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(49, 87, 68, 0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [forms],
};

export default config;
