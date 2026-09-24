import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        peach: {
          50: "#FFF9F5",
          100: "#FFF0E6",
          200: "#FFE0CC",
          300: "#FFC8A3",
          400: "#FFAA7A",
          500: "#F98555",
          600: "#E86A38",
          soft: "#FFD2B8",
          glow: "#FFE4D4",
        },
        brown: {
          950: "#0F0B09",
          900: "#1A1310",
          850: "#241B16",
          800: "#33251E",
          750: "#412E25",
          700: "#543C30",
          600: "#705041",
          500: "#916955",
          400: "#B88E77",
          300: "#D6B49F",
          200: "#ECD5C5",
        },
        noir: {
          950: "#080605",
          900: "#0D0A09",
          850: "#14100E",
          800: "#1C1715",
          700: "#29221F",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        peach: "0 4px 20px -2px rgba(255, 170, 122, 0.15)",
        "peach-lg": "0 10px 30px -4px rgba(255, 170, 122, 0.25)",
        brown: "0 8px 30px -4px rgba(15, 11, 9, 0.8)",
      },
    },
  },
  plugins: [],
};
export default config;
