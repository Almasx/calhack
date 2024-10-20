import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

// neutral-100
// neutral-200
// neutral-300
// neutral-400
// neutral-500
// neutral-600
// neutral-700
// neutral-800
// neutral-900
// #d9d9d9
// #a9a9a9
// #646262
// #424141
// #242424
// #1c1c1c
// #171717
// #101010
// #0a0a0a
