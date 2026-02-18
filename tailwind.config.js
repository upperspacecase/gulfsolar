/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        cream: "#F7F7F2",
        stone: {
          DEFAULT: "#1A1A1A",
          light: "#3A3A3A",
          muted: "#6B6B6B",
        },
        terracotta: {
          DEFAULT: "#C75B3F",
          light: "#D4705A",
          dark: "#A44A32",
        },
        // Keep legacy tokens for backward compat
        charcoal: {
          DEFAULT: "#1A1A1A",
          light: "#252525",
          dark: "#111111",
        },
        orange: {
          DEFAULT: "#C75B3F",
          light: "#D4705A",
          dark: "#A44A32",
        },
        amber: {
          DEFAULT: "#D4A574",
          light: "#E2BB8E",
          dark: "#B88A5E",
        },
        offwhite: "#F7F7F2",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        gulf: {
          primary: "#C75B3F",
          secondary: "#D4A574",
          accent: "#D4705A",
          neutral: "#1A1A1A",
          "base-100": "#F7F7F2",
          "base-200": "#FFFFFF",
          "base-300": "#E5E5E0",
          info: "#3B82F6",
          success: "#16A34A",
          warning: "#D4A574",
          error: "#EF4444",
        },
      },
    ],
  },
};
