import { theme } from "tailwindcss/defaultConfig";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          base: "#2C46B1",
          dark: "#2C4091",
        },
        gray: {
          100: "#F9F9FB",
          200: "#E4E6EC",
          300: "#CDCFD5",
          400: "#74798B",
          500: "#4D505C",
          600: "#1F2025",
        },
        white: "#FFFFFF",
        danger: "#B12C4D",
      },
      fontFamily: {
        sans: ["Open Sans", ...theme.fontFamily.sans],
      },
      fontSize: {
        xs: ["10px", { lineHeight: "14px", fontWeight: "400" }],
        sm: ["12px", { lineHeight: "16px", fontWeight: "400" }],
        md: ["14px", { lineHeight: "18px", fontWeight: "600" }],
        lg: ["18px", { lineHeight: "24px", fontWeight: "700" }],
        xl: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        xxs: "0.625rem",
      },
      opacity: {
        2: 0.02,
      },
      boxShadow: {
        shape:
          "0px 8px 8px rgba(0, 0, 0, 0.1), 0px 4px 4px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 0px 0px 1px rgba(255, 255, 255, 0.03), inset 0px 1px 0px rgba(255, 255, 255, 0.03)",
        "shape-content":
          "0px 0px 0px 1px rgba(0, 0, 0, 0.25), inset 0px 1px 0px rgba(255, 255, 255, 0.02), inset 0px 0px 0px 1px rgba(255, 255, 255, 0.02)",
      },
      animation: {
        border: "border 2s linear infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
    },
  },
  plugins: [],
};
