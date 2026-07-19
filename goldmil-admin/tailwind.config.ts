import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // لوحة الذهبي الأصلية من goldmil.matrxe.com
        gold: {
          50: "#fdf8e7",
          100: "#fbf0c8",
          200: "#f6df91",
          300: "#f0c75e",
          400: "#e8b94a",
          500: "#d4a843",
          600: "#c8962e",
          700: "#a07820",
          800: "#7d5b18",
          900: "#5a3f10",
        },
        // خلفيات الموقع الأصلية
        ink: {
          950: "#07070f",
          900: "#090913",
          800: "#0d0d1a",
          700: "#13131f",
          600: "#1a1a26",
          500: "#22222e",
          400: "#2a2a36",
        },
        // ألوان الحالة
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#3b82f6",
      },
      fontFamily: {
        cairo: ["Cairo", "system-ui", "sans-serif"],
        tajawal: ["Tajawal", "system-ui", "sans-serif"],
        sans: ["Cairo", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-gold":
          "linear-gradient(135deg, #c8962e 0%, #f0c75e 50%, #d4a843 100%)",
        "gradient-dark":
          "linear-gradient(135deg, #0d0d1a 0%, #090913 100%)",
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(200, 150, 46, 0.25)",
        "gold-lg": "0 10px 40px -5px rgba(200, 150, 46, 0.35)",
        glow: "0 0 30px rgba(200, 150, 46, 0.15)",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(200, 150, 46, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(200, 150, 46, 0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-gold": "pulseGold 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;