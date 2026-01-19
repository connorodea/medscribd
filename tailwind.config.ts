import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ["var(--font-sora)", "ui-sans-serif", "sans-serif"],
        source: ["var(--font-source)", "ui-sans-serif", "sans-serif"],
        fira: ["var(--font-fira)", "ui-monospace", "monospace"],
      },
      colors: {
        gray: {
          25: "#FBFBFF",
          200: "#E1E1E5",
          350: "#BBBBBF",
          450: "#949498",
          600: "#616165",
          700: "#4E4E52",
          800: "#2C2C33",
          850: "#1A1A1F",
          900: "#101014",
          1000: "#0B0B0C",
        },
        blue: {
          link: "#79AFFA",
        },
        green: {
          spring: "#13EF93",
        },
        brand: {
          teal: "#0F5D5D",
          mist: "#E8F3F1",
          amber: "#F4B860",
          ink: "#0F172A",
          cloud: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
