import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefaf7",
          100: "#d5f3ec",
          200: "#ace6dc",
          300: "#77d2c4",
          400: "#3ab5a4",
          500: "#179684",
          600: "#087565",
          700: "#006b5c",
          800: "#07564c",
          900: "#06473f",
          950: "#042c27",
        },
        coral: {
          50: "#fff1ed",
          100: "#ffe0d6",
          200: "#ffc5b5",
          300: "#ff9f85",
          400: "#ff7055",
          500: "#ff4d2e",
          600: "#ef2d12",
          700: "#c91e09",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        surface: {
          50: "#fbfcfc",
          100: "#f5f7f7",
          200: "#e8eeee",
          300: "#d8e2e2",
          400: "#b8c7c7",
        },
        ink: {
          950: "#070b10",
          900: "#121826",
          800: "#1f2937",
          700: "#344054",
          600: "#475467",
          500: "#667085",
          400: "#98a2b3",
          300: "#c7d0dd",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 30px -24px rgba(18, 24, 38, 0.35)",
        card: "0 18px 45px -35px rgba(18, 24, 38, 0.35)",
        glow: "0 18px 45px -30px rgba(0, 107, 92, 0.5)",
        coral: "0 16px 36px -28px rgba(255, 77, 46, 0.6)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern":
          "radial-gradient(ellipse at 20% 50%, rgba(0, 107, 92, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255, 77, 46, 0.06) 0%, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}

export default config
