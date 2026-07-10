/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Ink
        ink: "#000000",
        // Warm cream backgrounds
        cream: "#F5F2ED",
        paper: "#FFFFFF",
        "surface-dim": "#dadada",
        "surface-container": "#eeeeee",
        "surface-container-low": "#f3f3f3",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        // Text
        "on-surface": "#1b1b1b",
        "on-surface-variant": "#4c4546",
        // Neo-Brutalist accents
        coral: "#ff6b6b",
        "coral-deep": "#ae2f34",
        teal: "#00948c",
        "teal-bright": "#5dd9d0",
        "teal-mint": "#7cf6ec",
        yellow: "#ffde59",
        lavender: "#d4c4fb",
        "lavender-deep": "#cb9bfa",
        mint: "#bff0d4",
        rose: "#ffdad8",
        "rose-deep": "#ffb3b0",
        "rose-ink": "#8c1520",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "900" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "800" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "500" }],
        "label-bold": ["14px", { lineHeight: "1.2", fontWeight: "700" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "600" }],
      },
      borderRadius: {
        brutalist: "8px",
        card: "16px",
      },
      borderWidth: {
        neo: "3px",
        neothick: "4px",
      },
      boxShadow: {
        neo: "4px 4px 0px 0px rgba(0,0,0,1)",
        "neo-lg": "8px 8px 0px 0px rgba(0,0,0,1)",
        "neo-sm": "2px 2px 0px 0px rgba(0,0,0,1)",
        "neo-active": "0px 0px 0px 0px rgba(0,0,0,1)",
        "neo-teal": "4px 4px 0px 0px #5dd9d0",
        "neo-coral": "4px 4px 0px 0px #ff6b6b",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(5deg)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-delayed": "float 5s ease-in-out infinite 1s",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "pulse-slow": "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
