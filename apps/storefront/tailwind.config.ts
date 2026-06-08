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
          50: "#f0fdf9",
          100: "#ccfbef",
          200: "#99f6de",
          300: "#5ceac8",
          400: "#2dd4ad",
          500: "#14b893",
          600: "#0d9478",
          700: "#0f7663",
          800: "#115e50",
          900: "#0c4a40",
          950: "#0a3d34",
        },
        coral: {
          50: "#fff5f5",
          100: "#ffe3e3",
          200: "#ffc9c9",
          300: "#ffa8a8",
          400: "#ff8787",
          500: "#ff6b6b",
          600: "#fa5252",
          700: "#f03e3e",
        },
        amber: {
          400: "#fbbf24",
          500: "#e8b931",
          600: "#d4a017",
        },
        surface: {
          50: "#fafaf7",
          100: "#f5f3ee",
          200: "#e8e5dc",
          300: "#d4d0c4",
        },
        ink: {
          900: "#1a1a2e",
          800: "#2d2d44",
          700: "#40405a",
          600: "#5a5a72",
          500: "#74748a",
          400: "#9e9eb0",
          300: "#c4c4d0",
        },
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        card: "0 4px 25px -5px rgba(0, 0, 0, 0.08)",
        glow: "0 0 30px rgba(13, 148, 120, 0.15)",
        coral: "0 4px 20px rgba(255, 107, 107, 0.3)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern":
          "radial-gradient(ellipse at 20% 50%, rgba(13, 148, 120, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255, 107, 107, 0.06) 0%, transparent 50%)",
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
